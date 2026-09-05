'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES, DIFFICULTIES } from '@/lib/data';
import type { RecipeCategory, Difficulty } from '@/lib/data';
import { T } from '@/lib/tokens';
import { useNavGuard } from '@/components/ui/nav-guard-context';
import { useAuth } from '@/lib/auth-context';
import { createRecipe } from '@/lib/actions';
import { uploadImage, isSupportedImage, UnsupportedImageError } from '@/lib/supabase';
import { IconBack, IconPlus, IconClock, IconUsers, IconSignal, IconCamera, IconBookmarkFill } from '@/components/ui/icons';

const DIFFS = DIFFICULTIES;
const DRAFT_KEY = 'saveur:draft:new-recipe';

type Draft = {
  name: string;
  category: RecipeCategory;
  time: number;
  portions: number;
  difficulty: Difficulty;
  notes: string;
  ingredients: string[];
  steps: string[];
};

export default function AddScreen() {
  const router = useRouter();
  const { registerGuard, unregisterGuard } = useNavGuard();
  const { session } = useAuth();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Jantar');
  const [time, setTime] = useState(30);
  const [portions, setPortions] = useState(4);
  const [difficulty, setDifficulty] = useState<Difficulty>('Médio');
  const [notes, setNotes] = useState('');
  const [ingredients, setIngredients] = useState(['', '']);
  const [steps, setSteps] = useState(['', '']);
  const [errors, setErrors] = useState<{ name?: string; ingredients?: string; steps?: string }>({});
  const [discardDialog, setDiscardDialog] = useState<{ open: boolean; pendingHref?: string }>({ open: false });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [photo, setPhoto] = useState<{ file: File; preview: string } | null>(null);
  const photoInput = useRef<HTMLInputElement>(null);

  const cats = CATEGORIES.map(c => c.name);

  const isDirty = useCallback(() => {
    return (
      name.trim() !== '' ||
      notes.trim() !== '' ||
      ingredients.some(i => i.trim() !== '') ||
      steps.some(s => s.trim() !== '')
    );
  }, [name, notes, ingredients, steps]);

  // Restaura rascunho salvo localmente
  useEffect(() => {
    const stored = localStorage.getItem(DRAFT_KEY);
    if (!stored) return;
    try {
      const draft = JSON.parse(stored) as Draft;
      setName(draft.name);
      setCategory(draft.category);
      setTime(draft.time);
      setPortions(draft.portions);
      setDifficulty(draft.difficulty);
      setNotes(draft.notes);
      setIngredients(draft.ingredients);
      setSteps(draft.steps);
    } catch {
      localStorage.removeItem(DRAFT_KEY); // rascunho corrompido não trava a tela
    }
  }, []);

  // Register nav guard — shows dialog if form is dirty, allows nav if clean
  useEffect(() => {
    registerGuard((targetHref: string) => {
      if (!isDirty()) return true;
      setDiscardDialog({ open: true, pendingHref: targetHref });
      return false;
    });
    return () => unregisterGuard();
  }, [registerGuard, unregisterGuard, isDirty]);

  const handleBack = () => {
    if (isDirty()) {
      setDiscardDialog({ open: true });
    } else {
      router.back();
    }
  };

  const handleDiscardConfirm = () => {
    setDiscardDialog({ open: false });
    if (discardDialog.pendingHref) {
      router.push(discardDialog.pendingHref);
    } else {
      router.back();
    }
  };

  const saveDraft = () => {
    const draft: Draft = { name, category, time, portions, difficulty, notes, ingredients, steps };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  const handleSaveDraft = () => {
    saveDraft();
    setDiscardDialog({ open: false });
    if (discardDialog.pendingHref) {
      unregisterGuard();
      router.push(discardDialog.pendingHref);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite reescolher o mesmo arquivo
    if (!file) return;
    if (!isSupportedImage(file)) {
      setSaveError(new UnsupportedImageError().message);
      return;
    }
    setSaveError('');
    setPhoto(current => {
      if (current) URL.revokeObjectURL(current.preview);
      return { file, preview: URL.createObjectURL(file) };
    });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Nome é obrigatório';
    if (ingredients.filter(i => i.trim()).length === 0) e.ingredients = 'Adicione pelo menos um ingrediente';
    if (steps.filter(s => s.trim()).length === 0) e.steps = 'Adicione pelo menos um passo';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    if (!session) { router.push('/auth/login?redirect=/adicionar'); return; }

    setSaving(true);
    setSaveError('');

    // O id é gerado aqui para que a foto já suba sob o path definitivo
    const id = crypto.randomUUID();

    try {
      const img_url = photo ? await uploadImage(photo.file, 'recipes', id) : undefined;

      const result = await createRecipe({
        id,
        name: name.trim(),
        category,
        time_min: time,
        difficulty,
        portions,
        notes: notes.trim() || undefined,
        img_url,
        is_public: false,
        ingredients: ingredients.filter(i => i.trim()),
        steps: steps
          .filter(s => s.trim())
          .map((s, i) => ({ title: `Passo ${i + 1}`, body: s.trim() })),
      });

      if (!result.ok) { setSaveError(result.error); return; }

      localStorage.removeItem(DRAFT_KEY);
      unregisterGuard();
      router.push(`/receita/${result.data}`);
    } catch (error) {
      setSaveError(error instanceof UnsupportedImageError
        ? error.message
        : 'Não foi possível enviar a foto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="add-screen" style={{ minHeight: '100dvh', background: T.bg, position: 'relative' }}>
      <div style={{ overflowY: 'auto', paddingBottom: 130 }}>
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10, background: T.bg,
          padding: '54px 24px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button data-testid="btn-back" onClick={handleBack} style={{
            width: 42, height: 42, borderRadius: 14,
            background: T.card, border: `1px solid ${T.border}`, color: T.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconBack /></button>
          <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 700, color: T.text }}>Nova receita</div>
          <button onClick={saveDraft} style={{
            padding: '0 16px', height: 42, borderRadius: 14,
            background: 'transparent', border: 'none', color: T.textMuted,
            fontFamily: T.sans, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Rascunho</button>
        </div>

        {/* Photo upload */}
        <div style={{ padding: '4px 24px 0' }}>
          <input
            ref={photoInput}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          <div
            data-testid="photo-upload-area"
            onClick={() => photoInput.current?.click()}
            style={{
              height: 200, borderRadius: 22,
              background: photo ? `center / cover no-repeat url(${photo.preview})` : T.card,
              border: '2px dashed rgba(255,255,255,0.1)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12, cursor: 'pointer', position: 'relative', overflow: 'hidden',
            }}>
            {photo && <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,13,13,0.55)' }} />}
            <div style={{
              width: 56, height: 56, borderRadius: 18, zIndex: 1,
              background: T.amberSoft, border: `1px solid ${T.amberMid}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.amber,
            }}>
              <IconCamera />
            </div>
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: T.text }}>
                {photo ? 'Trocar foto' : 'Adicionar foto'}
              </div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>
                {photo ? photo.file.name : 'Mostre o prato finalizado'}
              </div>
            </div>
          </div>
        </div>

        {/* Name */}
        <Field label="Nome da receita">
          <div style={{ padding: '14px 16px', borderRadius: 14, background: T.card, border: `1px solid ${errors.name ? T.amber : T.border}` }}>
            <input
              data-testid="input-recipe-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex.: Pasta al limone"
              style={{
                width: '100%', border: 'none', background: 'transparent', outline: 'none',
                color: T.text, fontFamily: T.display, fontSize: 22, fontWeight: 400, letterSpacing: -0.3,
              }}
            />
          </div>
          {errors.name && <div data-testid="error-recipe-name" style={{ fontSize: 12, color: T.amber, marginTop: 6, fontWeight: 600 }}>{errors.name}</div>}
        </Field>

        {/* Category */}
        <Field label="Categoria">
          <div className="scrollbar-hide" style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {cats.map(c => {
              const active = c === category;
              const slug = c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-');
              return (
                <button
                  key={c}
                  data-testid={`category-chip-${slug}`}
                  data-active={active ? 'true' : 'false'}
                  onClick={() => setCategory(c)}
                  style={{
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
            <Stepper
              icon={<IconClock />}
              label="Tempo"
              value={time}
              unit="min"
              testidValue="stepper-time-value"
              testidPlus="stepper-time-plus"
              testidMinus="stepper-time-minus"
              onMinus={() => setTime(t => Math.max(5, t - 5))}
              onPlus={() => setTime(t => t + 5)}
            />
            <Stepper
              icon={<IconUsers />}
              label="Porções"
              value={portions}
              testidValue="stepper-portions-value"
              testidPlus="stepper-portions-plus"
              testidMinus="stepper-portions-minus"
              onMinus={() => setPortions(p => Math.max(1, p - 1))}
              onPlus={() => setPortions(p => p + 1)}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {DIFFS.map(d => {
              const active = d === difficulty;
              const slug = d.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
              return (
                <button key={d} data-testid={`difficulty-${slug}`} data-active={active ? 'true' : 'false'} onClick={() => setDifficulty(d)} style={{
                  flex: 1, padding: '12px 8px', borderRadius: 12, cursor: 'pointer',
                  border: `1px solid ${active ? T.amberMid : T.border}`,
                  background: active ? T.amberSoft : 'rgba(255,255,255,0.03)',
                  color: active ? T.amber : T.textMuted,
                  fontFamily: T.sans, fontSize: 12.5, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <IconSignal style={{ width: 12, height: 12 }} />{d}
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
                <div data-testid="ingredient-number" style={{
                  width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                  background: T.amberSoft, color: T.amber,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.sans, fontSize: 11, fontWeight: 700,
                }}>{i + 1}</div>
                <input
                  data-testid="ingredient-input"
                  value={ing}
                  onChange={e => setIngredients(arr => arr.map((v, j) => j === i ? e.target.value : v))}
                  placeholder={i === 0 ? 'Ex.: 200g de farinha' : 'Próximo ingrediente'}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    color: T.text, fontFamily: T.sans, fontSize: 14, fontWeight: 500,
                  }}
                />
                {ingredients.length > 1 && (
                  <button data-testid="ingredient-remove" onClick={() => setIngredients(arr => arr.filter((_, j) => j !== i))} style={{
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
              background: 'transparent', border: '1px dashed rgba(232,160,32,0.4)',
              color: T.amber, fontFamily: T.sans, fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <IconPlus style={{ width: 16, height: 16 }} /> Adicionar ingrediente
            </button>
          </div>
          {errors.ingredients && <div data-testid="error-ingredients" style={{ fontSize: 12, color: T.amber, marginTop: 6, fontWeight: 600 }}>{errors.ingredients}</div>}
        </Field>

        {/* Steps */}
        <Field label="Modo de preparo" subtitle="Passo a passo, na ordem">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((s, i) => (
              <div key={i} style={{
                padding: '14px', borderRadius: 14,
                background: T.card, border: `1px solid ${T.border}`,
                display: 'flex', gap: 12,
              }}>
                <div data-testid="step-number" style={{
                  width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                  background: T.amberSoft, border: `1px solid ${T.amberMid}`,
                  color: T.amber, fontFamily: T.display, fontSize: 15, fontWeight: 400,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic',
                }}>{String(i + 1).padStart(2, '0')}</div>
                <textarea
                  data-testid="step-textarea"
                  value={s}
                  onChange={e => setSteps(arr => arr.map((v, j) => j === i ? e.target.value : v))}
                  placeholder={i === 0 ? 'Descreva este passo…' : 'Próximo passo'}
                  rows={2}
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    color: T.text, fontFamily: T.sans, fontSize: 13.5, fontWeight: 500,
                    resize: 'none', lineHeight: 1.5, padding: '4px 0',
                  }}
                />
              </div>
            ))}
            <button onClick={() => setSteps(arr => [...arr, ''])} style={{
              padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
              background: 'transparent', border: '1px dashed rgba(232,160,32,0.4)',
              color: T.amber, fontFamily: T.sans, fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <IconPlus style={{ width: 16, height: 16 }} /> Adicionar passo
            </button>
          </div>
          {errors.steps && <div data-testid="error-steps" style={{ fontSize: 12, color: T.amber, marginTop: 6, fontWeight: 600 }}>{errors.steps}</div>}
        </Field>

        {/* Notes */}
        <Field label="Notas pessoais" subtitle="Variações, lembretes, fontes…">
          <div style={{ padding: '14px 16px', borderRadius: 14, background: T.card, border: `1px solid ${T.border}` }}>
            <textarea
              data-testid="input-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex.: receita da minha avó, fica melhor com farinha 00…"
              rows={3}
              style={{
                width: '100%', border: 'none', background: 'transparent', outline: 'none',
                color: T.text, fontFamily: T.sans, fontSize: 14, fontWeight: 500,
                resize: 'none', lineHeight: 1.5,
              }}
            />
          </div>
        </Field>

        <div style={{ height: 20 }} />
      </div>

      {/* Save CTA */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: '20px 24px 28px', maxWidth: 412, margin: '0 auto',
        background: 'linear-gradient(180deg, rgba(13,13,13,0) 0%, rgba(13,13,13,0.95) 30%, rgba(13,13,13,1) 100%)',
      }}>
        {saveError && (
          <div style={{
            marginBottom: 10, padding: '10px 14px', borderRadius: 12,
            background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)',
            fontFamily: T.sans, fontSize: 13, color: '#ff6b6b', fontWeight: 500, textAlign: 'center',
          }}>{saveError}</div>
        )}
        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', height: 58, borderRadius: 18,
          background: saving ? T.amberSoft : T.amber,
          border: 'none', color: saving ? T.amber : '#0D0D0D',
          fontFamily: T.sans, fontSize: 15.5, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: saving ? 'none' : '0 10px 30px rgba(232,160,32,0.35), inset 0 1px 0 rgba(255,255,255,0.3)',
          cursor: saving ? 'not-allowed' : 'pointer',
          transition: 'all .15s',
        }}>
          <IconBookmarkFill style={{ width: 18, height: 18 }} />
          {saving ? 'Salvando…' : 'Salvar receita'}
        </button>
      </div>

      {/* Discard dialog */}
      {discardDialog.open && (
        <DiscardDialog
          onSaveDraft={handleSaveDraft}
          onDiscard={handleDiscardConfirm}
          onCancel={() => setDiscardDialog({ open: false })}
        />
      )}
    </div>
  );
}

function DiscardDialog({
  onSaveDraft,
  onDiscard,
  onCancel,
}: {
  onSaveDraft: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }}
      />
      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
          maxWidth: 412, margin: '0 auto',
          background: T.card, borderRadius: '24px 24px 0 0',
          border: `1px solid ${T.borderStrong}`,
          padding: '28px 24px 40px',
        }}
      >
        <div style={{
          width: 36, height: 4, borderRadius: 2, background: T.textDim,
          margin: '0 auto 24px',
        }} />
        <div style={{ fontFamily: T.display, fontSize: 24, fontWeight: 400, color: T.text, letterSpacing: -0.4, marginBottom: 8 }}>
          Deseja salvar como rascunho?
        </div>
        <div style={{ fontFamily: T.sans, fontSize: 14, color: T.textMuted, lineHeight: 1.5, marginBottom: 28 }}>
          Você tem conteúdo não salvo. Salve como rascunho para continuar depois ou descarte as alterações.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onSaveDraft} style={{
            width: '100%', height: 54, borderRadius: 16,
            background: T.amber, border: 'none', color: '#0D0D0D',
            fontFamily: T.sans, fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(232,160,32,0.3)',
          }}>
            Salvar rascunho
          </button>
          <button onClick={onDiscard} style={{
            width: '100%', height: 54, borderRadius: 16,
            background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`,
            color: T.text, fontFamily: T.sans, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}>
            Descartar alterações
          </button>
          <button onClick={onCancel} style={{
            width: '100%', height: 44, borderRadius: 16,
            background: 'transparent', border: 'none',
            color: T.textDim, fontFamily: T.sans, fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ label, subtitle, children }: { label: string; subtitle?: string; children: React.ReactNode }) {
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

type StepperProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  testidValue: string;
  testidPlus: string;
  testidMinus: string;
  onMinus: () => void;
  onPlus: () => void;
};

function Stepper({ icon, label, value, unit, testidValue, testidPlus, testidMinus, onMinus, onPlus }: StepperProps) {
  return (
    <div style={{ flex: 1, padding: '12px 14px', borderRadius: 14, background: T.card, border: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.textMuted, fontSize: 11, fontWeight: 600, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 8 }}>
        {icon}{label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button data-testid={testidMinus} onClick={onMinus} style={{
          width: 28, height: 28, borderRadius: 9, cursor: 'pointer',
          background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.border}`,
          color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span data-testid={testidValue} style={{ fontFamily: T.display, fontSize: 22, fontWeight: 400, color: T.text, letterSpacing: -0.3 }}>
            {value}
          </span>
          {unit && <span style={{ fontSize: 12, color: T.textMuted }}>{unit}</span>}
        </div>
        <button data-testid={testidPlus} onClick={onPlus} style={{
          width: 28, height: 28, borderRadius: 9, cursor: 'pointer',
          background: T.amberSoft, border: `1px solid ${T.amberMid}`,
          color: T.amber, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IconPlus style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}
