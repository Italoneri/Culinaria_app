import { RECIPES, CATEGORIES } from '@/lib/data';
import { ReceitasClient } from './receitas-client';

export default function ReceitasPage() {
  return <ReceitasClient recipes={RECIPES} categories={CATEGORIES} />;
}
