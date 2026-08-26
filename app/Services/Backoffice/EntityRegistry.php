<?php

namespace App\Services\Backoffice;

use Illuminate\Validation\Rule;

class EntityRegistry
{
    public function all(): array
    {
        return [
            'clients' => $this->entity('clients', ['name','email','phone','location','preferred_language','tags','notes'], ['name'], ['name','email','phone','location','notes'], ['tags'], [
                'name'=>['string','max:255'], 'email'=>['nullable','email','max:255'], 'phone'=>['nullable','string','max:255'], 'location'=>['nullable','string','max:255'], 'preferred_language'=>['nullable','string','size:2'], 'tags'=>['nullable','array'], 'notes'=>['nullable','string'],
            ]),
            'jobs' => $this->entity('service_jobs', ['client_id','reference','title','service','status','progress','budget','location','start_date','end_date','notes'], ['reference','title','service'], ['reference','title','service','location','notes'], [], [
                'client_id'=>['nullable','integer','exists:clients,id'], 'reference'=>['string','max:255'], 'title'=>['string','max:255'], 'service'=>['string','max:255'], 'status'=>['nullable','string','max:50'], 'progress'=>['nullable','integer','between:0,100'], 'budget'=>['nullable','numeric','min:0'], 'location'=>['nullable','string','max:255'], 'start_date'=>['nullable','date'], 'end_date'=>['nullable','date','after_or_equal:start_date'], 'notes'=>['nullable','string'],
            ], ['reference']),
            'job_tasks' => $this->entity('service_job_tasks', ['job_id','title','status','position','due_date','notes'], ['job_id','title'], ['title','status','notes'], [], [
                'job_id'=>['integer','exists:service_jobs,id'], 'title'=>['string','max:255'], 'status'=>['nullable','string','max:50'], 'position'=>['nullable','integer','min:0'], 'due_date'=>['nullable','date'], 'notes'=>['nullable','string'],
            ]),
            'appointments' => $this->entity('appointments', ['client_id','job_id','title','starts_at','ends_at','location','status','google_event_id','notes'], ['title','starts_at','ends_at'], ['title','location','notes'], [], [
                'client_id'=>['nullable','integer','exists:clients,id'], 'job_id'=>['nullable','integer','exists:service_jobs,id'], 'title'=>['string','max:255'], 'starts_at'=>['date'], 'ends_at'=>['date','after:starts_at'], 'location'=>['nullable','string','max:255'], 'status'=>['nullable','string','max:50'], 'google_event_id'=>['nullable','string','max:255'], 'notes'=>['nullable','string'],
            ]),
            'materials' => $this->entity('material_items', ['job_id','name','quantity','unit','unit_cost','status','supplier','url','purchased_at'], ['job_id','name'], ['name','supplier','status'], [], [
                'job_id'=>['integer','exists:service_jobs,id'], 'name'=>['string','max:255'], 'quantity'=>['nullable','numeric','min:0'], 'unit'=>['nullable','string','max:50'], 'unit_cost'=>['nullable','numeric','min:0'], 'status'=>['nullable','string','max:50'], 'supplier'=>['nullable','string','max:255'], 'url'=>['nullable','url','max:2048'], 'purchased_at'=>['nullable','date'],
            ]),
            'messages' => $this->entity('customer_messages', ['client_id','quote_request_id','channel','subject','body','status','priority'], ['body'], ['subject','body','channel','status','priority'], [], [
                'client_id'=>['nullable','integer','exists:clients,id'], 'quote_request_id'=>['nullable','integer','exists:quote_requests,id'], 'channel'=>['nullable','string','max:50'], 'subject'=>['nullable','string','max:255'], 'body'=>['string'], 'status'=>['nullable','string','max:50'], 'priority'=>['nullable','string','max:50'],
            ]),
            'quote_requests' => $this->entity('quote_requests', ['name','phone','email','location','service','description','preferred_language','contact_method','preferred_date','attachments','consent_at'], ['name','phone','email','location','service','description','preferred_language','contact_method','consent_at'], ['name','phone','email','location','service','description'], ['attachments'], [
                'name'=>['string','max:120'], 'phone'=>['string','max:40'], 'email'=>['email','max:160'], 'location'=>['string','max:180'], 'service'=>['string','max:40'], 'description'=>['string'], 'preferred_language'=>['string','size:2'], 'contact_method'=>['string','max:20'], 'preferred_date'=>['nullable','date'], 'attachments'=>['nullable','array'], 'consent_at'=>['date'],
            ]),
            'service_catalog' => $this->entity('service_catalog', ['code','name','description','hourly_rate','default_hours','active'], ['code','name'], ['code','name','description'], [], [
                'code'=>['string','max:255'], 'name'=>['string','max:255'], 'description'=>['nullable','string'], 'hourly_rate'=>['nullable','numeric','min:0'], 'default_hours'=>['nullable','numeric','min:0'], 'active'=>['nullable','boolean'],
            ], ['code']),
            'purchase_lists' => $this->entity('purchase_lists', ['service_catalog_id','name','notes'], ['service_catalog_id','name'], ['name','notes'], [], [
                'service_catalog_id'=>['integer','exists:service_catalog,id'], 'name'=>['string','max:255'], 'notes'=>['nullable','string'],
            ]),
            'purchase_list_items' => $this->entity('purchase_list_items', ['purchase_list_id','name','description','supplier','url','quantity','unit','unit_price'], ['purchase_list_id','name'], ['name','description','supplier'], [], [
                'purchase_list_id'=>['integer','exists:purchase_lists,id'], 'name'=>['string','max:255'], 'description'=>['nullable','string'], 'supplier'=>['nullable','string','max:255'], 'url'=>['nullable','url','max:2048'], 'quantity'=>['nullable','numeric','min:0'], 'unit'=>['nullable','string','max:50'], 'unit_price'=>['nullable','numeric','min:0'],
            ]),
            'orders' => $this->entity('orders', ['reference','job_id','purchase_list_id','supplier','status','ordered_at','expected_at','received_at','notes'], ['reference'], ['reference','supplier','status','notes'], [], [
                'reference'=>['string','max:255'], 'job_id'=>['nullable','integer','exists:service_jobs,id'], 'purchase_list_id'=>['nullable','integer','exists:purchase_lists,id'], 'supplier'=>['nullable','string','max:255'], 'status'=>['nullable','string','max:50'], 'ordered_at'=>['nullable','date'], 'expected_at'=>['nullable','date'], 'received_at'=>['nullable','date'], 'notes'=>['nullable','string'],
            ], ['reference']),
            'order_items' => $this->entity('order_items', ['order_id','name','quantity','unit','unit_price','supplier','status'], ['order_id','name'], ['name','supplier','status'], [], [
                'order_id'=>['integer','exists:orders,id'], 'name'=>['string','max:255'], 'quantity'=>['nullable','numeric','min:0'], 'unit'=>['nullable','string','max:50'], 'unit_price'=>['nullable','numeric','min:0'], 'supplier'=>['nullable','string','max:255'], 'status'=>['nullable','string','max:50'],
            ]),
            'quotes' => $this->entity('quotes', ['reference','client_id','job_id','service_catalog_id','title','status','labor_hours','hourly_rate','materials_total','margin_percent','total','valid_until','description'], ['reference','title'], ['reference','title','status','description'], [], [
                'reference'=>['string','max:255'], 'client_id'=>['nullable','integer','exists:clients,id'], 'job_id'=>['nullable','integer','exists:service_jobs,id'], 'service_catalog_id'=>['nullable','integer','exists:service_catalog,id'], 'title'=>['string','max:255'], 'status'=>['nullable','string','max:50'], 'labor_hours'=>['nullable','numeric','min:0'], 'hourly_rate'=>['nullable','numeric','min:0'], 'materials_total'=>['nullable','numeric','min:0'], 'margin_percent'=>['nullable','numeric','min:0'], 'total'=>['nullable','numeric','min:0'], 'valid_until'=>['nullable','date'], 'description'=>['nullable','string'],
            ], ['reference']),
            'settings' => $this->entity('backoffice_settings', ['key','value','group','description'], ['key'], ['key','group','description'], ['value'], [
                'key'=>['string','max:255'], 'value'=>['nullable'], 'group'=>['nullable','string','max:100'], 'description'=>['nullable','string'],
            ], ['key']),
        ];
    }

    public function get(string $entity): array
    {
        return $this->all()[$entity] ?? throw new \InvalidArgumentException("Entidade não autorizada: {$entity}");
    }

    public function validate(string $entity, array $data, bool $creating, ?int $id = null): array
    {
        $meta = $this->get($entity);
        $unknown = array_diff(array_keys($data), $meta['fields']);
        if ($unknown) throw new \InvalidArgumentException('Campos não autorizados: '.implode(', ', $unknown));
        $rules = [];
        foreach ($meta['rules'] as $field => $fieldRules) {
            $fieldRules = $fieldRules;
            array_unshift($fieldRules, in_array($field, $meta['required'], true) && $creating ? 'required' : 'sometimes');
            if (in_array($field, $meta['unique'], true)) $fieldRules[] = Rule::unique($meta['table'], $field)->ignore($id);
            $rules[$field] = $fieldRules;
        }
        return validator($data, $rules)->validate();
    }

    private function entity(string $table, array $fields, array $required, array $search, array $json, array $rules, array $unique = []): array
    {
        return compact('table','fields','required','search','json','rules','unique');
    }
}
