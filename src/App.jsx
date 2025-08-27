import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChefHat, Clock, Filter, Heart, HeartOff, ListChecks, Mic, MicOff, RefreshCcw, Search, ShoppingCart, Sparkles, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MealMate – Vegetarian Meal Planner (Complete Build)
 * ---------------------------------------------------
 * - Progressive, clutter-free UI using Disclosure (+/-) sections under user control.
 * - Meal types (breakfast/lunch/dinner/snack) with opt-in filter.
 * - Main-ingredient gating, progressive narrowing, shopping list rules.
 * - Blinkit link is grocery-list-based (missing items only) with deep linking for mobile.
 * - Assistant layer: empathetic nudges, time relaxation, substitutions, adaptive hints.
 * - Self-tests cover matching, narrowing, tokenizer, links, assistant logic.
 * - ASCII-only hyphens and quotes in strings (avoid Unicode minus and dashes).
 */

/*********************************
 * Data: Ingredients & Recipes
 *********************************/
/** @typedef {"Fresh Produce"|"Grains"|"Pulses"|"Dairy"|"Oils"|"Spices"|"Other"} Category */
/** @typedef {"breakfast"|"lunch"|"dinner"|"snack"} MealType */

const INGREDIENT_CATALOG = {
  "Fresh Produce": [
    "tomato","potato","onion","garlic","ginger","spinach","capsicum","carrot","green chilli","coriander leaves","lemon","cauliflower","peas"
  ],
  Grains: ["rice","idli rice","wheat flour","poha","rava","bread"],
  Pulses: ["chickpeas","toor dal","moong dal","rajma","chana dal","urad dal","besan"],
  Dairy: ["milk","curd","paneer","ghee","butter"],
  Oils: ["oil","mustard oil"],
  Spices: [
    "salt","turmeric","red chilli powder","coriander powder","garam masala","cumin seeds","mustard seeds","asafoetida","black pepper","curry leaves","kasuri methi","fenugreek seeds","bay leaf","cloves","cardamom","cinnamon"
  ],
  Other: ["water","sugar","poha sev","lemon juice","yogurt"]
};

const ING_TO_CAT = new Map(
  Object.entries(INGREDIENT_CATALOG).flatMap(([cat, arr]) => arr.map((n) => [n, cat]))
);

const RECIPES = [
  // Snacks / Breakfast
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

/*********************************
 * Utilities & Services
 *********************************/
const deepFreeze = (obj) => { Object.freeze(obj); Object.getOwnPropertyNames(obj).forEach((p)=>{ const v = obj[p]; if (v && (typeof v === "object" || typeof v === "function") && !Object.isFrozen(v)) deepFreeze(v); }); return obj; };
deepFreeze(INGREDIENT_CATALOG);
deepFreeze(RECIPES);

const Tokenizer = (() => {
  const MAP = new Map([
    ["chilli","green chilli"],["chilies","green chilli"],["methi leaves","kasuri methi"],["coriander","coriander leaves"],["dhaniya","coriander powder"],["jeera","cumin seeds"],["hing","asafoetida"],["atta","wheat flour"],["buttermilk","curd"],["semolina","rava"],["sooji","rava"],["yoghurt","curd"],["methi seeds","fenugreek seeds"]
  ]);
  const normalize = (s) => MAP.get(s.trim().toLowerCase()) || s.trim().toLowerCase();
  const tokenize = (text) => text.split(/[\\n,]+/).map((x)=>normalize(x)).filter(Boolean);
  return { normalize, tokenize };
})();

const Scorer = (() => {
  const WEIGHTS = { "Fresh Produce":5, Grains:4, Pulses:3, Dairy:3, Other:2, Oils:1, Spices:1 };
  const scoreRecipe = (recipe, haveSet) => { let score = 0; for (const ing of recipe.ingredients) { if (haveSet.has(ing.name)) score += WEIGHTS[ing.cat] || 0; } return score; };
  return { scoreRecipe, WEIGHTS };
})();

const Assistant = (() => {
  const SUBS = { paneer:["tofu","mushrooms"], ghee:["oil","butter"], curd:["yogurt"], yogurt:["curd"], rice:["poha","rava"], tomato:["capsicum"], onion:["asafoetida"] };
  const getSubstitutionHints = (missingNames) => { const hints=[]; const seen=new Set(); for (const n of missingNames) { const key=(n||"").toLowerCase(); if (SUBS[key] && !seen.has(key)) { hints.push(`No ${key}? Try ${SUBS[key].join(" or ")}.`); seen.add(key);} } return hints; };
  const timeNudgePredicate = (maxTime, suggestionsLen) => maxTime <= 20 && suggestionsLen === 0;
  const profileSelection = (selectedSet) => { const counts = { "Fresh Produce":0, Grains:0, Pulses:0, Dairy:0, Oils:0, Spices:0, Other:0 }; selectedSet.forEach((ing)=>{ const cat = ING_TO_CAT.get(ing) || "Other"; if (counts[cat] != null) counts[cat]++; }); const top = Object.entries(counts).sort((a,b)=> b[1]-a[1])[0]; return { counts, topCat: top && top[1] > 0 ? top[0] : null }; };
  const adaptiveNudge = ({ selectedSet }) => { const { topCat } = profileSelection(selectedSet); if (topCat === "Pulses") return "You seem to enjoy lentils. Want me to surface more dal-based ideas?"; if (topCat === "Grains") return "Plenty of grain options here. Quick pulao or upma sound good?"; return null; };
  return { getSubstitutionHints, timeNudgePredicate, adaptiveNudge };
})();

const Matcher = (() => {
  const JAIN_BLOCK = new Set(["onion","garlic","ginger"]);
  const MAIN_CATS = new Set(["Fresh Produce","Grains","Pulses","Dairy"]);

  const hasMainOverlap = (recipe, haveSet) => { for (const ing of recipe.ingredients) { if (MAIN_CATS.has(ing.cat) && haveSet.has(ing.name)) return true; } return false; };

  const matchRecipe = ({ recipe, haveSet, pantrySet, jain }) => {
    const effectiveHave = new Set([...haveSet, ...pantrySet]);
    const required = recipe.ingredients.filter((i)=>!i.optional);
    if (jain) { for (const r of required) { if (JAIN_BLOCK.has(r.name)) return { ok: false }; } }
    const missing = []; for (const r of required) { if (!effectiveHave.has(r.name)) missing.push(r.name); }
    return { ok: true, missing, score: Scorer.scoreRecipe(recipe, effectiveHave) };
  };

  const reachableIngredientUniverse = ({ haveSet, pantrySet, jain, maxMissing, maxTime, mealType, limitByMeal }) => {
    const u = new Set();
    for (const recipe of RECIPES) {
      if (maxTime && recipe.timeMin > maxTime) continue;
      if (limitByMeal && mealType && recipe.mealType !== mealType) continue;
      const m = matchRecipe({ recipe, haveSet, pantrySet, jain });
      if (!m.ok) continue;
      if (m.missing.length <= (typeof maxMissing === "number" ? maxMissing : 4)) {
        for (const ing of recipe.ingredients) u.add(ing.name);
      }
    }
    return u;
  };

  return { matchRecipe, reachableIngredientUniverse, hasMainOverlap };
})();

/*********************************
 * Helper Links (Blinkit)
 *********************************/
const mkBlinkitListLink = (items) => { const query = encodeURIComponent([...new Set(items)].join(", ")); return `https://blinkit.com/s/?q=${query}`; };
const mkBlinkitMobileUrl = (ua, items) => { const query = encodeURIComponent([...new Set(items)].join(", ")); const httpsUrl = `https://blinkit.com/s/?q=${query}`; const isAndroid = /Android/i.test(ua || ""); if (isAndroid) { const pkg = "com.grofers.customerapp"; return `intent://s/?q=${query}#Intent;scheme=https;package=${pkg};S.browser_fallback_url=${encodeURIComponent(httpsUrl)};end`; } return httpsUrl; };
const openBlinkit = (items) => { const url = mkBlinkitMobileUrl(navigator.userAgent || "", items); window.location.href = url; };

/*********************************
 * State & Hooks
 *********************************/
function useAppState() {
  const [selected, setSelected] = useState(new Set());
  const [pantry, setPantry] = useState(new Set(["salt","turmeric","oil"]));
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({ maxMissing: 2, maxTime: 60, jain: false, mealType: null, limitByMeal: false });
  const [dontHaveSpices, setDontHaveSpices] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showTests, setShowTests] = useState(false);
  const toggleSelected = (name) => setSelected((prev)=>{ const n = new Set(prev); n.has(name)?n.delete(name):n.add(name); return n; });
  const togglePantry = (name) => setPantry((prev)=>{ const n = new Set(prev); n.has(name)?n.delete(name):n.add(name); return n; });
  const clearSelections = () => setSelected(new Set());
  const toggleFavorite = (id) => setFavorites((prev)=>{ const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  return { selected, pantry, favorites, filters, dontHaveSpices, selectedRecipeId, showTests,
    setFilters, setDontHaveSpices, setSelectedRecipeId, setShowTests, toggleSelected, togglePantry, clearSelections, toggleFavorite };
}

function useSpeechInput(onTranscript) {
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);
  useEffect(()=>{
    if (typeof window === "undefined") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR(); rec.lang = "en-IN"; rec.interimResults = false; rec.continuous = false;
    rec.onresult = (e)=>{ const txt = Array.from(e.results).map((r)=>r[0].transcript).join(" "); onTranscript(txt); };
    rec.onend = ()=>setListening(false);
    recRef.current = rec;
  }, [onTranscript]);
  const start = ()=>{ if (!recRef.current) return alert("Voice input not supported in this browser."); setListening(true); recRef.current.start(); };
  const stop = ()=>{ if (recRef.current) recRef.current.stop(); };
  return { listening, start, stop };
}

function useDerived(app) {
  const haveSet = app.selected; const pantrySet = app.pantry; const { jain, maxMissing, maxTime, mealType, limitByMeal } = app.filters;
  const reachableUniverse = useMemo(()=>Matcher.reachableIngredientUniverse({ haveSet, pantrySet, jain, maxMissing, maxTime, mealType, limitByMeal }), [haveSet, pantrySet, jain, maxMissing, maxTime, mealType, limitByMeal]);
  const suggestions = useMemo(()=>{
    const list = [];
    for (const r of RECIPES) {
      if (maxTime && r.timeMin > maxTime) continue;
      if (limitByMeal && mealType && r.mealType !== mealType) continue;
      const m = Matcher.matchRecipe({ recipe: r, haveSet, pantrySet, jain });
      if (!m.ok) continue;
      if (haveSet.size > 0 && !Matcher.hasMainOverlap(r, haveSet)) continue;
      if (m.missing.length <= maxMissing) list.push({ recipe: r, missing: m.missing, score: m.score });
    }
    list.sort((a,b)=> b.score - a.score || a.recipe.timeMin - b.recipe.timeMin);
    return list;
  }, [haveSet, pantrySet, jain, maxMissing, maxTime, mealType, limitByMeal]);
  const selectedRecipe = useMemo(()=> suggestions.find((s)=>s.recipe.id === app.selectedRecipeId) || null, [suggestions, app.selectedRecipeId]);
  return { reachableUniverse, suggestions, selectedRecipe };
}

/*********************************
 * UI Building Blocks
 *********************************/
// Friendly inline assistant card
const NudgeCard = ({ tone = "blue", children, actionLabel, onAction }) => {
  const toneClasses = tone === "green"
    ? "bg-green-50 border-green-200 text-green-800"
    : tone === "emerald" ? "bg-emerald-50 border-emerald-200 text-emerald-800"
    : tone === "yellow" ? "bg-yellow-50 border-yellow-200 text-yellow-800"
    : tone === "purple" ? "bg-purple-50 border-purple-200 text-purple-800"
    : "bg-blue-50 border-blue-200 text-blue-800";
  return (
    <div className={`mt-4 p-3 rounded-lg border text-sm ${toneClasses}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">{children}</div>
        {actionLabel && (
          <button className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50" onClick={onAction}>{actionLabel}</button>
        )}
      </div>
    </div>
  );
};

const Pill = ({ active, onClick, children, title }) => (
  <button className={`px-3 py-1 rounded-full border text-sm mr-2 mb-2 focus:outline-none focus:ring transition ${active?"bg-emerald-600 text-white border-emerald-600":"bg-white border-gray-300 hover:bg-gray-50"}`} aria-pressed={active} onClick={onClick} title={title}>{children}</button>
);

const Section = ({ title, icon, children, actions }) => (
  <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-4">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">{icon}{title}</h2>
      <div className="flex gap-2">{actions}</div>
    </div>
    {children}
  </section>
);

const Disclosure = ({ title, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button className="w-full flex items-center justify-between px-2 py-2 rounded-lg bg-white border hover:bg-gray-50" aria-expanded={open} onClick={()=>setOpen((o)=>!o)}>
        <span className="font-semibold text-lg">{title}</span>
        <span className="text-xl leading-none select-none">{open ? '-' : '+'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/*********************************
 * Ingredient Picker
 *********************************/
function IngredientPicker({ app, derived }) {
  const [freeText, setFreeText] = useState("");
  const [search, setSearch] = useState("");
  const onTranscript = (t) => setFreeText(t);
  const speech = useSpeechInput(onTranscript);
  const addFreeText = () => { Tokenizer.tokenize(freeText).forEach((tok)=>{ const exists = Object.values(INGREDIENT_CATALOG).some((arr)=>arr.includes(tok)); if (exists) app.toggleSelected(tok); }); setFreeText(""); };
  return (
    <Section title="Ingredients" icon={<Search className="w-5 h-5" />} actions={<button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-white hover:bg-gray-50" onClick={app.clearSelections}><RefreshCcw className="w-4 h-4"/> Clear</button>}>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 max-h-80 overflow-y-auto pr-2">
          <input value={search} onChange={(e)=>setSearch(e.target.value.toLowerCase())} placeholder="Search ingredient..." className="mb-3 w-full border rounded-lg px-3 py-2" />
          {Object.entries(INGREDIENT_CATALOG).map(([cat, items])=> (
            <div key={cat} className="mb-3">
              <div className="sticky top-0 bg-white text-sm font-medium text-gray-700 mb-1">{cat}</div>
              <div className="flex flex-wrap">
                {items.filter((it)=> (derived.reachableUniverse.has(it) || app.selected.has(it)) && (!search || it.toLowerCase().includes(search))).map((it)=> (
                  <Pill key={it} active={app.selected.has(it)} onClick={()=>app.toggleSelected(it)}>{it}</Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium">Quick add</label>
          <div className="flex gap-2">
            <input value={freeText} onChange={(e)=>setFreeText(e.target.value)} placeholder="e.g., tomato, rice, paneer" className="flex-1 border rounded-lg px-3 py-2" />
            <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={addFreeText}>Add</button>
            <button className={`px-3 py-2 rounded-lg border ${speech.listening?"bg-red-50":"bg-white"}`} onClick={speech.listening?speech.stop:speech.start} aria-pressed={speech.listening} aria-label="Voice input">{speech.listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</button>
          </div>
          <PantryManager app={app} />
        </div>
      </div>
    </Section>
  );
}

function PantryManager({ app }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50" onClick={()=>setOpen((v)=>!v)}><ListChecks className="w-4 h-4"/> Pantry Mode</button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 p-3 border rounded-xl">
            <div className="text-sm text-gray-700 mb-2">Mark items always available</div>
            {Object.entries(INGREDIENT_CATALOG).map(([cat, items])=> (
              <div key={cat} className="mb-2">
                <div className="text-xs font-medium text-gray-600">{cat}</div>
                <div className="flex flex-wrap">
                  {items.map((it)=> (<Pill key={it} active={app.pantry.has(it)} onClick={()=>app.togglePantry(it)}>{it}</Pill>))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*********************************
 * Filters (opt-in meal type)
 *********************************/
function FiltersBar({ app }) {
  const [open, setOpen] = useState(false);
  return (
    <Section title="Preferences" icon={<Filter className="w-5 h-5" />} actions={<button onClick={()=>setOpen((o)=>!o)} className="text-sm underline">{open?"Hide":"Show"}</button>}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid md:grid-cols-5 gap-4 items-center">
            <div>
              <label className="text-sm font-medium">Allow up to {app.filters.maxMissing} missing items</label>
              <input type="range" min={0} max={4} value={app.filters.maxMissing} onChange={(e)=>app.setFilters({ ...app.filters, maxMissing: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <label className="text-sm font-medium">Time limit: {app.filters.maxTime} min</label>
              <input type="range" min={10} max={120} step={5} value={app.filters.maxTime} onChange={(e)=>app.setFilters({ ...app.filters, maxTime: Number(e.target.value) })} className="w-full" />
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={app.filters.jain} onChange={(e)=>app.setFilters({ ...app.filters, jain: e.target.checked })}/> Jain-friendly</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={app.dontHaveSpices} onChange={(e)=>app.setDontHaveSpices(e.target.checked)}/> No spices/oil</label>
            <div className="flex items-center gap-2">
              <input id="limitByMeal" type="checkbox" checked={app.filters.limitByMeal} onChange={(e)=>app.setFilters({ ...app.filters, limitByMeal: e.target.checked })} />
              <label htmlFor="limitByMeal" className="text-sm font-medium">Limit by meal type</label>
            </div>
            {app.filters.limitByMeal && (
              <div className="md:col-span-5 flex items-center gap-2">
                <label className="text-sm">Meal:</label>
                <select className="border rounded-lg px-3 py-2" value={app.filters.mealType || "breakfast"} onChange={(e)=>app.setFilters({ ...app.filters, mealType: e.target.value })}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

/*********************************
 * Suggestions
 *********************************/
function RecipeList({ app, derived }) {
  const empty = app.selected.size === 0;
  return (
    <Section title="Suggestions" icon={<ChefHat className="w-5 h-5" />} actions={<button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-white hover:bg-gray-50" onClick={()=>app.setShowTests((s)=>!s)}><Sparkles className="w-4 h-4"/> {app.showTests?"Hide":"Show"} self-tests</button>}>
      {empty ? (
        <StarterIdeas app={app} />
      ) : derived.suggestions.length === 0 ? (
        <div className="text-gray-600">No matches. Try adjusting preferences or add another main ingredient.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {derived.suggestions.map(({ recipe, missing, score }) => (
            <motion.article key={recipe.id} layout className="border rounded-2xl p-4 flex flex-col">
              <header className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">{recipe.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border">{score} pts</span>
                  </h3>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4"/> {recipe.timeMin} min
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border capitalize">{recipe.mealType}</span>
                    {recipe.jainFriendly && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Jain-friendly</span>}
                  </div>
                </div>
                <button className={`p-2 rounded-lg border ${app.favorites.has(recipe.id)?"bg-pink-50":"bg-white"}`} onClick={()=>app.toggleFavorite(recipe.id)}>{app.favorites.has(recipe.id)?<Heart className="w-4 h-4"/>:<HeartOff className="w-4 h-4"/>}</button>
              </header>
              <div className="text-sm mb-2">
                {missing.length === 0 ? <span className="text-emerald-700">You have everything!</span> : (<div className="flex flex-wrap gap-2">Missing: {missing.map((m)=> <Pill key={m} onClick={()=>app.toggleSelected(m)}>{m}</Pill>)}</div>)}
              </div>
              <div className="mt-auto flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={()=>app.setSelectedRecipeId(recipe.id)}>View</button>
                {app.favorites.has(recipe.id) && (<span className="inline-flex items-center text-xs px-2 rounded bg-gray-100 border">★ Favorite</span>)}
              </div>
            </motion.article>
          ))}
        </div>
      )}
      {app.showTests && <SelfTests />}

      {/* Assistant – empathetic messages */}
      {derived.suggestions.length === 0 && (
        <NudgeCard tone="emerald">
          🤔 Hmm, I couldn't find a good match. Maybe try adding a grain like rice or wheat flour to unlock more dishes.
        </NudgeCard>
      )}
      {app.selected.size === 0 && (
        <NudgeCard tone="blue">
          👋 Hi there! Start by picking a main ingredient you have, and I'll suggest dishes around it.
        </NudgeCard>
      )}
      {derived.suggestions.some(s=> s.missing.length===0) && (
        <NudgeCard tone="green">
          ✅ Great news, you have everything you need for at least one recipe. Ready to start cooking?
        </NudgeCard>
      )}
      {/* Time relaxation nudge */}
      {Assistant.timeNudgePredicate(app.filters.maxTime, derived.suggestions.length) && (
        <NudgeCard tone="purple" actionLabel="Show up to 45 min" onAction={() => app.setFilters({ ...app.filters, maxTime: 45 })}>
          ⏱ Lots of tasty dishes take a bit longer. Want me to relax the time limit?
        </NudgeCard>
      )}
      {/* Dynamic ingredient unlocker: suggest a few high-impact mains to tap */}
      {(() => {
        if (app.selected.size === 0 || derived.suggestions.length >= 3) return null;
        const MAIN = new Set(["Fresh Produce","Grains","Pulses","Dairy"]);
        const candidates = Array.from(derived.reachableUniverse)
          .filter(n => !app.selected.has(n) && MAIN.has(ING_TO_CAT.get(n)))
          .slice(0, 3);
        if (candidates.length === 0) return null;
        return (
          <NudgeCard tone="blue">
            🔓 Add one of these to unlock more ideas: {candidates.map(c => (
              <Pill key={c} onClick={() => app.toggleSelected(c)}>{c}</Pill>
            ))}
          </NudgeCard>
        );
      })()}
    </Section>
  );
}

function StarterIdeas({ app }) {
  const ideas = useMemo(()=> {
    const list = RECIPES.filter(r => !app.filters.limitByMeal || (app.filters.mealType && r.mealType === app.filters.mealType));
    return list.slice(0, 3);
  }, [app.filters.limitByMeal, app.filters.mealType]);
  return (
    <div>
      <div className="text-gray-600 mb-3">Starter ideas (select ingredients to begin):</div>
      <div className="grid md:grid-cols-3 gap-3">
        {ideas.map((r) => (
          <div key={r.id} className="border rounded-xl p-3">
            <div className="font-medium mb-1">{r.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2"><Clock className="w-4 h-4"/> {r.timeMin} min <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border capitalize">{r.mealType}</span></div>
            <div className="mt-2 flex flex-wrap">
              {r.ingredients.slice(0,5).map((i)=> (<Pill key={i.name} active={app.selected.has(i.name)} onClick={()=>app.toggleSelected(i.name)}>{i.name}</Pill>))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*********************************
 * Recipe Detail (Cook Mode + Shopping List)
 *********************************/
function groupByCategory(list) {
  const out = {};
  for (const n of list) {
    const cat = ING_TO_CAT.get(n) || "Other";
    (out[cat] ||= []).push(n);
  }
  return out;
}

function RecipeDetail({ app, derived }) {
  const sel = derived.selectedRecipe; if (!sel) return null; const { recipe } = sel;
  const [spiceMissing, setSpiceMissing] = useState([]);
  useEffect(()=>setSpiceMissing([]), [recipe.id]);
  const effectiveHave = new Set([...app.selected, ...app.pantry]);
  const requiredMissing = recipe.ingredients.filter((i)=>!i.optional && !effectiveHave.has(i.name));
  const spicesToShow = app.dontHaveSpices ? (recipe.spicesOil || []) : [];
  const copyList = async ()=>{ const lines = [...requiredMissing.map(i=>i.name), ...spiceMissing]; await navigator.clipboard.writeText(lines.join("\\n")); alert("Shopping list copied to clipboard."); };
  const groups = groupByCategory(requiredMissing.map(i=>i.name));
  const subHints = Assistant.getSubstitutionHints(requiredMissing.map(i=>i.name));

  return (
    <Section title={recipe.name} icon={<ChefHat className="w-5 h-5"/>} actions={
      <div className="flex gap-2">
        <button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-white hover:bg-gray-50" onClick={()=>app.setSelectedRecipeId(null)}><X className="w-4 h-4"/> Close</button>
      </div>
    }>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2"><CookMode steps={recipe.steps} /></div>
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2"><ShoppingCart className="w-4 h-4"/> Shopping List</h4>
          {Object.entries(groups).map(([cat, items])=> (
            <div key={cat} className="mb-2"><div className="text-xs font-medium text-gray-600">{cat}</div>
              <ul className="list-disc list-inside text-sm">{items.map((m)=> <li key={m}>{m}</li>)}</ul>
            </div>
          ))}
          {spicesToShow.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">Spices/Oil (tick ones you are missing)</div>
              <div className="flex flex-wrap gap-2">
                {spicesToShow.map((s)=>{ const checked = spiceMissing.includes(s); return (
                  <label key={s} className={`px-2 py-1 rounded-full border text-sm cursor-pointer ${checked?"bg-amber-50 border-amber-300":"bg-white"}`}>
                    <input type="checkbox" className="mr-2" checked={checked} onChange={(e)=> setSpiceMissing((prev)=> e.target.checked ? [...prev, s] : prev.filter((x)=>x!==s)) } />
                    {s}
                  </label>
                );})}
              </div>
            </div>
          )}
          {subHints.length > 0 && (
            <NudgeCard tone="blue">💡 {subHints.join(" ")}</NudgeCard>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={copyList}>Copy list</button>
            <button className="px-3 py-2 rounded-lg border inline-flex items-center gap-2" onClick={() => openBlinkit([...requiredMissing.map(i=>i.name), ...spiceMissing])}>Buy on Blinkit</button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/*********************************
 * Cook Mode
 *********************************/
function CookMode({ steps }) {
  const [idx, setIdx] = useState(0);
  const total = steps.length;
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(total - 1, i + 1));
  return (
    <div className="border rounded-xl p-3">
      <div className="text-sm text-gray-600 mb-2">Step {idx + 1}/{total}</div>
      <div className="text-base">{steps[idx]}</div>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-2 rounded-lg border" onClick={prev} disabled={idx===0}>Prev</button>
        <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={next} disabled={idx===total-1}>Next</button>
      </div>
    </div>
  );
}

/*********************************
 * Self Tests
 *********************************/
function SelfTests() {
  const tests = useMemo(()=> buildTests(), []);
  return (
    <div className="mt-4 border rounded-2xl p-4 bg-slate-50">
      <div className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Self-tests</div>
      <ul className="space-y-2">
        {tests.map((t)=> (
          <li key={t.name} className="flex items-start gap-2">
            {t.pass ? <Check className="w-4 h-4 text-emerald-600"/> : <X className="w-4 h-4 text-red-600"/>}
            <div><div className="font-medium">{t.name}</div>{!t.pass && <div className="text-sm text-red-700">{t.message || "Failed"}</div>}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildTests() {
  const set = (arr)=> new Set(arr);
  // 1) Matching logic
  const m1 = Matcher.matchRecipe({ recipe: RECIPES.find((r)=>r.id === "aloo-gobi"), haveSet: set(["potato","cauliflower"]), pantrySet: set(["salt","turmeric","oil"]), jain: true });
  const t1 = { name: "Matching respects optional spices/masalas", pass: m1.ok && m1.missing.length === 0 };
  // 2) Narrowing
  const uni = Matcher.reachableIngredientUniverse({ haveSet: set(["poha"]), pantrySet: set(["salt","turmeric","oil"]), jain: false, maxMissing: 2, maxTime: 60 });
  const t2 = { name: "Progressive narrowing leaves only reachable ingredients", pass: uni.has("onion") && !uni.has("rajma") };
  // 3) Tokenizer
  const toks = Tokenizer.tokenize("green chilli, mustard seeds, jeera, semolina");
  const t3 = { name: "Tokenizer normalizes synonyms", pass: toks.includes("green chilli") && toks.includes("mustard seeds") && toks.includes("cumin seeds") && toks.includes("rava") };
  // 4) Shopping list scope
  const r = RECIPES.find((x)=>x.id === "poha");
  const have = set(["poha","onion","turmeric","salt"]);
  const m4 = Matcher.matchRecipe({ recipe: r, haveSet: have, pantrySet: set(["oil"]), jain: false });
  const t4 = { name: "Shopping list only required items by default", pass: m4.missing.length === 0 };
  // 5) Main-ingredient gating
  const poha = RECIPES.find((x)=> x.id === "poha");
  const chana = RECIPES.find((x)=> x.id === "chana-masala");
  const t5 = { name: "Suggestions require a selected main ingredient", pass: !Matcher.hasMainOverlap(poha, set(["chickpeas"])) && Matcher.hasMainOverlap(chana, set(["chickpeas"])) };
  // 6) Meal-type filter
  const suggAll = (()=>{ const haveSet = set(["rava"]); const pantrySet = set(["salt","oil"]); const jain = true; const maxMissing = 2; const maxTime = 60; const limitByMeal = false; const mealType = null; const u = Matcher.reachableIngredientUniverse({ haveSet, pantrySet, jain, maxMissing, maxTime, limitByMeal, mealType }); return u.has("rava"); })();
  const suggBreakfastOnly = (()=>{ const haveSet = set(["rava"]); const pantrySet = set(["salt","oil"]); const jain = true; const maxMissing = 2; const maxTime = 60; const limitByMeal = true; const mealType = "breakfast"; const res = []; for (const rr of RECIPES) { if (maxTime && rr.timeMin > maxTime) continue; if (limitByMeal && mealType && rr.mealType !== mealType) continue; const m = Matcher.matchRecipe({ recipe: rr, haveSet, pantrySet, jain }); if (!m.ok) continue; if (haveSet.size > 0 && !Matcher.hasMainOverlap(rr, haveSet)) continue; if (m.missing.length <= maxMissing) res.push(rr.id);} return res.includes("upma") && !res.includes("rajma-chawal"); })();
  const t6 = { name: "Meal-type filter limits results only when enabled", pass: suggAll && suggBreakfastOnly };
  // 7) Link building: Blinkit uses grocery list
  const bLink = mkBlinkitListLink(["chickpeas","tomato","oil"]);
  const t7 = { name: "Blinkit link builds from grocery list", pass: bLink.includes(encodeURIComponent("chickpeas")) };
  // 8) Assistant substitutions
  const t8 = { name: "Assistant suggests paneer substitutions", pass: Assistant.getSubstitutionHints(["paneer"]).join(" ").toLowerCase().includes("tofu") };
  // 9) Time nudge predicate logic
  const t9 = { name: "Time nudge predicate logic", pass: Assistant.timeNudgePredicate(20, 0) && !Assistant.timeNudgePredicate(45, 0) };
  // 10) Blinkit deep link intent for Android UA
  const uaAndroid = "Mozilla/5.0 (Linux; Android 14; Pixel) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Mobile Safari/537.36";
  const deepAndroid = mkBlinkitMobileUrl(uaAndroid, ["rice","oil"]);
  const t10 = { name: "Blinkit Android opens via intent://", pass: /^intent:\/\//.test(deepAndroid) && deepAndroid.includes("com.grofers.customerapp") };
  // 11) iOS uses https universal link
  const uaiOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
  const deepIOS = mkBlinkitMobileUrl(uaiOS, ["rice","oil"]);
  const t11 = { name: "Blinkit iOS uses https universal link", pass: /^https:\/\//.test(deepIOS) && deepIOS.includes("blinkit.com/s/") };
  return [t1,t2,t3,t4,t5,t6,t7,t8,t9,t10,t11];
}

/*********************************
 * Root App
 *********************************/
export default function MealMateApp() {
  const app = useAppState(); const derived = useDerived(app);
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><ChefHat className="w-7 h-7"/> MealMate</h1>
        <div className="text-sm text-gray-600">Your friendly meal planner</div>
      </header>

      <Disclosure title="1. Pick Main Ingredients" defaultOpen>
        <IngredientPicker app={app} derived={derived} />
      </Disclosure>

      <Disclosure title="2. Preferences">
        <FiltersBar app={app} />
      </Disclosure>

      <Disclosure title="3. Suggestions">
        <RecipeList app={app} derived={derived} />
      </Disclosure>

      {derived.selectedRecipe && (
        <Disclosure title="4. Recipe Detail" defaultOpen>
          <RecipeDetail app={app} derived={derived} />
        </Disclosure>
      )}

      <footer className="mt-8 text-xs text-gray-500 flex items-center gap-2">
        <Star className="w-3 h-3"/> Favorites are remembered per session. Add more recipes easily in RECIPES registry.
      </footer>
    </div>
  );
}
