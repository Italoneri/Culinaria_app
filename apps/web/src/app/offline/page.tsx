import { T } from '@/lib/tokens';

export default function OfflinePage() {
  return (
    <div style={{
      minHeight: '100dvh', background: T.bg, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 20,
        background: T.amberSoft, border: `1px solid ${T.amberMid}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: T.amber, fontFamily: T.display, fontSize: 32, fontStyle: 'italic', marginBottom: 24,
      }}>S</div>
      <h1 style={{ fontFamily: T.display, fontSize: 28, fontWeight: 400, color: T.text, margin: '0 0 12px', letterSpacing: -0.4 }}>
        Sem conexão
      </h1>
      <p style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, lineHeight: 1.55, maxWidth: 280, margin: 0 }}>
        Verifique sua conexão com a internet e tente novamente. Receitas já visitadas estão disponíveis offline.
      </p>
    </div>
  );
}
