<?php

$server = dirname(__DIR__).'/mcp/server.php';
$process = proc_open(['php', $server], [['pipe','r'],['pipe','w'],['pipe','w']], $pipes, dirname(__DIR__));
if (!is_resource($process)) throw new RuntimeException('Não foi possível iniciar o MCP.');
foreach ([
    ['jsonrpc'=>'2.0','id'=>1,'method'=>'initialize','params'=>['protocolVersion'=>'2025-06-18','capabilities'=>[],'clientInfo'=>['name'=>'smoke','version'=>'1']]],
    ['jsonrpc'=>'2.0','id'=>2,'method'=>'tools/list','params'=>[]],
    ['jsonrpc'=>'2.0','id'=>3,'method'=>'tools/call','params'=>['name'=>'backoffice_list','arguments'=>['entity'=>'clients','limit'=>1]]],
] as $request) fwrite($pipes[0], json_encode($request)."\n");
fclose($pipes[0]); $responses=[]; while (($line=fgets($pipes[1]))!==false) $responses[]=json_decode($line,true); $errors=stream_get_contents($pipes[2]); $code=proc_close($process);
if ($code!==0 || $errors || count($responses)!==3 || isset($responses[0]['error']) || count($responses[1]['result']['tools']??[])<7 || ($responses[2]['result']['isError']??true)) { fwrite(STDERR, $errors."\n".json_encode($responses,JSON_PRETTY_PRINT)); exit(1); }
echo "MCP smoke test OK: ".count($responses[1]['result']['tools'])." ferramentas.\n";
