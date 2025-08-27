import React, { useState } from "react";
import { Filter } from "lucide-react";

export default function FiltersBar({ app }) {
  const [open,setOpen]=useState(false);
  return (
    <section className="bg-white rounded-2xl shadow p-4 md:p-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2"><Filter className="w-5 h-5"/> Preferences</h2>
        <button onClick={()=>setOpen(o=>!o)} className="text-sm underline">{open?"Hide":"Show"}</button>
      </div>
      {open && (
        <div className="grid md:grid-cols-5 gap-4 items-center">
          <div>
            <label className="text-sm font-medium">Allow up to {app.filters.maxMissing} missing</label>
            <input type="range" min={0} max={4} value={app.filters.maxMissing}
              onChange={(e)=>app.setFilters({ ...app.filters, maxMissing: Number(e.target.value) })}
              className="w-full" />
          </div>
          <div>
            <label className="text-sm font-medium">Time: {app.filters.maxTime} min</label>
            <input type="range" min={10} max={120} step={5} value={app.filters.maxTime}
              onChange={(e)=>app.setFilters({ ...app.filters, maxTime: Number(e.target.value) })}
              className="w-full" />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={app.filters.jain}
              onChange={(e)=>app.setFilters({ ...app.filters, jain: e.target.checked })}/>
            Jain-friendly
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={app.dontHaveSpices}
              onChange={(e)=>app.setDontHaveSpices(e.target.checked)}/>
            No spices/oil
          </label>
          <div className="flex items-center gap-2">
            <input id="limitByMeal" type="checkbox" checked={app.filters.limitByMeal}
              onChange={(e)=>app.setFilters({ ...app.filters, limitByMeal: e.target.checked })}/>
            <label htmlFor="limitByMeal" className="text-sm font-medium">Limit by meal type</label>
          </div>
          {app.filters.limitByMeal && (
            <div className="md:col-span-5 flex items-center gap-2">
              <label className="text-sm">Meal:</label>
              <select className="border rounded-lg px-3 py-2" value={app.filters.mealType || "breakfast"}
                onChange={(e)=>app.setFilters({ ...app.filters, mealType: e.target.value })}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
