export const RECIPES = [
  // Snacks / Breakfast
  {
    id: "kanda-poha",
    title: "Kanda Poha",
    time: 20,
    tags: ["breakfast", "quick", "light"],
    ingredients: [
      "poha", "onion", "green chilli", "mustard seeds", "turmeric",
      "peanuts", "coriander leaves", "lemon", "oil", "salt"
    ],
    steps: [
      "Rinse poha and drain.",
      "Heat oil; splutter mustard seeds. Sauté onion and green chilli.",
      "Add turmeric and drained poha; mix gently with salt.",
      "Finish with peanuts, coriander leaves, lemon."
    ]
  },
  {
    id: "rava-upma",
    title: "Rava Upma",
    time: 25,
    tags: ["breakfast", "south indian"],
    ingredients: [
      "rava", "onion", "ginger", "green chilli", "curry leaves",
      "ghee", "salt", "water"
    ],
    steps: [
      "Dry roast rava until aromatic; keep aside.",
      "In ghee, sauté onion, ginger, green chilli, curry leaves.",
      "Add water and salt; bring to boil.",
      "Rain in rava while stirring; steam 3–5 minutes."
    ]
  },
  {
    id: "idli",
    title: "Steamed Idli",
    time: 30,
    tags: ["breakfast", "south indian", "fermented"],
    ingredients: ["idli rice", "idli rava", "urad dal", "fenugreek seeds", "salt", "water", "oil"],
    steps: [
      "Soak idli rice + idli rava + urad dal with fenugreek seeds; grind and ferment overnight.",
      "Grease moulds with a little oil; pour batter.",
      "Steam 10–12 minutes. Rest 2 minutes and demould."
    ]
  },
  {
    id: "dosa",
    title: "Crispy Dosa",
    time: 30,
    tags: ["breakfast", "south indian", "fermented"],
    ingredients: ["rice", "urad dal", "fenugreek seeds", "salt", "oil", "water"],
    steps: [
      "Soak rice + urad dal with fenugreek seeds; grind and ferment overnight.",
      "Spread batter thin on hot tawa; drizzle oil.",
      "Cook until golden and crisp; serve hot."
    ]
  },
  {
    id: "aloo-paratha",
    title: "Aloo Paratha",
    time: 35,
    tags: ["breakfast", "north indian", "hearty"],
    ingredients: [
      "wheat flour", "potato", "green chilli", "coriander leaves", "ghee", "salt", "water"
    ],
    steps: [
      "Make soft dough with wheat flour, water, salt; rest.",
      "Mash boiled potato with green chilli, salt, coriander leaves.",
      "Stuff, roll, and roast on tawa with ghee until golden."
    ]
  },
  {
    id: "oats-pancakes",
    title: "Banana Oats Pancakes",
    time: 20,
    tags: ["breakfast", "healthy", "sweet"],
    ingredients: ["oats", "banana", "milk", "baking powder", "honey", "butter"],
    steps: [
      "Blend oats to flour.",
      "Mix with mashed banana, milk, baking powder.",
      "Cook small pancakes; serve with honey."
    ]
  },
  {
    id: "veg-grilled-sandwich",
    title: "Vegetable Grilled Sandwich",
    time: 15,
    tags: ["breakfast", "snack", "quick"],
    ingredients: ["bread", "butter", "tomato", "cucumber", "capsicum", "cheese", "salt", "black pepper"],
    steps: [
      "Butter bread; layer tomato, cucumber, capsicum, cheese; season.",
      "Grill/toast until crisp and melty."
    ]
  },
  {
    id: "masala-chai",
    title: "Masala Chai",
    time: 10,
    tags: ["breakfast", "beverage"],
    ingredients: ["tea leaves", "milk", "ginger", "cardamom", "cinnamon", "sugar", "water"],
    steps: [
      "Boil water with crushed ginger, cardamom, cinnamon.",
      "Add tea leaves; simmer.",
      "Add milk and sugar; boil briefly. Strain."
    ]
  },
  {
    id: "mango-lassi",
    title: "Mango Lassi",
    time: 5,
    tags: ["breakfast", "beverage", "cool"],
    ingredients: ["mango", "yogurt", "milk", "honey"],
    steps: [
      "Blend mango, yogurt, milk, honey until smooth; chill."
    ]
  },
  { id: "poha", name: "Kanda Poha (Onion Poha)", mealType: "snack", timeMin: 20, jainFriendly: false,
    ingredients: [
      { name: "poha", cat: "Grains" },
      { name: "onion", cat: "Fresh Produce" },
      { name: "green chilli", cat: "Fresh Produce", optional: true },
      { name: "mustard seeds", cat: "Spices", optional: true },
      { name: "turmeric", cat: "Spices", optional: true },
      { name: "salt", cat: "Spices", optional: true },
      { name: "oil", cat: "Oils", optional: true },
      { name: "lemon", cat: "Fresh Produce", optional: true },
      { name: "poha sev", cat: "Other", optional: true },
      { name: "curry leaves", cat: "Spices", optional: true }
    ],
    spicesOil: ["mustard seeds","turmeric","salt","oil","curry leaves"],
    steps: ["Rinse poha and drain.","Temper mustard seeds, curry leaves, green chilli.","Add onions, saute; add turmeric and salt.","Mix poha; cook 2-3 minutes. Finish with lemon."]
  },
  { id: "upma", name: "Rava Upma", mealType: "breakfast", timeMin: 20, jainFriendly: true,
    ingredients: [
      { name: "rava", cat: "Grains" },
      { name: "onion", cat: "Fresh Produce", optional: true },
      { name: "curry leaves", cat: "Spices", optional: true },
      { name: "mustard seeds", cat: "Spices", optional: true },
      { name: "green chilli", cat: "Fresh Produce", optional: true },
      { name: "oil", cat: "Oils", optional: true },
      { name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["mustard seeds","curry leaves","oil","salt"],
    steps: ["Dry roast rava and keep aside.","Temper mustard seeds and curry leaves.","Add onions or green chilli if using, then water and salt.","Stir in rava until fluffy."]
  },
  { id: "besan-chilla", name: "Besan Chilla", mealType: "breakfast", timeMin: 20, jainFriendly: true,
    ingredients: [
      { name: "besan", cat: "Pulses" },{ name: "onion", cat: "Fresh Produce", optional: true },{ name: "tomato", cat: "Fresh Produce", optional: true },{ name: "green chilli", cat: "Fresh Produce", optional: true },{ name: "turmeric", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "water", cat: "Other" }
    ],
    spicesOil: ["turmeric","salt","oil"],
    steps: ["Make a batter with besan, water and spices.","Add chopped veggies if using.","Pan-fry thin pancakes until golden."]
  },
  { id: "idli", name: "Idli", mealType: "breakfast", timeMin: 30, jainFriendly: true,
    ingredients: [
      { name: "idli rice", cat: "Grains" },{ name: "urad dal", cat: "Pulses" },{ name: "fenugreek seeds", cat: "Spices", optional: true },{ name: "water", cat: "Other" },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["salt"],
    steps: ["Soak idli rice and urad dal with fenugreek seeds.","Grind, ferment, then steam batter in moulds."]
  },
  { id: "dosa", name: "Plain Dosa", mealType: "breakfast", timeMin: 35, jainFriendly: true,
    ingredients: [
      { name: "idli rice", cat: "Grains" },{ name: "urad dal", cat: "Pulses" },{ name: "fenugreek seeds", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "salt", cat: "Spices", optional: true },{ name: "water", cat: "Other" }
    ],
    spicesOil: ["oil","salt"],
    steps: ["Prepare fermented dosa batter.","Spread on hot tawa, drizzle oil, cook till crisp."]
  },

  // Lunch
  { id: "chana-masala", name: "Chana Masala", mealType: "lunch", timeMin: 40, jainFriendly: false,
    ingredients: [
      { name: "chickpeas", cat: "Pulses" },{ name: "tomato", cat: "Fresh Produce" },{ name: "onion", cat: "Fresh Produce", optional: true },{ name: "garlic", cat: "Fresh Produce", optional: true },{ name: "ginger", cat: "Fresh Produce", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "cumin seeds", cat: "Spices", optional: true },{ name: "garam masala", cat: "Spices", optional: true },{ name: "turmeric", cat: "Spices", optional: true },{ name: "red chilli powder", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["oil","cumin seeds","garam masala","turmeric","red chilli powder","salt"],
    steps: ["Soak and boil chickpeas or use cooked ones.","Heat oil, add cumin seeds.","Add onion, ginger, garlic (skip for Jain) and saute.","Add tomatoes and spices; cook till thick.","Add chickpeas, simmer 10 minutes.","Garnish with coriander leaves and serve."]
  },
  { id: "aloo-gobi", name: "Aloo Gobi", mealType: "lunch", timeMin: 30, jainFriendly: true,
    ingredients: [
      { name: "potato", cat: "Fresh Produce" },{ name: "cauliflower", cat: "Fresh Produce" },{ name: "peas", cat: "Fresh Produce", optional: true },{ name: "turmeric", cat: "Spices", optional: true },{ name: "coriander powder", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true }
    ],
    spicesOil: ["turmeric","coriander powder","salt","oil"],
    steps: ["Heat oil; add turmeric and spices.","Add potato and cauliflower; cover and cook.","Add peas if using; cook till tender."]
  },
  { id: "veg-pulao", name: "Veg Pulao", mealType: "lunch", timeMin: 30, jainFriendly: true,
    ingredients: [
      { name: "rice", cat: "Grains" },{ name: "peas", cat: "Fresh Produce", optional: true },{ name: "carrot", cat: "Fresh Produce", optional: true },{ name: "capsicum", cat: "Fresh Produce", optional: true },{ name: "bay leaf", cat: "Spices", optional: true },{ name: "cloves", cat: "Spices", optional: true },{ name: "cardamom", cat: "Spices", optional: true },{ name: "cinnamon", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true }
    ],
    spicesOil: ["bay leaf","cloves","cardamom","cinnamon","salt","oil"],
    steps: ["Saute whole spices, add veggies.","Add rice and water; cook till done."]
  },
  { id: "dal-tadka", name: "Dal Tadka", mealType: "lunch", timeMin: 35, jainFriendly: true,
    ingredients: [
      { name: "toor dal", cat: "Pulses" },{ name: "tomato", cat: "Fresh Produce", optional: true },{ name: "turmeric", cat: "Spices", optional: true },{ name: "cumin seeds", cat: "Spices", optional: true },{ name: "asafoetida", cat: "Spices", optional: true },{ name: "ghee", cat: "Dairy", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["turmeric","cumin seeds","asafoetida","ghee","salt"],
    steps: ["Pressure cook dal with turmeric and salt.","Make tadka with ghee, cumin, asafoetida, tomatoes.","Pour over dal and simmer."]
  },

  // Dinner
  { id: "rajma-chawal", name: "Rajma Chawal", mealType: "dinner", timeMin: 55, jainFriendly: false,
    ingredients: [
      { name: "rajma", cat: "Pulses" },{ name: "rice", cat: "Grains" },{ name: "tomato", cat: "Fresh Produce" },{ name: "onion", cat: "Fresh Produce", optional: true },{ name: "garlic", cat: "Fresh Produce", optional: true },{ name: "ginger", cat: "Fresh Produce", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "coriander powder", cat: "Spices", optional: true },{ name: "garam masala", cat: "Spices", optional: true },{ name: "turmeric", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["oil","coriander powder","garam masala","turmeric","salt"],
    steps: ["Soak and pressure cook rajma.","Make masala with onion, ginger, garlic and tomatoes.","Add spices and rajma; simmer.","Cook rice separately. Serve together."]
  },
  { id: "khichdi", name: "Moong Dal Khichdi", mealType: "dinner", timeMin: 30, jainFriendly: true,
    ingredients: [
      { name: "rice", cat: "Grains" },{ name: "moong dal", cat: "Pulses" },{ name: "turmeric", cat: "Spices", optional: true },{ name: "ghee", cat: "Dairy", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["turmeric","ghee","salt"],
    steps: ["Wash rice and dal.","Pressure cook with turmeric and salt until soft.","Finish with ghee."]
  },
  { id: "veg-biryani", name: "Veg Biryani", mealType: "dinner", timeMin: 60, jainFriendly: true,
    ingredients: [
      { name: "rice", cat: "Grains" },{ name: "peas", cat: "Fresh Produce", optional: true },{ name: "carrot", cat: "Fresh Produce", optional: true },{ name: "capsicum", cat: "Fresh Produce", optional: true },{ name: "bay leaf", cat: "Spices", optional: true },{ name: "cloves", cat: "Spices", optional: true },{ name: "cardamom", cat: "Spices", optional: true },{ name: "cinnamon", cat: "Spices", optional: true },{ name: "garam masala", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["bay leaf","cloves","cardamom","cinnamon","garam masala","oil","salt"],
    steps: ["Parboil rice; cook veggies with spices.","Layer and dum-cook until aromatic."]
  },
  { id: "paneer-bhurji", name: "Paneer Bhurji", mealType: "dinner", timeMin: 25, jainFriendly: false,
    ingredients: [
      { name: "paneer", cat: "Dairy" },{ name: "tomato", cat: "Fresh Produce" },{ name: "onion", cat: "Fresh Produce", optional: true },{ name: "turmeric", cat: "Spices", optional: true },{ name: "red chilli powder", cat: "Spices", optional: true },{ name: "garam masala", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["turmeric","red chilli powder","garam masala","oil","salt"],
    steps: ["Crumble paneer and saute with masala.","Cook till soft and well seasoned."]
  },
  { id: "kadhi-chawal", name: "Kadhi Chawal", mealType: "dinner", timeMin: 45, jainFriendly: true,
    ingredients: [
      { name: "besan", cat: "Pulses" },{ name: "curd", cat: "Dairy" },{ name: "rice", cat: "Grains" },{ name: "turmeric", cat: "Spices", optional: true },{ name: "curry leaves", cat: "Spices", optional: true },{ name: "mustard seeds", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true },{ name: "oil", cat: "Oils", optional: true }
    ],
    spicesOil: ["turmeric","curry leaves","mustard seeds","salt","oil"],
    steps: ["Whisk besan with curd and water.","Simmer; temper with spices, serve with rice."]
  },
  { id: "palak-paneer", name: "Palak Paneer", mealType: "dinner", timeMin: 30, jainFriendly: false,
    ingredients: [
      { name: "spinach", cat: "Fresh Produce" },{ name: "paneer", cat: "Dairy" },{ name: "tomato", cat: "Fresh Produce", optional: true },{ name: "onion", cat: "Fresh Produce", optional: true },{ name: "garlic", cat: "Fresh Produce", optional: true },{ name: "ginger", cat: "Fresh Produce", optional: true },{ name: "ghee", cat: "Dairy", optional: true },{ name: "oil", cat: "Oils", optional: true },{ name: "garam masala", cat: "Spices", optional: true },{ name: "cumin seeds", cat: "Spices", optional: true },{ name: "salt", cat: "Spices", optional: true }
    ],
    spicesOil: ["ghee","oil","garam masala","cumin seeds","salt"],
    steps: ["Blanch spinach and blend.","Saute onion, garlic, ginger (skip for Jain).","Add tomato and spices.","Add spinach puree and paneer cubes.","Simmer and finish with kasuri methi if available."]
  }
];
