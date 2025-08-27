import React from "react";

export default function Pill({ active, children, onClick, title }) {
  return (
    <button
      title={title}
      aria-pressed={!!active}
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm mr-2 mb-2 transition-colors ease-pleasant focus-visible:outline-none ${
        active
          ? "bg-brand-600 text-white border-brand-600"
          : "bg-white border-gray-300 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}
