# Guia de Uso de Mídia e Assets

Este guia descreve como utilizar os assets gráficos migrados para a pasta `Recuperação/media` na recriação do frontend.

## 1. Estrutura de Pastas
Os arquivos foram copiados da pasta `public` original. Ao implementar o novo projeto, você deve mover estes arquivos de volta para a pasta `public` do novo projeto Next.js.

```
public/
├── icones-categorias/   # Ícones SVG/PNG para as categorias de produtos
├── slide-desktop/       # Banners para o carrossel (versão desktop)
├── slide-mobile/        # Banners para o carrossel (versão mobile)
├── slide-footer/        # Imagens para o rodapé ou seções secundárias
├── logo.png             # Logo principal (fundo transparente/escuro)
├── logo-novo-gme.png    # Variação do logo
├── favicon.ico          # Ícone do navegador
└── BG - GEREZIM...png   # Background de alta resolução (Login)
```

## 2. Mapeamento por Página

### A. Login (`src/app/login/page.tsx`)
-   **Background:** Use `BG - GEREZIM - TELA DE LOGIN.png` como fundo da seção esquerda ou overlay.
-   **Logo:** Use `logo.png` ou `logo-novo-gme.png` acima do formulário.
-   **Carrossel:** O componente `LoginCarousel` deve consumir as imagens de `slide-desktop` (e `slide-mobile` se houver lógica responsiva de imagem).

### B. Dashboard e Topbar (`src/components/layout/topbar.tsx`)
-   **Logo:** `logo.png` (redimensionado, ex: `h-8`).
-   **Favicon:** Certifique-se de que `favicon.ico` e `logo-icon.ico` estejam na raiz de `public` e configurados no `layout.tsx` (Metadata).

### C. Categorias (`src/app/oportunidades/page.tsx`)
-   **Ícones:** As categorias listadas no banco devem ter um mapeamento para os arquivos em `icones-categorias/`.
    -   Exemplo: Categoria "Carros" -> `/icones-categorias/carro.svg` (verifique a extensão real dos arquivos).

## 3. Componente de Imagem (Next.js)
Sempre utilize o componente `Image` do Next.js para otimização automática.

```tsx
import Image from 'next/image'

// Exemplo
<Image 
  src="/logo.png" 
  alt="Gerezim Logo" 
  width={150} 
  height={50} 
  priority 
/>
```

## 4. Cores e Identidade
Os assets seguem a paleta **Navy & Gold**. Certifique-se de que o CSS (Tailwind) esteja configurado com as cores extraídas destes assets para manter a consistência visual.
