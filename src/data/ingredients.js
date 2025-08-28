// src/data/ingredients.js

// Optional: lightweight alias map that you can use in Tokenizer.normalize()
// so user input like "sooji" or "flattened rice" resolves to the canonical token.
export const INGREDIENT_ALIASES = {
  // breakfast bases
  "flattened rice": "poha",
  aval: "poha",
  avalakki: "poha",
  "beaten rice": "poha",
  sooji: "rava",
  suji: "rava",
  semolina: "rava",
  "idli rawa": "idli rava",
  "rolled oats": "oats",

  // dairy
  yoghurt: "yogurt",
  curd: "yogurt,

  // oils/fats
  "vegetable oil": "oil",
  "refined oil": "oil",

  // spices (common variants)
  "red chilli powder": "red chili powder",
  chilli: "chili",
  chillies: "chili",
};

export const INGREDIENT_CATALOG = {
  "Breakfast Staples": [
    "poha",            // flattened rice
    "rava",            // semolina / sooji
    "idli rava",
    "oats",
    "bread",
    "upma mix",
    "cornflakes",
    "muesli",
    "milk",
    "yogurt"           // curd
  ],

  "Fresh Produce": [
    "onion",
    "tomato",
    "potato",
    "ginger",
    "garlic",
    "green chili",
    "coriander",
    "curry leaves",
    "lemon",
    "spinach"
  ],

  "Grains & Flours": [
    "rice",
    "wheat flour",
    "besan",
    "maida",
    "rice flour"
  ],

  "Legumes & Lentils": [
    "urad dal",
    "chana dal",
    "moong dal"
  ],

  "Spices & Seeds": [
    "mustard seeds",
    "cumin",
    "turmeric",
    "red chili powder",
    "hing",
    "coriander powder",
    "garam masala",
    "black pepper",
    "fenugreek"
  ],

  "Oils & Fats": [
    "ghee",
    "oil",
    "butter"
  ],

  "Condiments & Extras": [
    "green chutney",
    "tamarind chutney",
    "ketchup",
    "honey",
    "salt",
    "sugar",
    "baking powder",
    "tea leaves",
    "cardamom",
    "cinnamon"
  ]
};
