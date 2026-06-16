import { notFound } from 'next/navigation';
import { fetchPublicRecipe } from '@/lib/db';
import { DetailClient } from './detail-client';

export const dynamic = 'force-dynamic';

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = await fetchPublicRecipe(params.id);
  if (!recipe) notFound();
  return <DetailClient recipe={recipe} />;
}
