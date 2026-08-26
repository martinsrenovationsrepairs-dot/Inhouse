# CI/CD para Hostinger

O workflow `CI` valida lint, testes e build em pushes e pull requests para
`main`. Depois de um push válido, `Deploy to Hostinger` publica uma release por
SSH e muda atomicamente o link `current`. As cinco releases mais recentes são
mantidas para permitir rollback.

## Configuração no GitHub

Crie o environment **production** em **Settings → Environments**. Nesse
environment, adicione os seguintes Secrets:

- `HOSTINGER_HOST`: hostname ou IP SSH.
- `HOSTINGER_USERNAME`: utilizador SSH.
- `HOSTINGER_PORT`: porta SSH; normalmente `22` ou `65002`.
- `HOSTINGER_DEPLOY_PATH`: caminho absoluto dedicado à aplicação, nunca `/`;
  por exemplo `/home/u123456789/apps/inhouse`.
- `HOSTINGER_SSH_PRIVATE_KEY`: chave privada completa de uma chave exclusiva
  para deployments.

Adicione também estas Variables no environment:

- `PRODUCTION_URL`: URL pública sem barra final.
- `HOSTINGER_RESTART_COMMAND`: comando disponibilizado pela Hostinger para
  reiniciar a aplicação. Deixe vazio até confirmar o comando correto no hPanel.

Não guarde `.env`, passwords, tokens ou chaves no repositório. Configure
`NODE_ENV`, `APP_URL`, dados MySQL, `SESSION_SECRET` e dados do administrador nas
Environment Variables da Web App no hPanel, conforme `HOSTINGER.md`.

## Preparação única na Hostinger

1. Autorize no servidor a chave pública correspondente ao secret privado.
2. Crie o diretório indicado por `HOSTINGER_DEPLOY_PATH`.
3. Configure a Web App para Node.js 22, entry file `server/app.js` e diretório
   raiz `<HOSTINGER_DEPLOY_PATH>/current`.
4. Configure as variáveis de ambiente no hPanel.
5. Defina `HOSTINGER_RESTART_COMMAND` com o comando de restart indicado pelo
   painel e execute manualmente `Deploy to Hostinger` uma primeira vez.

## Rollback

No SSH, liste `<HOSTINGER_DEPLOY_PATH>/releases` e volte o link `current` para
uma release anterior. Depois reinicie a aplicação com o mesmo comando definido
em `HOSTINGER_RESTART_COMMAND`.
