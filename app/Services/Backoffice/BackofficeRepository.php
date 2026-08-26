<?php

namespace App\Services\Backoffice;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BackofficeRepository
{
    public function __construct(public EntityRegistry $registry) {}

    public function list(string $entity, array $filters = [], ?string $search = null, int $limit = 50, int $offset = 0): array
    {
        $meta = $this->registry->get($entity);
        $query = DB::table($meta['table']);
        foreach ($filters as $field => $value) {
            if (! in_array($field, array_merge(['id'], $meta['fields']), true)) throw new \InvalidArgumentException("Filtro não autorizado: {$field}");
            $query->where($field, $value);
        }
        if ($search = trim((string) $search)) {
            $query->where(function ($query) use ($meta, $search) {
                foreach ($meta['search'] as $index => $field) $index ? $query->orWhere($field, 'like', "%{$search}%") : $query->where($field, 'like', "%{$search}%");
            });
        }
        return array_map(fn ($row) => $this->decode($row, $meta), $query->orderByDesc('id')->offset(max(0, $offset))->limit(min(200, max(1, $limit)))->get()->all());
    }

    public function get(string $entity, int $id): array
    {
        $meta = $this->registry->get($entity);
        $row = DB::table($meta['table'])->where('id', $id)->first();
        if (! $row) throw new \RuntimeException("Registo {$entity} #{$id} não encontrado.");
        return $this->decode($row, $meta);
    }

    public function create(string $entity, array $data, string $source = 'api'): array
    {
        $meta = $this->registry->get($entity);
        $data = $this->prepare($entity, $this->registry->validate($entity, $data, true), $meta);
        if (Schema::hasColumn($meta['table'], 'created_at')) $data['created_at'] = now();
        if (Schema::hasColumn($meta['table'], 'updated_at')) $data['updated_at'] = now();
        $id = DB::transaction(fn () => (int) DB::table($meta['table'])->insertGetId($data));
        $this->audit($source, 'create', $entity, $id, $data);
        return $this->get($entity, $id);
    }

    public function update(string $entity, int $id, array $data, string $source = 'api'): array
    {
        $meta = $this->registry->get($entity); $existing = $this->get($entity, $id);
        $data = $this->prepare($entity, $this->registry->validate($entity, $data, false, $id), $meta, $existing);
        if (! $data) throw new \InvalidArgumentException('Nenhum campo válido foi enviado.');
        if (Schema::hasColumn($meta['table'], 'updated_at')) $data['updated_at'] = now();
        DB::transaction(fn () => DB::table($meta['table'])->where('id', $id)->update($data));
        $this->audit($source, 'update', $entity, $id, $data);
        return $this->get($entity, $id);
    }

    public function delete(string $entity, int $id, string $source = 'api'): void
    {
        $meta = $this->registry->get($entity); $before = $this->get($entity, $id);
        DB::transaction(fn () => DB::table($meta['table'])->where('id', $id)->delete());
        $this->audit($source, 'delete', $entity, $id, $before);
    }

    public function createOrderFromPurchaseList(array $data, string $source = 'mcp'): array
    {
        foreach (['reference','purchase_list_id'] as $field) if (empty($data[$field])) throw new \InvalidArgumentException("Campo obrigatório: {$field}");
        return DB::transaction(function () use ($data, $source) {
            $order = $this->create('orders', array_intersect_key($data, array_flip($this->registry->get('orders')['fields'])), $source);
            $items = DB::table('purchase_list_items')->where('purchase_list_id', $data['purchase_list_id'])->get();
            foreach ($items as $item) $this->create('order_items', ['order_id'=>$order['id'],'name'=>$item->name,'quantity'=>$item->quantity,'unit'=>$item->unit,'unit_price'=>$item->unit_price,'supplier'=>$item->supplier,'status'=>'pending'], $source);
            return $this->details('orders', (int) $order['id']);
        });
    }

    public function details(string $entity, int $id): array
    {
        $record = $this->get($entity, $id);
        return match ($entity) {
            'clients' => $record + ['jobs'=>$this->list('jobs',['client_id'=>$id]),'appointments'=>$this->list('appointments',['client_id'=>$id]),'messages'=>$this->list('messages',['client_id'=>$id]),'quotes'=>$this->list('quotes',['client_id'=>$id])],
            'jobs' => $record + ['tasks'=>$this->list('job_tasks',['job_id'=>$id]),'appointments'=>$this->list('appointments',['job_id'=>$id]),'materials'=>$this->list('materials',['job_id'=>$id]),'orders'=>$this->list('orders',['job_id'=>$id]),'quotes'=>$this->list('quotes',['job_id'=>$id])],
            'service_catalog' => $record + ['purchase_lists'=>array_map(fn($list)=>$list+['items'=>$this->list('purchase_list_items',['purchase_list_id'=>$list['id']])],$this->list('purchase_lists',['service_catalog_id'=>$id]))],
            'orders' => $record + ['items'=>$this->list('order_items',['order_id'=>$id])],
            default => $record,
        };
    }

    private function prepare(string $entity, array $data, array $meta, array $existing = []): array
    {
        foreach ($meta['json'] as $field) if (array_key_exists($field, $data) && $data[$field] !== null) $data[$field] = json_encode($data[$field], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
        if ($entity === 'quotes' && count(array_intersect(array_keys($data), ['labor_hours','hourly_rate','materials_total','margin_percent'])) > 0) {
            $values = array_merge($existing, $data);
            $base = ($values['labor_hours'] ?? 0) * ($values['hourly_rate'] ?? 0) + ($values['materials_total'] ?? 0);
            $data['total'] = round($base * (1 + ($values['margin_percent'] ?? 0) / 100), 2);
        }
        return $data;
    }

    private function decode(object|array $row, array $meta): array
    {
        $row = (array) $row;
        foreach ($meta['json'] as $field) if (isset($row[$field]) && is_string($row[$field])) $row[$field] = json_decode($row[$field], true);
        return $row;
    }

    private function audit(string $source, string $action, string $entity, ?int $id, array $changes): void
    {
        if (getenv('MARTINS_MCP_DISABLE_AUDIT') === '1' || ! Schema::hasTable('backoffice_audit_logs')) return;
        DB::table('backoffice_audit_logs')->insert(['source'=>$source,'action'=>$action,'entity'=>$entity,'entity_id'=>$id,'changes'=>json_encode($changes, JSON_UNESCAPED_UNICODE),'created_at'=>now()]);
    }
}
