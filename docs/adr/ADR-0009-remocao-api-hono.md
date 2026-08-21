# ADR-0009 — Remoção da API Hono: acesso direto ao Supabase

**Status:** Aceito
**Data:** 2026-08-20
**Substitui:** [ADR-0002](ADR-0002-stack-backend.md) — Stack backend: Hono + Bun

## Contexto

A API Hono de `apps/api/` foi implementada junto com um caminho de leitura que
ia direto do Next.js ao Supabase. Na prática o app ficou com dois caminhos de
dados para os mesmos registros, com dois modelos de auth:

- leitura: `lib/db.ts`, client anon do supabase-js, RLS decidindo o recorte
- escrita: `lib/api-client.ts` → Hono → supabase-js com o JWT do usuário

O desenho não fechava em três pontos concretos:

1. `apps/api` só sobe com `bun`, que não estava instalado em nenhuma máquina do
   time, e `src/index.ts` exportava `{ port, fetch }` — formato que o Node não
   entende sem `@hono/node-server`.
2. `index.ts` aplicava `authMiddleware` em todo `/api/*`, mas `api-client.ts`
   chamava `/api/recipes` e `/api/categories` sem token, sob o comentário
   "public endpoints (no auth)". Essas funções retornariam 401 se fossem usadas.
3. As rotas Hono não faziam nada além do que a RLS já garantia: cada handler
   abria um client com o JWT do usuário e repassava a query.

Os 50+ testes de integração da API eram inteiramente mockados (`mockChain` em
`tests/integration/helpers.ts`), então não cobriam o Postgres de verdade e não
davam sinal sobre o comportamento real das policies.

## Decisão

Remover `apps/api/` e concentrar o acesso a dados no Next.js:

- **Leitura**: Server Components chamam `lib/db.ts`, que usa o client de sessão
  (`lib/supabase-server.ts`). Sem filtro de visibilidade no código — a RLS de
  `recipes` (`is_public = true OR owner_id = auth.uid()`) é a única fonte da
  regra.
- **Escrita**: Server Actions em `lib/actions.ts`, com o payload validado por
  zod na entrada (allowlist explícita de campos) e `revalidatePath` depois.
- **Upload**: direto do browser para o Supabase Storage, com policies por pasta.
  Some a necessidade da service role key no servidor de aplicação.

## Consequências

**Positivas**
- Um caminho de dados e um modelo de auth. A regra de visibilidade existe em um
  lugar só: as policies.
- Nenhum runtime extra para instalar ou operar; um deploy em vez de dois.
- A service role key deixa de ser necessária fora de scripts administrativos.

**Negativas**
- Lógica de negócio pesada, se aparecer, terá que morar em Server Actions ou em
  funções Postgres, não num serviço separado.
- Não há mais uma API REST versionada para um cliente nativo consumir. Se isso
  voltar a ser requisito, o caminho natural é a API REST gerada pelo PostgREST
  do próprio Supabase, não um serviço novo.
- A correção das policies passa a ser crítica: um erro de RLS vira exposição de
  dado, sem uma camada de aplicação para segurar. Isso exige teste de RLS com
  banco real — dívida registrada, já que os testes mockados foram removidos.
