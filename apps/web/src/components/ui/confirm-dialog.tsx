'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { T } from '@/lib/tokens';

type Props = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  /** Pinta o confirmar de vermelho — para ação que não tem volta. */
  destructive?: boolean;
  pending?: boolean;
  /** Quando presente, confirmar só habilita depois de digitar exatamente esta palavra. */
  requireTyping?: string;
  error?: string;
};

const DESTRUCTIVE = '#ff5555';

/**
 * Bottom sheet de confirmação, no visual do dialog de descarte da tela
 * Adicionar. O que se acrescenta aqui é o comportamento de dialog de verdade:
 * foco vai para dentro ao abrir, Esc cancela e o leitor de tela anuncia o
 * título em vez de um `role="dialog"` anônimo.
 */
export function ConfirmDialog({
  title, message, confirmLabel, onConfirm, onCancel,
  destructive = false, pending = false, requireTyping, error,
}: Props) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState('');

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onCancel]);

  const confirmBlocked = pending || (requireTyping !== undefined && typed !== requireTyping);
  const confirmColor = destructive ? DESTRUCTIVE : T.amber;

  return (
    <>
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        data-testid="confirm-dialog"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          maxWidth: 412, margin: '0 auto',
          background: T.card, borderRadius: '24px 24px 0 0',
          border: `1px solid ${T.borderStrong}`,
          padding: '28px 24px 40px', outline: 'none',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: T.textDim, margin: '0 auto 24px' }} />

        <h2 id={titleId} style={{
          fontFamily: T.display, fontSize: 24, fontWeight: 400,
          color: T.text, letterSpacing: -0.4, margin: '0 0 8px',
        }}>{title}</h2>

        <p style={{
          fontFamily: T.sans, fontSize: 14, color: T.textMuted,
          lineHeight: 1.5, margin: `0 0 ${requireTyping ? 18 : 28}px`,
        }}>{message}</p>

        {requireTyping !== undefined && (
          <input
            value={typed}
            onChange={e => setTyped(e.target.value)}
            placeholder={requireTyping}
            aria-label={`Digite ${requireTyping} para confirmar`}
            data-testid="confirm-typing"
            autoComplete="off"
            style={{
              height: 52, borderRadius: 16, padding: '0 16px', marginBottom: 20,
              background: T.bg, border: `1px solid ${T.border}`, color: T.text,
              fontFamily: T.sans, fontSize: 15, fontWeight: 600, letterSpacing: 1,
              outline: 'none', width: '100%', boxSizing: 'border-box',
            }}
          />
        )}

        {error && (
          <div role="alert" style={{
            padding: '12px 14px', borderRadius: 12, marginBottom: 16,
            background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
            fontFamily: T.sans, fontSize: 13, color: '#ff6b6b', fontWeight: 500,
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onConfirm}
            disabled={confirmBlocked}
            data-testid="confirm-accept"
            style={{
              width: '100%', height: 54, borderRadius: 16, border: 'none',
              background: confirmBlocked ? 'rgba(255,255,255,0.06)' : confirmColor,
              color: confirmBlocked ? T.textDim : '#0D0D0D',
              fontFamily: T.sans, fontSize: 15, fontWeight: 700,
              cursor: confirmBlocked ? 'not-allowed' : 'pointer',
            }}
          >
            {pending ? 'Aguarde…' : confirmLabel}
          </button>

          <button
            onClick={onCancel}
            data-testid="confirm-cancel"
            style={{
              width: '100%', height: 44, borderRadius: 16,
              background: 'transparent', border: 'none', color: T.textDim,
              fontFamily: T.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
