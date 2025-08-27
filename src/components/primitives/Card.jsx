import React from "react";

export default function Card({ className="", children, as:Comp="section" }) {
  return (
    <Comp className={`bg-white rounded-2xl shadow-card hover:shadow-cardHover transition-shadow ${className}`}>
      {children}
    </Comp>
  );
}
