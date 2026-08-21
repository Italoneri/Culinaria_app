# US-03 — Adicionar Receita

## Contexto
Tela acessada pelo botão "+" central da barra de navegação. O usuário cria e salva suas próprias receitas no app.

---

## US-03.1 — Criar nova receita com campos básicos

**Como** usuário,  
**quero** preencher o nome, categoria, tempo, porções e dificuldade de uma nova receita,  
**para que** eu tenha as informações básicas registradas antes de adicionar os detalhes.

### Critérios de aceitação
- Campo de nome com placeholder "Ex.: Pasta al limone" (fonte display, destaque visual)
- Seleção de categoria por chips horizontais (Café da manhã, Almoço, Jantar, Sobremesa, Snacks)
- Stepper de tempo em minutos com incremento de 5 min; mínimo de 5 min
- Stepper de porções com incremento de 1; mínimo de 1 porção
- Seleção de dificuldade por botões: Fácil, Médio, Difícil
- A dificuldade selecionada fica com fundo âmbar translúcido e texto âmbar

---

## US-03.2 — Fazer upload da foto da receita

**Como** usuário,  
**quero** adicionar uma foto do prato finalizado,  
**para que** minha receita fique visualmente atraente no feed.

### Critérios de aceitação
- Área de upload exibe ícone de câmera âmbar e texto "Adicionar foto" / "Mostre o prato finalizado"
- Ao tocar, o usuário pode escolher: câmera do dispositivo ou galeria de fotos
- Após selecionar, a foto é exibida como preview na área de upload (substituindo o placeholder)
- Formatos aceitos: JPG, PNG, HEIC
- Tamanho máximo: 10 MB

---

## US-03.3 — Adicionar ingredientes dinamicamente

**Como** usuário,  
**quero** adicionar e remover ingredientes um a um,  
**para que** eu monte a lista exata da minha receita.

### Critérios de aceitação
- O formulário começa com 2 campos de ingrediente vazios
- Cada campo exibe um número sequencial âmbar à esquerda
- Ao tocar em "Adicionar ingrediente", um novo campo é inserido ao final da lista
- Cada campo (exceto quando há apenas 1) tem um botão "×" para remover aquela linha
- Não é possível remover o último campo restante
- Placeholder do primeiro campo: "Ex.: 200g de farinha"; demais: "Próximo ingrediente"

---

## US-03.4 — Adicionar passos de preparo dinamicamente

**Como** usuário,  
**quero** adicionar e remover passos do modo de preparo,  
**para que** eu descreva o processo culinário de forma sequencial.

### Critérios de aceitação
- O formulário começa com 2 campos de passo vazios
- Cada passo exibe número sequencial âmbar (formato "01") à esquerda
- O campo de texto é multiline (textarea, mín. 2 linhas)
- Ao tocar em "Adicionar passo", um novo campo é inserido ao final
- Cada campo (exceto quando há apenas 1) pode ser removido
- Placeholder do primeiro: "Descreva este passo…"; demais: "Próximo passo"

---

## US-03.5 — Adicionar notas pessoais

**Como** usuário,  
**quero** escrever notas livres sobre a receita (variações, lembretes, fonte),  
**para que** eu guarde contexto pessoal que não se encaixa nos outros campos.

### Critérios de aceitação
- Campo de texto livre multiline (textarea, mín. 3 linhas)
- Placeholder: "Ex.: receita da minha avó, fica melhor com farinha 00…"
- Campo opcional — a receita pode ser salva sem notas

---

## US-03.6 — Salvar receita

**Como** usuário,  
**quero** salvar a receita que criei,  
**para que** ela fique disponível no meu perfil e no feed.

### Critérios de aceitação
- Botão "Salvar receita" fixo no rodapé, fundo âmbar
- Ao tocar, valida campos obrigatórios: nome e ao menos 1 ingrediente e 1 passo
- Se houver campo inválido, exibe feedback inline no campo correspondente
- Ao salvar com sucesso, o usuário é redirecionado para a tela de detalhes da receita recém-criada
- A receita aparece na seção "Salvas recentemente" da Home

---

## US-03.7 — Salvar rascunho

**Como** usuário,  
**quero** salvar um rascunho da receita incompleta,  
**para que** eu possa continuar preenchendo depois sem perder o que já escrevi.

### Critérios de aceitação
- Botão "Rascunho" visível no topo da tela (ao lado do título "Nova receita")
- Ao tocar, salva o estado atual como rascunho sem validação de campos obrigatórios
- O rascunho fica acessível na tela de Perfil em uma seção "Rascunhos" (ou lista de receitas)
- Ao sair da tela sem salvar nem rascunhar, exibir dialog de confirmação: "Deseja salvar como rascunho?"
