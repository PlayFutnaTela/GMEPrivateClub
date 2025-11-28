# Lógica do Concierge (Chat Premium)

Este documento detalha a arquitetura e funcionamento do módulo de atendimento Concierge.

## 1. Arquitetura
O Concierge funciona como um cliente de chat em tempo real que se comunica com um backend externo (ex: n8n, Typebot) via Webhooks.

### Componentes
-   **Frontend:** `ConciergeLayoutClient` (Gerencia estado global do chat).
-   **Backend Proxy:** `/api/concierge/webhook` (Contorna CORS e protege credenciais).
-   **Banco de Dados:**
    -   `concierge_conversations`: Armazena metadados (id, status, última mensagem).
    -   `concierge_folders`: Organização de conversas (abas/pastas).
    -   `concierge_settings`: Configurações dinâmicas (URL do Webhook).

## 2. Fluxo de Mensagens

### Envio (Usuário -> Bot/Atendente)
1.  O usuário digita uma mensagem no input.
2.  O frontend chama `POST /api/concierge/webhook`.
3.  **Payload:**
    ```json
    {
      "url": "https://n8n.webhook.url...", // Obtida de concierge_settings
      "message": "Olá",
      "userId": "uuid",
      "conversationId": "uuid"
    }
    ```
4.  O Proxy repassa para o serviço externo.
5.  A resposta do serviço externo é retornada ao frontend e exibida na tela.

### Recebimento (Bot/Atendente -> Usuário)
-   Atualmente, o sistema parece depender de **Polling** ou resposta síncrona do Webhook para atualizações imediatas, ou **Realtime** do Supabase se as mensagens forem salvas no banco por um processo externo.
-   *Nota:* A implementação atual foca na resposta imediata do webhook (Request/Response pattern).

## 3. Gestão de Estado (`ConciergeLayoutClient`)
-   **Conversas:** Lista carregada via Supabase (`concierge_conversations`).
-   **Seleção:** Ao clicar em uma conversa, o ID é setado no estado e o chat é renderizado.
-   **Pastas:** As conversas são filtradas pela pasta selecionada (ex: 'Arquivados').

## 4. Integração com Supabase
-   **Settings:** A URL do webhook é buscada na tabela `concierge_settings` (chave `webhook_url`). Isso permite alterar o fluxo do bot sem redeploy da aplicação.
-   **Permissões:** Apenas Admins (ou roles permitidas) podem acessar o módulo, garantido por `requireAdminOrRedirect` no Server Component pai.
