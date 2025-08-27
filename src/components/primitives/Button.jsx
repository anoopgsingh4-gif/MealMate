import React from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl transition-all ease-pleasant " +
  "px-3.5 py-2 text-sm font-medium focus-visible:outline-none";

const variants = {
  solid:
    "bg-brand-600 text-white hover:bg-brand-700 active:scale-[.98] shadow-sm",
  outline:
    "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 active:scale-[.98]",
  ghost:
    "text-gray-700 hover:bg-gray-50 active:scale-[.98]",
};

export default function Button({ as:Comp="button", variant="solid", className="", ...props }) {
  return <Comp className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
