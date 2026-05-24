import { notFound } from 'next/navigation';
import { RECIPES } from '@/lib/data';
import { DetailClient } from './detail-client';

export function generateStaticParams() {
  return RECIPES.map(r => ({ id: r.id }));
}

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = RECIPES.find(r => r.id === params.id);
  if (!recipe) notFound();
  return <DetailClient recipe={recipe} />;
}
