'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { T } from '@/lib/tokens';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/';
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    router.push(redirect);
  };

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'linear-gradient(135deg, #2a1f10, #1a1a1a)',
            border: '1px solid rgba(232,160,32,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.amber, fontFamily: T.display, fontSize: 30, fontWeight: 400, fontStyle: 'italic',
            marginBottom: 16,
          }}>S</div>
          <h1 style={{ fontFamily: T.display, fontSize: 32, fontWeight: 400, color: T.text, margin: 0, letterSpacing: -0.5 }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, margin: '8px 0 0', fontWeight: 500 }}>
            Entre para acessar suas receitas
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              style={{
                height: 52, borderRadius: 16, padding: '0 16px',
                background: T.card, border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : T.border}`,
                color: T.text, fontFamily: T.sans, fontSize: 15, fontWeight: 500,
                outline: 'none', width: '100%', boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{
                height: 52, borderRadius: 16, padding: '0 16px',
                background: T.card, border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : T.border}`,
                color: T.text, fontFamily: T.sans, fontSize: 15, fontWeight: 500,
                outline: 'none', width: '100%', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
              fontFamily: T.sans, fontSize: 13, color: '#ff6b6b', fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6, height: 56, borderRadius: 18,
              background: loading ? T.amberSoft : T.amber,
              border: 'none', color: loading ? T.amber : '#0D0D0D',
              fontFamily: T.sans, fontSize: 15.5, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(232,160,32,0.35)',
              transition: 'all .15s',
            }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontFamily: T.sans, fontSize: 14, color: T.textMuted, marginTop: 28 }}>
          Não tem conta?{' '}
          <Link href="/auth/cadastro" style={{ color: T.amber, fontWeight: 700, textDecoration: 'none' }}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}

// useSearchParams exige um limite de Suspense para o Next conseguir pré-renderizar a rota
export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: T.bg }} />}>
      <LoginForm />
    </Suspense>
  );
}
