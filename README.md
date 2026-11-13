# webtenda.com.br

Página de vendas da WebTenda. Site estático (HTML, CSS e JS), sem build.
O sistema fica em outro repositório e roda em https://app.webtenda.com.br.

## Deploy automático

Cada push na `main` envia os arquivos por SSH (rsync) para o `public_html` do site no CyberPanel
(`.github/workflows/deploy.yml`). Também dá para rodar manualmente em Actions > Deploy > Run workflow.

Secrets do repositório (Settings > Secrets and variables > Actions):

| Secret | Valor |
|---|---|
| `SSH_HOST` | IP do servidor CyberPanel |
| `SSH_USER` | usuário SSH com acesso à pasta do site |
| `SSH_KEY` | chave privada SSH (a pública vai no servidor) |
| `SSH_PORT` | opcional, padrão 22 |
| `DEPLOY_PATH` | opcional, padrão `/home/webtenda.com.br/public_html` |

Sem os secrets o workflow só avisa e não faz nada.
O rsync não apaga arquivos no servidor (o `.well-known` do SSL fica intacto); para remover um arquivo do site, apague-o também no servidor.

## Onde mexer

- Preços e limites dos planos: seção "PLANOS" no `index.html` (iguais aos planos do sistema).
- Valor da calculadora de comissão: `PLANO` em `main.js`.
- Botões apontam para https://app.webtenda.com.br/cadastro e /entrar.
