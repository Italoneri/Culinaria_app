'use client';

import { T } from '@/lib/tokens';

type Action = {
  label: string;
  onClick?: () => void;
  href?: string;
};

type Props = {
  title: string;
  message: string;
  action: Action;
  /** Aparece pequeno no rodapé — é o que liga esta tela à linha de log do servidor. */
  reference?: string;
  testid?: string;
};

/** Tela de página inteira para erro e 404. Mesmo visual do login, sem o formulário. */
export function MessageScreen({ title, message, action, reference, testid }: Props) {
  return (
    <div
      data-testid={testid}
      style={{
        minHeight: '100dvh', background: T.bg,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: 'linear-gradient(135deg, #2a1f10, #1a1a1a)',
        border: `1px solid ${T.amberMid}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.amber, fontFamily: T.display, fontSize: 30, fontStyle: 'italic',
        marginBottom: 20,
      }}>S</div>

      <h1 style={{
        fontFamily: T.display, fontSize: 30, fontWeight: 400,
        color: T.text, margin: 0, letterSpacing: -0.5,
      }}>{title}</h1>

      <p style={{
        fontFamily: T.sans, fontSize: 14, fontWeight: 500,
        color: T.textMuted, margin: '10px 0 0', maxWidth: 320, lineHeight: 1.5,
      }}>{message}</p>

      {action.href ? (
        <a
          href={action.href}
          data-testid="message-action"
          style={{
            marginTop: 28, height: 56, width: '100%', maxWidth: 320,
            borderRadius: 18, background: T.amber, color: '#0D0D0D',
            fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, textDecoration: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(232,160,32,0.35)',
          }}
        >{action.label}</a>
      ) : (
        <button
          onClick={action.onClick}
          data-testid="message-action"
          style={{
            marginTop: 28, height: 56, width: '100%', maxWidth: 320,
            borderRadius: 18, background: T.amber, color: '#0D0D0D',
            border: 'none', fontFamily: T.sans, fontSize: 15.5, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(232,160,32,0.35)',
          }}
        >{action.label}</button>
      )}

      {reference && (
        <p style={{
          fontFamily: T.sans, fontSize: 11, fontWeight: 500,
          color: T.textDim, marginTop: 22, letterSpacing: 0.3,
        }}>{reference}</p>
      )}
    </div>
  );
}
