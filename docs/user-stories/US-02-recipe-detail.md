# US-02 — Detalhes da Receita

## Contexto
Tela exibida ao tocar em qualquer receita do feed ou do perfil. O usuário vem aqui para decidir se vai cozinhar a receita e para executá-la na cozinha.

---

## US-02.1 — Visualizar informações da receita

**Como** usuário,  
**quero** ver todos os detalhes de uma receita em uma única tela,  
**para que** eu possa avaliar se quero prepará-la.

### Critérios de aceitação
- Exibe foto hero em tela cheia (380px) com overlay de gradiente
- Exibe badge de categoria (âmbar) sobre a foto
- Exibe título da receita (fonte display, 32px), descrição curta abaixo
- Exibe 4 pills de metadados: Tempo, Porções, kcal, Nível de dificuldade
- O pill de Tempo fica com acento âmbar; os demais ficam no tom padrão

---

## US-02.2 — Navegar entre ingredientes e passos via tabs

**Como** usuário,  
**quero** alternar entre a lista de ingredientes e o modo de preparo,  
**para que** eu possa consultar cada um separadamente enquanto cozinho.

### Critérios de aceitação
- Há um seletor com duas abas: "Ingredientes · N" e "Passos · N" (onde N é a contagem)
- A aba ativa tem fundo âmbar e texto escuro; a inativa fica transparente
- A troca de aba não recarrega a tela — apenas alterna o conteúdo abaixo
- O conteúdo da aba selecionada é mostrado imediatamente ao tocar

---

## US-02.3 — Marcar ingredientes como separados

**Como** usuário,  
**quero** fazer check nos ingredientes que já separei,  
**para que** eu não perca o controle do que já tenho em mãos enquanto cozinho.

### Critérios de aceitação
- Na aba "Ingredientes", cada item tem um checkbox à esquerda
- Ao tocar no item, o checkbox fica preenchido em âmbar com ícone de check
- O texto do ingrediente marcado fica tachado e com cor esmaecida
- Ao tocar novamente, o item volta ao estado desmarcado
- O estado dos checks persiste enquanto a tela está aberta

---

## US-02.4 — Ler o modo de preparo passo a passo

**Como** usuário,  
**quero** ver cada passo do preparo numerado com título e descrição,  
**para que** eu possa seguir a receita sem me perder.

### Critérios de aceitação
- Na aba "Passos", cada passo exibe: número (formato "01"), título em negrito, descrição
- Passos que têm dica do chef exibem um card âmbar com label "DICA DO CHEF" e o texto da dica
- A numeração é automática e sequencial

---

## US-02.5 — Favoritar receita

**Como** usuário,  
**quero** salvar uma receita nos favoritos diretamente da tela de detalhes,  
**para que** ela apareça no meu perfil para acesso rápido futuro.

### Critérios de aceitação
- Há um botão de bookmark no canto superior direito, com fundo âmbar quando salvo
- Ao tocar, a receita é adicionada aos favoritos do perfil do usuário
- Ao tocar novamente, a receita é removida dos favoritos
- O estado visual do botão reflete o estado real (salvo/não salvo)

---

## US-02.6 — Compartilhar receita

**Como** usuário,  
**quero** compartilhar uma receita com outras pessoas,  
**para que** eu possa recomendar receitas que gostei.

### Critérios de aceitação
- Há um botão de compartilhamento no topo da tela (ao lado do back)
- Ao tocar, o share sheet nativo do sistema operacional é acionado
- O conteúdo compartilhado inclui nome da receita e link/identificador

---

## US-02.7 — Iniciar modo de preparo

**Como** usuário,  
**quero** iniciar o preparo da receita com um botão de ação principal,  
**para que** eu entre em um modo focado de cozimento.

### Critérios de aceitação
- Um botão "Iniciar preparo" fica fixo no rodapé da tela com o tempo total visível
- O botão tem fundo âmbar e contrasta com o conteúdo abaixo
- Ao tocar, o app inicia o fluxo de modo de preparo (navegação passo a passo)

---

## US-02.8 — Ajustar número de porções

**Como** usuário,  
**quero** ajustar o número de porções da receita,  
**para que** eu possa cozinhar a quantidade certa para o meu grupo.

### Critérios de aceitação
- O pill de "Porções" é interativo: exibe botões — e + ao ser expandido
- Ao ajustar as porções, as quantidades dos ingredientes são recalculadas proporcionalmente
- O valor mínimo é 1 porção
