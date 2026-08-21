# US-04 — Perfil de Usuário

## Contexto
Tela acessada pelo ícone de usuário na barra de navegação. Centraliza a identidade do usuário, suas receitas favoritas, coleções e estatísticas culinárias.

---

## US-04.1 — Visualizar dados do perfil

**Como** usuário,  
**quero** ver meu nome, foto, bio e localização no meu perfil,  
**para que** eu tenha uma identidade dentro do app.

### Critérios de aceitação
- Exibe foto de perfil circular com borda âmbar e anel externo translúcido
- Exibe nome completo (fonte display, itálico), email e cidade
- Exibe bio do usuário (texto livre, até 280 caracteres)
- Exibe badge "Membro Premium" se o usuário tiver plano premium (fundo âmbar translúcido)

---

## US-04.2 — Trocar foto de perfil

**Como** usuário,  
**quero** alterar minha foto de perfil,  
**para que** minha identidade visual no app esteja atualizada.

### Critérios de aceitação
- Há um botão de câmera âmbar sobreposto à foto de perfil (canto inferior direito da foto)
- Ao tocar, o usuário pode escolher entre câmera ou galeria do dispositivo
- Após confirmar, a nova foto substitui a anterior imediatamente
- Formatos aceitos: JPG, PNG, HEIC; tamanho máximo 10 MB

---

## US-04.3 — Visualizar estatísticas de uso

**Como** usuário,  
**quero** ver um resumo das minhas atividades culinárias,  
**para que** eu acompanhe meu engajamento com o app.

### Critérios de aceitação
- Exibe 3 estatísticas em cards side-by-side: "Receitas criadas", "Favoritas", "Cozinhadas"
- O card "Favoritas" tem destaque âmbar (fundo e texto)
- Os valores são atualizados em tempo real conforme o usuário usa o app

---

## US-04.4 — Visualizar e acessar receitas favoritas

**Como** usuário,  
**quero** ver minhas receitas favoritas em grid no meu perfil,  
**para que** eu acesse rapidamente as que mais gosto de cozinhar.

### Critérios de aceitação
- Seção "Minhas favoritas" exibe receitas em grid de 2 colunas
- Cada card exibe: foto, nome (truncado em 2 linhas), tempo e dificuldade (cor âmbar)
- Cada card tem um botão de coração para desfavoritar direto do grid
- Link "Ver todas →" navega para lista completa de favoritas
- Se não houver favoritas, exibir estado vazio com CTA para explorar o feed

---

## US-04.5 — Gerenciar coleções de receitas

**Como** usuário,  
**quero** organizar minhas receitas em coleções temáticas,  
**para que** eu encontre facilmente receitas agrupadas por ocasião ou tipo.

### Critérios de aceitação
- Seção "Coleções" exibe chips horizontalmente roláveis com emoji, nome e contagem de receitas
- Link "+ Nova" permite criar uma nova coleção
- Ao tocar em uma coleção, o usuário é levado à lista de receitas daquela coleção
- O usuário pode nomear e escolher um emoji para a coleção

---

## US-04.6 — Editar perfil

**Como** usuário,  
**quero** editar meu nome, bio e localização,  
**para que** meu perfil reflita informações atualizadas.

### Critérios de aceitação
- Botão de lápis (editar) visível no canto superior direito da tela de perfil
- Ao tocar, o usuário entra em modo de edição: campos de nome, bio e cidade ficam editáveis
- Botão "Salvar" confirma as alterações; botão "Cancelar" descarta
- Validação: nome obrigatório, bio máx. 280 caracteres

---

## US-04.7 — Acessar jornada culinária (atividade semanal)

**Como** usuário,  
**quero** ver um resumo da minha atividade culinária da semana,  
**para que** eu acompanhe minha consistência na cozinha.

### Critérios de aceitação
- Há um card "Sua jornada culinária" com link "Veja sua atividade da semana"
- Ao tocar, exibe histórico de receitas cozinhadas, salvas e criadas nos últimos 7 dias
- A visualização inclui contagem por dia ou listagem cronológica
