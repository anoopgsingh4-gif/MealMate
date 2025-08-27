import React from "react";
import Card from "./Card";

export default function Section({ title, icon, actions, children }) {
  return (
    <Card className="p-4 md:p-6 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          {icon}{title}
        </h2>
        <div className="flex gap-2">{actions}</div>
      </div>
      {children}
    </Card>
  );
}
