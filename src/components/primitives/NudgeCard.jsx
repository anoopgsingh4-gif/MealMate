import React from "react";

export default function NudgeCard({ tone="blue", children, actionLabel, onAction }) {
  const toneClasses = {
    green: "bg-green-50 border-green-200 text-green-800",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
  }[tone] || "bg-blue-50 border-blue-200 text-blue-800";

  return (
    <div className={`mt-4 p-3 rounded-xl border text-sm ${toneClasses}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">{children}</div>
        {actionLabel && (
          <button
            className="px-3 py-1 rounded-lg border bg-white hover:bg-gray-50"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
