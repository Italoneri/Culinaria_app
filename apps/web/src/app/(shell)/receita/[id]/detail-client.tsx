'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Recipe } from '@/lib/data';
import { useFavorite } from '@/lib/use-favorite';
import { T } from '@/lib/tokens';
import { Pill } from '@/components/ui/pill';
import {
  IconBack, IconShare, IconBookmarkFill, IconClock,
  IconUsers, IconFlame, IconSignal, IconCheck,
} from '@/components/ui/icons';

type Tab = 'ingredients' | 'steps';

export function DetailClient({ recipe, favorited: initialFavorited }: { recipe: Recipe; favorited?: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [tab, setTab] = useState<Tab>('ingredients');
  const { favorited, toggle } = useFavorite(recipe.id, initialFavorited);

  const toggleCheck = (i: number) => setChecked(c => ({ ...c, [i]: !c[i] }));

  return (
    <div data-testid="detail-screen" style={{ minHeight: '100dvh', background: T.bg, position: 'relative' }}>
      <div style={{ overflowY: 'auto', paddingBottom: 110 }}>
        {/* Hero */}
        <div data-testid="detail-hero" style={{
          position: 'relative', height: 380,
          backgroundImage: `url(${recipe.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 30%, rgba(13,13,13,0) 60%, rgba(13,13,13,1) 100%)',
          }} />
          <div style={{ position: 'absolute', top: 54, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 18px' }}>
            <button data-testid="btn-back" onClick={() => router.back()} style={{
              width: 42, height: 42, borderRadius: 14,
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
              border: `1px solid ${T.borderStrong}`, color: T.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><IconBack /></button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button data-testid="btn-share" style={{
                width: 42, height: 42, borderRadius: 14,
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
                border: `1px solid ${T.borderStrong}`, color: T.text,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><IconShare /></button>
              <button data-testid="btn-bookmark" data-saved={favorited ? 'true' : 'false'} onClick={toggle} style={{
                width: 42, height: 42, borderRadius: 14,
                background: T.amber, border: 'none', color: '#0D0D0D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(232,160,32,0.4)',
              }}><IconBookmarkFill /></button>
            </div>
          </div>
          <div data-testid="detail-category-badge" style={{
            position: 'absolute', bottom: 64, left: 24,
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
            border: `1px solid ${T.borderStrong}`,
            fontSize: 11, color: T.amber, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
          }}>{recipe.category}</div>
        </div>

        {/* Title */}
        <div style={{ padding: '0 24px', marginTop: -20, position: 'relative', zIndex: 2 }}>
          <h1 data-testid="detail-title" style={{
            fontFamily: T.display, fontSize: 32, fontWeight: 400,
            color: T.text, margin: 0, lineHeight: 1.05, letterSpacing: -0.5,
          }}>{recipe.name}</h1>
          <p data-testid="detail-description" style={{
            fontFamily: T.sans, fontSize: 14, color: T.textMuted,
            lineHeight: 1.55, margin: '12px 0 0', fontWeight: 500,
          }}>{recipe.description}</p>
        </div>

        {/* Stat pills */}
        <div style={{ display: 'flex', gap: 8, padding: '22px 24px 0' }}>
          <div data-testid="pill-tempo" data-accent="true">
            <Pill icon={<IconClock />} label="Tempo" value={`${recipe.time_min}m`} accent />
          </div>
          <div data-testid="pill-porções">
            <Pill icon={<IconUsers />} label="Porções" value={recipe.portions} />
          </div>
          <div data-testid="pill-kcal">
            <Pill icon={<IconFlame />} label="kcal" value={recipe.calories ?? '—'} />
          </div>
          <div data-testid="pill-nível">
            <Pill icon={<IconSignal />} label="Nível" value={recipe.difficulty} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          margin: '26px 24px 0', padding: 4, borderRadius: 14,
          background: T.card, border: `1px solid ${T.border}`,
          display: 'flex', gap: 4,
        }}>
          {([
            { id: 'ingredients' as Tab, label: `Ingredientes · ${recipe.ingredients.length}`, testid: 'tab-ingredients' },
            { id: 'steps' as Tab, label: `Passos · ${recipe.steps.length}`, testid: 'tab-steps' },
          ]).map(t => (
            <button key={t.id} data-testid={t.testid} data-active={tab === t.id ? 'true' : 'false'} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 8px', borderRadius: 10,
              border: 'none',
              background: tab === t.id ? T.amber : 'transparent',
              color: tab === t.id ? '#0D0D0D' : T.textMuted,
              fontFamily: T.sans, fontSize: 12.5, fontWeight: 700,
              transition: 'all .15s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'ingredients' ? (
          <div data-testid="ingredients-list" style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recipe.ingredients.map((ing, i) => (
              <div data-testid="ingredient-item" key={i} onClick={() => toggleCheck(i)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', borderRadius: 14,
                background: T.card, border: `1px solid ${T.border}`,
                cursor: 'pointer',
              }}>
                <div data-testid="ingredient-checkbox" data-checked={checked[i] ? 'true' : 'false'} style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  border: `1.5px solid ${checked[i] ? T.amber : 'rgba(255,255,255,0.2)'}`,
                  background: checked[i] ? T.amber : 'transparent',
                  color: '#0D0D0D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .15s',
                }}>
                  {checked[i] && <IconCheck style={{ width: 12, height: 12 }} />}
                </div>
                <span data-testid="ingredient-text" style={{
                  fontFamily: T.sans, fontSize: 14.5, fontWeight: 500,
                  color: checked[i] ? T.textDim : T.text,
                  textDecoration: checked[i] ? 'line-through' : 'none',
                  transition: 'all .15s',
                }}>{ing}</span>
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="steps-list" style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recipe.steps.map((s, i) => (
              <div data-testid="step-item" key={i} style={{
                padding: '18px', borderRadius: 18,
                background: T.card, border: `1px solid ${T.border}`,
                display: 'flex', gap: 14,
              }}>
                <div data-testid="step-number" style={{
                  width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                  background: T.amberSoft, border: `1px solid ${T.amberMid}`,
                  color: T.amber, fontFamily: T.display, fontSize: 18, fontWeight: 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontStyle: 'italic',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div data-testid="step-title" style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                    {s.title}
                  </div>
                  <div data-testid="step-description" style={{ fontFamily: T.sans, fontSize: 13.5, color: T.textMuted, lineHeight: 1.5, fontWeight: 500 }}>
                    {s.body}
                  </div>
                  {s.tip && (
                    <div data-testid="chef-tip" style={{
                      marginTop: 12, padding: '12px 14px', borderRadius: 12,
                      background: T.amberSoft, border: `1px solid ${T.amberMid}`,
                      display: 'flex', gap: 10,
                    }}>
                      <div style={{ color: T.amber, flexShrink: 0, marginTop: 1 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3zM10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: T.amber, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>Dica do chef</div>
                        <div style={{ fontFamily: T.sans, fontSize: 13, color: T.text, lineHeight: 1.5, fontWeight: 500 }}>{s.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '20px 24px 28px', maxWidth: 412, margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.95) 30%, rgba(13,13,13,1) 100%)',
      }}>
        <button style={{
          width: '100%', height: 58, borderRadius: 18,
          background: T.amber, border: 'none', color: '#0D0D0D',
          fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, letterSpacing: -0.1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 10px 30px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          Iniciar preparo
          <span data-testid="cta-time" style={{ marginLeft: 'auto', fontSize: 12, opacity: 0.7, fontWeight: 600 }}>{recipe.time_min}m</span>
        </button>
      </div>
    </div>
  );
}
