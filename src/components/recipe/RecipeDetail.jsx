import React, { useEffect, useMemo, useState } from "react";
import { ChefHat, ShoppingCart, X, Clock } from "lucide-react";
import { ING_TO_CAT } from "../../data/ingredients";
import { Assistant } from "../../lib/assistant";
import { openBlinkit } from "../../lib/links";

/** Group ingredient names by catalog category for tidy lists */
function groupByCategory(list) {
  const out = {};
  for (const n of list) {
    const cat = ING_TO_CAT.get(n) || "Other";
    (out[cat] ||= []).push(n);
  }
  return out;
}

/** Simple guided cook mode */
function CookMode({ steps }) {
  const [idx, setIdx] = useState(0);
  const total = steps.length;
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(total - 1, i + 1));

  return (
    <div className="border rounded-xl p-3">
      <div className="text-sm text-gray-600 mb-2">
        Step {idx + 1}/{total}
      </div>
      <div className="text-base">{steps[idx]}</div>
      <div className="mt-3 flex gap-2">
        <button className="px-3 py-2 rounded-lg border" onClick={prev} disabled={idx === 0}>
          Prev
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-emerald-600 text-white"
          onClick={next}
          disabled={idx === total - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function RecipeDetail({ app, derived }) {
  const sel = derived.selectedRecipe;
  if (!sel) return null;
  const { recipe } = sel;

  // reset spice toggles when recipe changes
  const [spiceMissing, setSpiceMissing] = useState([]);
  useEffect(() => setSpiceMissing([]), [recipe.id]);

  // compute required missing items (respect pantry and current selections)
  const effectiveHave = useMemo(
    () => new Set([...app.selected, ...app.pantry]),
    [app.selected, app.pantry]
  );
  const requiredMissing = useMemo(
    () => recipe.ingredients.filter((i) => !i.optional && !effectiveHave.has(i.name)),
    [recipe.ingredients, effectiveHave]
  );
  const groups = useMemo(
    () => groupByCategory(requiredMissing.map((i) => i.name)),
    [requiredMissing]
  );

  // optional spices/oil selector (only shown when user toggled "No spices/oil")
  const spicesToShow = app.dontHaveSpices ? recipe.spicesOil || [] : [];

  // gentle substitution hints
  const subHints = useMemo(
    () => Assistant.getSubstitutionHints(requiredMissing.map((i) => i.name)),
    [requiredMissing]
  );

  const copyList = async () => {
    const lines = [...requiredMissing.map((i) => i.name), ...spiceMissing];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      alert("Shopping list copied to clipboard.");
    } catch {
      // fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = lines.join("\n");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Shopping list copied to clipboard.");
    }
  };

  const buyOnBlinkit = () => {
    const items = [...requiredMissing.map((i) => i.name), ...spiceMissing];
    openBlinkit(items);
  };

  return (
    <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <ChefHat className="w-5 h-5" /> {recipe.name}
        </h2>
        <div className="text-sm text-gray-600 flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4" /> {recipe.timeMin} min
          </span>
          {recipe.jainFriendly && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              Jain-friendly
            </span>
          )}
          <button
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-white hover:bg-gray-50"
            onClick={() => app.setSelectedRecipeId(null)}
          >
            <X className="w-4 h-4" /> Close
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Cook mode */}
        <div className="md:col-span-2">
          <CookMode steps={recipe.steps} />
        </div>

        {/* Shopping list and helpers */}
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Shopping List
          </h4>

          {/* Required missing items grouped by category */}
          {Object.entries(groups).map(([cat, items]) => (
            <div key={cat} className="mb-2">
              <div className="text-xs font-medium text-gray-600">{cat}</div>
              <ul className="list-disc list-inside text-sm">
                {items.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Optional spices/oil section */}
          {spicesToShow.length > 0 && (
            <div className="mb-3">
              <div className="text-sm font-medium mb-1">
                Spices/Oil (tick ones you are missing)
              </div>
              <div className="flex flex-wrap gap-2">
                {spicesToShow.map((s) => {
                  const checked = spiceMissing.includes(s);
                  return (
                    <label
                      key={s}
                      className={`px-2 py-1 rounded-full border text-sm cursor-pointer ${
                        checked ? "bg-amber-50 border-amber-300" : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={checked}
                        onChange={(e) =>
                          setSpiceMissing((prev) =>
                            e.target.checked ? [...prev, s] : prev.filter((x) => x !== s)
                          )
                        }
                      />
                      {s}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substitution hints */}
          {subHints.length > 0 && (
            <div className="mt-2 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded p-2">
              💡 {subHints.join(" ")}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={copyList}>
              Copy list
            </button>
            <button className="px-3 py-2 rounded-lg border" onClick={buyOnBlinkit}>
              Buy on Blinkit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
