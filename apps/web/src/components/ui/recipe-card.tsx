'use client';

import Link from 'next/link';
import { T } from '@/lib/tokens';
import type { Recipe } from '@/lib/data';
import { useFavorite } from '@/lib/use-favorite';
import { IconClock, IconSignal, IconBookmarkFill, IconClock as ClockSm, IconFlame } from './icons';

export function FeaturedCard({ recipe, favorited: initialFavorited }: { recipe: Recipe; favorited?: boolean }) {
  const { favorited, toggle } = useFavorite(recipe.id, initialFavorited);
  return (
    <Link data-testid="featured-card" href={`/receita/${recipe.id}`} style={{
      display: 'block', margin: '20px 24px 28px', borderRadius: 24, overflow: 'hidden',
      position: 'relative', height: 280,
      backgroundImage: `url(${recipe.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center',
      border: `1px solid ${T.borderStrong}`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
      textDecoration: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.92) 100%)',
      }} />
      <div style={{ position: 'absolute', top: 14, left: 14 }}>
        <div style={{
          padding: '6px 10px', borderRadius: 999,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)',
          border: `1px solid ${T.borderStrong}`,
          fontSize: 11, color: T.text, fontWeight: 600, letterSpacing: 0.3,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ color: T.amber }}>★</span> Receita da semana
        </div>
      </div>
      <button
        onClick={toggle}
        style={{
          position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 12,
          background: favorited ? T.amber : 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
          border: `1px solid ${favorited ? T.amber : T.borderStrong}`,
          color: favorited ? '#0D0D0D' : T.amber, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .2s',
        }}>
        <IconBookmarkFill style={{ width: 18, height: 18 }} />
      </button>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 18px' }}>
        <div data-testid="recipe-category" style={{ fontSize: 11, color: T.amber, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
          {recipe.category}
        </div>
        <div data-testid="recipe-name" style={{
          fontFamily: T.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1,
          color: T.text, marginBottom: 12, letterSpacing: -0.4,
        }}>{recipe.name}</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
          <span data-testid="recipe-time" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><IconClock /> {recipe.time_min} min</span>
          <span data-testid="recipe-difficulty" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><IconSignal /> {recipe.difficulty}</span>
        </div>
      </div>
    </Link>
  );
}

export function RecipeCard({ recipe, favorited: initialFavorited }: { recipe: Recipe; favorited?: boolean }) {
  const { favorited, toggle } = useFavorite(recipe.id, initialFavorited);
  return (
    <Link data-testid="recipe-card" href={`/receita/${recipe.id}`} style={{
      display: 'flex', borderRadius: 20, background: T.card, border: `1px solid ${T.border}`,
      padding: 10, gap: 14,
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      textDecoration: 'none',
    }}>
      <div style={{
        width: 104, height: 104, borderRadius: 14, flexShrink: 0,
        backgroundImage: `url(${recipe.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 4px 4px 0', minWidth: 0 }}>
        <div>
          <div data-testid="recipe-category" style={{ fontSize: 10.5, color: T.amber, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
            {recipe.category}
          </div>
          <div data-testid="recipe-name" style={{
            fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, color: T.text,
            lineHeight: 1.2, letterSpacing: -0.2,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}>{recipe.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: T.textMuted, fontWeight: 500, alignItems: 'center' }}>
          <span data-testid="recipe-time" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ClockSm style={{ width: 12, height: 12 }} /> {recipe.time_min} min</span>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: T.textDim }} />
          <span data-testid="recipe-difficulty" style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IconSignal style={{ width: 12, height: 12 }} /> {recipe.difficulty}</span>
        </div>
      </div>
      <button onClick={toggle} style={{
        border: 'none', cursor: 'pointer',
        width: 32, height: 32, borderRadius: 10, alignSelf: 'flex-start',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: favorited ? T.amberSoft : 'transparent',
        color: favorited ? T.amber : T.textDim,
        transition: 'all .2s',
      }}>
        <IconBookmarkFill style={{ width: 16, height: 16 }} />
      </button>
    </Link>
  );
}

export function MiniCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link data-testid="mini-card" href={`/receita/${recipe.id}`} style={{
      display: 'block', width: 168, flexShrink: 0, borderRadius: 18, overflow: 'hidden',
      position: 'relative', height: 220,
      backgroundImage: `url(${recipe.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center',
      border: `1px solid ${T.border}`,
      textDecoration: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 }}>
        <div data-testid="recipe-name" style={{
          fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.text,
          lineHeight: 1.15, marginBottom: 6,
        }}>{recipe.name}</div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10.5, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
          <span data-testid="recipe-time" style={{ display: 'flex', alignItems: 'center', gap: 3 }}><ClockSm style={{ width: 11, height: 11 }} /> {recipe.time_min}m</span>
          <span data-testid="recipe-calories" style={{ display: 'flex', alignItems: 'center', gap: 3 }}><IconFlame style={{ width: 11, height: 11 }} /> {recipe.calories} kcal</span>
        </div>
      </div>
    </Link>
  );
}
