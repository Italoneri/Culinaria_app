import { fetchPublicRecipes, fetchCategories } from '@/lib/db';
import HomeClient from './home-client';

export default async function Root() {
  const [recipes, categories] = await Promise.all([
    fetchPublicRecipes(),
    fetchCategories(),
  ]);
  return <HomeClient recipes={recipes} categories={categories} />;
}
