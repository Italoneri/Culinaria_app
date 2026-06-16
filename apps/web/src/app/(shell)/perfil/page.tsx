import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import { getProfile, getFavorites } from '@/lib/api-client'
import type { Profile } from '@/lib/api-client'
import type { Recipe } from '@/lib/data'
import PerfilClient from './perfil-client'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const supabase = createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login?redirect=/perfil')

  let profile: Profile | null = null
  let favorites: Recipe[] = []

  try {
    ;[profile, favorites] = await Promise.all([
      getProfile(session.access_token),
      getFavorites(session.access_token),
    ])
  } catch { /* API offline — render with empty state */ }

  return <PerfilClient initialProfile={profile} initialFavorites={favorites} />
}
