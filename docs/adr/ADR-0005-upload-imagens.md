# ADR-0005 — Upload de imagens: Supabase Storage

**Status:** Aceito
**Data:** 2026-05-24

## Contexto

A tela "Adicionar receita" (screen-add.jsx) inclui upload de foto do prato. Usuários em mobile Android farão upload direto da câmera ou galeria. Requisitos:

- Upload direto do browser (sem passar pelo servidor Next.js — evita timeout)
- CDN automático para servir imagens nos cards
- Resize/otimização (imagens de câmera podem ter 10–20MB)
- Controle de acesso (imagens privadas vs. públicas)

## Decisão

**Supabase Storage com presigned URLs.**

Fluxo:
1. Frontend solicita presigned URL ao backend Hono (`POST /api/upload/presign`)
2. Backend valida autenticação e retorna URL temporária do Supabase Storage
3. Frontend faz upload direto ao Storage via `PUT` na presigned URL (sem passar pelo servidor)
4. Backend recebe callback com a URL final e salva em `recipes.img_url`

Resize no cliente antes do upload usando `browser-image-compression` (npm) — reduz para max 800px largura, ~200KB.

## Buckets

```
saveur-images/
├── recipes/         # público — imagens de receitas
│   └── {recipe_id}.jpg
└── avatars/         # público — fotos de perfil
    └── {user_id}.jpg
```

Bucket `recipes` é público (leitura sem auth). Escrita apenas via presigned URL com JWT válido.

## Alternativas consideradas

| Opção | Por que rejeitada |
|-------|------------------|
| Cloudinary | Excelente para transformações, mas custo adicional e vendor extra |
| AWS S3 | Funciona, mas adiciona infra desvinculada do resto do stack Supabase |
| Vercel Blob | Acoplado à Vercel; pode haver problemas se mudar de host |
| Upload via Next.js API route | Servidor como intermediário cria limite de 4MB (Vercel) e latência |

## Consequências

- Imagens armazenadas com nome `{recipe_id}.jpg` — substituição idempotente no re-upload
- `next/image` com domínio do Supabase Storage adicionado em `next.config.ts`
- Limpeza de imagens órfãs: cron semanal ou via trigger `AFTER DELETE ON recipes`
