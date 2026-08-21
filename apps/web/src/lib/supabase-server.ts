import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server Components / Route Handlers / Server Actions.
// Carrega a sessão dos cookies para que a RLS enxergue auth.uid().
export function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component context — cookies não podem ser mutados aqui
          }
        },
      },
    }
  )
}
