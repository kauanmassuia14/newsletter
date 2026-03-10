# Plano de Implementação: Newsletter "Connect & Story"

Este documento detalha o plano de execução para a criação de uma plataforma de newsletter premium focada em **Eventos, Palestras e Storytelling**.

---

## 1. Visão Geral do Produto
Uma plataforma dual que combina uma **Landing Page de Alta Conversão** com um **Ecossistema de Conteúdo Imersivo**. O objetivo não é apenas informar, mas "transportar" o leitor para dentro dos eventos e palestras através de técnicas de storytelling visual e textual.

## 2. Identidade Visual & Branding (Premium Dark Mode & Clean)
*   **Paleta de Cores:**
    *   **Primária (Deep Blue):** `#0A1F35` (Confiança e autoridade em eventos corporativos)
    *   **Fundo:** `#FFFFFF` (Clareza absoluta para leitura de notícias)
    *   **Acentos:** `#000000` (Elegância)
    *   **Destaque:** Gradientes suaves de `#0A1F35` para tons levemente mais claros em hovers.
*   **Tipografia:**
    *   *Headers:* `Outfit` ou `Sora` (Proporções modernas para títulos de palestras)
    *   *Corpo:* `Inter` com line-height de 1.7 para garantir conforto em textos longos.
*   **Aesthetics:**
    *   Uso de **Empty States** elegantes.
    *   **Micro-interações:** Botões que brilham levemente ao hover com a cor `#0A1F35`.
    *   **Skeleton Screens** customizados para carregar o feed de notícias.

---

## 3. Stack Tecnológica de Elite
*   **Core:** Next.js 15 (App Router) + React 19.
*   **Database:** Supabase (PostgreSQL + Realtime) - Permite ver quem está online no painel admin.
*   **ORM:** Prisma para segurança de tipos em toda a aplicação.
*   **Auth:** NextAuth.js (v5) - Foco em Passworldless (Magic Links) para reduzir fricção.
*   **Emails:** Resend + React Email (Templates que parecem sites, não apenas texto).
*   **Components:** Radix UI (Acessibilidade) + Framer Motion (Animações de storytelling).

---

## 4. Estratégia de Conversão (Landing Page)
1.  **A Isca (The Hook):** Hero section com título focado na transformação (Ex: "Onde os maiores eventos do mundo se tornam histórias inesquecíveis").
2.  **O Registro:** Formulário minimalista de um único campo.
3.  **A Entrega de Acesso:** Assim que o usuário clica em "Garantir Acesso", um processo em background cria sua conta, gera um token de acesso único e dispara um email com o link de login automático.
4.  **Feedback Visual:** Carregamento suave após o envio, mostrando que o convite está a caminho.

---

## 5. Experiência de Storytelling (News Feed)
*   **Layout "Magazine Style":** Notícias não são apenas listas; possuem hierarquia visual (Notícia Principal vs. Notas de Rodapé).
*   **Filtros Dinâmicos:** Alternar entre "Eventos", "Palestras" e "Insights de Storytelling".
*   **Modo Leitura:** Opção de esconder a navegação para foco total no texto.

---

## 6. Painel Administrativo (The Command Center)
*   **Dashboard Overview:** Gráficos de crescimento de inscritos.
*   **Rich Text Editor:** Interface estilo Notion para escrever as notícias com suporte a imagens, citações e vídeos.
*   **Preview em Tempo Real:** Ver como a notícia aparecerá no email e no feed antes de publicar.

---

## 7. Estrutura de Pastas e Arquitetura

```text
/src
  /app
    /(auth)         # Login e Registro
    /(dashboard)    # Painel Admin (Protegido)
    /(feed)         # Feed de notícias (Publico/Protegido)
    /api            # Webhooks e Endpoints de email
  /components
    /ui             # Componentes base (Radix/Tailwind)
    /marketing      # Componentes da LP
    /newsletter     # Componentes de leitura de posts
  /lib
    /prisma         # Conexão DB
    /resend         # Configuração de email
```

---

## 8. Roadmap de Desenvolvimento (Sprint 1)

1.  **Dia 1: Infra & Design System**
    *   Configurar Next.js, Tailwind e Variáveis CSS.
    *   Criar Layout Global com a cor `#0A1F35`.
2.  **Dia 2: Landing Page & Lead Capture**
    *   Desenvolver LP de alta performance.
    *   Integrar com API do Resend para envio do primeiro email.
3.  **Dia 3: Auth & Database**
    *   Configurar Prisma e Supabase.
    *   Implementar fluxo de Magic Link.
4.  **Dia 4: Admin Panel (MVP)**
    *   Criar tela de listagem e criação de notícias.
5.  **Dia 5: Feed & Polimento**
    *   Desenvolver o feed público das notícias.
    *   Adicionar animações Framer Motion.

---

## 9. Próximos Passos
> "A perfeição está nos detalhes."

*   [ ] Executar `npm install` das dependências core (Prisma, Radix, Framer).
*   [ ] Criar o protótipo da Landing Page no `/app/page.tsx`.
*   [ ] Validar a identidade visual com o usuário.
