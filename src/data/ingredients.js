// src/data/ingredients.js

export const INGREDIENT_CATALOG = {
  "Fresh Produce": [
    "tomato","potato","onion","garlic","ginger","spinach","capsicum","carrot",
    "green chilli","coriander leaves","lemon","cauliflower","peas",
    // breakfast adds
    "banana","mango", "cucumber"
  ],
  Grains: [
    "rice","idli rice","wheat flour","poha","rava","bread",
    // breakfast adds
    "idli rava","oats"
  ],
  Pulses: ["chickpeas","toor dal","moong dal","rajma","chana dal","urad dal","besan"],
  Dairy: ["milk","curd","paneer","ghee","butter" /* breakfast: cheese for sandwich */,"cheese"],
  Oils: ["oil","mustard oil"],
  Spices: [
    "salt","turmeric","red chilli powder","coriander powder","garam masala",
    "cumin seeds","mustard seeds","asafoetida","black pepper","curry leaves",
    "kasuri methi","fenugreek seeds","bay leaf","cloves","cardamom","cinnamon"
  ],
  Other: [
    "water","sugar","poha sev","lemon juice","yogurt",
    // breakfast adds
    "peanuts","cashews","baking powder","tea leaves","honey"
  ]
};

export const ING_TO_CAT = new Map(
  Object.entries(INGREDIENT_CATALOG).flatMap(([cat, arr]) => arr.map((n) => [n, cat]))
);

// Defensive freeze to prevent accidental mutation
const deepFreeze = (obj) => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((p) => {
    const v = obj[p];
    if (v && (typeof v === "object" || typeof v === "function") && !Object.isFrozen(v)) {
      deepFreeze(v);
    }
  });
  return obj;
};
deepFreeze(INGREDIENT_CATALOG);
