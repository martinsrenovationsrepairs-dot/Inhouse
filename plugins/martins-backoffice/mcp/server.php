<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use App\Services\Backoffice\BackofficeRepository;
use App\Services\Backoffice\EntityRegistry;

$projectRoot = dirname(__DIR__, 3);
require $projectRoot.'/vendor/autoload.php';
$app = require $projectRoot.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$registry = $app->make(EntityRegistry::class);
$repository = $app->make(BackofficeRepository::class);
$entities = $registry->all();

function send(array $payload): void { echo json_encode($payload, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)."\n"; fflush(STDOUT); }
function textResult(mixed $value, bool $error = false): array { return ['content' => [['type' => 'text', 'text' => json_encode($value, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES)]], 'isError' => $error]; }
function definition(array $entities): array {
    $entityNames = array_keys($entities);
    $entityProp = ['type'=>'string','enum'=>$entityNames,'description'=>'Entidade de negócio. Use backoffice_schema para ver os campos.'];
    return [
        ['name'=>'backoffice_schema','description'=>'Lista as entidades do backoffice, campos editáveis e estrutura real das tabelas autorizadas. Não expõe tabelas de autenticação ou framework.','inputSchema'=>['type'=>'object','properties'=>['entity'=>['type'=>'string','enum'=>$entityNames]]]],
        ['name'=>'backoffice_dashboard','description'=>'Obtém um resumo operacional atual: contagens, trabalhos ativos, agenda, materiais e pedidos recentes.','inputSchema'=>['type'=>'object','properties'=>[]]],
        ['name'=>'backoffice_list','description'=>'Lista e pesquisa registos de uma entidade, com filtros exatos opcionais.','inputSchema'=>['type'=>'object','properties'=>['entity'=>$entityProp,'search'=>['type'=>'string'],'filters'=>['type'=>'object'],'limit'=>['type'=>'integer','minimum'=>1,'maximum'=>200],'offset'=>['type'=>'integer','minimum'=>0]],'required'=>['entity']]],
        ['name'=>'backoffice_get','description'=>'Lê todos os detalhes autorizados de um registo pelo ID.','inputSchema'=>['type'=>'object','properties'=>['entity'=>$entityProp,'id'=>['type'=>'integer','minimum'=>1]],'required'=>['entity','id']]],
        ['name'=>'backoffice_details','description'=>'Lê um registo com todas as relações úteis. Clientes incluem trabalhos, agenda, mensagens e orçamentos; trabalhos incluem tarefas, materiais, encomendas e orçamentos; serviços de catálogo incluem listas e artigos.','inputSchema'=>['type'=>'object','properties'=>['entity'=>$entityProp,'id'=>['type'=>'integer','minimum'=>1]],'required'=>['entity','id']]],
        ['name'=>'backoffice_create','description'=>'Cria um registo no backoffice. Envie data como objeto usando os campos indicados por backoffice_schema.','inputSchema'=>['type'=>'object','properties'=>['entity'=>$entityProp,'data'=>['type'=>'object']],'required'=>['entity','data']]],
        ['name'=>'backoffice_update','description'=>'Edita apenas os campos indicados de um registo existente.','inputSchema'=>['type'=>'object','properties'=>['entity'=>$entityProp,'id'=>['type'=>'integer','minimum'=>1],'data'=>['type'=>'object']],'required'=>['entity','id','data']]],
        ['name'=>'backoffice_create_order_from_purchase_list','description'=>'Cria uma encomenda e copia, numa única transação, todos os artigos de uma lista de compras para linhas da encomenda.','inputSchema'=>['type'=>'object','properties'=>['reference'=>['type'=>'string'],'purchase_list_id'=>['type'=>'integer','minimum'=>1],'job_id'=>['type'=>'integer','minimum'=>1],'supplier'=>['type'=>'string'],'status'=>['type'=>'string'],'notes'=>['type'=>'string']],'required'=>['reference','purchase_list_id']]],
        ['name'=>'backoffice_delete','description'=>'APAGA permanentemente um registo. Requer confirmation exatamente no formato APAGAR <entidade> <id>.','annotations'=>['destructiveHint'=>true],'inputSchema'=>['type'=>'object','properties'=>['entity'=>$entityProp,'id'=>['type'=>'integer','minimum'=>1],'confirmation'=>['type'=>'string','description'=>'Texto exato: APAGAR <entidade> <id>']],'required'=>['entity','id','confirmation']]],
    ];
}
function entity(array $entities, array $args): array { $name = $args['entity'] ?? ''; if (!isset($entities[$name])) throw new InvalidArgumentException("Entidade não autorizada: {$name}"); return [$name, $entities[$name]]; }
function cleanData(array $meta, array $data, bool $creating): array {
    $unknown = array_values(array_diff(array_keys($data), $meta['fields']));
    if ($unknown) throw new InvalidArgumentException('Campos não autorizados: '.implode(', ', $unknown));
    if ($creating) { $missing = array_values(array_filter($meta['required'], fn($key) => !array_key_exists($key, $data) || $data[$key] === '')); if ($missing) throw new InvalidArgumentException('Campos obrigatórios: '.implode(', ', $missing)); }
    if (!$data) throw new InvalidArgumentException('Nenhum campo válido foi enviado.');
    foreach ($meta['json'] ?? [] as $field) {
        if (array_key_exists($field, $data) && $data[$field] !== null && !is_string($data[$field])) {
            $data[$field] = json_encode($data[$field], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
        }
    }
    return $data;
}
function audit(string $action, string $entity, ?int $id, array $changes = []): void {
    if (getenv('MARTINS_MCP_DISABLE_AUDIT') === '1') return;
    if (!Schema::hasTable('backoffice_audit_logs')) return;
    DB::table('backoffice_audit_logs')->insert(['source'=>'mcp','action'=>$action,'entity'=>$entity,'entity_id'=>$id,'changes'=>json_encode($changes, JSON_UNESCAPED_UNICODE),'created_at'=>now()]);
}
function callTool(string $tool, array $args, array $entities, BackofficeRepository $repository): array {
    if ($tool === 'backoffice_schema') {
        $selected = $args['entity'] ?? null; $items = [];
        foreach ($entities as $name => $meta) { if ($selected && $selected !== $name) continue; $items[$name] = ['table'=>$meta['table'],'editable_fields'=>$meta['fields'],'required_on_create'=>$meta['required'],'columns'=>Schema::getColumns($meta['table'])]; }
        return textResult($items);
    }
    if ($tool === 'backoffice_dashboard') {
        return textResult(['counts'=>array_map(fn($m)=>DB::table($m['table'])->count(), $entities),'active_jobs'=>DB::table('service_jobs')->whereNotIn('status',['completed','cancelled'])->orderByDesc('updated_at')->limit(20)->get(),'next_appointments'=>DB::table('appointments')->where('starts_at','>=',now())->orderBy('starts_at')->limit(20)->get(),'materials_needed'=>DB::table('material_items')->whereIn('status',['needed','por_comprar'])->orderByDesc('created_at')->limit(50)->get(),'recent_quote_requests'=>DB::table('quote_requests')->orderByDesc('created_at')->limit(20)->get()]);
    }
    if ($tool === 'backoffice_create_order_from_purchase_list') return textResult($repository->createOrderFromPurchaseList($args));
    [$name, $meta] = entity($entities, $args); $table = $meta['table'];
    if ($tool === 'backoffice_list') {
        $limit = min(200,max(1,(int)($args['limit']??50))); $offset=max(0,(int)($args['offset']??0));
        return textResult(['entity'=>$name,'limit'=>$limit,'offset'=>$offset,'items'=>$repository->list($name,(array)($args['filters']??[]),$args['search']??null,$limit,$offset)]);
    }
    if ($tool === 'backoffice_create') {
        return textResult($repository->create($name,(array)($args['data']??[]),'mcp'));
    }
    $id=(int)($args['id']??0); if ($id<1) throw new InvalidArgumentException('ID inválido.');
    if ($tool === 'backoffice_get') return textResult($repository->get($name,$id));
    if ($tool === 'backoffice_details') return textResult($repository->details($name,$id));
    if ($tool === 'backoffice_update') return textResult($repository->update($name,$id,(array)($args['data']??[]),'mcp'));
    if ($tool === 'backoffice_delete') { $expected="APAGAR {$name} {$id}"; if (($args['confirmation']??'')!==$expected) throw new InvalidArgumentException("Confirmação necessária. Envie exatamente: {$expected}"); $repository->delete($name,$id,'mcp'); return textResult(['deleted'=>true,'entity'=>$name,'id'=>$id]); }
    throw new InvalidArgumentException("Ferramenta desconhecida: {$tool}");
}

while (($line = fgets(STDIN)) !== false) {
    $request = json_decode(trim($line), true); if (!is_array($request)) continue;
    $id = $request['id'] ?? null; $method = $request['method'] ?? '';
    if ($id === null) continue;
    try {
        $result = match ($method) {
            'initialize' => ['protocolVersion'=>$request['params']['protocolVersion']??'2025-06-18','capabilities'=>['tools'=>['listChanged'=>false]],'serverInfo'=>['name'=>'martins-backoffice','version'=>'1.0.0']],
            'ping' => (object)[],
            'tools/list' => ['tools'=>definition($entities)],
            'tools/call' => callTool((string)($request['params']['name']??''),(array)($request['params']['arguments']??[]),$entities,$repository),
            default => throw new BadMethodCallException("Método não suportado: {$method}"),
        };
        send(['jsonrpc'=>'2.0','id'=>$id,'result'=>$result]);
    } catch (Throwable $e) {
        if ($method === 'tools/call') send(['jsonrpc'=>'2.0','id'=>$id,'result'=>textResult(['error'=>$e->getMessage()],true)]);
        else send(['jsonrpc'=>'2.0','id'=>$id,'error'=>['code'=>-32603,'message'=>$e->getMessage()]]);
    }
}
