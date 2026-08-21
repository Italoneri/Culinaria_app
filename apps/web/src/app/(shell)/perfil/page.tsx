import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { fetchProfile, fetchFavorites } from '@/lib/db'
import PerfilClient from './perfil-client'

export const dynamic = 'force-dynamic'

export default async function PerfilPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/perfil')

  const [profile, favorites] = await Promise.all([fetchProfile(), fetchFavorites()])

  return <PerfilClient initialProfile={profile} initialFavorites={favorites} />
}
