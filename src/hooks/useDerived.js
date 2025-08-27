import { useMemo } from "react";
import { Matcher } from "../lib/matcher";
import { RECIPES } from "../data/recipes";

/**
 * useDerived
 * ----------
 * Derived state based on current app selections, pantry, and filters.
 *
 * @param {object} app - the object returned by useAppState()
 * @returns {object} { reachableUniverse, suggestions, selectedRecipe }
 */
export function useDerived(app) {
  const haveSet = app.selected;
  const pantrySet = app.pantry;
  const { jain, maxMissing, maxTime, mealType, limitByMeal } = app.filters;

  // Which ingredients are still “reachable” given current selection/pantry
  const reachableUniverse = useMemo(
    () =>
      Matcher.reachableIngredientUniverse({
        haveSet,
        pantrySet,
        jain,
        maxMissing,
        maxTime,
        mealType,
        limitByMeal,
      }),
    [haveSet, pantrySet, jain, maxMissing, maxTime, mealType, limitByMeal]
  );

  // Build the live list of recipe suggestions
  const suggestions = useMemo(() => {
    const list = [];
    for (const r of RECIPES) {
      if (maxTime && r.timeMin > maxTime) continue;
      if (limitByMeal && mealType && r.mealType !== mealType) continue;

      const m = Matcher.matchRecipe({ recipe: r, haveSet, pantrySet, jain });
      if (!m.ok) continue;

      // Enforce main-ingredient gating
      if (haveSet.size > 0 && !Matcher.hasMainOverlap(r, haveSet)) continue;

      // Only include if missing items within limit
      if (m.missing.length <= maxMissing) {
        list.push({ recipe: r, missing: m.missing, score: m.score });
      }
    }

    // Sort by score (higher first), then shorter cooking time
    list.sort((a, b) => b.score - a.score || a.recipe.timeMin - b.recipe.timeMin);
    return list;
  }, [haveSet, pantrySet, jain, maxMissing, maxTime, mealType, limitByMeal]);

  // Find the currently selected recipe
  const selectedRecipe = useMemo(
    () => suggestions.find((s) => s.recipe.id === app.selectedRecipeId) || null,
    [suggestions, app.selectedRecipeId]
  );

  return { reachableUniverse, suggestions, selectedRecipe };
}
