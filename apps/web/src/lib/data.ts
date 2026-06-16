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
  is_public?: boolean;
  created_at?: string;
  ingredients: string[];
  steps: { title: string; body: string; tip?: string }[];
};

export type Category = {
  name: string;
  emoji: string;
  count: number;
};

export const RECIPES: Recipe[] = [
  {
    id: 'r1',
    name: 'Risoto de cogumelos com trufa',
    category: 'Jantar',
    time_min: 45,
    difficulty: 'Médio',
    portions: 4,
    calories: 520,
    img_url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80&auto=format&fit=crop',
    description: 'Cremoso, terroso e elegante — finalizado com lascas de parmesão e azeite de trufa branca.',
    ingredients: [
      '300g de arroz arbóreo',
      '500g de cogumelos paris',
      '1 cebola roxa picada',
      '2 dentes de alho',
      '1L de caldo de legumes',
      '150ml de vinho branco seco',
      '80g de parmesão ralado',
      '50g de manteiga',
      'Azeite de trufa a gosto',
    ],
    steps: [
      { title: 'Refogue a base', body: 'Em uma panela funda, doure a cebola e o alho na manteiga até ficarem translúcidos, cerca de 3 minutos.' },
      { title: 'Sele os cogumelos', body: 'Adicione os cogumelos em fogo alto até dourar bem e perder a água — não mexa demais.', tip: 'Sele em duas levas se a panela estiver lotada — assim eles douram em vez de cozinhar no vapor.' },
      { title: 'Tostar o arroz', body: 'Junte o arroz e mexa por 2 min até ficar perolado. Adicione o vinho e mexa até evaporar.' },
      { title: 'Adicionar o caldo', body: 'Adicione o caldo quente uma concha por vez, mexendo até cada porção ser absorvida.' },
      { title: 'Finalização', body: 'Quando al dente, desligue o fogo. Adicione parmesão, manteiga gelada e azeite de trufa. Mexa enérgico para emulsionar.', tip: 'A "mantecatura" final é o segredo — bata bem para incorporar ar e ficar cremoso.' },
    ],
  },
  {
    id: 'r2',
    name: 'Salmão grelhado com aspargos',
    category: 'Almoço',
    time_min: 25,
    difficulty: 'Fácil',
    portions: 2,
    calories: 380,
    img_url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80&auto=format&fit=crop',
    description: 'Filé suculento com casca crocante, servido sobre aspargos grelhados e molho de limão siciliano.',
    ingredients: ['2 filés de salmão (180g cada)', '1 maço de aspargos', '1 limão siciliano', 'Azeite extra-virgem', 'Sal em flocos', 'Pimenta-do-reino'],
    steps: [
      { title: 'Tempere o salmão', body: 'Seque os filés com papel-toalha. Tempere com sal e pimenta dos dois lados.' },
      { title: 'Aqueça a frigideira', body: 'Aqueça uma frigideira de fundo grosso em fogo médio-alto com um fio de azeite até fumegar levemente.' },
      { title: 'Sele pela pele', body: 'Coloque o salmão com a pele para baixo. Pressione com uma espátula por 30 segundos. Cozinhe 4 minutos sem mexer.', tip: 'Não mova o peixe — a pele só solta sozinha quando estiver crocante.' },
      { title: 'Vire e finalize', body: 'Vire e cozinhe mais 2 minutos. Esprema o limão por cima.' },
      { title: 'Aspargos', body: 'Em outra frigideira, grelhe os aspargos por 4-5 min com azeite e sal em flocos.' },
    ],
  },
  {
    id: 'r3',
    name: 'Panquecas de ricota com mel',
    category: 'Café da manhã',
    time_min: 20,
    difficulty: 'Fácil',
    portions: 3,
    calories: 290,
    img_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80&auto=format&fit=crop',
    description: 'Fofas e aeradas, com ricota fresca e finalizadas com mel cru e raspas de limão.',
    ingredients: ['200g de ricota fresca', '2 ovos separados', '80g de farinha', '50ml de leite', '1 colher de chá de fermento', 'Mel cru', 'Raspas de limão'],
    steps: [
      { title: 'Misture os secos', body: 'Em uma tigela, misture farinha e fermento.' },
      { title: 'Bata as gemas', body: 'Em outra tigela, bata as gemas com ricota e leite até ficar liso.' },
      { title: 'Claras em neve', body: 'Bata as claras em ponto de neve firme e incorpore delicadamente à mistura.', tip: 'Incorpore com movimentos de baixo para cima para não perder o ar.' },
      { title: 'Frite', body: 'Em frigideira antiaderente, faça panquecas pequenas. Vire quando aparecerem bolhas na superfície.' },
      { title: 'Sirva', body: 'Empilhe, regue com mel e finalize com raspas de limão fresco.' },
    ],
  },
  {
    id: 'r4',
    name: 'Brownie de chocolate 70%',
    category: 'Sobremesa',
    time_min: 50,
    difficulty: 'Médio',
    portions: 9,
    calories: 410,
    img_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80&auto=format&fit=crop',
    description: 'Denso, úmido e com casquinha rachada por cima. Receita de chef.',
    ingredients: ['200g de chocolate 70%', '150g de manteiga', '3 ovos', '180g de açúcar mascavo', '80g de farinha', '40g de cacau em pó', 'Pitada de flor de sal'],
    steps: [
      { title: 'Derreta', body: 'Derreta o chocolate com a manteiga em banho-maria. Reserve para amornar.' },
      { title: 'Bata ovos e açúcar', body: 'Bata os ovos com açúcar por 5 minutos até triplicar de volume e ficar bem claro.', tip: 'Esse passo cria a casquinha brilhante característica do brownie.' },
      { title: 'Misture', body: 'Incorpore o chocolate amornado, depois farinha e cacau peneirados.' },
      { title: 'Asse', body: 'Forno a 170°C por 25 minutos. O centro deve permanecer levemente molhado.' },
    ],
  },
  {
    id: 'r5',
    name: 'Tartar de atum com abacate',
    category: 'Snacks',
    time_min: 15,
    difficulty: 'Fácil',
    portions: 2,
    calories: 220,
    img_url: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80&auto=format&fit=crop',
    description: 'Fresco, cítrico e elegante — perfeito como entrada ou petisco refinado.',
    ingredients: ['200g de atum sashimi', '1 abacate maduro', '1 cebolinha', 'Shoyu', 'Óleo de gergelim', 'Gergelim torrado', 'Limão tahiti'],
    steps: [
      { title: 'Corte o atum', body: 'Corte em cubos pequenos de 0,5cm com faca bem afiada.', tip: 'Mantenha o atum gelado até a hora de cortar.' },
      { title: 'Tempere', body: 'Misture com shoyu, óleo de gergelim, cebolinha e suco de limão.' },
      { title: 'Monte', body: 'Em um aro, faça uma camada de abacate amassado e por cima o atum. Finalize com gergelim.' },
    ],
  },
  {
    id: 'r6',
    name: 'Salada burrata e pêssego',
    category: 'Almoço',
    time_min: 10,
    difficulty: 'Fácil',
    portions: 2,
    calories: 340,
    img_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop',
    description: 'Verão no prato — burrata cremosa, pêssego maduro e manjericão fresco.',
    ingredients: ['1 burrata fresca', '2 pêssegos maduros', 'Manjericão fresco', 'Rúcula', 'Vinagre balsâmico envelhecido', 'Azeite extra-virgem'],
    steps: [
      { title: 'Corte os pêssegos', body: 'Corte em gomos generosos, descartando o caroço.' },
      { title: 'Monte', body: 'Distribua rúcula no prato, adicione pêssegos e a burrata inteira no centro.' },
      { title: 'Finalize', body: 'Regue com azeite, balsâmico, sal em flocos e manjericão rasgado à mão.' },
    ],
  },
];

export const CATEGORIES: Category[] = [
  { name: 'Café da manhã', emoji: '☕', count: 12 },
  { name: 'Almoço', emoji: '🍝', count: 28 },
  { name: 'Jantar', emoji: '🍷', count: 24 },
  { name: 'Sobremesa', emoji: '🍰', count: 18 },
  { name: 'Snacks', emoji: '🥑', count: 9 },
];
