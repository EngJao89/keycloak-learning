# Keycloak Learning

Projeto de estudo e demonstração de integração de **autenticação OIDC/OAuth2** com **Keycloak** em uma aplicação **Next.js**, usando fluxo Authorization Code.

---

## Descrição do Projeto

O **Keycloak Learning** é uma aplicação web que serve como laboratório para aprender e validar a integração entre:

- **Next.js 15** (App Router)
- **Keycloak** como provedor de identidade (IdP)
- **react-oidc-context** para gerenciar o fluxo OIDC no cliente

A aplicação oferece:

- **Página inicial**: tela de boas-vindas com botão de login que redireciona para o Keycloak.
- **Fluxo de login**: redirecionamento para o realm Keycloak, login e callback para o dashboard.
- **Dashboard**: área após autenticação, com exibição do nome do usuário e opção de logout.
- **Renovação silenciosa de token**: configurada para manter a sessão ativa sem novo login.

O objetivo é servir de referência para implementar SSO com Keycloak em projetos Next.js.

---

## Como Rodar o Projeto

### Pré-requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** (ou yarn/pnpm/bun)
- **Keycloak** em execução (local ou remoto) com um realm e um client configurado para uso com esta aplicação

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd keycloak-learning
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as variáveis do Keycloak:

```env
# URL base do Keycloak (ex.: http://localhost:8080)
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080

# Nome do realm (ex.: master ou um realm customizado)
NEXT_PUBLIC_KEYCLOAK_REALM=master

# Client ID configurado no Keycloak para esta aplicação
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=keycloak-learning

# URI de redirecionamento após login (deve coincidir com a configurada no client)
NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI=http://localhost:3000/dashboard
```

**No Keycloak**, o client deve:

- Ser do tipo **public** (ou confidential, se usar client secret).
- Ter **Valid Redirect URIs** incluindo `http://localhost:3000/dashboard` (e a origem `http://localhost:3000` se necessário).
- Ter **Web Origins** com `http://localhost:3000` para desenvolvimento.

### 3. Executar a aplicação

**Desenvolvimento** (com Turbopack):

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

**Build e produção**:

```bash
npm run build
npm start
```

**Outros scripts**:

| Script    | Descrição                          |
|-----------|------------------------------------|
| `npm run dev`   | Sobe o servidor de desenvolvimento (Turbopack) |
| `npm run build` | Gera o build de produção           |
| `npm run start` | Inicia o servidor de produção      |
| `npm run lint`  | Executa o ESLint                   |
| `npm run commit`| Abre o Commitizen para commits convencionais |

---

## Decisões Técnicas e Arquiteturais

### Stack principal

- **Next.js 15** com **App Router**: uso do modelo de rotas baseado em pastas e React Server Components onde faz sentido; páginas de auth são Client Components por dependerem de estado e do contexto OIDC.
- **React 19**: versão atual do React com suporte estável.
- **TypeScript**: tipagem em todo o projeto.
- **Tailwind CSS v4**: estilização utilitária e tema consistente (incluindo dark mode via `prefers-color-scheme`).

### Autenticação (OIDC/OAuth2)

- **react-oidc-context**: escolhido para encapsular o fluxo OIDC no cliente (Authorization Code), gerenciar tokens, renovação silenciosa e estado de autenticação. Evita implementar manualmente redirects, callbacks e armazenamento de tokens.
- **Keycloak** como IdP: padrão de mercado para SSO e identity brokering; a app apenas consome o endpoint OIDC do realm configurado.
- **Authorization Code**: fluxo recomendado para SPAs; a aplicação não lida com senhas, apenas com códigos e tokens.
- **Scopes** utilizados: `openid profile email` para identidade básica e dados do perfil.

### Estrutura da aplicação

- **App Router**: `src/app/` contém as rotas (page.tsx como página da rota, layout.tsx global).
- **Provedor de auth**: `AuthProvider` (react-oidc-context) envolve a aplicação no `layout.tsx`, garantindo que todas as rotas tenham acesso ao estado de autenticação.
- **Página inicial** (`/`): componente que decide entre “Carregando”, “Erro”, “Usuário autenticado” (com saudação e logout) ou **LoginPage** (botão “Entrar” que chama `signinRedirect()`).
- **Dashboard** (`/dashboard`): usada como **redirect_uri** após o login no Keycloak; exibe conteúdo protegido e botão de logout (`signoutRedirect()`).
- **Configuração OIDC**: concentrada em `src/providers/providers.tsx` (e referência em `src/lib/keycloak.ts`); `redirect_uri` e `post_logout_redirect_uri` alinhados às rotas da aplicação.

### Configuração e ambiente

- Variáveis **NEXT_PUBLIC_*** para expor apenas o necessário no cliente (URL do Keycloak, realm, client id, redirect URI).
- Nenhum secret de aplicação é exposto no front; para client confidential seria necessário um backend para trocar código por token.

### Qualidade e padrões

- **ESLint** com config Next.js para consistência e detecção de erros comuns.
- **Commitizen** com **cz-conventional-changelog** para commits no formato Conventional Commits, facilitando changelog e versionamento semântico.

### Dependências de autenticação

- **react-oidc-context**: provider e hooks (`useAuth`) para estado de login, usuário e ações (signin/signout redirect).
- **oidc-client-ts**: dependência de baixo nível do react-oidc-context para comunicação com o endpoint OIDC do Keycloak.

A biblioteca **keycloak-js** está no `package.json`; na implementação atual o fluxo é conduzido via **react-oidc-context** (genérico OIDC), o que mantém a aplicação desacoplada do Keycloak e reutilizável com outros IdPs compatíveis com OIDC.

---

## Arquitetura (visão geral)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js App (Browser)                      │
│  ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │   Layout    │  │  AuthProvider     │  │  Páginas (/,        │  │
│  │  (root)     │──│  (react-oidc-     │──│   /dashboard)       │  │
│  │             │  │   context)        │  │                     │  │
│  └─────────────┘  └────────┬─────────┘  └─────────────────────┘  │
│                            │ useAuth(), signinRedirect(), etc.   │
└────────────────────────────┼────────────────────────────────────┘
                             │ HTTPS (OIDC/OAuth2)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Keycloak (IdP)                               │
│  Realm → Client (keycloak-learning) → Users / Login UI           │
│  Endpoints: /realms/{realm}/protocol/openid-connect/*            │
└─────────────────────────────────────────────────────────────────┘
```

- O usuário acessa a aplicação → não autenticado vê a tela de login → clica “Entrar” → redirecionado ao Keycloak → faz login → Keycloak redireciona para `/dashboard` com código → react-oidc-context troca código por tokens e atualiza o estado → usuário vê o dashboard; logout redireciona ao Keycloak e depois de volta para `/`.

---

## Estrutura de Pastas (resumo)

```
keycloak-learning/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Página inicial (fluxo de auth: loading, erro, logado ou login)
│   │   ├── layout.tsx         # Layout global + AuthProvider
│   │   ├── globals.css
│   │   ├── loginpage/
│   │   │   └── page.tsx       # Componente da tela de login (botão "Entrar")
│   │   └── dashboard/
│   │       └── page.tsx       # Página protegida após login
│   ├── lib/
│   │   └── keycloak.ts        # Config OIDC (authority, client_id, etc.)
│   └── providers/
│       └── providers.tsx      # AuthProvider com react-oidc-context
├── .env.local                 # Variáveis de ambiente (não versionado)
├── next.config.ts
├── package.json
└── README.md
```

---

## Referências

- [Next.js Documentation](https://nextjs.org/docs)
- [react-oidc-context](https://github.com/authts/react-oidc-context)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [OIDC Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)
