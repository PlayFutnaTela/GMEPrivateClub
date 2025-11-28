# Lógica do Banco de Dados e Schema

Este documento descreve a estrutura do banco de dados Supabase e as regras de negócio aplicadas via SQL.

## 1. Tabelas Principais

### `profiles`
Armazena dados estendidos dos usuários.
-   **PK:** `id` (uuid, FK para `auth.users`).
-   **Colunas:** `full_name`, `bio`, `avatar_url`, `role` (enum: 'user', 'adm'), `updated_at`.
-   **Trigger:** Idealmente, um trigger deve criar um registro aqui automaticamente quando um novo usuário é criado em `auth.users`.

### `products`
Catálogo de itens à venda.
-   **Colunas:** `id`, `title`, `subtitle`, `description`, `price` (numeric), `category`, `status` ('active', 'inactive', 'sold'), `images` (array de strings/URLs), `stock` (int), `commission_percent`.

### `opportunities`
Registra leads ou negociações vinculadas (ou não) a produtos.
-   **Colunas:** `id`, `value`, `status` ('em_negociacao', 'vendido', etc.), `pipeline_stage` ('Novo', 'Interessado', etc.), `product_id` (FK opcional), `contact_id` (FK opcional).

### `contacts`
Base de leads e clientes.
-   **Colunas:** `id`, `name`, `phone`, `email`, `status` ('quente', 'morno', 'frio'), `interests`, `source`.

### `concierge_conversations` & `concierge_folders`
Sistema de chat.
-   **Conversations:** Armazena metadados da conversa. Mensagens reais podem estar em outra tabela ou sub-coleção (não visível na análise inicial, verificar se há `concierge_messages`).
-   **Folders:** Organização de conversas (ex: 'Ativos', 'Arquivados').

## 2. Row Level Security (RLS)

A segurança é aplicada diretamente no banco:

-   **Profiles:**
    -   Leitura: Pública (`true`).
    -   Escrita (Update): Apenas o próprio usuário (`auth.uid() = id`) ou Admins.
    -   Inserção: Apenas o próprio usuário (no cadastro).
-   **Products/Opportunities/Contacts:**
    -   Leitura: Pública (para vitrine) ou restrita a Admins (para dados sensíveis).
    -   Escrita: Restrita a Admins (`public.is_admin(auth.uid())`).
-   **Storage (`avatars`, `product-images`):**
    -   Leitura: Pública.
    -   Escrita: Autenticada (usuários para avatares, admins para produtos).

## 3. Funções Database (`RPC`)

-   **`is_admin(uid uuid)`:** Função de segurança (`SECURITY DEFINER`) que verifica se um usuário tem role 'adm' na tabela profiles. Usada dentro das políticas RLS para evitar recursão infinita.

## 4. Storage Buckets

1.  **`avatars`:** Imagens de perfil de usuários.
2.  **`product-images`:** Imagens de produtos. Estrutura de pastas: `product-images/{productId}/{filename}`.

## 5. Enum Types
-   **`user_role`:** `'user'`, `'adm'`. Garante integridade dos tipos de usuário.
