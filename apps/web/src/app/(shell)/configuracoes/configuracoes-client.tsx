'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { T } from '@/lib/tokens';
import { useAuth } from '@/lib/auth-context';
import { deleteOwnImages } from '@/lib/supabase';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IconChevron } from '@/components/ui/icons';

// TODO: apontar para a caixa de suporte real antes do lançamento.
const SUPPORT_EMAIL = 'suporte@saveur.app';
const DELETE_CONFIRMATION = 'EXCLUIR';
const DESTRUCTIVE = '#ff5555';

type OpenDialog = 'none' | 'signout' | 'delete';

type Props = {
  email: string;
  userId: string;
  appVersion: string;
};

export default function ConfiguracoesClient({ email, userId, appVersion }: Props) {
  const router = useRouter();
  const { signOut, requestPasswordReset, deleteAccount } = useAuth();

  const [dialog, setDialog] = useState<OpenDialog>('none');
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async () => {
    setNotice('');
    setError('');
    setPending(true);
    const result = await requestPasswordReset(email);
    setPending(false);

    if (result.error) { setError(result.error); return; }
    setNotice('Enviamos um link de redefinição para o seu email.');
  };

  const handleSignOut = async () => {
    setPending(true);
    await signOut();
    router.push('/auth/login');
  };

  const handleDelete = async () => {
    setError('');
    setPending(true);

    // Antes da conta sumir: o cascade do banco não alcança o Storage, e depois
    // do delete não há mais sessão para autorizar a limpeza.
    await deleteOwnImages(userId);

    const result = await deleteAccount();
    setPending(false);

    if (result.error) { setError(result.error); return; }
    router.push('/auth/login');
  };

  return (
    <div data-testid="settings-screen" style={{
      minHeight: '100dvh', background: T.bg,
      overflowY: 'auto', paddingBottom: 130,
    }}>
      <header style={{ padding: '54px 24px 8px' }}>
        <h1 style={{
          fontFamily: T.display, fontSize: 34, fontWeight: 400, fontStyle: 'italic',
          color: T.text, margin: 0, letterSpacing: -0.5,
        }}>
          Configurações
        </h1>
      </header>

      {notice && (
        <div role="status" data-testid="settings-notice" style={{
          margin: '16px 24px 0', padding: '12px 14px', borderRadius: 12,
          background: T.amberSoft, border: `1px solid ${T.amberMid}`,
          fontFamily: T.sans, fontSize: 13, color: T.amber, fontWeight: 600,
        }}>{notice}</div>
      )}

      {error && dialog === 'none' && (
        <div role="alert" data-testid="settings-error" style={{
          margin: '16px 24px 0', padding: '12px 14px', borderRadius: 12,
          background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
          fontFamily: T.sans, fontSize: 13, color: '#ff6b6b', fontWeight: 500,
        }}>{error}</div>
      )}

      <Section label="Conta">
        <ReadOnlyRow label="Email" value={email} testid="row-email" />

        <ActionRow
          label="Alterar senha"
          hint="Enviamos um link por email"
          onClick={handlePasswordReset}
          disabled={pending}
          testid="row-change-password"
        />

        <ActionRow
          label="Sair da conta"
          onClick={() => setDialog('signout')}
          testid="row-signout"
        />

        <ActionRow
          label="Excluir conta"
          hint="Apaga receitas, favoritas e fotos para sempre"
          onClick={() => { setError(''); setDialog('delete'); }}
          tone={DESTRUCTIVE}
          testid="row-delete-account"
        />
      </Section>

      <Section label="Sobre">
        <ReadOnlyRow label="Versão" value={`Saveur ${appVersion}`} testid="row-version" />

        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Problema no Saveur ${appVersion}`)}`}
          data-testid="row-report-problem"
          style={{ ...rowStyle, textDecoration: 'none' }}
        >
          <span style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.text }}>
            Reportar um problema
          </span>
          <IconChevron style={{ width: 16, height: 16, color: T.textDim }} />
        </a>
      </Section>

      {dialog === 'signout' && (
        <ConfirmDialog
          title="Sair da conta?"
          message="Você vai precisar entrar de novo para ver suas receitas e favoritas."
          confirmLabel="Sair"
          pending={pending}
          onConfirm={handleSignOut}
          onCancel={() => setDialog('none')}
        />
      )}

      {dialog === 'delete' && (
        <ConfirmDialog
          title="Excluir a conta?"
          message={`Suas receitas, favoritas e fotos serão apagadas e não há como recuperar. Digite ${DELETE_CONFIRMATION} para confirmar.`}
          confirmLabel="Excluir para sempre"
          requireTyping={DELETE_CONFIRMATION}
          destructive
          pending={pending}
          error={error}
          onConfirm={handleDelete}
          onCancel={() => { setError(''); setDialog('none'); }}
        />
      )}
    </div>
  );
}

const rowStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
  width: '100%', padding: '16px 18px', textAlign: 'left' as const,
  background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ padding: '28px 24px 0' }}>
      <h2 style={{
        fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
        textTransform: 'uppercase', color: T.amber, margin: '0 0 12px',
      }}>{label}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </section>
  );
}

function ReadOnlyRow({ label, value, testid }: { label: string; value: string; testid: string }) {
  return (
    <div data-testid={testid} style={rowStyle}>
      <span style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.text }}>{label}</span>
      <span style={{
        fontFamily: T.sans, fontSize: 13.5, fontWeight: 500, color: T.textMuted,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>{value}</span>
    </div>
  );
}

function ActionRow({
  label, hint, onClick, tone = T.text, disabled = false, testid,
}: {
  label: string;
  hint?: string;
  onClick: () => void;
  tone?: string;
  disabled?: boolean;
  testid: string;
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      onClick={onClick}
      disabled={disabled}
      style={{ ...rowStyle, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}
    >
      <span style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: tone }}>{label}</span>
        {hint && (
          <span style={{ fontFamily: T.sans, fontSize: 12, fontWeight: 500, color: T.textDim }}>{hint}</span>
        )}
      </span>
      <IconChevron style={{ width: 16, height: 16, color: T.textDim }} />
    </button>
  );
}
