-- Dev seed — dados do handoff (data.js)
-- Requer um usuário de dev criado previamente com ID abaixo

DO $$
DECLARE
  dev_user_id uuid := '00000000-0000-0000-0000-000000000001';
  r1 uuid; r2 uuid; r3 uuid; r4 uuid; r5 uuid; r6 uuid;
BEGIN
  -- Ensure dev profile exists
  INSERT INTO profiles (id, username, bio, is_premium)
  VALUES (dev_user_id, 'Mariana Silva', 'Cozinheira amadora apaixonada por massas, pães e tudo que leva manteiga', true)
  ON CONFLICT (id) DO NOTHING;

  -- Recipes
  INSERT INTO recipes (id, owner_id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public)
  VALUES
    (gen_random_uuid(), dev_user_id, 'Risoto de cogumelos com trufa', 'Jantar', 45, 'Médio', 4, 520,
     'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80&auto=format&fit=crop',
     'Cremoso, terroso e elegante — finalizado com lascas de parmesão e azeite de trufa branca.', true)
  RETURNING id INTO r1;

  INSERT INTO recipes (id, owner_id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public)
  VALUES
    (gen_random_uuid(), dev_user_id, 'Salmão grelhado com aspargos', 'Almoço', 25, 'Fácil', 2, 380,
     'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop',
     'Filé suculento com casca crocante, servido sobre aspargos grelhados e molho de limão siciliano.', true)
  RETURNING id INTO r2;

  INSERT INTO recipes (id, owner_id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public)
  VALUES
    (gen_random_uuid(), dev_user_id, 'Panquecas de ricota com mel', 'Café da manhã', 20, 'Fácil', 3, 290,
     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop',
     'Fofas e aeradas, com ricota fresca e finalizadas com mel cru e raspas de limão.', true)
  RETURNING id INTO r3;

  INSERT INTO recipes (id, owner_id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public)
  VALUES
    (gen_random_uuid(), dev_user_id, 'Brownie de chocolate 70%', 'Sobremesa', 50, 'Médio', 9, 410,
     'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80&auto=format&fit=crop',
     'Denso, úmido e com casquinha rachada por cima. Receita de chef.', true)
  RETURNING id INTO r4;

  INSERT INTO recipes (id, owner_id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public)
  VALUES
    (gen_random_uuid(), dev_user_id, 'Tartar de atum com abacate', 'Snacks', 15, 'Fácil', 2, 220,
     'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80&auto=format&fit=crop',
     'Fresco, cítrico e elegante — perfeito como entrada ou petisco refinado.', true)
  RETURNING id INTO r5;

  INSERT INTO recipes (id, owner_id, name, category, time_min, difficulty, portions, calories, img_url, description, is_public)
  VALUES
    (gen_random_uuid(), dev_user_id, 'Salada burrata e pêssego', 'Almoço', 10, 'Fácil', 2, 340,
     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
     'Verão no prato — burrata cremosa, pêssego maduro e manjericão fresco.', true)
  RETURNING id INTO r6;

  -- Ingredients for r1 (Risoto)
  INSERT INTO recipe_ingredients (recipe_id, position, text) VALUES
    (r1, 0, '300g de arroz arbóreo'),
    (r1, 1, '500g de cogumelos paris'),
    (r1, 2, '1 cebola roxa picada'),
    (r1, 3, '2 dentes de alho'),
    (r1, 4, '1L de caldo de legumes'),
    (r1, 5, '150ml de vinho branco seco'),
    (r1, 6, '80g de parmesão ralado'),
    (r1, 7, '50g de manteiga'),
    (r1, 8, 'Azeite de trufa a gosto');

  -- Steps for r1 (Risoto)
  INSERT INTO recipe_steps (recipe_id, position, title, body, tip) VALUES
    (r1, 0, 'Refogue a base', 'Em uma panela funda, doure a cebola e o alho na manteiga até ficarem translúcidos, cerca de 3 minutos.', null),
    (r1, 1, 'Sele os cogumelos', 'Adicione os cogumelos em fogo alto até dourar bem e perder a água — não mexa demais.', 'Sele em duas levas se a panela estiver lotada — assim eles douram em vez de cozinhar no vapor.'),
    (r1, 2, 'Tostar o arroz', 'Junte o arroz e mexa por 2 min até ficar perolado. Adicione o vinho e mexa até evaporar.', null),
    (r1, 3, 'Adicionar o caldo', 'Adicione o caldo quente uma concha por vez, mexendo até cada porção ser absorvida.', null),
    (r1, 4, 'Finalização', 'Quando al dente, desligue o fogo. Adicione parmesão, manteiga gelada e azeite de trufa. Mexa enérgico para emulsionar.', 'A "mantecatura" final é o segredo — bata bem para incorporar ar e ficar cremoso.');

  -- Seed favorites
  INSERT INTO favorites (user_id, recipe_id) VALUES
    (dev_user_id, r1),
    (dev_user_id, r2),
    (dev_user_id, r3),
    (dev_user_id, r4);

END $$;
