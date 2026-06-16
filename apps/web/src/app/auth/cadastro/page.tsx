'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { T } from '@/lib/tokens';

export default function CadastroPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) { setError('Senha deve ter pelo menos 6 caracteres.'); return; }
    if (password !== confirm) { setError('As senhas não conferem.'); return; }

    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);

    if (error) { setError(error); return; }
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
          <h1 style={{ fontFamily: T.display, fontSize: 28, fontWeight: 400, color: T.text, margin: '0 0 12px', letterSpacing: -0.4 }}>
            Confirme seu email
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, lineHeight: 1.6, fontWeight: 500 }}>
            Enviamos um link de confirmação para <strong style={{ color: T.text }}>{email}</strong>. Clique nele para ativar sua conta.
          </p>
          <Link href="/auth/login" style={{
            display: 'block', marginTop: 28, height: 56, borderRadius: 18,
            background: T.amber, color: '#0D0D0D',
            fontFamily: T.sans, fontSize: 15.5, fontWeight: 700,
            textDecoration: 'none', lineHeight: '56px', textAlign: 'center',
            boxShadow: '0 8px 24px rgba(232,160,32,0.35)',
          }}>
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

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
            Criar conta
          </h1>
          <p style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, margin: '8px 0 0', fontWeight: 500 }}>
            Comece a salvar suas receitas favoritas
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Email', value: email, setter: setEmail, type: 'email', placeholder: 'seu@email.com', autoComplete: 'email' },
            { label: 'Senha', value: password, setter: setPassword, type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
            { label: 'Confirmar senha', value: confirm, setter: setConfirm, type: 'password', placeholder: '••••••••', autoComplete: 'new-password' },
          ].map(({ label, value, setter, type, placeholder, autoComplete }) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 700, color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                {label}
              </label>
              <input
                type={type}
                value={value}
                onChange={e => setter(e.target.value)}
                placeholder={placeholder}
                required
                autoComplete={autoComplete}
                style={{
                  height: 52, borderRadius: 16, padding: '0 16px',
                  background: T.card, border: `1px solid ${error ? 'rgba(255,80,80,0.4)' : T.border}`,
                  color: T.text, fontFamily: T.sans, fontSize: 15, fontWeight: 500,
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

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
            {loading ? 'Criando conta…' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontFamily: T.sans, fontSize: 14, color: T.textMuted, marginTop: 28 }}>
          Já tem conta?{' '}
          <Link href="/auth/login" style={{ color: T.amber, fontWeight: 700, textDecoration: 'none' }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
