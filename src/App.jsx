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

import React from "react";
import { ChefHat, Star } from "lucide-react";

import Disclosure from "./components/primitives/Disclosure.jsx";
import IngredientPicker from "./components/ingredients/IngredientPicker.jsx";
import FiltersBar from "./components/filters/FiltersBar.jsx";
import RecipeList from "./components/suggestions/RecipeList.jsx";
import RecipeDetail from "./components/recipe/RecipeDetail.jsx";
import { useAppState } from "./hooks/useAppState.js";
import { useDerived } from "./hooks/useDerived.js";

export default function App() {
  const app = useAppState();
  const derived = useDerived(app);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <ChefHat className="w-7 h-7" /> MealMate
        </h1>
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
        <Star className="w-3 h-3" />
        Favorites are remembered per session. Add more recipes easily in RECIPES registry.
      </footer>
    </div>
  );
}
