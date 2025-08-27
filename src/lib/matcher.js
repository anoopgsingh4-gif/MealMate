import { Scorer } from "./scorer";
import { RECIPES } from "../data/recipes";

const JAIN_BLOCK = new Set(["onion","garlic","ginger"]);
const MAIN_CATS = new Set(["Fresh Produce","Grains","Pulses","Dairy"]);

const hasMainOverlap = (recipe, haveSet) => {
  for (const ing of recipe.ingredients) {
    if (MAIN_CATS.has(ing.cat) && haveSet.has(ing.name)) return true;
  }
  return false;
};

const matchRecipe = ({ recipe, haveSet, pantrySet, jain }) => {
  const effectiveHave = new Set([...haveSet, ...pantrySet]);
  const required = recipe.ingredients.filter((i)=>!i.optional);
  if (jain) { for (const r of required) { if (JAIN_BLOCK.has(r.name)) return { ok:false }; } }
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

export const Matcher = { matchRecipe, reachableIngredientUniverse, hasMainOverlap };
