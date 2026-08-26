# Martins In House Services

Aplicação full-stack preparada para **Hostinger Deploy Web App**, com React 19, Vite, Express.js e MySQL.

## Desenvolvimento

1. Copiar `.env.example` para `.env` e configurar uma base MySQL local.
2. Instalar dependências:

```bash
npm install
npm --prefix frontend install
```

3. Criar schema e dados demo:

```bash
npm run db:migrate
npm run db:seed:demo
```

4. Criar administrador, definindo previamente `ADMIN_EMAIL` e `ADMIN_INITIAL_PASSWORD`:

```bash
npm run admin:create -- admin@example.com
```

5. Iniciar API e Vite:

```bash
npm run dev
```

Frontend: `http://127.0.0.1:5180`  
API: `http://127.0.0.1:3000`

## Produção

```bash
npm run lint
npm test
npm run build
npm start
```

O Express serve o frontend compilado em `dist` e todas as rotas `/api`. Consulte `HOSTINGER.md` para as definições exatas do deployment e da base de dados.

## Dados demo e reais

Todas as entidades operacionais têm `data_scope` igual a `demo` ou `real`. O interruptor global em **Backoffice → Definições → Modo de dados** muda o âmbito usado pelas listagens e pelo CRUD. Os pedidos enviados pelo formulário público são sempre reais.
