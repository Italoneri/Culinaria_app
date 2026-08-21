# US-01 — Home Feed

## Contexto
Tela principal do app. O usuário chega aqui ao abrir o Saveur e precisa descobrir e acessar receitas rapidamente.

---

## US-01.1 — Visualizar feed de receitas

**Como** usuário,  
**quero** ver um feed com receitas ao abrir o app,  
**para que** eu possa descobrir o que cozinhar hoje.

### Critérios de aceitação
- O feed exibe um card hero em destaque (primeira receita, badge "Receita da semana")
- Abaixo do hero há uma seção "Salvas recentemente" com até 4 cards de receita
- Cada card exibe: foto, categoria (em âmbar), nome, tempo de preparo e dificuldade
- Ao final há uma seção horizontal "Para hoje à noite" com mini cards roláveis
- Cada mini card exibe: foto, nome, tempo e calorias

---

## US-01.2 — Filtrar receitas por categoria

**Como** usuário,  
**quero** filtrar o feed por categoria (Café da manhã, Almoço, Jantar, Sobremesa, Snacks),  
**para que** eu veja apenas receitas relevantes para o momento.

### Critérios de aceitação
- Há uma barra de chips horizontalmente rolável com "Todas" + as categorias disponíveis
- Ao tocar em uma categoria, os cards da seção "Salvas recentemente" são filtrados
- O chip ativo fica com fundo âmbar e texto escuro; os demais ficam com borda sutil
- "Todas" é a seleção padrão ao entrar na tela
- O card hero e a seção "Para hoje à noite" não são afetados pelo filtro

---

## US-01.3 — Buscar receita ou ingrediente

**Como** usuário,  
**quero** buscar por nome de receita ou ingrediente,  
**para que** eu encontre rapidamente algo específico.

### Critérios de aceitação
- A barra de busca fica abaixo do título "O que vai cozinhar hoje?"
- Placeholder: "Buscar receita, ingrediente…"
- Ao tocar na barra, o teclado é ativado e a busca começa
- Os resultados filtram as receitas em tempo real conforme o usuário digita
- Se nenhum resultado for encontrado, exibir mensagem de estado vazio

---

## US-01.4 — Salvar receita diretamente do feed

**Como** usuário,  
**quero** favoritar/salvar uma receita sem precisar abrir seus detalhes,  
**para que** eu possa guardar receitas interessantes rapidamente enquanto navego.

### Critérios de aceitação
- Cada card (hero, lista e mini) tem um botão de bookmark/salvar visível
- Tocar no botão salva a receita sem navegar para outra tela
- O ícone indica visualmente se a receita já está salva (preenchido) ou não
- A ação não interrompe a navegação no feed

---

## US-01.5 — Visualizar saudação personalizada

**Como** usuário,  
**quero** ver meu nome e o dia da semana no topo da Home,  
**para que** a experiência seja mais pessoal e contextual.

### Critérios de aceitação
- O header exibe o logo "S", dia da semana e saudação "Olá, [nome]"
- O nome exibido corresponde ao perfil do usuário logado

---

## US-01.6 — Acessar notificações

**Como** usuário,  
**quero** ver um indicador de notificações não lidas na Home,  
**para que** eu saiba quando há algo novo sem precisar navegar.

### Critérios de aceitação
- Há um ícone de sino no canto superior direito da Home
- Um ponto âmbar indica notificações não lidas
- Ao tocar no ícone, o usuário é levado à tela/painel de notificações
