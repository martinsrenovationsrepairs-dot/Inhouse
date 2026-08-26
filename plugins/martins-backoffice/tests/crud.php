<?php

declare(strict_types=1);

$pluginRoot = dirname(__DIR__);
putenv('MARTINS_MCP_DISABLE_AUDIT=1');
$process = proc_open([PHP_BINARY, $pluginRoot.'/mcp/server.php'], [['pipe','r'],['pipe','w'],['pipe','w']], $pipes, $pluginRoot);
if (!is_resource($process)) throw new RuntimeException('Não foi possível iniciar o MCP.');

$sequence = 0;
function callMcp($stdin, $stdout, string $name, array $arguments): mixed
{
    global $sequence;
    $id = ++$sequence;
    fwrite($stdin, json_encode(['jsonrpc'=>'2.0','id'=>$id,'method'=>'tools/call','params'=>['name'=>$name,'arguments'=>$arguments]], JSON_UNESCAPED_UNICODE)."\n");
    fflush($stdin);
    $response = json_decode((string)fgets($stdout), true);
    if (($response['id'] ?? null) !== $id) throw new RuntimeException("Resposta MCP fora de sequência em {$name}.");
    $result = $response['result'] ?? [];
    $payload = json_decode($result['content'][0]['text'] ?? 'null', true);
    if (($result['isError'] ?? false) === true) throw new RuntimeException($payload['error'] ?? "Erro em {$name}.");
    return $payload;
}

$created = [];
try {
    $create = function (string $entity, array $data) use (&$created, $pipes) {
        $row = callMcp($pipes[0], $pipes[1], 'backoffice_create', compact('entity','data'));
        $created[] = [$entity, (int)$row['id']];
        return $row;
    };

    $suffix = bin2hex(random_bytes(4));
    $client = $create('clients', ['name'=>'MCP CRUD '.$suffix,'email'=>"crud-{$suffix}@example.test",'location'=>'Setúbal','preferred_language'=>'pt','tags'=>['teste'],'notes'=>'criado pelo teste CRUD']);
    $job = $create('jobs', ['client_id'=>$client['id'],'reference'=>'TEST-SRV-'.$suffix,'title'=>'Serviço CRUD','service'=>'Teste','status'=>'planned','progress'=>0,'budget'=>100,'location'=>'Setúbal']);
    $task = $create('job_tasks', ['job_id'=>$job['id'],'title'=>'Tarefa CRUD','status'=>'pending','position'=>1]);
    $appointment = $create('appointments', ['client_id'=>$client['id'],'job_id'=>$job['id'],'title'=>'Marcação CRUD','starts_at'=>'2030-01-01 10:00:00','ends_at'=>'2030-01-01 11:00:00','status'=>'scheduled']);
    $material = $create('materials', ['job_id'=>$job['id'],'name'=>'Material CRUD','quantity'=>2,'unit'=>'un.','unit_cost'=>3.5,'status'=>'needed','supplier'=>'Fornecedor CRUD']);
    $request = $create('quote_requests', ['name'=>'Pedido CRUD','phone'=>'+351 000 000 000','email'=>"request-{$suffix}@example.test",'location'=>'Setúbal','service'=>'other','description'=>'Teste CRUD','preferred_language'=>'pt','contact_method'=>'email','attachments'=>[],'consent_at'=>'2030-01-01 10:00:00']);
    $message = $create('messages', ['client_id'=>$client['id'],'quote_request_id'=>$request['id'],'channel'=>'website','subject'=>'CRUD','body'=>'Mensagem CRUD','status'=>'unread','priority'=>'normal']);
    $catalog = $create('service_catalog', ['code'=>'TEST-CAT-'.$suffix,'name'=>'Catálogo CRUD','description'=>'Teste','hourly_rate'=>25,'default_hours'=>2,'active'=>true]);
    $list = $create('purchase_lists', ['service_catalog_id'=>$catalog['id'],'name'=>'Lista CRUD']);
    $listItem = $create('purchase_list_items', ['purchase_list_id'=>$list['id'],'name'=>'Item CRUD','quantity'=>2,'unit'=>'un.','unit_price'=>5]);
    $order = $create('orders', ['reference'=>'TEST-ENC-'.$suffix,'job_id'=>$job['id'],'purchase_list_id'=>$list['id'],'supplier'=>'Fornecedor CRUD','status'=>'draft']);
    $orderItem = $create('order_items', ['order_id'=>$order['id'],'name'=>'Linha CRUD','quantity'=>1,'unit'=>'un.','unit_price'=>5,'status'=>'pending']);
    $quote = $create('quotes', ['reference'=>'TEST-ORC-'.$suffix,'client_id'=>$client['id'],'job_id'=>$job['id'],'service_catalog_id'=>$catalog['id'],'title'=>'Orçamento CRUD','status'=>'draft','total'=>100]);
    $setting = $create('settings', ['key'=>'crud_test_'.$suffix,'value'=>['enabled'=>true],'group'=>'tests','description'=>'Teste CRUD']);

    foreach ($created as [$entity, $id]) {
        $row = callMcp($pipes[0], $pipes[1], 'backoffice_get', compact('entity','id'));
        if ((int)$row['id'] !== $id) throw new RuntimeException("Leitura inválida de {$entity} #{$id}.");
        $listed = callMcp($pipes[0], $pipes[1], 'backoffice_list', ['entity'=>$entity,'filters'=>['id'=>$id],'limit'=>1]);
        if (count($listed['items'] ?? []) !== 1) throw new RuntimeException("Listagem inválida de {$entity} #{$id}.");
    }

    $updates = ['clients'=>['notes'=>'editado'],'jobs'=>['notes'=>'editado'],'job_tasks'=>['notes'=>'editado'],'appointments'=>['notes'=>'editado'],'materials'=>['status'=>'purchased'],'quote_requests'=>['description'=>'editado'],'messages'=>['status'=>'read'],'service_catalog'=>['description'=>'editado'],'purchase_lists'=>['notes'=>'editado'],'purchase_list_items'=>['description'=>'editado'],'orders'=>['notes'=>'editado'],'order_items'=>['status'=>'received'],'quotes'=>['description'=>'editado'],'settings'=>['description'=>'editado']];
    foreach ($created as [$entity, $id]) callMcp($pipes[0], $pipes[1], 'backoffice_update', ['entity'=>$entity,'id'=>$id,'data'=>$updates[$entity]]);

    echo 'CRUD MCP OK: '.count($created)." entidades criadas, lidas, listadas e editadas.\n";
} finally {
    foreach (array_reverse($created) as [$entity, $id]) {
        try { callMcp($pipes[0], $pipes[1], 'backoffice_delete', ['entity'=>$entity,'id'=>$id,'confirmation'=>"APAGAR {$entity} {$id}"]); } catch (Throwable $e) { fwrite(STDERR, "Falha ao limpar {$entity} #{$id}: {$e->getMessage()}\n"); }
    }
    fclose($pipes[0]); fclose($pipes[1]);
    $errors = stream_get_contents($pipes[2]); fclose($pipes[2]);
    $exit = proc_close($process);
    if ($errors !== '') fwrite(STDERR, $errors);
    if ($exit !== 0) exit($exit);
}
