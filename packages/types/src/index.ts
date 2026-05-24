export type Difficulty = 'Fácil' | 'Médio' | 'Difícil'
export type Category = 'Café da manhã' | 'Almoço' | 'Jantar' | 'Sobremesa' | 'Snacks'

export interface RecipeStep {
  position: number
  title: string
  body: string
  tip?: string
}

export interface Recipe {
  id: string
  owner_id: string
  name: string
  category: Category
  time_min: number
  difficulty: Difficulty
  portions: number
  calories?: number
  img_url?: string
  description?: string
  notes?: string
  is_public: boolean
  created_at: string
  updated_at: string
  ingredients: string[]
  steps: RecipeStep[]
}

export interface RecipeListItem {
  id: string
  name: string
  category: Category
  time_min: number
  difficulty: Difficulty
  portions: number
  calories?: number
  img_url?: string
  description?: string
  is_public: boolean
  created_at: string
}

export interface Profile {
  id: string
  username?: string
  bio?: string
  avatar_url?: string
  is_premium: boolean
  created_at: string
  stats: {
    recipes_created: number
    favorites: number
  }
}

export interface Collection {
  id: string
  owner_id: string
  name: string
  emoji: string
  recipe_count: number
}

export interface CategoryStat {
  name: Category
  emoji: string
  count: number
}

// Request bodies

export interface CreateRecipeBody {
  name: string
  category: Category
  time_min: number
  difficulty: Difficulty
  portions: number
  calories?: number
  description?: string
  notes?: string
  is_public?: boolean
  ingredients: string[]
  steps: Array<{ title: string; body: string; tip?: string }>
}

export interface UpdateRecipeBody extends Partial<CreateRecipeBody> {}

export interface UpdateProfileBody {
  username?: string
  bio?: string
}

export interface CreateCollectionBody {
  name: string
  emoji?: string
}

export interface PresignResponse {
  upload_url: string
  public_url: string
  path: string
}

// API response wrapper

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: string
  status: number
}
