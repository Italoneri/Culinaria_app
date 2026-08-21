import { fetchRecipes, fetchCategories, fetchFavoriteIds } from '@/lib/db';
import HomeClient from './home-client';

export const dynamic = 'force-dynamic';

export default async function Root() {
  const [recipes, categories, favoriteIds] = await Promise.all([
    fetchRecipes(),
    fetchCategories(),
    fetchFavoriteIds(),
  ]);
  return <HomeClient recipes={recipes} categories={categories} favoriteIds={favoriteIds} />;
}
