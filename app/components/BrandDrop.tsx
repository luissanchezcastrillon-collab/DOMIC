"use client";

import { useEffect, useState } from "react";

// Espera un momentico viendo el moto-carro, luego salen las letras
const LETTERS = [
  { char: "d", delay: 2.4 },
  { char: "o", delay: 2.15 },
  { char: "m", delay: 1.9 },
  { char: "i", delay: 1.65 },
  { char: "c", delay: 1.4 },
];

export default function BrandDrop() {
  const [pulling, setPulling] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPulling(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <h1
      className={`brand brand--hero brand--drop${pulling ? " brand--pulling" : ""}`}
      aria-label="domic"
    >
      {LETTERS.map(({ char, delay }) => (
        <span
          key={char}
          className="brand-letter"
          style={{ animationDelay: pulling ? `${delay}s` : undefined }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
