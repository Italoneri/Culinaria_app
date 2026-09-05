'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { T } from '@/lib/tokens';

const MIN_PASSWORD_LENGTH = 8;

const fieldStyle = {
  height: 52, borderRadius: 16, padding: '0 16px',
  background: T.card, color: T.text,
  fontFamily: T.sans, fontSize: 15, fontWeight: 500,
  outline: 'none', width: '100%', boxSizing: 'border-box',
} as const;

const labelStyle = {
  fontFamily: T.sans, fontSize: 12, fontWeight: 700,
  color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase',
} as const;

/**
 * Destino do link de redefinição, encaminhado pelo /auth/callback já com a
 * sessão trocada — updateUser só funciona autenticado.
 */
export default function NovaSenhaPage() {
  const router = useRouter();
  const { session, loading, updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha precisa ter ao menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirmation) {
      setError('As duas senhas não são iguais.');
      return;
    }

    setError('');
    setSaving(true);
    const result = await updatePassword(password);
    setSaving(false);

    if (result.error) { setError(result.error); return; }
    router.push('/');
  };

  if (loading) {
    return <div style={{ minHeight: '100dvh', background: T.bg }} />;
  }

  return (
    <div style={{
      minHeight: '100dvh', background: T.bg, padding: 24,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{
          fontFamily: T.display, fontSize: 32, fontWeight: 400,
          color: T.text, margin: 0, letterSpacing: -0.5, textAlign: 'center',
        }}>
          {session ? 'Escolha uma nova senha' : 'Link expirado'}
        </h1>

        {!session ? (
          <>
            <p style={{
              fontFamily: T.sans, fontSize: 14, color: T.textMuted,
              margin: '10px 0 28px', textAlign: 'center', lineHeight: 1.5,
            }}>
              Este link de redefinição já foi usado ou passou da validade. Peça um novo na tela de entrada.
            </p>
            <Link
              href="/auth/login"
              style={{
                height: 56, borderRadius: 18, background: T.amber, color: '#0D0D0D',
                fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(232,160,32,0.35)',
              }}
            >
              Voltar para entrar
            </Link>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 28 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="nova-senha" style={labelStyle}>Nova senha</label>
              <input
                id="nova-senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                style={{ ...fieldStyle, border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : T.border}` }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label htmlFor="confirmar-senha" style={labelStyle}>Confirmar senha</label>
              <input
                id="confirmar-senha"
                type="password"
                value={confirmation}
                onChange={e => setConfirmation(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                style={{ ...fieldStyle, border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : T.border}` }}
              />
            </div>

            {error && (
              <div role="alert" style={{
                padding: '12px 14px', borderRadius: 12,
                background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
                fontFamily: T.sans, fontSize: 13, color: '#ff6b6b', fontWeight: 500,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              style={{
                marginTop: 6, height: 56, borderRadius: 18,
                background: saving ? T.amberSoft : T.amber,
                border: 'none', color: saving ? T.amber : '#0D0D0D',
                fontFamily: T.sans, fontSize: 15.5, fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                boxShadow: saving ? 'none' : '0 8px 24px rgba(232,160,32,0.35)',
                transition: 'all .15s',
              }}
            >
              {saving ? 'Salvando…' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
