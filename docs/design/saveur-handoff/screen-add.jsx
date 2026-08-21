// Saveur — Add Recipe screen

function AddScreen({ onBack }) {
  const T = window.SAVEUR_TOKENS;
  const [ingredients, setIngredients] = React.useState(['', '']);
  const [steps, setSteps] = React.useState(['', '']);
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('Jantar');
  const [time, setTime] = React.useState(30);
  const [portions, setPortions] = React.useState(4);
  const [difficulty, setDifficulty] = React.useState('Médio');
  const [notes, setNotes] = React.useState('');

  const cats = window.SAVEUR_CATEGORIES.map(c => c.name);
  const diffs = ['Fácil', 'Médio', 'Difícil'];

  return (
    <div style={{ height: '100%', background: T.bg, position: 'relative', overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 130 }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10, background: T.bg,
          padding: '54px 24px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={onBack} style={{
            width: 42, height: 42, borderRadius: 14, cursor: 'pointer',
            background: T.card, border: `1px solid ${T.border}`, color: T.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.back /></button>
          <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text }}>Nova receita</div>
          <button style={{
            padding: '0 16px', height: 42, borderRadius: 14, cursor: 'pointer',
            background: 'transparent', border: 'none', color: T.textMuted,
            fontFamily: T.sans, fontSize: 13, fontWeight: 600,
          }}>Rascunho</button>
        </div>

        {/* Photo upload */}
        <div style={{ padding: '4px 24px 0' }}>
          <div style={{
            height: 200, borderRadius: 22,
            background: T.card, border: `2px dashed rgba(255,255,255,0.1)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, cursor: 'pointer',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: T.amberSoft, border: `1px solid ${T.amberMid}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.amber,
            }}>
              <Icon.camera />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>Adicionar foto</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Mostre o prato finalizado</div>
            </div>
          </div>
        </div>

        {/* Name field */}
        <Field label="Nome da receita">
          <div style={{
            padding: '14px 16px', borderRadius: 14,
            background: T.card, border: `1px solid ${T.border}`,
          }}>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Ex.: Pasta al limone"
              style={{
                width: '100%', border: 'none', background: 'transparent', outline: 'none',
                color: T.text, fontFamily: T.display, fontSize: 22, fontWeight: 400,
                letterSpacing: -0.3,
              }} />
          </div>
        </Field>

        {/* Category */}
        <Field label="Categoria">
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {cats.map(c => {
              const active = c === category;
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
                  border: `1px solid ${active ? T.amber : T.border}`,
                  background: active ? T.amber : 'rgba(255,255,255,0.03)',
                  color: active ? '#0D0D0D' : T.textMuted,
                  fontFamily: T.sans, fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>{c}</button>
              );
            })}
          </div>
        </Field>

        {/* Time & portions */}
        <Field label="Detalhes">
          <div style={{ display: 'flex', gap: 10 }}>
            <Stepper icon={<Icon.clock />} label="Tempo" value={time} unit="min" onMinus={() => setTime(Math.max(5, time - 5))} onPlus={() => setTime(time + 5)} />
            <Stepper icon={<Icon.users />} label="Porções" value={portions} onMinus={() => setPortions(Math.max(1, portions - 1))} onPlus={() => setPortions(portions + 1)} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {diffs.map(d => {
              const active = d === difficulty;
              return (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  flex: 1, padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${active ? T.amberMid : T.border}`,
                  background: active ? T.amberSoft : 'rgba(255,255,255,0.03)',
                  color: active ? T.amber : T.textMuted,
                  fontFamily: T.sans, fontSize: 12.5, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Icon.signal style={{ width: 12, height: 12 }} />{d}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Ingredients */}
        <Field label="Ingredientes" subtitle="Liste tudo que vai usar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ingredients.map((ing, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 12,
                background: T.card, border: `1px solid ${T.border}`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  background: T.amberSoft, color: T.amber,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.sans, fontSize: 11, fontWeight: 700,
                }}>{i + 1}</div>
                <input value={ing}
                  onChange={e => setIngredients(arr => arr.map((v, j) => j === i ? e.target.value : v))}
                  placeholder={i === 0 ? 'Ex.: 200g de farinha' : 'Próximo ingrediente'}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    color: T.text, fontFamily: T.sans, fontSize: 14, fontWeight: 500,
                  }} />
                {ingredients.length > 1 && (
                  <button onClick={() => setIngredients(arr => arr.filter((_, j) => j !== i))} style={{
                    border: 'none', background: 'transparent', color: T.textDim, cursor: 'pointer',
                    width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                )}
              </div>
            ))}
            <button onClick={() => setIngredients(arr => [...arr, ''])} style={{
              padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent',
              border: `1px dashed rgba(232,160,32,0.4)`,
              color: T.amber, fontFamily: T.sans, fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon.plus style={{ width: 16, height: 16 }} /> Adicionar ingrediente
            </button>
          </div>
        </Field>

        {/* Steps */}
        <Field label="Modo de preparo" subtitle="Passo a passo, na ordem">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                padding: '14px 14px', borderRadius: 14,
                background: T.card, border: `1px solid ${T.border}`,
                display: 'flex', gap: 12,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                  background: T.amberSoft, border: `1px solid ${T.amberMid}`,
                  color: T.amber, fontFamily: T.display, fontSize: 15, fontWeight: 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontStyle: 'italic',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <textarea value={s}
                  onChange={e => setSteps(arr => arr.map((v, j) => j === i ? e.target.value : v))}
                  placeholder={i === 0 ? 'Descreva este passo…' : 'Próximo passo'}
                  rows={2}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    color: T.text, fontFamily: T.sans, fontSize: 13.5, fontWeight: 500,
                    resize: 'none', lineHeight: 1.5, padding: '4px 0',
                  }} />
              </div>
            ))}
            <button onClick={() => setSteps(arr => [...arr, ''])} style={{
              padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent', border: `1px dashed rgba(232,160,32,0.4)`,
              color: T.amber, fontFamily: T.sans, fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon.plus style={{ width: 16, height: 16 }} /> Adicionar passo
            </button>
          </div>
        </Field>

        {/* Notes */}
        <Field label="Notas pessoais" subtitle="Variações, lembretes, fontes…">
          <div style={{
            padding: '14px 16px', borderRadius: 14,
            background: T.card, border: `1px solid ${T.border}`,
          }}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Ex.: receita da minha avó, fica melhor com farinha 00…"
              rows={3}
              style={{
                width: '100%', border: 'none', background: 'transparent', outline: 'none',
                color: T.text, fontFamily: T.sans, fontSize: 14, fontWeight: 500,
                resize: 'none', lineHeight: 1.5,
              }} />
          </div>
        </Field>

        <div style={{ height: 20 }} />
      </div>

      {/* Save CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '20px 24px 28px',
        background: 'linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.95) 30%, rgba(13,13,13,1) 100%)',
        pointerEvents: 'none',
      }}>
        <button style={{
          width: '100%', height: 58, borderRadius: 18, cursor: 'pointer',
          background: T.amber, border: 'none', color: '#0D0D0D',
          fontFamily: T.sans, fontSize: 15.5, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 10px 30px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
          pointerEvents: 'auto',
        }}>
          <Icon.bookmarkFill style={{ width: 18, height: 18 }} />
          Salvar receita
        </button>
      </div>
    </div>
  );
}

function Field({ label, subtitle, children }) {
  const T = window.SAVEUR_TOKENS;
  return (
    <div style={{ padding: '24px 24px 0' }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: T.sans, fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
          textTransform: 'uppercase', color: T.amber, marginBottom: subtitle ? 4 : 0,
        }}>{label}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.textDim, fontWeight: 500 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function Stepper({ icon, label, value, unit, onMinus, onPlus }) {
  const T = window.SAVEUR_TOKENS;
  return (
    <div style={{
      flex: 1, padding: '12px 14px', borderRadius: 14,
      background: T.card, border: `1px solid ${T.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 8 }}>
        {icon}{label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onMinus} style={{
          width: 28, height: 28, borderRadius: 9, cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`,
          color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        <div style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, letterSpacing: -0.3 }}>
          {value}{unit && <span style={{ fontSize: 12, color: T.textMuted, marginLeft: 3 }}>{unit}</span>}
        </div>
        <button onClick={onPlus} style={{
          width: 28, height: 28, borderRadius: 9, cursor: 'pointer',
          background: T.amberSoft, border: `1px solid ${T.amberMid}`,
          color: T.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon.plus style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

window.AddScreen = AddScreen;
