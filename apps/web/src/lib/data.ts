export const RECIPE_CATEGORIES = ['Café da manhã', 'Almoço', 'Jantar', 'Sobremesa', 'Snacks'] as const;
export type RecipeCategory = typeof RECIPE_CATEGORIES[number];

export const DIFFICULTIES = ['Fácil', 'Médio', 'Difícil'] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export type Recipe = {
  id: string;
  name: string;
  category: string;
  time_min: number;
  difficulty: string;
  portions: number;
  calories?: number;
  img_url?: string;
  description?: string;
  notes?: string;
  owner_id?: string;
  is_public?: boolean;
  created_at?: string;
  ingredients: string[];
  steps: { title: string; body: string; tip?: string }[];
};

export type Category = {
  name: RecipeCategory;
  emoji: string;
  count: number;
};

export type Profile = {
  id: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  is_premium: boolean;
  created_at: string;
  stats: { recipes_created: number; favorites: number };
};

// Nomes e emojis canônicos das categorias — os counts reais vêm de fetchCategories()
export const CATEGORIES: Category[] = [
  { name: 'Café da manhã', emoji: '☕', count: 0 },
  { name: 'Almoço', emoji: '🍝', count: 0 },
  { name: 'Jantar', emoji: '🍷', count: 0 },
  { name: 'Sobremesa', emoji: '🍰', count: 0 },
  { name: 'Snacks', emoji: '🥑', count: 0 },
];
