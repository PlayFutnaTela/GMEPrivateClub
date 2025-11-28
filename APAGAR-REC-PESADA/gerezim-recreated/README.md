# GEREZIM — Recreated (esqueleto)

Projeto recriado a partir das instruções de recuperação. Este diretório contem um esqueleto inicial feito com Next.js (App Router), TypeScript e Tailwind.

Principais pontos:
- Next.js app router com Server Components
- Tailwind CSS configurado com tema (cores navy/gold)
- Supabase (clientes server / client) em `lib/supabase`
- Layout básico (header, footer) e um shell de dashboard

Como rodar localmente (exemplo):

1. Copie `.env.example` para `.env.local` e preencha com as variáveis do Supabase.
2. Instale dependências e rode em modo dev:

```powershell
cd recuperacao/gerezim-recreated
pnpm install
pnpm dev
```

Próximos passos recomendados:

- Implementar autenticação robusta usando `@supabase/auth-helpers-nextjs` e proteger rotas via middleware
- Adicionar Server Components e carregamento de dados seguros (Server-side) para otimizar performance
- Construir os módulos de negócio (Oportunidades, Concierge, Perfil, CRUDs) conforme o roteiro detalhado no prompt de recuperação

Roadmap curto (tarefas imediatas):
1. Configurar testes unitários e de integração para componentes críticos
2. Integrar uploads de avatar no Supabase Storage e páginas de edição de perfil
3. Implementar RLS (Row-Level Security) e migrations para as tabelas `profiles` e módulos

Se quiser, prossigo agora com uma destas tarefas — qual prefere: (A) Autenticação completa com Supabase, (B) Implementar perfil/avatars e Storage, (C) Criar CRUD de Oportunidades?
