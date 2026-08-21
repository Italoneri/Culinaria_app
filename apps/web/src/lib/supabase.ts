import { createBrowserClient } from '@supabase/ssr'
import { IMAGE_BUCKET } from './data'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Espelha allowed_mime_types do bucket — o bucket é quem realmente barra,
// isto aqui só evita uma subida fadada a falhar.
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

// Client Components. O client server-side vive em supabase-server.ts porque
// next/headers não pode ser importado de um Client Component.
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export type ImageKind = 'recipes' | 'avatars'

export function isSupportedImage(file: File): boolean {
  return file.type in EXTENSION_BY_MIME
}

export class UnsupportedImageError extends Error {
  constructor() {
    super('Formato não suportado. Use JPG, PNG, WebP ou AVIF.')
    this.name = 'UnsupportedImageError'
  }
}

/**
 * Sobe a imagem do browser para o Storage e devolve a URL pública.
 *
 * O path é sempre `<uid>/<kind>/<id>.<ext>`: a policy do bucket exige que a
 * primeira pasta seja o próprio uid, então ninguém escreve na pasta de outro.
 * A extensão vem do mime type, nunca do nome do arquivo, que é dado do usuário.
 */
export async function uploadImage(file: File, kind: ImageKind, id: string): Promise<string> {
  const extension = EXTENSION_BY_MIME[file.type]
  if (!extension) throw new UnsupportedImageError()

  const supabase = createSupabaseBrowserClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Sessão expirada')

  const path = `${user.id}/${kind}/${id}.${extension}`

  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw error

  const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)
  return `${data.publicUrl}?v=${Date.now()}`
}
