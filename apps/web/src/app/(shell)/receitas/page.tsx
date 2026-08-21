import { fetchRecipes, fetchCategories, fetchFavoriteIds } from '@/lib/db';
import { ReceitasClient } from './receitas-client';

export const dynamic = 'force-dynamic';

export default async function ReceitasPage() {
  const [recipes, categories, favoriteIds] = await Promise.all([
    fetchRecipes(),
    fetchCategories(),
    fetchFavoriteIds(),
  ]);
  return <ReceitasClient recipes={recipes} categories={categories} favoriteIds={favoriteIds} />;
}
