import { notFound } from 'next/navigation';
import { fetchRecipe, fetchFavoriteIds } from '@/lib/db';
import { DetailClient } from './detail-client';

export const dynamic = 'force-dynamic';

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const [recipe, favoriteIds] = await Promise.all([
    fetchRecipe(params.id),
    fetchFavoriteIds(),
  ]);
  if (!recipe) notFound();
  return <DetailClient recipe={recipe} favorited={favoriteIds.includes(params.id)} />;
}
