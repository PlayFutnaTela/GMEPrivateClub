# Lógica de Autenticação e Sessão

Este documento detalha o funcionamento da autenticação no projeto GEREZIM, utilizando Supabase Auth e Next.js Middleware/SSR.

## 1. Visão Geral
O sistema utiliza o **Supabase Auth** como provedor de identidade. A sessão é gerenciada tanto no lado do servidor (cookies) quanto no lado do cliente (local storage/memória), garantindo persistência e segurança.

## 2. Componentes Principais

### A. Clientes Supabase (`src/lib/supabase`)
Existem dois clientes configurados para lidar com diferentes contextos:

1.  **Server Client (`server.ts`):**
    -   Usado em Server Components, Server Actions e Route Handlers.
    -   Utiliza `createServerClient` do `@supabase/ssr`.
    -   Acessa e manipula cookies diretamente via `next/headers`.
    -   **Função:** `createClient()` (sem argumentos).

2.  **Browser Client (`client.ts`):**
    -   Usado em Client Components.
    -   Utiliza `createBrowserClient` do `@supabase/ssr`.
    -   **Singleton:** Deve ser criado uma única vez ou memoizado para evitar vazamento de memória.
    -   **Hidratação:** Aceita um `initialSession` opcional. Se não fornecido, tenta ler de `window.__SUPABASE_INITIAL_SESSION` (injetado pelo `RootLayout`) para evitar "flicker" de estado não autenticado durante a hidratação.

### B. Middleware de Auth (Callback)
-   **Rota:** `src/app/api/auth/callback/route.ts`
-   **Função:** Processar o retorno do login (OAuth ou Magic Link).
-   **Fluxo:**
    1.  Recebe `code` via query param.
    2.  Troca o código por uma sessão usando `supabase.auth.exchangeCodeForSession(code)`.
    3.  Redireciona o usuário para a rota de destino (`next` param) ou `/dashboard`.
    4.  Trata ambientes locais vs. produção (Load Balancer/Proxy) verificando `x-forwarded-host`.

### C. Proteção de Rotas e Admin (`src/lib/server-admin.ts`)
-   **Função:** `requireAdminOrRedirect(supabase)`
-   **Lógica:**
    1.  Verifica se existe usuário logado (`auth.getUser()`). Se não, redireciona para `/login`.
    2.  Busca o perfil do usuário na tabela `public.profiles`.
    3.  Verifica o campo `role`. Se não for `'adm'`, redireciona para `/oportunidades` (área de usuário comum).
    4.  Retorna o objeto `user` e `profile` se autorizado.

## 3. Fluxo de Login (`/login`)
1.  **Formulário:** O usuário insere credenciais.
2.  **Ação:** Chama `supabase.auth.signInWithPassword`.
3.  **Sucesso:** O cliente Supabase atualiza os cookies automaticamente e redireciona.
4.  **Erro:** Exibe toast via `sonner`.

## 4. Recuperação de Senha
1.  **Solicitação:** `supabase.auth.resetPasswordForEmail(email, { redirectTo: ... })`.
2.  **Email:** O usuário recebe um link apontando para `/api/auth/callback`.
3.  **Redirecionamento:** O callback redireciona para uma página de redefinição (ex: `/auth/reset-password`) onde o usuário define a nova senha com `supabase.auth.updateUser({ password: ... })`.

## 5. Roles e Permissões (`src/lib/roles.ts`)
-   **Enum:** `user` (padrão) e `adm`.
-   **Helpers:** `isAdmin(profile)` e `isUser(profile)` para verificações rápidas no frontend.
-   **Banco de Dados:** A coluna `role` na tabela `profiles` é a fonte da verdade. RLS (Row Level Security) deve proteger essa coluna de edições por usuários não-admins.
