// Saveur — Home Feed screen

function HomeScreen({ onOpenRecipe, onTabChange }) {
  const T = window.SAVEUR_TOKENS;
  const [activeCat, setActiveCat] = React.useState('Todas');
  const cats = ['Todas', ...window.SAVEUR_CATEGORIES.map(c => c.name)];
  const recipes = window.SAVEUR_RECIPES;
  const filtered = activeCat === 'Todas' ? recipes : recipes.filter(r => r.category === activeCat);

  return (
    <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', background: T.bg, paddingBottom: 110 }}>
      {/* Hero */}
      <div style={{ padding: '64px 24px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 14,
              background: 'linear-gradient(135deg, #2a1f10, #1a1a1a)',
              border: '1px solid rgba(232,160,32,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.amber, fontFamily: T.display, fontSize: 22, fontWeight: 400, fontStyle: 'italic',
            }}>S</div>
            <div>
              <div style={{ fontSize: 11, color: T.textDim, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>Sexta-feira</div>
              <div style={{ fontSize: 13, color: T.textMuted, fontWeight: 500, marginTop: 1 }}>Olá, Mariana</div>
            </div>
          </div>
          <button style={{
            border: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.03)',
            width: 40, height: 40, borderRadius: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.text, position: 'relative',
          }}>
            <Icon.bell />
            <span style={{
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

        {/* Search */}
        <div style={{
          marginTop: 22, height: 50, borderRadius: 16,
          background: T.card, border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
        }}>
          <Icon.search style={{ color: T.textDim }} />
          <span style={{ fontSize: 14.5, color: T.textDim, fontWeight: 500, flex: 1 }}>Buscar receita, ingrediente…</span>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: T.amberSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.amber,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M6 12h12M9 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 24px 4px', overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        {cats.map(c => {
          const isActive = c === activeCat;
          return (
            <button key={c} onClick={() => setActiveCat(c)} style={{
              padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
              border: `1px solid ${isActive ? T.amber : T.border}`,
              background: isActive ? T.amber : 'rgba(255,255,255,0.03)',
              color: isActive ? '#0D0D0D' : T.textMuted,
              fontFamily: T.sans, fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all .15s',
            }}>{c}</button>
          );
        })}
      </div>

      {/* Featured hero card — first recipe */}
      <FeaturedCard recipe={recipes[0]} onClick={() => onOpenRecipe(recipes[0])} />

      {/* Section header */}
      <div style={{
        padding: '8px 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      }}>
        <div>
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, fontStyle: 'italic' }}>
            Salvas recentemente
          </div>
          <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{filtered.length} receitas na sua coleção</div>
        </div>
        <span style={{ fontSize: 12.5, color: T.amber, fontWeight: 600 }}>Ver todas →</span>
      </div>

      {/* Recipe cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 24px' }}>
        {filtered.slice(1, 5).map(r => (
          <RecipeCard key={r.id} recipe={r} onClick={() => onOpenRecipe(r)} />
        ))}
      </div>

      {/* "Chefs' picks" mini scroll */}
      <div style={{ padding: '32px 0 0' }}>
        <div style={{ padding: '0 24px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, fontStyle: 'italic' }}>
            Para hoje à noite
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '0 24px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {recipes.slice(2).map(r => (
            <MiniCard key={r.id} recipe={r} onClick={() => onOpenRecipe(r)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ recipe, onClick }) {
  const T = window.SAVEUR_TOKENS;
  return (
    <div onClick={onClick} style={{
      margin: '20px 24px 28px', borderRadius: 24, overflow: 'hidden',
      position: 'relative', height: 280, cursor: 'pointer',
      backgroundImage: `url(${recipe.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
      border: `1px solid ${T.borderStrong}`,
      boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
    }}>
      {/* gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.92) 100%)',
      }} />
      {/* Top badge */}
      <div style={{
        position: 'absolute', top: 14, left: 14, display: 'flex', gap: 6,
      }}>
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
      {/* Save button */}
      <button style={{
        position: 'absolute', top: 14, right: 14, width: 38, height: 38, borderRadius: 12,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
        border: `1px solid ${T.borderStrong}`, color: T.amber, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} onClick={e => e.stopPropagation()}>
        <Icon.bookmarkFill style={{ width: 18, height: 18 }} />
      </button>
      {/* Bottom content */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px 18px' }}>
        <div style={{ fontSize: 11, color: T.amber, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
          {recipe.category}
        </div>
        <div style={{
          fontFamily: T.display, fontSize: 26, fontWeight: 400, lineHeight: 1.1,
          color: T.text, marginBottom: 12, letterSpacing: -0.4,
        }}>{recipe.name}</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon.clock /> {recipe.time} min</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon.signal /> {recipe.difficulty}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Icon.users /> {recipe.portions}</span>
        </div>
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onClick }) {
  const T = window.SAVEUR_TOKENS;
  return (
    <div onClick={onClick} style={{
      borderRadius: 20, background: T.card, border: `1px solid ${T.border}`,
      padding: 10, display: 'flex', gap: 14, cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
    }}>
      <div style={{
        width: 104, height: 104, borderRadius: 14, flexShrink: 0,
        backgroundImage: `url(${recipe.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 4px 4px 0', minWidth: 0 }}>
        <div>
          <div style={{ fontSize: 10.5, color: T.amber, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
            {recipe.category}
          </div>
          <div style={{
            fontFamily: T.sans, fontSize: 15.5, fontWeight: 700, color: T.text,
            lineHeight: 1.2, letterSpacing: -0.2,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>{recipe.name}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: T.textMuted, fontWeight: 500, alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon.clock style={{ width: 12, height: 12 }} /> {recipe.time} min</span>
          <span style={{ width: 3, height: 3, borderRadius: 2, background: T.textDim }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon.signal style={{ width: 12, height: 12 }} /> {recipe.difficulty}</span>
        </div>
      </div>
      <button onClick={e => e.stopPropagation()} style={{
        border: 'none', background: 'transparent', color: T.amber, cursor: 'pointer',
        width: 32, height: 32, borderRadius: 10, alignSelf: 'flex-start',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon.bookmarkFill style={{ width: 16, height: 16 }} />
      </button>
    </div>
  );
}

function MiniCard({ recipe, onClick }) {
  const T = window.SAVEUR_TOKENS;
  return (
    <div onClick={onClick} style={{
      width: 168, flexShrink: 0, borderRadius: 18, overflow: 'hidden',
      position: 'relative', height: 220, cursor: 'pointer',
      backgroundImage: `url(${recipe.img})`, backgroundSize: 'cover', backgroundPosition: 'center',
      border: `1px solid ${T.border}`,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)',
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 14 }}>
        <div style={{
          fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.text,
          lineHeight: 1.15, marginBottom: 6,
        }}>{recipe.name}</div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10.5, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon.clock style={{ width: 11, height: 11 }} /> {recipe.time}m</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Icon.flame style={{ width: 11, height: 11 }} /> {recipe.calories} kcal</span>
        </div>
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
