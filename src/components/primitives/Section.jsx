import React, { useState } from "react";
import Card from "./Card.jsx";

/**
 * Section
 * - Props:
 *    - title       : string (required)
 *    - icon        : ReactNode (optional)
 *    - actions     : ReactNode (right-side header actions)
 *    - className   : string (optional extra classes for the outer <section>)
 *    - collapsible : boolean (enable header click to toggle content)
 *    - defaultOpen : boolean (initial open state when collapsible)
 */
export default function Section({
  title,
  icon,
  actions,
  children,
  className = "",
  collapsible = false,
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`mb-6 ${className}`}>
      {/* Header row (clickable if collapsible) */}
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          className="flex items-center gap-2 text-lg md:text-xl font-semibold focus:outline-none"
          aria-expanded={collapsible ? open : undefined}
          onClick={() => collapsible && setOpen((v) => !v)}
        >
          {icon && <span className="text-xl">{icon}</span>}
          <span>{title}</span>
          {collapsible && (
            <span className="ml-2 text-sm text-gray-500 select-none">
              {open ? "Hide" : "Show"}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">{actions}</div>
      </div>

      {/* Content inside a Card (only rendered when open if collapsible) */}
      {(!collapsible || open) && (
        <Card className="p-4 md:p-6">{children}</Card>
      )}
    </section>
  );
}
