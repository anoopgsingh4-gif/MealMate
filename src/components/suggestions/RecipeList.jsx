import React from "react";
import { ChefHat, Clock, Sparkles, Heart, HeartOff } from "lucide-react";

import Section from "../primitives/Section.jsx";
import Card from "../primitives/Card.jsx";
import Button from "../primitives/Button.jsx";
import Pill from "../primitives/Pill.jsx";
import NudgeCard from "../primitives/NudgeCard.jsx";

import { buildTests } from "../../lib/tests";
import { Assistant } from "../../lib/assistant";
import { ING_TO_CAT } from "../../data/ingredients";

/** Inline self-tests panel (uses lib/tests) */
function SelfTests() {
  const tests = buildTests();
  return (
    <div className="mt-4 border rounded-xl p-4 bg-slate-50">
      <div className="font-semibold mb-2 flex items-center gap-2">
        <Sparkles className="w-4 h-4" /> Self-tests
      </div>
      <ul className="space-y-2">
        {tests.map((t) => (
          <li key={t.name} className="flex items-start gap-2">
            {t.pass ? (
              <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] mt-[2px]">✓</span>
            ) : (
              <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] mt-[2px]">×</span>
            )}
            <div>
              <div className="font-medium">{t.name}</div>
              {!t.pass && (
                <div className="text-sm text-red-700">{t.message || "Failed"}</div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Starter ideas shown when nothing is selected */
function StarterIdeas({ app, suggestions }) {
  const ideas = suggestions.slice(0, 3); // suggestions already sorted in useDerived
  return (
    <div>
      <div className="text-gray-600 mb-3">
        Starter ideas (select ingredients to begin):
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {ideas.map(({ recipe }) => (
          <Card key={recipe.id} className="p-3">
            <div className="font-medium mb-1">{recipe.name}</div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" /> {recipe.timeMin} min
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border capitalize">
                {recipe.mealType}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap">
              {recipe.ingredients.slice(0, 5).map((i) => (
                <Pill key={i.name} onClick={() => app.toggleSelected(i.name)}>
                  {i.name}
                </Pill>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function RecipeList({ app, derived }) {
  const empty = app.selected.size === 0;

  // Assistant nudges
  const showTimeNudge = Assistant.timeNudgePredicate(
    app.filters.maxTime,
    derived.suggestions.length
  );

  // Dynamic “unlock” nudge: propose a few main-category ingredients that unlock more ideas
  let unlockCandidates = [];
  if (app.selected.size > 0 && derived.suggestions.length < 3) {
    const MAIN = new Set(["Fresh Produce", "Grains", "Pulses", "Dairy"]);
    unlockCandidates = Array.from(derived.reachableUniverse)
      .filter((n) => !app.selected.has(n) && MAIN.has(ING_TO_CAT.get(n)))
      .slice(0, 3);
  }

  return (
    <Section
      title="Suggestions"
      icon={<ChefHat className="w-5 h-5" />}
      actions={
        <Button
          variant="outline"
          onClick={() => app.setShowTests((s) => !s)}
          title="Toggle self-tests"
        >
          <Sparkles className="w-4 h-4" /> {app.showTests ? "Hide" : "Show"} self-tests
        </Button>
      }
    >
      {empty ? (
        <StarterIdeas app={app} suggestions={derived.suggestions} />
      ) : derived.suggestions.length === 0 ? (
        <div className="text-gray-600">
          No matches. Try adjusting preferences or add another main ingredient.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {derived.suggestions.map(({ recipe, missing, score }) => (
            <Card key={recipe.id} className="p-4 flex flex-col">
              <header className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {recipe.name}
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border">
                      {score} pts
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {recipe.timeMin} min
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border capitalize">
                      {recipe.mealType}
                    </span>
                    {recipe.jainFriendly && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        Jain-friendly
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className={app.favorites.has(recipe.id) ? "bg-pink-50" : ""}
                  onClick={() => app.toggleFavorite(recipe.id)}
                  aria-pressed={app.favorites.has(recipe.id)}
                  title={
                    app.favorites.has(recipe.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {app.favorites.has(recipe.id) ? (
                    <Heart className="w-4 h-4" />
                  ) : (
                    <HeartOff className="w-4 h-4" />
                  )}
                </Button>
              </header>

              <div className="text-sm mb-2">
                {missing.length === 0 ? (
                  <span className="text-emerald-700">You have everything!</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    Missing: {missing.map((m) => <Pill key={m}>{m}</Pill>)}
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <Button onClick={() => app.setSelectedRecipeId(recipe.id)}>
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Self-tests panel */}
      {app.showTests && <SelfTests />}

      {/* Assistant – empathetic nudges */}
      {derived.suggestions.length === 0 && (
        <NudgeCard tone="emerald">
          🤔 Hmm, I couldn't find a good match. Maybe add a grain like rice or wheat flour to unlock more dishes.
        </NudgeCard>
      )}

      {app.selected.size === 0 && (
        <NudgeCard tone="blue">
          👋 Hi there! Start by picking a main ingredient you have, and I’ll suggest dishes around it.
        </NudgeCard>
      )}

      {derived.suggestions.some((s) => s.missing.length === 0) && (
        <NudgeCard tone="green">
          ✅ Great news — you have everything for at least one recipe. Ready to start cooking?
        </NudgeCard>
      )}

      {showTimeNudge && (
        <NudgeCard
          tone="purple"
          actionLabel="Show up to 45 min"
          onAction={() => app.setFilters({ ...app.filters, maxTime: 45 })}
        >
          ⏱ Lots of great dishes take a bit longer. Want me to relax the time limit?
        </NudgeCard>
      )}

      {unlockCandidates.length > 0 && (
        <NudgeCard tone="blue">
          🔓 Add one of these to unlock more ideas:&nbsp;
          {unlockCandidates.map((c) => (
            <Pill key={c} onClick={() => app.toggleSelected(c)}>
              {c}
            </Pill>
          ))}
        </NudgeCard>
      )}
    </Section>
  );
}
