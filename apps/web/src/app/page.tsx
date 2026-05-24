'use client';

import { useState } from 'react';
import { NavGuardProvider } from '@/components/ui/nav-guard-context';
import { BottomNav } from '@/components/ui/bottom-nav';
import { RECIPES, CATEGORIES } from '@/lib/data';
import { T } from '@/lib/tokens';
import { FeaturedCard, RecipeCard, MiniCard } from '@/components/ui/recipe-card';
import { IconSearch, IconBell } from '@/components/ui/icons';

export default function Root() {
  const [activeCat, setActiveCat] = useState('Todas');
  const cats = ['Todas', ...CATEGORIES.map(c => c.name)];
  const filtered = activeCat === 'Todas' ? RECIPES : RECIPES.filter(r => r.category === activeCat);

  return (
    <NavGuardProvider>
      <div style={{ position: 'relative', minHeight: '100dvh', background: T.bg }}>
        <div data-testid="home-screen" style={{ minHeight: '100dvh', overflowY: 'auto', overflowX: 'hidden', background: T.bg, paddingBottom: 110 }}>
          <div style={{ padding: '64px 24px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div data-testid="logo-mark" style={{
                  width: 40, height: 40, borderRadius: 14,
                  background: 'linear-gradient(135deg, #2a1f10, #1a1a1a)',
                  border: '1px solid rgba(232,160,32,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.amber, fontFamily: T.display, fontSize: 22, fontWeight: 400, fontStyle: 'italic',
                }}>S</div>
                <div>
                  <div data-testid="greeting-day" style={{ fontSize: 11, color: T.textDim, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Sexta-feira</div>
                  <div data-testid="greeting-name" style={{ fontSize: 13, color: T.textMuted, fontWeight: 500, marginTop: 1 }}>Olá, Mariana</div>
                </div>
              </div>
              <button style={{
                border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.03)',
                width: 40, height: 40, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: T.text, position: 'relative',
              }}>
                <IconBell />
                <span data-testid="notification-dot" style={{
                  position: 'absolute', top: 9, right: 10, width: 7, height: 7,
                  borderRadius: 4, background: T.amber, border: `1.5px solid ${T.bg}`,
                }} />
              </button>
            </div>

            <h1 style={{
              fontFamily: T.display, fontSize: 38, fontWeight: 400, lineHeight: 1.05,
              color: T.text, margin: 0, letterSpacing: -0.6,
            }}>
              O que vai<br />
              <span style={{ fontStyle: 'italic', color: T.amber }}>cozinhar</span> hoje?
            </h1>

            <div data-testid="search-bar" style={{
              marginTop: 22, height: 50, borderRadius: 16,
              background: T.card, border: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
            }}>
              <IconSearch style={{ color: T.textDim }} />
              <span style={{ fontSize: 14.5, color: T.textDim, fontWeight: 500, flex: 1 }}>Buscar receita, ingrediente…</span>
              <div style={{
                width: 32, height: 32, borderRadius: 10, background: T.amberSoft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.amber,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16M6 12h12M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div data-testid="category-chip-bar" className="scrollbar-hide" style={{ display: 'flex', gap: 8, padding: '0 24px 4px', overflowX: 'auto' }}>
            {cats.map(c => {
              const isActive = c === activeCat;
              const slug = c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
              return (
                <button
                  key={c}
                  data-testid={`category-chip-${slug}`}
                  data-active={isActive ? 'true' : 'false'}
                  onClick={() => setActiveCat(c)}
                  style={{
                    padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
                    border: `1px solid ${isActive ? T.amber : T.border}`,
                    background: isActive ? T.amber : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#0D0D0D' : T.textMuted,
                    fontFamily: T.sans, fontSize: 13, fontWeight: 600,
                    whiteSpace: 'nowrap', flexShrink: 0,
                    transition: 'all .15s',
                  }}
                >{c}</button>
              );
            })}
          </div>

          {RECIPES[0] && <FeaturedCard recipe={RECIPES[0]} />}

          <div data-testid="section-saved-recently" style={{ padding: '8px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, fontStyle: 'italic' }}>
                Salvas recentemente
              </div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{filtered.length} receitas na sua coleção</div>
            </div>
            <span style={{ fontSize: 12.5, color: T.amber, fontWeight: 600 }}>Ver todas →</span>
          </div>

          {filtered.slice(1, 5).length === 0 ? (
            <div data-testid="empty-state" style={{ padding: '32px 24px', textAlign: 'center', color: T.textDim, fontSize: 14, fontFamily: T.sans }}>
              Nenhuma receita encontrada nessa categoria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 24px' }}>
              {filtered.slice(1, 5).map(r => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}

          <div data-testid="section-tonight" style={{ padding: '32px 0 0' }}>
            <div style={{ padding: '0 24px 14px' }}>
              <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, fontStyle: 'italic' }}>
                Para hoje à noite
              </div>
            </div>
            <div className="scrollbar-hide" style={{ display: 'flex', gap: 12, padding: '0 24px', overflowX: 'auto' }}>
              {RECIPES.slice(2).map(r => (
                <MiniCard key={r.id} recipe={r} />
              ))}
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </NavGuardProvider>
  );
}
