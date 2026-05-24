import type { ReactNode } from 'react';
import { T } from '@/lib/tokens';

type PillProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
};

export function Pill({ icon, label, value, accent = false }: PillProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '12px 8px', borderRadius: 16,
      background: accent ? T.amberSoft : 'rgba(255,255,255,0.04)',
      border: `1px solid ${accent ? T.amberMid : T.border}`,
      flex: 1, minWidth: 0,
    }}>
      <div style={{ color: accent ? T.amber : T.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon}
        <span style={{ fontFamily: T.sans, fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</span>
      </div>
      <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: accent ? T.amber : T.text }}>{value}</div>
    </div>
  );
}
