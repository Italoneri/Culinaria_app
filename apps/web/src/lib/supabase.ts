import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const BUCKET = 'saveur-images'

// Client Components. O client server-side vive em supabase-server.ts porque
// next/headers não pode ser importado de um Client Component.
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

export type ImageFolder = 'recipes' | 'avatars'

/**
 * Sobe a imagem direto do browser para o Storage e devolve a URL pública.
 * O path é determinístico (uma imagem por receita/avatar), então o upsert
 * substitui a anterior e o sufixo `v` derruba o cache do CDN.
 */
export async function uploadImage(file: File, folder: ImageFolder, id: string): Promise<string> {
  const supabase = createSupabaseBrowserClient()
  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${folder}/${id}.${extension}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })

  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return `${data.publicUrl}?v=${Date.now()}`
}
