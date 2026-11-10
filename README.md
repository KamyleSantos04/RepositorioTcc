# Conecta-Alimento

Plataforma web que conecta estabelecimentos com excedentes de alimentos a ONGs e instituições que precisam recebê-los. O sistema inclui autenticação por tipo de conta, publicação de doações, solicitação, aceite, recebimento, histórico e edição de perfis.

## Arquitetura

```text
frontend (React + SCSS, porta 3000)
             │ HTTP/JSON + JWT
             ▼
backend (Node.js + Express, porta 3001)
             │ mysql2/promise
             ▼
MySQL (banco TCC13)
```

- `frontend/`: aplicação React; `src/lib/api.js` centraliza as requisições e `src/lib/sessao.js` controla a sessão.
- `backend/`: API Express organizada em controladores, middleware de autenticação e repositórios MySQL.
- `backend/src/scripts/schema.sql`: definição do banco e das tabelas.
- `backend/src/scripts/criar-banco.js`: cria o banco e as tabelas sem apagar registros existentes.
- `backend/src/scripts/teste-api.js`: teste de integração da API.

## Funcionalidades

### Estabelecimento

- Criar conta, entrar e editar o perfil.
- Publicar, consultar, cancelar ou remover alimentos permitidos.
- Visualizar e responder solicitações de instituições.
- Acompanhar doações concluídas e indicadores no dashboard.

### ONG / instituição

- Criar conta, entrar e editar o perfil.
- Buscar doações disponíveis diretamente da API.
- Solicitar alimentos e acompanhar cada solicitação.
- Confirmar recebimento após aceite do estabelecimento.
- Consultar recebimentos e histórico.

### Segurança e regras de negócio

- JWT nas rotas protegidas.
- Autorização separada para `ONG` e `ESTABELECIMENTO` no frontend e backend.
- Redirecionamento ao login preservando o destino desejado.
- Não é possível duplicar solicitação aberta para a mesma doação.
- Ao aceitar um pedido, a doação fica reservada; após a retirada, fica concluída.
- Operações de solicitação e aceite usam transações MySQL.

## Pré-requisitos

- Node.js 18 ou superior.
- npm.
- MySQL 8 ou compatível em execução.

## Configuração

Ajuste `backend/.env` com uma credencial válida do MySQL. Não versione senhas reais.

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=TCC13
JWT_SECRET=uma_chave_longa_e_aleatoria
PORT=3001
```

Opcionalmente, defina a URL da API em `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:3001
```

## Instalação e execução

Na raiz do repositório:

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run banco --prefix backend
npm run dev
```

O comando `npm run dev` inicia a API e o React. A aplicação fica disponível em `http://localhost:3000`.

Se já estiver dentro de `backend`, use apenas:

```bash
npm run banco
```

Não use `--prefix backend` dentro da pasta `backend`: isso faria o npm procurar `backend/backend/package.json`.

## Validação

Com a API em execução:

```bash
node backend/src/scripts/teste-api.js
```

O script cria dados de teste e valida cadastro, login, perfis, doação, solicitação, bloqueio de duplicidade, aceite, recebimento, resumos e permissões.

Para gerar o build de produção do frontend:

```bash
npm run build --prefix frontend
```

## API

| Método | Rota | Acesso | Descrição |
| --- | --- | --- | --- |
| `POST` | `/api/auth/cadastro/ong` | Público | Cria conta de instituição |
| `POST` | `/api/auth/cadastro/estabelecimento` | Público | Cria conta de estabelecimento |
| `POST` | `/api/auth/login` | Público | Retorna JWT e dados da sessão |
| `GET` | `/api/doacoes` | Público | Lista doações disponíveis |
| `POST` | `/api/doacoes` | Estabelecimento | Publica alimento para doação |
| `GET` | `/api/minhas-doacoes` | Estabelecimento | Lista doações próprias |
| `PUT` | `/api/doacoes/:id/status` | Estabelecimento | Atualiza estado da doação |
| `DELETE` | `/api/doacoes/:id` | Estabelecimento | Remove doação permitida |
| `GET/PUT` | `/api/meu-estabelecimento` | Estabelecimento | Consulta ou edita o perfil |
| `GET/PUT` | `/api/minha-instituicao` | ONG | Consulta ou edita o perfil |
| `POST` | `/api/solicitacoes` | ONG | Solicita uma doação |
| `GET` | `/api/minhas-solicitacoes` | ONG | Lista solicitações da instituição |
| `PUT` | `/api/solicitacoes/:id/concluir` | ONG | Confirma o recebimento |
| `GET` | `/api/solicitacoes-recebidas` | Estabelecimento | Lista pedidos recebidos |
| `PUT` | `/api/solicitacoes/:id/status` | Estabelecimento | Aceita ou recusa pedido |

Envie `Authorization: Bearer <token>` nas rotas autenticadas.

## Banco de dados

O schema cria as seguintes tabelas no banco `TCC13`:

- `usuarios`: credenciais, hash BCrypt e tipo de conta.
- `instituicoes13`: dados de organizações beneficiárias.
- `estabelecimentos13`: dados de empresas doadoras.
- `doacoes13`: alimentos publicados e seu status.
- `solicitacoes13`: pedidos de instituições e seu status.

Estados utilizados:

- Doação: `DISPONIVEL`, `RESERVADA`, `CONCLUIDA`, `CANCELADA`.
- Solicitação: `PENDENTE`, `ACEITA`, `RECUSADA`, `CONCLUIDA`.

## Estrutura de pastas

```text
.
├── backend/
│   └── src/
│       ├── controller/     # rotas e regras HTTP
│       ├── middleware/     # JWT e autorização
│       ├── repository/     # queries MySQL
│       └── scripts/        # schema, criação e teste de API
├── frontend/
│   └── src/
│       ├── components/     # layout, cartões e avisos reutilizáveis
│       ├── hooks/          # proteção de rotas e requisições
│       ├── lib/            # API, sessão e formatação
│       └── pages/          # telas públicas e dashboards
└── README.md
```
