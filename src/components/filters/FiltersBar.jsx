// src/components/filters/FiltersBar.jsx
import React from "react";
import { Filter as FilterIcon } from "lucide-react";
import Section from "../primitives/Section.jsx";

export default function FiltersBar({ app }) {
  return (
    <Section title="2. Preferences" icon={<FilterIcon className="w-5 h-5" />} collapsible defaultOpen>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {/* Missing ingredients slider */}
        <div className="min-w-[220px]">
          <label className="block text-sm font-medium mb-1">
            Allow up to {app.filters.maxMissing} missing
          </label>
          <input
            type="range"
            min={0}
            max={4}
            value={app.filters.maxMissing}
            onChange={(e) =>
              app.setFilters({ ...app.filters, maxMissing: Number(e.target.value) })
            }
            className="w-full"
            aria-label="Allowed missing ingredients"
          />
        </div>

        {/* Time slider */}
        <div className="min-w-[220px]">
          <label className="block text-sm font-medium mb-1">
            Time: {app.filters.maxTime} min
          </label>
          <input
            type="range"
            min={10}
            max={120}
            step={5}
            value={app.filters.maxTime}
            onChange={(e) =>
              app.setFilters({ ...app.filters, maxTime: Number(e.target.value) })
            }
            className="w-full"
            aria-label="Maximum cooking time"
          />
        </div>

        {/* Jain-friendly */}
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={app.filters.jain}
            onChange={(e) =>
              app.setFilters({ ...app.filters, jain: e.target.checked })
            }
          />
          <span>Jain-friendly</span>
        </label>

        {/* No spices/oil */}
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={app.dontHaveSpices}
            onChange={(e) => app.setDontHaveSpices(e.target.checked)}
          />
          <span>No spices/oil</span>
        </label>

        {/* Limit by meal type */}
        <div className="flex items-center gap-2">
          <input
            id="limitByMeal"
            type="checkbox"
            checked={app.filters.limitByMeal}
            onChange={(e) =>
              app.setFilters({ ...app.filters, limitByMeal: e.target.checked })
            }
          />
          <label htmlFor="limitByMeal" className="text-sm font-medium">
            Limit by meal type
          </label>
        </div>

        {/* Meal type select (full-row when visible) */}
        {app.filters.limitByMeal && (
          <div className="sm:col-span-2 lg:col-span-5 flex items-center gap-2">
            <label className="text-sm">Meal:</label>
            <select
              className="border rounded-lg px-3 py-2"
              value={app.filters.mealType || "breakfast"}
              onChange={(e) =>
                app.setFilters({ ...app.filters, mealType: e.target.value })
              }
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        )}
      </div>
    </Section>
  );
}
