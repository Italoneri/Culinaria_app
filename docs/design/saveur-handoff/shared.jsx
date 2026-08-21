// Saveur — Shared UI primitives: dark device frame, bottom nav, icons

const T = window.SAVEUR_TOKENS;

// ─────────────────────────────────────────────────────────────
// Icons — line-based, 1.6 stroke, matches Manrope weight
// ─────────────────────────────────────────────────────────────
const Icon = {
  home: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  homeFill: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" {...p}>
      <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z" fill="currentColor"/>
    </svg>
  ),
  book: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 4.5A1.5 1.5 0 015.5 3H20v15H5.5A1.5 1.5 0 014 16.5v-12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M4 16.5A1.5 1.5 0 015.5 18H20v3H6a2 2 0 01-2-2v-2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M8 8h8M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  plus: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  user: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M4 21a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  back: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bookmark: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 4h12v17l-6-4-6 4V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  bookmarkFill: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" {...p}>
      <path d="M6 4h12v17l-6-4-6 4V4z" fill="currentColor"/>
    </svg>
  ),
  search: (p = {}) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  clock: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  flame: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3s5 4 5 9a5 5 0 11-10 0c0-2 1-3 2-3s1 1 1 2c1-3 2-5 2-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  users: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M3 20a6 6 0 0112 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M16 6a3.5 3.5 0 010 7M21 20a5 5 0 00-3-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  ),
  signal: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 19v-3M10 19v-7M16 19v-11M22 19v-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  camera: (p = {}) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="1.6"/>
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  ),
  check: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M4 12l5 5L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevron: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  share: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  bell: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M6 9a6 6 0 0112 0v4l1.5 3h-15L6 13V9zM10 19a2 2 0 004 0" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  flag: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M5 3v18M5 4h12l-2 4 2 4H5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  gear: (p = {}) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M19.4 13.5a1 1 0 00.2-1.1l-1-1.7a1 1 0 00-1-.5l-1.5.2a6.4 6.4 0 00-1.3-.8l-.5-1.4a1 1 0 00-1-.7h-2a1 1 0 00-1 .7l-.5 1.4c-.5.2-.9.4-1.3.8l-1.5-.2a1 1 0 00-1 .5l-1 1.7a1 1 0 00.2 1.1l1 1c0 .5 0 1 0 1.4l-1 1a1 1 0 00-.2 1.1l1 1.7a1 1 0 001 .5l1.5-.2c.4.3.8.6 1.3.8l.5 1.4a1 1 0 001 .7h2a1 1 0 001-.7l.5-1.4c.5-.2.9-.4 1.3-.8l1.5.2a1 1 0 001-.5l1-1.7a1 1 0 00-.2-1.1l-1-1c0-.5 0-1 0-1.4l1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  ),
  heart: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" fill="currentColor"/>
    </svg>
  ),
  pencil: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" {...p}>
      <path d="M14 4l6 6L9 21H3v-6L14 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────
// Status bar — dark
// ─────────────────────────────────────────────────────────────
function StatusBar({ time = '9:41' }) {
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
      height: 54, padding: '18px 30px 0', boxSizing: 'border-box',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      pointerEvents: 'none',
    }}>
      <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: -0.2 }}>{time}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', color: T.text }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5"/><rect x="4.5" y="5" width="3" height="6" rx="0.5"/><rect x="9" y="2.5" width="3" height="8.5" rx="0.5"/><rect x="13.5" y="0" width="3" height="11" rx="0.5" opacity="0.4"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 3C9.4 3 11.2 3.7 12.5 5l1-1C11.8 2.3 9.7 1.5 7.5 1.5S3.2 2.3 1.5 4l1 1C3.8 3.7 5.6 3 7.5 3z"/><path d="M7.5 6c1 0 2 .4 2.7 1.1l1-1C10.2 5.2 8.9 4.6 7.5 4.6S4.8 5.2 3.8 6.1l1 1C5.5 6.4 6.5 6 7.5 6z"/><circle cx="7.5" cy="9" r="1.3"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="21" height="10" rx="3" stroke="currentColor" strokeOpacity="0.5" fill="none"/><rect x="2" y="2" width="14" height="7" rx="1.5" fill="currentColor"/><path d="M23 4v3c.6-.2 1-.7 1-1.5s-.4-1.3-1-1.5z" fill="currentColor" fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom nav — 5 tabs, amber active state, floating pill design.
// + is index 2 (perfectly centered): Home · Receitas · + · Perfil · Config.
// ─────────────────────────────────────────────────────────────
function BottomNav({ active = 'home', onChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Icon.home, iconFill: Icon.homeFill },
    { id: 'recipes', label: 'Receitas', icon: Icon.book },
    { id: 'add', label: '', icon: Icon.plus, special: true },
    { id: 'profile', label: 'Perfil', icon: Icon.user },
    { id: 'settings', label: 'Config.', icon: Icon.gear },
  ];
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 18, zIndex: 25,
      height: 70, borderRadius: 28,
      background: 'rgba(20,20,20,0.78)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: `1px solid ${T.borderStrong}`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center',
      padding: '0 6px',
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        if (t.special) {
          return (
            <div key={t.id} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <button onClick={() => onChange && onChange(t.id)} style={{
                border: 'none', cursor: 'pointer', width: 52, height: 52, borderRadius: 18,
                background: T.amber, color: '#0D0D0D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 22px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
                transition: 'transform .15s',
              }}>
                <t.icon style={{ width: 26, height: 26 }} />
              </button>
            </div>
          );
        }
        const Iconfn = isActive && t.iconFill ? t.iconFill : t.icon;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '8px 4px', color: isActive ? T.amber : T.textDim,
            transition: 'color .15s',
          }}>
            <Iconfn />
            <span style={{ fontFamily: T.sans, fontSize: 10, fontWeight: 600, letterSpacing: 0.1 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Device frame — dark iPhone (390×844)
// ─────────────────────────────────────────────────────────────
function Phone({ children, statusBarTime = '9:41', showStatusBar = true }) {
  return (
    <div style={{
      width: 390, height: 844, borderRadius: 44, overflow: 'hidden',
      position: 'relative', background: T.bg,
      boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      fontFamily: T.sans, color: T.text,
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, borderRadius: 22, background: '#000', zIndex: 50,
      }} />
      {showStatusBar && <StatusBar time={statusBarTime} />}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {children}
      </div>
      {/* home indicator */}
      <div style={{
        position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
        width: 130, height: 4.5, borderRadius: 100,
        background: 'rgba(255,255,255,0.45)', zIndex: 60, pointerEvents: 'none',
      }} />
    </div>
  );
}

// Pill badge (used in detail screen)
function Pill({ icon, label, value, accent = false }) {
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

Object.assign(window, { Icon, StatusBar, BottomNav, Phone, Pill });
