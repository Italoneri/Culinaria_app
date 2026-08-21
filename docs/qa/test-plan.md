# Saveur — Plano de Testes Mestre

**Versão:** 1.1  
**Status:** Critérios de aceitação refinados com product-owner em 2026-05-24  
**Gabarito visual:** `docs/design/saveur-handoff/Saveur.html`  
**Viewport de referência:** 360–412px (mobile-first)

---

## 1. Escopo

### Telas cobertas
| ID | Tela | Arquivo de referência |
|----|------|-----------------------|
| T01 | Home (feed/descoberta) | `screen-home.jsx` |
| T02 | Detalhes de receita | `screen-detail.jsx` |
| T03 | Adicionar receita | `screen-add.jsx` |
| T04 | Perfil de usuário | `screen-profile.jsx` |
| T05 | Configurações | Não existe no handoff — spec a ser definida pelo product-owner |

### Fora de escopo (v1)
- Animações e loading states (não cobertos pelo handoff estático)
- Tela de Configurações (T05) — aguardando spec do product-owner
- Push notifications
- Sincronização offline

---

## 2. Sistema de design — tokens para validação visual

Estes valores são extraídos de `data.js` e são a fonte da verdade para validação visual.

| Token | Valor |
|-------|-------|
| Fundo (bg) | `#0D0D0D` |
| Card | `#1A1A1A` |
| Card elevado | `#222222` |
| Borda normal | `rgba(255,255,255,0.06)` |
| Borda forte | `rgba(255,255,255,0.1)` |
| Âmbar (acento) | `#E8A020` |
| Âmbar suave | `rgba(232,160,32,0.14)` |
| Âmbar médio | `rgba(232,160,32,0.22)` |
| Texto primário | `#F5F2EC` |
| Texto muted | `rgba(245,242,236,0.62)` |
| Texto dim | `rgba(245,242,236,0.38)` |
| Tipografia display | Instrument Serif (itálico) |
| Tipografia UI | Manrope |
| Border-radius cards | 14–24px |

---

## 3. Fluxos críticos

### FC-01 · Buscar e filtrar receitas (Tela Home)

**Happy path**
1. Usuário abre a tela Home — feed exibe card destacado (FeaturedCard) + lista "Salvas recentemente" + scroll horizontal "Para hoje à noite"
2. Usuário toca em um chip de categoria (ex: "Jantar") — lista filtra somente receitas da categoria selecionada; chip ativo fica com fundo âmbar `#E8A020` e texto `#0D0D0D`
3. Usuário toca em "Todas" — lista volta ao estado completo
4. Usuário toca na barra de busca e digita um termo — resultados filtram em tempo real
5. Usuário digita termo sem correspondência — estado vazio exibe "Nenhuma receita encontrada para '[termo]'" com CTA "Explorar todas as receitas" que limpa o filtro
6. Usuário toca no CTA — filtro limpo, lista completa restaurada

**Edge cases**
- EC-01-A: Categoria sem receitas — lista vazia exibe mesmo estado vazio da busca (mensagem + CTA)
- EC-01-B: Scroll horizontal de chips ultrapassa viewport — scrollbar oculta (`scrollbarWidth: none`), sem overflow visível
- EC-01-C: Nome de receita com 2+ linhas no RecipeCard — truncamento com `-webkit-line-clamp: 2`

---

### FC-02 · Favoritar receita (Tela Detalhes)

**Happy path**
1. Usuário abre uma receita qualquer (via FeaturedCard ou RecipeCard)
2. Tela Detalhes exibe: hero 380px, título em Instrument Serif, stat pills (Tempo, Porções, kcal, Nível), tabs "Ingredientes" e "Passos"
3. Usuário toca no botão de bookmark (canto superior direito — fundo âmbar, ícone `#0D0D0D`) — receita é favoritada
4. Usuário toca na tab "Ingredientes" — lista de ingredientes com checkboxes interativos; ao marcar, texto aparece riscado e em cor dim
5. Usuário toca na tab "Passos" — lista de passos com numeração em Instrument Serif itálico; passos com `tip` exibem card "Dica do chef" em fundo `amberSoft`
6. Usuário toca em "Iniciar preparo" (CTA fixo na base) — inicia fluxo de preparo
7. Usuário toca no botão de voltar — retorna à Home

**Comportamento confirmado (US-02.3):** estado dos checks persiste **apenas durante a visita à tela** — ao navegar para outra tela e voltar, os checks são zerados.

**Comportamento confirmado (US-02.8):** recálculo de quantidades dos ingredientes ocorre **em tempo real** ao mover o stepper de porções.

**Edge cases**
- EC-02-A: Receita sem tip nos passos — card "Dica do chef" não aparece
- EC-02-B: Receita com muitos ingredientes — scroll funciona, bottom CTA fixo não se sobrepõe ao conteúdo (paddingBottom: 110)
- EC-02-C: Navegar para outra tela e voltar zera os checks de ingredientes (estado não persiste entre visitas)

---

### FC-03 · Criar receita (Tela Adicionar)

**Happy path**
1. Usuário toca no botão "+" central do bottom nav — navega para tela Adicionar
2. Tela exibe: foto (upload area dashed), campo nome, seleção de categoria (chips), steppers de tempo e porções, seleção de dificuldade, lista de ingredientes, lista de passos, campo notas
3. Usuário preenche nome da receita — campo usa Instrument Serif 22px
4. Usuário seleciona uma categoria — chip ativo com fundo âmbar
5. Usuário ajusta tempo via stepper (mínimo: 5min, incremento: 5min) e porções (mínimo: 1)
6. Usuário seleciona dificuldade (Fácil / Médio / Difícil) — ativo usa fundo `amberSoft`
7. Usuário preenche pelo menos 1 ingrediente — inputs com numeração
8. Usuário adiciona ingrediente extra via "+ Adicionar ingrediente" (botão dashed âmbar) — nova linha aparece
9. Usuário remove ingrediente via botão "×" — linha removida; botão "×" não aparece quando há apenas 1 ingrediente
10. Usuário preenche pelo menos 1 passo (textarea)
11. Usuário adiciona passo extra via "+ Adicionar passo"
12. Usuário toca "Salvar receita" (CTA fixo) — receita salva, usuário retorna à Home ou confirmação
13. Usuário toca "Rascunho" — salva como rascunho sem validação obrigatória

**Comportamento confirmado (US-03.6 — dialog de descarte):** dialog "Deseja salvar como rascunho?" aparece ao tocar **botão Voltar** E ao **trocar de aba no bottom nav** quando há conteúdo não salvo. Swipe-back do SO está fora do escopo da v1.

**Edge cases**
- EC-03-A: Salvar com nome vazio — feedback inline no campo "Nome da receita"
- EC-03-B: Salvar sem nenhum ingrediente — feedback inline na seção Ingredientes
- EC-03-C: Salvar sem nenhum passo — feedback inline na seção Modo de preparo
- EC-03-D: Tempo mínimo (5min) — botão "−" sem efeito abaixo do mínimo
- EC-03-E: Porções mínimas (1) — botão "−" sem efeito abaixo de 1
- EC-03-F: Upload de foto — clique na área abre seletor de arquivo; exibe preview após seleção
- EC-03-G: Teclado virtual em mobile — CTA "Salvar receita" não bloqueia o campo ativo
- EC-03-H: Trocar de aba no bottom nav com form sujo — dialog de descarte aparece antes de sair

---

### FC-04 · Editar perfil (Tela Perfil)

**Happy path**
1. Usuário navega para aba "Perfil" no bottom nav
2. Tela exibe: avatar circular com anel âmbar, nome em Instrument Serif itálico, badge "Membro Premium", stats (Receitas criadas / Favoritas / Cozinhadas), grid 2x2 de favoritas, scroll horizontal de coleções
3. Usuário toca no botão de câmera (canto inferior direito do avatar) — abre seletor de imagem; avatar atualizado com nova foto
4. Usuário toca no botão de lápis (canto superior direito da tela) — abre modo de edição do perfil (nome, bio, localização)
5. Usuário toca em uma receita favorita — navega para Detalhes
6. Usuário toca em "Ver todas →" nas favoritas — exibe lista completa de favoritas
7. Usuário toca em "+ Nova" em Coleções — cria nova coleção
8. Usuário toca em "Sua jornada culinária" — exibe atividade semanal

**Edge cases**
- EC-04-A: Avatar sem foto carregada — exibe placeholder (comportamento a definir)
- EC-04-B: Nome muito longo — truncamento ou quebra de linha no Instrument Serif 30px
- EC-04-C: Grid de favoritas com menos de 4 receitas — comportamento a definir com product-owner
- EC-04-D: Coleção com contagem 0 — exibição a definir

---

## 4. Validação visual por tela

### Checklist geral (aplicar a todas as telas)
- [ ] Background `#0D0D0D` — sem tons de cinza ou branco puro
- [ ] Cards com background `#1A1A1A` e borda `rgba(255,255,255,0.06)`
- [ ] Fonte Manrope carregada para UI (labels, botões, metadados)
- [ ] Fonte Instrument Serif carregada e aplicada nos títulos display e numeração itálica
- [ ] Acento âmbar `#E8A020` em: botões primários, CTA, chips ativos, badges, ícone de bookmark ativo
- [ ] Bottom nav com 5 itens: Home · Receitas · **+** · Perfil · Config.
- [ ] Botão "+" centralizado: 52×52px, border-radius 18, fundo âmbar, sombra âmbar
- [ ] Tab ativo do bottom nav: cor âmbar; inativo: `textDim`
- [ ] Viewport sem scroll horizontal
- [ ] Conteúdo não corta sob o bottom nav (paddingBottom ≥ 110)

### T01 — Home
- [ ] FeaturedCard: altura 280px, border-radius 24, overlay gradiente, badge "Receita da semana"
- [ ] Chips de categoria: border-radius 999, ativo com fundo âmbar e texto `#0D0D0D`
- [ ] RecipeCard: imagem 104×104px border-radius 14, nome truncado em 2 linhas
- [ ] MiniCard: largura 168px, altura 220px, border-radius 18
- [ ] Seção "Salvas recentemente" e "Para hoje à noite" com título em Instrument Serif itálico

### T02 — Detalhes
- [ ] Hero: altura 380px
- [ ] Botões de ação (voltar/compartilhar/salvar): 42×42px, border-radius 14, backdrop-blur
- [ ] Botão salvar: fundo âmbar, sombra âmbar
- [ ] Stat pills: tempo com acento âmbar, outros neutros
- [ ] Tab ativa: fundo âmbar, texto `#0D0D0D`; inativa: fundo transparente
- [ ] Checkbox de ingrediente marcado: fundo âmbar, ícone check `#0D0D0D`, texto riscado
- [ ] Número do passo: Instrument Serif itálico, fundo `amberSoft`
- [ ] Card "Dica do chef": fundo `amberSoft`, borda `amberMid`, ícone âmbar
- [ ] CTA "Iniciar preparo": altura 58px, border-radius 18, fundo âmbar, gradiente de fundo

### T03 — Adicionar
- [ ] Área de upload: border dashed `rgba(255,255,255,0.1)`, border-radius 22, altura 200px
- [ ] Ícone câmera dentro da área: 56×56px, fundo `amberSoft`
- [ ] Campo nome: Instrument Serif 22px
- [ ] Stepper: botão "+" com fundo `amberSoft`; botão "−" com fundo `rgba(255,255,255,0.05)`
- [ ] Seleção de dificuldade: ativo com `amberSoft` + borda `amberMid` + cor `amber`
- [ ] Botão "+ Adicionar ingrediente/passo": border dashed âmbar 0.4 opacity
- [ ] Numeração de ingrediente: fundo `amberSoft`, cor âmbar
- [ ] Numeração de passo: Instrument Serif itálico, fundo `amberSoft`
- [ ] CTA "Salvar receita": altura 58px, border-radius 18, fundo âmbar

### T04 — Perfil
- [ ] Avatar: 96×96px, border-radius 50%, borda `amberMid`, sombra
- [ ] Anel externo âmbar: inset -6, border `amberSoft`
- [ ] Botão câmera no avatar: 32×32px, border-radius 12, fundo âmbar, borda 3px `bg`
- [ ] Nome: Instrument Serif 30px itálico
- [ ] Badge "Membro Premium": fundo `amberSoft`, borda `amberMid`, cor âmbar
- [ ] StatCard acento (Favoritas): fundo `amberSoft`, valor em âmbar
- [ ] Grid favoritas: 2 colunas, gap 12
- [ ] FavoriteCard: imagem 130px altura, overlay gradiente, botão coração âmbar
- [ ] Coleções: scroll horizontal sem scrollbar visível

---

## 5. Acessibilidade (básica)

### Contraste mínimo (WCAG AA — razão 4.5:1 para texto normal)
- [ ] Texto primário `#F5F2EC` sobre `#0D0D0D` — verificar
- [ ] Texto âmbar `#E8A020` sobre `#0D0D0D` — verificar
- [ ] Texto `#0D0D0D` sobre âmbar `#E8A020` (CTAs, chips ativos) — verificar
- [ ] Texto muted `rgba(245,242,236,0.62)` sobre `#1A1A1A` — verificar (potencial issue)
- [ ] Texto dim `rgba(245,242,236,0.38)` — verificar se usado em texto interativo (potencial falha WCAG)

### Labels semânticos
- [ ] Botão "+" do bottom nav tem `aria-label="Adicionar receita"`
- [ ] Botão de voltar tem `aria-label="Voltar"`
- [ ] Botão de câmera do avatar tem `aria-label="Trocar foto de perfil"`
- [ ] Botão de bookmark/salvar tem `aria-label` descritivo
- [ ] Imagens de receita têm `alt` com nome da receita
- [ ] Checkboxes de ingredientes têm `aria-checked`

### Navegação por teclado
- [ ] Bottom nav navegável com Tab
- [ ] Formulário de adicionar receita navegável com Tab na ordem lógica
- [ ] Botões de adicionar/remover ingrediente e passo acessíveis via teclado
- [ ] Stepper de tempo e porções acessível via teclado

---

## 6. Testes de integração da API

> Contrato publicado em `/docs/api-contract.md`. Testes escritos em `apps/api/tests/integration/`.

### Endpoints cobertos (conforme `api-contract.md`)

| Método | Endpoint | Arquivo de teste |
|--------|----------|-----------------|
| GET | `/api/recipes` | `recipes.test.ts` |
| POST | `/api/recipes` | `recipes.test.ts` |
| GET | `/api/recipes/:id` | `recipes.test.ts` |
| PUT | `/api/recipes/:id` | `recipes.test.ts` |
| DELETE | `/api/recipes/:id` | `recipes.test.ts` |
| POST | `/api/recipes/:id/favorites` | `favorites.test.ts` |
| DELETE | `/api/recipes/:id/favorites` | `favorites.test.ts` |
| GET | `/api/favorites` | `favorites.test.ts` |
| GET | `/api/categories` | `categories.test.ts` |
| GET | `/api/profile` | `profile.test.ts` |
| PUT | `/api/profile` | `profile.test.ts` |
| GET | `/api/profile/collections` | `profile.test.ts` |
| POST | `/api/profile/collections` | `profile.test.ts` |
| POST | `/api/upload/presign` | `upload.test.ts` |

### Shape de dados da API (conforme `api-contract.md`)
```typescript
interface Recipe {
  id: string;
  name: string;                          // max 120
  category: 'Café da manhã' | 'Almoço' | 'Jantar' | 'Sobremesa' | 'Snacks';
  time_min: number;                      // > 0
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  portions: number;                      // > 0
  calories?: number;
  img_url?: string;
  description?: string;
  is_public: boolean;
  created_at: string;
  ingredients: string[];                 // min 1
  steps: Array<{ title: string; body: string; tip?: string }>; // min 1
}
```

---

## 7. Testes E2E — estrutura planejada

> Stack definida: **Playwright** (ADR-0007). Viewport 390×844, Chromium mobile. Testes escritos em `apps/web/e2e/`.

### Organização de arquivos
```
apps/web/e2e/
  home.spec.ts          # FC-01: busca, filtro, estado vazio
  detail.spec.ts        # FC-02: favoritar, tabs, checkboxes, porções
  add-recipe.spec.ts    # FC-03: criar receita, validações, rascunho, dialog descarte (Voltar + tab switch)
  profile.spec.ts       # FC-04: editar perfil, troca de avatar, coleções
  navigation.spec.ts    # Bottom nav, roteamento, tab ativo âmbar
  visual.spec.ts        # Tokens de design contra Saveur.html
```

### Critérios de entrada para execução dos testes
- [x] ADR-0007 publicado — Playwright confirmado
- [x] `/docs/api-contract.md` publicado
- [x] User stories finalizadas em `/docs/user-stories/`
- [ ] frontend-dev implementa telas — testes executam conforme cada tela fica pronta

---

## 8. Log de severidade de bugs

| Severidade | Critério |
|------------|----------|
| Crítico | Bloqueia o fluxo principal; dado perdido; crash; falha de segurança |
| Alto | Funcionalidade importante não funciona; divergência grave do design (cor errada em CTA, fonte errada em título principal) |
| Médio | Funcionalidade parcialmente quebrada; divergência visual notável (espaçamento, tamanho incorreto) |
| Baixo | Comportamento inconsistente menor; divergência visual sutil |

Bugs são reportados em `/docs/qa/bugs.md`.

---

## 9. Critérios de conclusão de uma user story

Uma user story só é marcada como **concluída** quando:
1. Todos os critérios de aceitação definidos com o product-owner passam
2. Happy path E2E passa sem falhas
3. Edge cases críticos cobertos nos testes
4. Checklist visual da tela correspondente aprovado
5. Sem bugs de severidade Crítica ou Alta em aberto para aquela story
6. Acessibilidade básica (contraste e labels) validada

---

## 10. Pendências e dependências

| Item | Status | Decisão |
|------|--------|---------|
| Stack E2E | Resolvido | Playwright (ADR-0007) |
| Critérios de aceitação | Resolvido | Refinados com PO em 2026-05-24 |
| Contrato da API | Resolvido | `/docs/api-contract.md` publicado |
| Estado vazio de busca | Resolvido | Mensagem + CTA "Explorar todas as receitas" |
| Persistência dos checks de ingredientes | Resolvido | Apenas durante a visita (estado em memória) |
| Recálculo de porções | Resolvido | Em tempo real ao mover o stepper |
| Dialog de descarte | Resolvido | Aparece no botão Voltar E ao trocar de aba no bottom nav; swipe-back do OS fora do escopo v1 |
| Toggle notificações com permissão negada | Resolvido | Toggle `disabled` cinza + texto "Ative nas configurações do sistema" com link para OS |
| Spec T05 Configurações | Resolvido | US-05 criada pelo product-owner |
| Implementação do frontend | Em aberto | Aguardando frontend-dev — testes E2E executam conforme telas ficam prontas |
