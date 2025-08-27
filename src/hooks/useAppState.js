import { useState } from "react";

export function useAppState() {
  const [selected, setSelected] = useState(new Set());
  const [pantry, setPantry] = useState(new Set(["salt","turmeric","oil"]));
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({ maxMissing: 2, maxTime: 60, jain: false, mealType: null, limitByMeal: false });
  const [dontHaveSpices, setDontHaveSpices] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [showTests, setShowTests] = useState(false);

  const toggleSelected = (name) => setSelected((prev)=>{ const n = new Set(prev); n.has(name)?n.delete(name):n.add(name); return n; });
  const togglePantry = (name)  => setPantry((prev)=>{ const n = new Set(prev); n.has(name)?n.delete(name):n.add(name); return n; });
  const toggleFavorite = (id)  => setFavorites((prev)=>{ const n = new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });
  const clearSelections = () => setSelected(new Set());

  return { selected, pantry, favorites, filters, dontHaveSpices, selectedRecipeId, showTests,
    setFilters, setDontHaveSpices, setSelectedRecipeId, setShowTests,
    toggleSelected, togglePantry, clearSelections, toggleFavorite };
}
