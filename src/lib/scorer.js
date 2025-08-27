const WEIGHTS = { "Fresh Produce":5, Grains:4, Pulses:3, Dairy:3, Other:2, Oils:1, Spices:1 };

const scoreRecipe = (recipe, haveSet) => {
  let score = 0;
  for (const ing of recipe.ingredients) {
    if (haveSet.has(ing.name)) score += WEIGHTS[ing.cat] || 0;
  }
  return score;
};

export const Scorer = { WEIGHTS, scoreRecipe };
