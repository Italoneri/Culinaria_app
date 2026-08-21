import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

/**
 * Destino do link de confirmação de email. O GoTrue verifica o token do lado
 * dele e redireciona para cá com `?code=`; sem essa troca por sessão o usuário
 * confirma a conta mas volta deslogado.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`)
  }

  const supabase = createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/login?error=invalid_code`)
  }

  // Caminho relativo do próprio app — nunca a URL crua, para não virar open redirect
  return NextResponse.redirect(`${origin}${redirect.startsWith('/') ? redirect : '/'}`)
}
