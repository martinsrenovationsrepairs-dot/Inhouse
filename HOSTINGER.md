# Deploy na Hostinger — Node.js Web App

> **Importante:** envie este ZIP completo através de **Deploy Web App**. Não o
> extraia no gestor de ficheiros, não copie `frontend` para `public_html` e não
> renomeie `frontend/public`. Essa pasta contém apenas os assets de origem do
> Vite; o conteúdo publicável é o diretório `dist` gerado pelo build.

## Definições do deployment

- Tipo: **Deploy Web App**
- Framework: **Express.js** (ou Other se a deteção automática não identificar)
- Node.js: **22.x**
- Root directory: `.`
- Build command: `npm run build`
- Start command: `npm start`
- Entry file: `server/app.js`
- Output do frontend: `dist`

## Base de dados

Crie uma base MySQL no hPanel e copie os nomes completos apresentados pela Hostinger. Configure `DB_HOST=localhost`, `DB_PORT=3306`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` nas Environment Variables do deployment.

As migrations e os seeders de demonstração são idempotentes e executam automaticamente no arranque. Os dados demo usam `data_scope=demo`; os dados reais usam `data_scope=real`. O interruptor fica em **Backoffice → Definições → Modo de dados**.

Pedidos enviados pelo formulário público são sempre guardados como dados reais, mesmo quando o backoffice está em modo demo.

## Primeiro administrador

No primeiro deployment configure `ADMIN_EMAIL`, `ADMIN_NAME` e `ADMIN_INITIAL_PASSWORD` (mínimo 12 caracteres). Depois de confirmar o login, remova `ADMIN_INITIAL_PASSWORD` das variáveis e faça redeploy/restart.

## Segurança

Nunca envie `.env`, `node_modules`, passwords ou dumps da base de dados no ZIP/GitHub. Em produção são obrigatórios `NODE_ENV=production`, `APP_URL=https://...` e um `SESSION_SECRET` aleatório longo.

## Verificação após deploy

1. Abrir `/api/status` e confirmar `status: online`.
2. Entrar em `/admin`.
3. Confirmar dados demo e executar um CRUD de teste.
4. Desligar o modo demo e confirmar que a listagem real está separada.
5. Enviar um pedido público e confirmar que aparece no modo real.
