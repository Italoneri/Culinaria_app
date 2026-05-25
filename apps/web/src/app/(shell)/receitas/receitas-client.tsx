'use client';

import { useState } from 'react';
import { T } from '@/lib/tokens';
import { RecipeCard } from '@/components/ui/recipe-card';
import { IconSearch } from '@/components/ui/icons';
import type { Recipe, Category } from '@/lib/data';

type Props = {
  recipes: Recipe[];
  categories: Category[];
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-');
}

export function ReceitasClient({ recipes, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryNames = ['Todas', ...categories.map(c => c.name)];

  const filteredRecipes = recipes
    .filter(r => selectedCategory === 'Todas' || r.category === selectedCategory)
    .filter(r => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div
      data-testid="receitas-screen"
      style={{
        minHeight: '100dvh',
        overflowY: 'auto',
        overflowX: 'hidden',
        background: T.bg,
        paddingBottom: 110,
      }}
    >
      <div style={{ padding: '64px 24px 20px' }}>
        <h1 style={{
          fontFamily: T.display,
          fontSize: 34,
          fontWeight: 400,
          color: T.text,
          margin: '0 0 20px',
          letterSpacing: -0.5,
          fontStyle: 'italic',
        }}>
          Receitas
        </h1>

        <div style={{
          height: 50,
          borderRadius: 16,
          background: T.card,
          border: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 10,
        }}>
          <IconSearch style={{ color: T.textDim, flexShrink: 0 }} />
          <input
            data-testid="search-input"
            type="text"
            placeholder="Buscar receita…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14.5,
              color: T.text,
              fontFamily: T.sans,
              fontWeight: 500,
            }}
          />
        </div>
      </div>

      <div
        className="scrollbar-hide"
        style={{
          display: 'flex',
          gap: 8,
          padding: '0 24px 20px',
          overflowX: 'auto',
        }}
      >
        {categoryNames.map(name => {
          const isActive = name === selectedCategory;
          const slug = toSlug(name);
          return (
            <button
              key={name}
              data-testid={`category-chip-${slug}`}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => setSelectedCategory(name)}
              style={{
                padding: '10px 16px',
                borderRadius: 999,
                cursor: 'pointer',
                border: `1px solid ${isActive ? T.amber : T.border}`,
                background: isActive ? T.amber : 'rgba(255,255,255,0.03)',
                color: isActive ? '#0D0D0D' : T.textMuted,
                fontFamily: T.sans,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all .15s',
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {filteredRecipes.length === 0 ? (
        <div
          data-testid="empty-state"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: T.textDim,
            fontSize: 14,
            fontFamily: T.sans,
            lineHeight: 1.6,
          }}
        >
          Nenhuma receita encontrada.
        </div>
      ) : (
        <div
          data-testid="recipe-list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            padding: '0 24px',
          }}
        >
          {filteredRecipes.map(r => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}
