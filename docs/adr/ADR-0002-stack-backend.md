# ADR-0002 — Stack backend: Hono + Bun

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

O frontend (Next.js) acessa o Supabase diretamente via SDK para operações CRUD de receitas e autenticação. Um backend dedicado em `apps/api/` é necessário para:

- Lógica de negócio que não deve estar no cliente (validação cross-field, regras de negócio futuras)
- Processamento de imagens antes do upload (resize, otimização)
- Endpoints que agregam dados de múltiplas tabelas
- Webhooks futuros (notificações, integrações)

O Supabase cobre ~80% dos casos via RLS + PostgREST. O `apps/api/` entra apenas para os 20% restantes.

## Decisão

**Hono com Bun runtime.**

Hono é um framework web minimalista com tipagem end-to-end via RPC client (`hono/client`). Bun oferece performance superior ao Node.js para cold starts (relevante em deploy serverless).

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Express | Sem tipos nativos; boilerplate excessivo |
| NestJS | Overhead de decorators e DI para uma API pequena |
| tRPC | Excelente, mas requer adapter para Next.js App Router; Hono RPC é mais simples |
| Fastify | Boa escolha alternativa; Hono tem sintaxe mais limpa e suporte edge nativo |

## Consequências

- Tipos de request/response compartilhados em `packages/types/` — consumidos tanto por `apps/api/` quanto por `apps/web/`
- Deploy: Railway ou Fly.io para o container Bun; alternativa: Cloudflare Workers (Hono é compatível)
- Middleware de auth valida JWT do Supabase em toda rota autenticada
