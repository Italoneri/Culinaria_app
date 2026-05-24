-- profiles: extends auth.users
CREATE TABLE profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   text,
  bio        text,
  avatar_url text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- recipes
CREATE TABLE recipes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        text NOT NULL,
  category    text NOT NULL
    CHECK (category IN ('Café da manhã','Almoço','Jantar','Sobremesa','Snacks')),
  time_min    int NOT NULL CHECK (time_min > 0),
  difficulty  text NOT NULL CHECK (difficulty IN ('Fácil','Médio','Difícil')),
  portions    int NOT NULL CHECK (portions > 0),
  calories    int CHECK (calories > 0),
  img_url     text,
  description text,
  notes       text,
  is_public   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_recipes_owner ON recipes(owner_id);
CREATE INDEX idx_recipes_category ON recipes(category);

-- recipe_ingredients
CREATE TABLE recipe_ingredients (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  position  int NOT NULL,
  text      text NOT NULL,
  UNIQUE(recipe_id, position)
);

-- recipe_steps
CREATE TABLE recipe_steps (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  position  int NOT NULL,
  title     text NOT NULL,
  body      text NOT NULL,
  tip       text,
  UNIQUE(recipe_id, position)
);

-- collections
CREATE TABLE collections (
  id       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name     text NOT NULL,
  emoji    text DEFAULT '📚'
);

-- collection_recipes
CREATE TABLE collection_recipes (
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id     uuid REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, recipe_id)
);

-- favorites
CREATE TABLE favorites (
  user_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  recipe_id uuid REFERENCES recipes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, recipe_id)
);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- recipes: public ones readable by all authenticated users; private only by owner
CREATE POLICY "recipes readable" ON recipes FOR SELECT
  USING (is_public = true OR owner_id = auth.uid());
CREATE POLICY "recipes insertable by owner" ON recipes FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY "recipes updatable by owner" ON recipes FOR UPDATE
  USING (owner_id = auth.uid());
CREATE POLICY "recipes deletable by owner" ON recipes FOR DELETE
  USING (owner_id = auth.uid());

-- recipe_ingredients and steps follow parent recipe ownership
CREATE POLICY "ingredients readable" ON recipe_ingredients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes r WHERE r.id = recipe_id AND (r.is_public = true OR r.owner_id = auth.uid())
  ));
CREATE POLICY "ingredients writable" ON recipe_ingredients FOR ALL
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.owner_id = auth.uid()));

CREATE POLICY "steps readable" ON recipe_steps FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM recipes r WHERE r.id = recipe_id AND (r.is_public = true OR r.owner_id = auth.uid())
  ));
CREATE POLICY "steps writable" ON recipe_steps FOR ALL
  USING (EXISTS (SELECT 1 FROM recipes r WHERE r.id = recipe_id AND r.owner_id = auth.uid()));

-- collections
CREATE POLICY "collections owner only" ON collections FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "collection_recipes owner only" ON collection_recipes FOR ALL
  USING (EXISTS (SELECT 1 FROM collections c WHERE c.id = collection_id AND c.owner_id = auth.uid()));

-- favorites
CREATE POLICY "favorites owner only" ON favorites FOR ALL USING (user_id = auth.uid());
