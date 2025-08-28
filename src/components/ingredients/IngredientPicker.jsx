import React, { useState } from "react";
import { RefreshCcw, Search, Mic, MicOff, ListChecks } from "lucide-react";
import { INGREDIENT_CATALOG } from "../../data/ingredients";
import { useSpeechInput } from "../../hooks/useSpeechInput";
import { Tokenizer } from "../../lib/tokenizer";
import Section from "../primitives/Section.jsx";
import Button from "../primitives/Button.jsx";
import Pill from "../primitives/Pill.jsx";

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
          <div className="text-sm text-gray-700 mb-2">Mark items always available</div>
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
      const exists = Object.values(INGREDIENT_CATALOG).some((arr) => arr.includes(tok));
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
        {/* LEFT: catalog */}
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

        {/* RIGHT: quick add + pantry (WRAPPER WAS MISSING) */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Quick add</label>

          {/* Wrapping row that keeps everything inside on narrow widths */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-hidden">
            {/* Flexible input with mic inside */}
            <div className="relative flex-1 min-w-[240px]">
              <input
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="e.g., tomato, rice, paneer"
                className="w-full border rounded-lg px-3 py-2 pr-11"
                aria-label="Quick add ingredients"
              />

              {/* Mic button anchored inside the input (never overflows) */}
              <Button
                variant="outline"
                className={`absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 shrink-0 ${
                  speech.listening ? "bg-red-50" : ""
                }`}
                onClick={speech.listening ? speech.stop : speech.start}
                aria-pressed={speech.listening}
                aria-label={speech.listening ? "Stop voice input" : "Start voice input"}
                title={speech.listening ? "Stop voice input" : "Start voice input"}
              >
                {speech.listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>

            {/* Add button stays inside row and doesn’t shrink */}
            <Button onClick={addFreeText} className="shrink-0 whitespace-nowrap">
              Add
            </Button>
          </div>

          <PantryManager app={app} />
        </div>
      </div>
    </Section>
  );
}
