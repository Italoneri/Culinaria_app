-- Dev seed — dados do handoff (data.js)
-- O dono é o primeiro usuário real de auth.users: cadastre-se em /auth/cadastro antes de rodar.

DO $$
DECLARE
  dev_user_id uuid;
  r1 uuid; r2 uuid; r3 uuid; r4 uuid; r5 uuid; r6 uuid;
BEGIN
  SELECT id INTO dev_user_id FROM auth.users ORDER BY created_at LIMIT 1;

  IF dev_user_id IS NULL THEN
    RAISE EXCEPTION 'auth.users vazio — crie uma conta em /auth/cadastro antes de rodar o seed';
  END IF;

  IF EXISTS (SELECT 1 FROM recipes WHERE owner_id = dev_user_id) THEN
    RAISE NOTICE 'seed já aplicado para o usuário %, nada a fazer', dev_user_id;
    RETURN;
  END IF;

  -- Upsert em vez de update: contas criadas antes do schema existir não passaram
  -- pelo trigger handle_new_user e não têm linha em profiles
  INSERT INTO profiles (id, username, bio, is_premium)
  VALUES (
    dev_user_id,
    'Mariana Silva',
    'Cozinheira amadora apaixonada por massas, pães e tudo que leva manteiga',
    true
  )
  ON CONFLICT (id) DO UPDATE
    SET username = EXCLUDED.username,
        bio = EXCLUDED.bio,
        is_premium = EXCLUDED.is_premium;

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

  -- Ingredients + steps r2 (Salmão)
  INSERT INTO recipe_ingredients (recipe_id, position, text) VALUES
    (r2, 0, '2 filés de salmão (180g cada)'),
    (r2, 1, '1 maço de aspargos'),
    (r2, 2, '1 limão siciliano'),
    (r2, 3, 'Azeite extra-virgem'),
    (r2, 4, 'Sal em flocos'),
    (r2, 5, 'Pimenta-do-reino');

  INSERT INTO recipe_steps (recipe_id, position, title, body, tip) VALUES
    (r2, 0, 'Tempere o salmão', 'Seque os filés com papel-toalha. Tempere com sal e pimenta dos dois lados.', null),
    (r2, 1, 'Aqueça a frigideira', 'Aqueça uma frigideira de fundo grosso em fogo médio-alto com um fio de azeite até fumegar levemente.', null),
    (r2, 2, 'Sele pela pele', 'Coloque o salmão com a pele para baixo. Pressione com uma espátula por 30 segundos. Cozinhe 4 minutos sem mexer.', 'Não mova o peixe — a pele só solta sozinha quando estiver crocante.'),
    (r2, 3, 'Vire e finalize', 'Vire e cozinhe mais 2 minutos. Esprema o limão por cima.', null),
    (r2, 4, 'Aspargos', 'Em outra frigideira, grelhe os aspargos por 4-5 min com azeite e sal em flocos.', null);

  -- Ingredients + steps r3 (Panquecas)
  INSERT INTO recipe_ingredients (recipe_id, position, text) VALUES
    (r3, 0, '200g de ricota fresca'),
    (r3, 1, '2 ovos separados'),
    (r3, 2, '80g de farinha'),
    (r3, 3, '50ml de leite'),
    (r3, 4, '1 colher de chá de fermento'),
    (r3, 5, 'Mel cru'),
    (r3, 6, 'Raspas de limão');

  INSERT INTO recipe_steps (recipe_id, position, title, body, tip) VALUES
    (r3, 0, 'Misture os secos', 'Em uma tigela, misture farinha e fermento.', null),
    (r3, 1, 'Bata as gemas', 'Em outra tigela, bata as gemas com ricota e leite até ficar liso.', null),
    (r3, 2, 'Claras em neve', 'Bata as claras em ponto de neve firme e incorpore delicadamente à mistura.', 'Incorpore com movimentos de baixo para cima para não perder o ar.'),
    (r3, 3, 'Frite', 'Em frigideira antiaderente, faça panquecas pequenas. Vire quando aparecerem bolhas na superfície.', null),
    (r3, 4, 'Sirva', 'Empilhe, regue com mel e finalize com raspas de limão fresco.', null);

  -- Ingredients + steps r4 (Brownie)
  INSERT INTO recipe_ingredients (recipe_id, position, text) VALUES
    (r4, 0, '200g de chocolate 70%'),
    (r4, 1, '150g de manteiga'),
    (r4, 2, '3 ovos'),
    (r4, 3, '180g de açúcar mascavo'),
    (r4, 4, '80g de farinha'),
    (r4, 5, '40g de cacau em pó'),
    (r4, 6, 'Pitada de flor de sal');

  INSERT INTO recipe_steps (recipe_id, position, title, body, tip) VALUES
    (r4, 0, 'Derreta', 'Derreta o chocolate com a manteiga em banho-maria. Reserve para amornar.', null),
    (r4, 1, 'Bata ovos e açúcar', 'Bata os ovos com açúcar por 5 minutos até triplicar de volume e ficar bem claro.', 'Esse passo cria a casquinha brilhante característica do brownie.'),
    (r4, 2, 'Misture', 'Incorpore o chocolate amornado, depois farinha e cacau peneirados.', null),
    (r4, 3, 'Asse', 'Forno a 170°C por 25 minutos. O centro deve permanecer levemente molhado.', null);

  -- Ingredients + steps r5 (Tartar)
  INSERT INTO recipe_ingredients (recipe_id, position, text) VALUES
    (r5, 0, '200g de atum sashimi'),
    (r5, 1, '1 abacate maduro'),
    (r5, 2, '1 cebolinha'),
    (r5, 3, 'Shoyu'),
    (r5, 4, 'Óleo de gergelim'),
    (r5, 5, 'Gergelim torrado'),
    (r5, 6, 'Limão tahiti');

  INSERT INTO recipe_steps (recipe_id, position, title, body, tip) VALUES
    (r5, 0, 'Corte o atum', 'Corte em cubos pequenos de 0,5cm com faca bem afiada.', 'Mantenha o atum gelado até a hora de cortar.'),
    (r5, 1, 'Tempere', 'Misture com shoyu, óleo de gergelim, cebolinha e suco de limão.', null),
    (r5, 2, 'Monte', 'Em um aro, faça uma camada de abacate amassado e por cima o atum. Finalize com gergelim.', null);

  -- Ingredients + steps r6 (Burrata)
  INSERT INTO recipe_ingredients (recipe_id, position, text) VALUES
    (r6, 0, '1 burrata fresca'),
    (r6, 1, '2 pêssegos maduros'),
    (r6, 2, 'Manjericão fresco'),
    (r6, 3, 'Rúcula'),
    (r6, 4, 'Vinagre balsâmico envelhecido'),
    (r6, 5, 'Azeite extra-virgem');

  INSERT INTO recipe_steps (recipe_id, position, title, body, tip) VALUES
    (r6, 0, 'Corte os pêssegos', 'Corte em gomos generosos, descartando o caroço.', null),
    (r6, 1, 'Monte', 'Distribua rúcula no prato, adicione pêssegos e a burrata inteira no centro.', null),
    (r6, 2, 'Finalize', 'Regue com azeite, balsâmico, sal em flocos e manjericão rasgado à mão.', null);

  -- Seed favorites
  INSERT INTO favorites (user_id, recipe_id) VALUES
    (dev_user_id, r1),
    (dev_user_id, r2),
    (dev_user_id, r3),
    (dev_user_id, r4);

END $$;
