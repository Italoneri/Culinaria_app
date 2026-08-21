# US-05 — Configurações

## Contexto
Tela acessada pelo ícone de engrenagem na barra de navegação (5ª posição). **Não existe no handoff de design** — esta é a especificação de produto que define o que deve ser construído.

### Decisão de produto
A tela de Configurações foi incluída no bottom nav do design mas não foi detalhada. Com base no contexto do app (dark mode premium, conta de usuário, plano premium, notificações visíveis na Home), definimos 4 grupos de configurações: Aparência, Conta, Notificações e Assinatura. Uma seção de dados e privacidade é incluída por obrigação legal (LGPD).

---

## US-05.1 — Acessar configurações de aparência

**Como** usuário,  
**quero** personalizar a aparência do app,  
**para que** a experiência visual se adapte às minhas preferências.

### Critérios de aceitação
- Seção "Aparência" com as opções:
  - **Tema**: Dark (padrão), Light, Seguir sistema — seleção por radio/toggle
  - **Cor de acento**: Âmbar (padrão), outras opções a definir em v2
- Dark mode é o padrão e o tema premium; Light mode é funcional mas sem o visual premium
- Ao trocar o tema, a mudança é aplicada imediatamente sem reiniciar o app

---

## US-05.2 — Gerenciar conta

**Como** usuário,  
**quero** acessar e alterar as configurações da minha conta,  
**para que** eu mantenha meus dados seguros e atualizados.

### Critérios de aceitação
- Seção "Conta" com as opções:
  - **Email**: exibe o email atual; link para alterar email
  - **Senha**: link "Alterar senha" (fluxo de email de redefinição)
  - **Vincular conta**: opções para login com Google / Apple
  - **Sair da conta**: botão com confirmação via dialog ("Tem certeza?")
  - **Excluir conta**: link em vermelho com confirmação em 2 etapas (digitar "EXCLUIR")
- A exclusão de conta remove todos os dados do usuário permanentemente (informar claramente)

---

## US-05.3 — Gerenciar preferências de notificação

**Como** usuário,  
**quero** controlar quais notificações recebo do Saveur,  
**para que** eu não seja incomodado por alertas que não me interessam.

### Critérios de aceitação
- Seção "Notificações" com toggles individuais para:
  - Receita da semana (toda segunda-feira) — padrão: ativado
  - Lembretes para cozinhar (diário, configurável horário) — padrão: desativado
  - Novidades e atualizações do app — padrão: ativado
- Se as permissões de notificação do sistema estiverem negadas, exibir aviso com link para Configurações do sistema
- As preferências são salvas imediatamente ao alternar o toggle

---

## US-05.4 — Gerenciar assinatura premium

**Como** usuário,  
**quero** ver e gerenciar meu plano de assinatura,  
**para que** eu saiba o que estou pagando e possa cancelar se quiser.

### Critérios de aceitação
- Seção "Assinatura" exibe:
  - Plano atual (ex.: "Membro Premium — R$ 14,90/mês")
  - Data de renovação
  - Botão "Gerenciar assinatura" (redireciona para App Store / Play Store)
- Para usuários sem plano premium, exibe card de upgrade com benefícios
- Benefícios do premium (a definir em detalhe): temas exclusivos, sync ilimitado, receitas offline

---

## US-05.5 — Acessar dados e privacidade

**Como** usuário,  
**quero** acessar informações sobre como meus dados são usados,  
**para que** eu possa exercer meus direitos (LGPD).

### Critérios de aceitação
- Seção "Dados e privacidade" com links para:
  - Política de privacidade (WebView interno)
  - Termos de uso (WebView interno)
  - **Exportar meus dados**: gera arquivo JSON/ZIP com receitas e perfil do usuário
  - **Excluir todos os dados**: mesmo fluxo de US-05.2 "Excluir conta"
- Exportação deve ser processada em até 24h e enviada por email

---

## US-05.6 — Acessar sobre o app

**Como** usuário,  
**quero** ver a versão do app e informações de crédito,  
**para que** eu saiba qual versão estou usando e possa reportar problemas.

### Critérios de aceitação
- Rodapé da tela de configurações exibe: versão do app (ex.: "Saveur 1.0.0"), link "Avaliar no App Store"
- Link "Reportar um problema" abre formulário ou email pré-preenchido
