# Martins Backoffice MCP

Plugin MCP local para gerir por chat todos os dados operacionais deste projeto Laravel: clientes,
trabalhos e respetivas tarefas, agenda, mensagens, materiais, catálogo de serviços, listas de
compras, encomendas, orçamentos, pedidos recebidos e definições.

## Ferramentas

- `backoffice_schema`: entidades, validações e campos autorizados
- `backoffice_dashboard`: resumo operacional
- `backoffice_list` / `backoffice_get` / `backoffice_details`: pesquisa, leitura e relações completas
- `backoffice_create` / `backoffice_update`: criação e edição
- `backoffice_create_order_from_purchase_list`: cria uma encomenda com as linhas de uma lista numa transação
- `backoffice_delete`: eliminação com confirmação explícita

O servidor usa a configuração de base de dados do `.env` do projeto. Tabelas técnicas e de
autenticação (`users`, `sessions`, `jobs`, cache, tokens) não são expostas. Todas as mutações
ficam registadas em `backoffice_audit_logs`.

O manifesto MCP aponta para o servidor no projeto original, porque o Codex instala plugins numa
cache própria que não contém as dependências `vendor` nem o `.env` do Laravel.

## Preparação e instalação

Execute primeiro `php artisan migrate`. Depois instale a pasta `plugins/martins-backoffice`
através de um marketplace local do Codex. Em alternativa, registe diretamente o servidor na
configuração MCP do Codex:

```toml
[mcp_servers.martins_backoffice]
command = "php"
args = ["C:/laragon/www/REACTPORTFOLIOWORKS/SiteGervas/plugins/martins-backoffice/mcp/server.php"]
cwd = "C:/laragon/www/REACTPORTFOLIOWORKS/SiteGervas/plugins/martins-backoffice"
```

Depois da instalação ou alteração da configuração, abra uma nova tarefa no Codex. Para testar o
servidor sem o Codex, execute `php plugins/martins-backoffice/tests/smoke.php`.
O teste integral de criação, leitura, edição e eliminação das entidades é executado com
`php plugins/martins-backoffice/tests/crud.php`; os registos temporários são removidos no final.

## Eliminações

Apagar é permanente e exige um segundo passo. Exemplo: para eliminar o cliente 12, a ferramenta
exige a confirmação literal `APAGAR clients 12`. As chaves estrangeiras da base de dados continuam
a proteger e/ou propagar relações conforme as migrations do Laravel.
