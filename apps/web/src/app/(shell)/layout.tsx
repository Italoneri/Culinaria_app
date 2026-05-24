import { BottomNav } from '@/components/ui/bottom-nav';
import { NavGuardProvider } from '@/components/ui/nav-guard-context';

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavGuardProvider>
      <div style={{ position: 'relative', minHeight: '100dvh', background: '#0D0D0D' }}>
        {children}
        <BottomNav />
      </div>
    </NavGuardProvider>
  );
}
