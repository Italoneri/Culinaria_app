import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { version } from '../../../../package.json'
import ConfiguracoesClient from './configuracoes-client'

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/configuracoes')

  return <ConfiguracoesClient email={user.email ?? ''} userId={user.id} appVersion={version} />
}
