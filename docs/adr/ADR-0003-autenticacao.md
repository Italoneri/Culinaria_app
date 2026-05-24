# ADR-0003 — Autenticação: Supabase Auth

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

O app precisa identificar usuários para:
- Associar receitas criadas a um dono
- Persistir favoritos e coleções por usuário
- Futuramente: plano premium (Membro Premium visto no design do perfil)

O target é Android Chrome (PWA) — fluxos que requerem redirecionamento OAuth são compatíveis.

## Decisão

**Supabase Auth com magic link (email) + Google OAuth.**

Magic link é o método principal: sem senha para lembrar, funciona bem em mobile. Google OAuth como alternativa rápida para usuários que preferem.

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Auth próprio (JWT manual) | Overhead de implementação; risco de segurança |
| NextAuth.js / Auth.js | Requer adapter Supabase; adiciona uma camada desnecessária quando já usamos Supabase |
| Clerk | Excelente DX, mas custo adicional e vendor lock-in desnecessário |
| Firebase Auth | Forçaria uso de Firestore; foge do stack PostgreSQL escolhido |

## Consequências

- `createServerClient` do `@supabase/ssr` usado em Server Components e Route Handlers
- `createBrowserClient` nos Client Components
- RLS (Row Level Security) no PostgreSQL garante isolamento de dados por `auth.uid()` sem lógica extra no backend
- Sessão persistida em cookies `HttpOnly` via middleware Next.js (`middleware.ts` na raiz de `apps/web/`)
- Fluxo de magic link: usuário insere email → recebe link → clica → redirecionado ao app com sessão ativa
