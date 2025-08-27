import React from "react";
import { ChefHat, Clock, Sparkles, Heart, HeartOff } from "lucide-react";

const Pill = ({ onClick, children }) => (
  <button className="px-3 py-1 rounded-full border text-sm" onClick={onClick}>{children}</button>
);

function SelfTests() { return null; } // optional wire-in later

function StarterIdeas({ app, list }) {
  const ideas = list.slice(0,3);
  return (
    <div>
      <div className="text-gray-600 mb-3">Starter ideas (select ingredients to begin):</div>
      <div className="grid md:grid-cols-3 gap-3">
        {ideas.map((r)=>(
          <div key={r.recipe.id} className="border rounded-xl p-3">
            <div className="font-medium mb-1">{r.recipe.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4"/> {r.recipe.timeMin} min
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border capitalize">{r.recipe.mealType}</span>
            </div>
            <div className="mt-2 flex flex-wrap">
              {r.recipe.ingredients.slice(0,5).map((i)=>(
                <Pill key={i.name} onClick={()=>app.toggleSelected(i.name)}>{i.name}</Pill>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RecipeList({ app, derived }) {
  const empty = app.selected.size === 0;
  return (
    <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <ChefHat className="w-5 h-5"/> Suggestions
        </h2>
        <button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-white hover:bg-gray-50" onClick={()=>app.setShowTests(s=>!s)}>
          <Sparkles className="w-4 h-4"/> {app.showTests?"Hide":"Show"} self-tests
        </button>
      </div>

      {empty ? (
        <StarterIdeas app={app} list={derived.suggestions}/>
      ) : derived.suggestions.length === 0 ? (
        <div className="text-gray-600">No matches. Try adjusting preferences or add another main ingredient.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {derived.suggestions.map(({ recipe, missing, score })=>(
            <article key={recipe.id} className="border rounded-2xl p-4 flex flex-col">
              <header className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {recipe.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border">{score} pts</span>
                  </h3>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4"/> {recipe.timeMin} min
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border capitalize">{recipe.mealType}</span>
                    {recipe.jainFriendly && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Jain-friendly</span>}
                  </div>
                </div>
                <button className={`p-2 rounded-lg border ${app.favorites.has(recipe.id)?"bg-pink-50":"bg-white"}`} onClick={()=>app.toggleFavorite(recipe.id)}>
                  {app.favorites.has(recipe.id)?<Heart className="w-4 h-4"/>:<HeartOff className="w-4 h-4"/>}
                </button>
              </header>
              <div className="text-sm mb-2">
                {missing.length===0 ? "You have everything!" : (
                  <div className="flex flex-wrap gap-2">Missing: {missing.join(", ")}</div>
                )}
              </div>
              <div className="mt-auto">
                <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={()=>app.setSelectedRecipeId(recipe.id)}>View</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {app.showTests && <SelfTests/>}
    </section>
  );
}
