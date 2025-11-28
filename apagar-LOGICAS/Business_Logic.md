# Lógica de Negócios e Funcionalidades

Este documento detalha o funcionamento das principais features da plataforma.

## 1. Gestão de Produtos (`/produtos`)

### Cadastro e Edição
-   **Upload de Imagens:**
    -   Realizado via API Route (`/api/upload-images`) para contornar limitações de tamanho ou processamento no cliente.
    -   Usa `Service Role` no servidor para upload, garantindo que apenas requisições validadas gravem no bucket.
    -   Limite: 30 imagens por produto.
    -   Nomes de arquivo são sanitizados e prefixados com Timestamp.
-   **Dados:** Título, Subtítulo, Preço, Categoria (Select), Estoque, Descrição.

### Listagem (Vitrine)
-   **Filtros:** Por Status (`active`) e Categoria.
-   **Busca:** Textual (título/descrição).
-   **Paginação:** Implementada via `limit/range` do Supabase.

## 2. Dashboard Analítico (`/dashboard`)

### Métricas (KPIs)
-   **Total de Oportunidades:** Count simples na tabela `opportunities`.
-   **Volume Financeiro:** Soma da coluna `value`.
-   **Pipeline:** Agrupamento por `pipeline_stage`.

### Gráficos
-   **Timeline:** Agrupamento de oportunidades por data de criação (`created_at`). O intervalo (7d, 30d, etc.) define a granularidade (dia/mês).
-   **Categorias:** Distribuição de oportunidades por tipo de produto.

## 3. Concierge (Chat)

### Webhook Proxy
-   **Rota:** `/api/concierge/webhook`.
-   **Problema:** Chamadas diretas do browser para APIs de terceiros (ex: n8n, Typebot, OpenAI) frequentemente falham por CORS.
-   **Solução:** O frontend envia o payload para esta rota interna, que repassa (proxy) para a URL externa configurada no banco (`concierge_settings`) e retorna a resposta.
-   **Segurança:** A URL de destino não é exposta no frontend (vem do banco server-side), protegendo chaves de API.

## 4. Perfil de Usuário

### Edição
-   Permite alterar dados cadastrais (Nome, Bio, Telefone).
-   **Email:** Não editável diretamente pelo formulário (requer fluxo de troca de email do Supabase).
-   **Avatar:** Upload direto para bucket `avatars` e atualização da URL no perfil.

### Segurança
-   **Troca de Senha:** Modal que chama `supabase.auth.updateUser`. Requer re-autenticação ou sessão ativa segura.

## 5. Favoritos

-   **Lógica:** Tabela de junção `favorites` (`user_id`, `product_id`).
-   **Visualização:** Join com `products` para exibir o card completo.
-   **Regra:** Apenas usuários logados podem favoritar.
