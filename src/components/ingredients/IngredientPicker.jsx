import React, { useMemo, useState } from "react";
import { RefreshCcw, Search, Mic, MicOff, ListChecks } from "lucide-react";
import { INGREDIENT_CATALOG } from "../../data/ingredients";
import { useSpeechInput } from "../../hooks/useSpeechInput";
import { Tokenizer } from "../../lib/tokenizer";
import Section from "../primitives/Section.jsx";
import Button from "../primitives/Button.jsx";
import Pill from "../primitives/Pill.jsx";


const Pill = ({active,onClick,children}) => (
  <button className={`px-3 py-1 rounded-full border text-sm mr-2 mb-2 ${active?"bg-emerald-600 text-white":""}`} onClick={onClick}>{children}</button>
);

function PantryManager({ app }) {
  const [open,setOpen]=useState(false);
  return (
    <div>
      <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50" onClick={()=>setOpen(v=>!v)}>
        <ListChecks className="w-4 h-4"/> Pantry Mode
      </button>
      {open && (
        <div className="mt-3 p-3 border rounded-xl">
          {Object.entries(INGREDIENT_CATALOG).map(([cat,items])=>(
            <div key={cat} className="mb-2">
              <div className="text-xs font-medium text-gray-600">{cat}</div>
              <div className="flex flex-wrap">
                {items.map(it=>(
                  <Pill key={it} active={app.pantry.has(it)} onClick={()=>app.togglePantry(it)}>{it}</Pill>
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
  const [freeText,setFreeText]=useState("");
  const [search,setSearch]=useState("");
  const speech = useSpeechInput((t)=>setFreeText(t));
  const addFreeText = () => {
    Tokenizer.tokenize(freeText).forEach(tok=>{
      const exists = Object.values(INGREDIENT_CATALOG).some(arr=>arr.includes(tok));
      if (exists) app.toggleSelected(tok);
    });
    setFreeText("");
  };
  return (
    <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2"><Search className="w-5 h-5"/> Ingredients</h2>
        <button className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border bg-white hover:bg-gray-50" onClick={app.clearSelections}>
          <RefreshCcw className="w-4 h-4"/> Clear
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 max-h-80 overflow-y-auto pr-2">
          <input value={search} onChange={(e)=>setSearch(e.target.value.toLowerCase())} placeholder="Search ingredient..." className="mb-3 w-full border rounded-lg px-3 py-2" />
          {Object.entries(INGREDIENT_CATALOG).map(([cat,items])=>(
            <div key={cat} className="mb-3">
              <div className="sticky top-0 bg-white text-sm font-medium text-gray-700 mb-1">{cat}</div>
              <div className="flex flex-wrap">
                {items
                  .filter(it=>derived.reachableUniverse.has(it)||app.selected.has(it))
                  .filter(it=>!search || it.toLowerCase().includes(search))
                  .map(it=>(
                    <Pill key={it} active={app.selected.has(it)} onClick={()=>app.toggleSelected(it)}>{it}</Pill>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-medium">Quick add</label>
          <div className="flex gap-2">
            <input value={freeText} onChange={(e)=>setFreeText(e.target.value)} placeholder="e.g., tomato, rice" className="flex-1 border rounded-lg px-3 py-2" />
            <button className="px-3 py-2 rounded-lg bg-emerald-600 text-white" onClick={addFreeText}>Add</button>
            <button className={`px-3 py-2 rounded-lg border ${speech.listening?"bg-red-50":"bg-white"}`} onClick={speech.listening?speech.stop:speech.start}>
              {speech.listening ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
            </button>
          </div>
          <PantryManager app={app}/>
        </div>
      </div>
    </section>
  );
}
