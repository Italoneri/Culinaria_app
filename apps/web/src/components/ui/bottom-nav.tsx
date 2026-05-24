'use client';

import { useRouter, usePathname } from 'next/navigation';
import { T } from '@/lib/tokens';
import { useNavGuard } from './nav-guard-context';
import {
  IconHome, IconHomeFill, IconBook, IconPlus,
  IconUser, IconGear,
} from './icons';

const tabs = [
  { id: 'home', label: 'Home', href: '/', icon: IconHome, iconFill: IconHomeFill },
  { id: 'recipes', label: 'Receitas', href: '/receitas', icon: IconBook },
  { id: 'add', label: '', href: '/adicionar', icon: IconPlus, special: true },
  { id: 'profile', label: 'Perfil', href: '/perfil', icon: IconUser },
  { id: 'settings', label: 'Config.', href: '/configuracoes', icon: IconGear },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { checkGuard } = useNavGuard();

  const activeId = (() => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/adicionar')) return 'add';
    if (pathname.startsWith('/receita')) return 'recipes';
    if (pathname.startsWith('/receitas')) return 'recipes';
    if (pathname.startsWith('/perfil')) return 'profile';
    if (pathname.startsWith('/configuracoes')) return 'settings';
    return 'home';
  })();

  const handleTabClick = (href: string) => {
    if (checkGuard(href)) {
      router.push(href);
    }
    // If guard returns false, it means the page handled it (showed dialog)
  };

  return (
    <nav role="navigation" aria-label="navegação principal" style={{
      position: 'fixed', left: 16, right: 16, bottom: 18, zIndex: 25,
      height: 70, borderRadius: 28,
      background: 'rgba(20,20,20,0.78)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: `1px solid ${T.borderStrong}`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      padding: '0 6px',
      maxWidth: 412, margin: '0 auto',
    }}>
      {tabs.map(tab => {
        const isActive = activeId === tab.id;
        if ('special' in tab && tab.special) {
          return (
            <div key={tab.id} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <button
                role="button"
                aria-label="Adicionar receita"
                onClick={() => handleTabClick(tab.href)}
                style={{
                  width: 52, height: 52, borderRadius: 18,
                  background: T.amber, color: '#0D0D0D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 22px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                  border: 'none', cursor: 'pointer',
                }}>
                <tab.icon style={{ width: 26, height: 26 }} />
              </button>
            </div>
          );
        }
        const IconComponent = isActive && 'iconFill' in tab && tab.iconFill ? tab.iconFill : tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.href)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '8px 4px', color: isActive ? T.amber : T.textDim,
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'color .15s',
            }}>
            <IconComponent />
            <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: 0.1 }}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
