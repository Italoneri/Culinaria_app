import { fetchPublicRecipes, fetchCategories } from '@/lib/db';
import { ReceitasClient } from './receitas-client';

export default async function ReceitasPage() {
  const [recipes, categories] = await Promise.all([
    fetchPublicRecipes(),
    fetchCategories(),
  ]);
  return <ReceitasClient recipes={recipes} categories={categories} />;
}
