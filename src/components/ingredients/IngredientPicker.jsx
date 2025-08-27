import React, { useState } from "react";
import { RefreshCcw, Search, Mic, MicOff, ListChecks } from "lucide-react";
import { INGREDIENT_CATALOG } from "../../data/ingredients";
import { useSpeechInput } from "../../hooks/useSpeechInput";
import { Tokenizer } from "../../lib/tokenizer";
import Section from "../primitives/Section.jsx";
import Button from "../primitives/Button.jsx";
import Pill from "../primitives/Pill.jsx"; // use the shared Pill

function PantryManager({ app }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setOpen((v) => !v)}
        title="Toggle Pantry Mode"
      >
        <ListChecks className="w-4 h-4" /> Pantry Mode
      </Button>

      {open && (
        <div className="mt-3 p-3 border rounded-xl">
          <div className="text-sm text-gray-700 mb-2">
            Mark items always available
          </div>
          {Object.entries(INGREDIENT_CATALOG).map(([cat, items]) => (
            <div key={cat} className="mb-2">
              <div className="text-xs font-medium text-gray-600">{cat}</div>
              <div className="flex flex-wrap">
                {items.map((it) => (
                  <Pill
                    key={it}
                    active={app.pantry.has(it)}
                    onClick={() => app.togglePantry(it)}
                  >
                    {it}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function IngredientPicker({ app, derived }) {
  const [freeText, setFreeText] = useState("");
  const [search, setSearch] = useState("");

  const speech = useSpeechInput((t) => setFreeText(t));

  const addFreeText = () => {
    Tokenizer.tokenize(freeText).forEach((tok) => {
      const exists = Object.values(INGREDIENT_CATALOG).some((arr) =>
        arr.includes(tok)
      );
      if (exists) app.toggleSelected(tok);
    });
    setFreeText("");
  };

  return (
    <Section
      title="Ingredients"
      icon={<Search className="w-5 h-5" />}
      actions={
        <Button variant="outline" onClick={app.clearSelections}>
          <RefreshCcw className="w-4 h-4" /> Clear
        </Button>
      }
    >
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 max-h-80 overflow-y-auto pr-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            placeholder="Search ingredient..."
            className="mb-3 w-full border rounded-lg px-3 py-2"
          />

          {Object.entries(INGREDIENT_CATALOG).map(([cat, items]) => (
            <div key={cat} className="mb-3">
              <div className="sticky top-0 bg-white text-sm font-medium text-gray-700 mb-1">
                {cat}
              </div>
              <div className="flex flex-wrap">
                {items
                  .filter(
                    (it) =>
                      derived.reachableUniverse.has(it) ||
                      app.selected.has(it)
                  )
                  .filter((it) => !search || it.toLowerCase().includes(search))
                  .map((it) => (
                    <Pill
                      key={it}
                      active={app.selected.has(it)}
                      onClick={() => app.toggleSelected(it)}
                    >
                      {it}
                    </Pill>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium">Quick add</label>
          <div className="flex gap-2">
            <input
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g., tomato, rice, paneer"
              className="flex-1 border rounded-lg px-3 py-2"
            />
            <Button onClick={addFreeText}>Add</Button>
            <Button
              variant="outline"
              className={speech.listening ? "bg-red-50" : undefined}
              onClick={speech.listening ? speech.stop : speech.start}
              aria-pressed={speech.listening}
              aria-label={speech.listening ? "Stop voice input" : "Start voice input"}
              title={speech.listening ? "Stop voice input" : "Start voice input"}
            >
              {speech.listening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          </div>

          <PantryManager app={app} />
        </div>
      </div>
    </Section>
  );
}
