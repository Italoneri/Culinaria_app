'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RECIPES } from '@/lib/data';
import { T } from '@/lib/tokens';
import { IconClock, IconChevron, IconHeart, IconPencil } from '@/components/ui/icons';

const COLLECTIONS = [
  { name: 'Jantar romântico', count: 8, emoji: '🍷' },
  { name: 'Receitas da vovó', count: 14, emoji: '🥧' },
  { name: 'Quick & Easy', count: 22, emoji: '⚡' },
  { name: 'Saudáveis', count: 11, emoji: '🥗' },
  { name: 'Italianas', count: 9, emoji: '🍝' },
];

export default function ProfileScreen() {
  const favorites = RECIPES.slice(0, 4);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState('Mariana Silva');
  const [editBio, setEditBio] = useState('Cozinheira amadora apaixonada por massas, pães e tudo que leva manteiga ✦');
  const [editCity, setEditCity] = useState('São Paulo');
  const [nameError, setNameError] = useState('');

  const handleSave = () => {
    if (!editName.trim()) { setNameError('Nome é obrigatório'); return; }
    setNameError('');
    setEditMode(false);
  };

  return (
    <div data-testid="profile-screen" style={{ minHeight: '100dvh', overflowY: 'auto', overflowX: 'hidden', background: T.bg, paddingBottom: 110 }}>
      {/* Top bar */}
      <div style={{ padding: '54px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{
          width: 40, height: 40, borderRadius: 13,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
          color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.textMuted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Perfil</div>
        <button data-testid="btn-edit-profile" onClick={() => setEditMode(e => !e)} style={{
          width: 40, height: 40, borderRadius: 13,
          background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`,
          color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconPencil style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Avatar */}
      <div style={{ padding: '28px 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div data-testid="profile-avatar" style={{ position: 'relative', width: 96, height: 96 }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            backgroundImage: 'url(https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop)',
            backgroundSize: 'cover', backgroundPosition: 'center',
            border: `2px solid ${T.amberMid}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          }} />
          <div data-testid="avatar-ring" style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: `1px solid ${T.amberSoft}`, pointerEvents: 'none',
          }} />
          <button data-testid="btn-change-avatar" style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 32, height: 32, borderRadius: 12, cursor: 'pointer',
            background: T.amber, border: `3px solid ${T.bg}`, color: '#0D0D0D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(232,160,32,0.4)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 8a2 2 0 012-2h2l1.5-2h5L16 6h2a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        {editMode ? (
          <div style={{ width: '100%', maxWidth: 300, marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input data-testid="edit-name" value={editName} onChange={e => setEditName(e.target.value)}
              style={{ background: T.card, border: `1px solid ${nameError ? T.amber : T.border}`, borderRadius: 12, padding: '10px 14px', color: T.text, fontFamily: T.sans, fontSize: 16, fontWeight: 600, width: '100%', outline: 'none' }} />
            {nameError && <div data-testid="error-edit-name" style={{ fontSize: 12, color: T.amber, fontWeight: 600 }}>{nameError}</div>}
            <input data-testid="edit-city" value={editCity} onChange={e => setEditCity(e.target.value)}
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 14px', color: T.text, fontFamily: T.sans, fontSize: 14, width: '100%', outline: 'none' }} />
            <textarea data-testid="edit-bio" value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: '10px 14px', color: T.text, fontFamily: T.sans, fontSize: 13, width: '100%', outline: 'none', resize: 'none' }} />
            <button onClick={handleSave} style={{
              background: T.amber, border: 'none', borderRadius: 12, padding: '12px', color: '#0D0D0D',
              fontFamily: T.sans, fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Salvar</button>
          </div>
        ) : (
          <>
            <div data-testid="profile-name" style={{
              fontFamily: T.display, fontSize: 30, fontWeight: 400, fontStyle: 'italic',
              color: T.text, letterSpacing: -0.5, marginTop: 18, lineHeight: 1.1,
            }}>{editName}</div>
            <div data-testid="profile-email" style={{ fontSize: 13, color: T.textMuted, marginTop: 4, fontWeight: 500 }}>
              mariana@saveur.app · <span data-testid="profile-city">{editCity}</span>
            </div>
            <div data-testid="profile-bio" style={{
              fontSize: 12.5, color: T.textDim, marginTop: 10, fontWeight: 500,
              textAlign: 'center', lineHeight: 1.5, maxWidth: 280,
            }}>{editBio}</div>
          </>
        )}

        {/* Premium badge */}
        <div data-testid="premium-badge" style={{
          marginTop: 16, padding: '6px 12px', borderRadius: 999,
          background: T.amberSoft, border: `1px solid ${T.amberMid}`,
          display: 'flex', alignItems: 'center', gap: 6,
          color: T.amber, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z"/></svg>
          Membro Premium
        </div>
      </div>

      {/* Stats */}
      <div style={{ padding: '28px 24px 0', display: 'flex', gap: 10 }}>
        <StatCard value="12" label="Receitas criadas" testid="stat-created" />
        <StatCard value="28" label="Favoritas" accent testid="stat-favorites" />
        <StatCard value="47" label="Cozinhadas" testid="stat-cooked" />
      </div>

      {/* Favorites */}
      <div style={{ padding: '32px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div data-testid="favorites-heading">
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, fontStyle: 'italic', letterSpacing: -0.3 }}>Minhas favoritas</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Receitas que você ama cozinhar</div>
        </div>
        <span style={{ fontSize: 12.5, color: T.amber, fontWeight: 600 }}>Ver todas →</span>
      </div>

      <div data-testid="favorites-grid" style={{ padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {favorites.map(r => (
          <Link data-testid="favorite-card" key={r.id} href={`/receita/${r.id}`} style={{
            borderRadius: 18, overflow: 'hidden', textDecoration: 'none',
            background: T.card, border: `1px solid ${T.border}`,
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              height: 130, position: 'relative',
              backgroundImage: `url(${r.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)' }} />
              <button onClick={e => e.preventDefault()} style={{
                position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 10,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)', color: T.amber, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <IconHeart style={{ width: 14, height: 14 }} />
              </button>
            </div>
            <div style={{ padding: '10px 12px 12px' }}>
              <div style={{
                fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.text,
                lineHeight: 1.25, letterSpacing: -0.1,
                overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                minHeight: 32,
              } as React.CSSProperties}>{r.name}</div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.textMuted, fontWeight: 500 }}>
                <IconClock style={{ width: 11, height: 11 }} />
                {r.time} min
                <span style={{ width: 3, height: 3, borderRadius: 2, background: T.textDim, margin: '0 2px' }} />
                <span style={{ color: T.amber }}>{r.difficulty}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Collections */}
      <div style={{ padding: '32px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, fontStyle: 'italic', letterSpacing: -0.3 }}>Coleções</div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{COLLECTIONS.length} listas personalizadas</div>
        </div>
        <span style={{ fontSize: 12.5, color: T.amber, fontWeight: 600 }}>+ Nova</span>
      </div>

      <div data-testid="collections-scroll" className="scrollbar-hide" style={{ display: 'flex', gap: 10, padding: '0 24px 8px', overflowX: 'auto' }}>
        {COLLECTIONS.map(c => (
          <div data-testid="collection-chip" key={c.name} style={{
            flexShrink: 0, padding: '12px 16px', borderRadius: 16,
            background: T.card, border: `1px solid ${T.border}`,
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', minHeight: 56,
          }}>
            <div data-testid="collection-emoji" style={{
              width: 34, height: 34, borderRadius: 11, flexShrink: 0,
              background: 'rgba(232,160,32,0.1)', border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>{c.emoji}</div>
            <div>
              <div data-testid="collection-name" style={{ fontFamily: T.sans, fontSize: 13, fontWeight: 700, color: T.text, letterSpacing: -0.1 }}>
                {c.name}
              </div>
              <div data-testid="collection-count" style={{ fontSize: 11, color: T.textDim, fontWeight: 500, marginTop: 1 }}>
                {c.count} receitas
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Journey card */}
      <div style={{ padding: '28px 24px 0' }}>
        <div data-testid="journey-card" style={{
          padding: '16px 18px', borderRadius: 18,
          background: T.card, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: T.amberSoft, border: `1px solid ${T.amberMid}`,
            color: T.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Sua jornada culinária</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Veja sua atividade da semana</div>
          </div>
          <IconChevron style={{ color: T.textDim }} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, accent, testid }: { value: string; label: string; accent?: boolean; testid: string }) {
  return (
    <div data-testid={testid} data-accent={accent ? 'true' : undefined} style={{
      flex: 1, padding: '16px 12px', borderRadius: 18,
      background: accent ? T.amberSoft : T.card,
      border: `1px solid ${accent ? T.amberMid : T.border}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
    }}>
      <div style={{
        fontFamily: T.display, fontSize: 30, fontWeight: 400,
        color: accent ? T.amber : T.text, letterSpacing: -0.5, lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: 10.5, color: accent ? T.amber : T.textMuted, fontWeight: 600,
        letterSpacing: 0.3, textTransform: 'uppercase', textAlign: 'center',
      }}>{label}</div>
    </div>
  );
}
