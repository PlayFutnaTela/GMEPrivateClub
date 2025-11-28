# Prompt para Recriação Otimizada do Projeto GEREZIM

Você é um especialista em Next.js, Tailwind CSS e Supabase. Sua missão é recriar o projeto "GEREZIM" do zero, focando em performance, arquitetura limpa e uma experiência de usuário premium.

## 1. Configuração do Projeto e Tech Stack

-   **Framework:** React.
-   **Linguagem:** TypeScript (Strict mode).
-   **Estilização:** Tailwind CSS com variáveis CSS para temas.
-   **Componentes:** Shadcn/ui (baseado em Radix UI) ou construção manual otimizada com Radix Primitives.
-   **Ícones:** Lucide React.
-   **Animações:** Framer Motion (para micro-interações e transições de página).
-   **Gerenciamento de Estado:** Zustand (se necessário global) ou React Context para temas/auth.
-   **Backend/BaaS:** Supabase (Auth, Database, Storage, Realtime).
-   **Validação:** Zod + React Hook Form.
-   **Feedback:** Sonner (Toasts).

## 2. Design System e UI (Premium)

O design deve transmitir exclusividade, confiança e sofisticação.

-   **Paleta de Cores:**
    -   **Primária (Navy):**
        -   Navy 900: `#0b2132` (Fundo profundo)
        -   Navy 800: `#0e2238` (Cards/Sidebar)
        -   Navy 700: `#1a3b5c` (Bordas sutis/Hover)
    -   **Acento (Gold):**
        -   Gold 500: `#b7902e` (Botões primários, Destaques)
        -   Gold 300: `#c6a15a` (Gradientes, Bordas focadas)
        -   Gold 100: `#fbf5e6` (Fundos claros de destaque)
    -   **Neutros:**
        -   Background: `#f6f8fb` (Light mode), `#0b2132` (Dark mode)
        -   Text: Slate/Gray scale otimizada para legibilidade.
-   **Tipografia:**
    -   **Títulos:** `Playfair Display` (Serif) - para elegância.
    -   **Corpo:** `Inter` ou `Geist Sans` - para legibilidade e modernidade.
-   **Componentes Visuais:**
    -   Bordas sutis com gradientes dourados.
    -   Sombras suaves (glassmorphism onde apropriado).
    -   Transições suaves (ease-out).

## 3. Arquitetura e Estrutura de Pastas

Adote uma estrutura modular e escalável:

```
src/
├── app/
│   ├── (auth)/          # Rotas de autenticação (login, register, forgot-password)
│   ├── (dashboard)/     # Rotas protegidas com layout de sidebar
│   │   ├── dashboard/
│   │   ├── oportunidades/
│   │   ├── concierge/
│   │   ├── perfil/
│   │   └── ... (outros módulos)
│   ├── api/             # Route Handlers
│   ├── layout.tsx       # Root Layout (Fontes, Providers)
│   └── page.tsx         # Landing ou Redirect
├── components/
│   ├── ui/              # Componentes base (Button, Input, Card)
│   ├── layout/          # Sidebar, Topbar, Shell
│   ├── features/        # Componentes específicos de funcionalidades
│   └── shared/          # Componentes reutilizáveis (Avatar, Logo)
├── lib/
│   ├── supabase/        # Clients (server, client, middleware)
│   ├── utils.ts         # Helpers (cn, formatters)
│   └── hooks/           # Custom hooks
├── types/               # Definições de tipos globais/DB
└── middleware.ts        # Proteção de rotas e gestão de sessão
```

## 4. Funcionalidades Principais

### A. Autenticação (Supabase Auth)
-   Login com Email/Senha.
-   Recuperação de senha completa.
-   Proteção de rotas via Middleware.
-   Persistência de sessão segura.

### B. Dashboard (Layout Principal)
-   **Sidebar:** Navegação colapsável, ícones claros, destaque para rota ativa.
-   **Topbar:** Breadcrumbs, Notificações, Menu de Usuário (Avatar, Logout).
-   **Responsividade:** Menu hambúrguer em mobile.

### C. Módulos de Negócio
1.  **Oportunidades:** Listagem de itens (imóveis/investimentos) com filtros avançados, visualização em Grid/List, e detalhes em modal ou página dedicada.
2.  **Concierge:** Chat em tempo real (ou integração com IA) para suporte premium.
3.  **Perfil:** Edição de dados do usuário (Nome, Bio, Avatar com upload para Supabase Storage).
4.  **Gestão (CRUDs):** Categorias, Contatos, Insumos, Pipeline, Produtos, Relatórios.

## 5. Banco de Dados (Supabase)

Garanta que as tabelas existam e tenham RLS (Row Level Security) configurado.

-   **Tabela `profiles`:**
    -   `id` (uuid, FK auth.users)
    -   `full_name` (text)
    -   `bio` (text)
    -   `avatar_url` (text)
    -   `role` (enum: 'user', 'adm')
    -   `updated_at` (timestamp)
-   **Storage `avatars`:** Bucket público para imagens de perfil.

## 6. Otimizações Obrigatórias

-   **Server Components:** Use Server Components por padrão para data fetching.
-   **Imagens:** Use `next/image` com formatos modernos (WebP/AVIF).
-   **Carregamento:** Implemente Skeletons e Suspense para estados de loading.
-   **SEO:** Metadata dinâmica em todas as páginas.
-   **Código:** Evite prop drilling (use composição ou context), tipagem estrita, sem `any`.

## Instruções para o Agente

1.  Comece configurando o ambiente e as variáveis de ambiente (`.env.local`).
2.  Crie os clientes do Supabase (Server, Client, Middleware).
3.  Implemente o Layout Base e o Design System (Tailwind config).
4.  Desenvolva o fluxo de Autenticação.
5.  Construa o Layout do Dashboard.
6.  Implemente as páginas principais uma a uma, garantindo qualidade visual e funcional.
