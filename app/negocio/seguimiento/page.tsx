"use client";

import { Suspense } from "react";
import SeguimientoClient from "./SeguimientoClient";

export default function SeguimientoPage() {
  return (
    <Suspense
      fallback={
        <main className="app-shell">
          <p className="muted">Cargando mapa…</p>
        </main>
      }
    >
      <SeguimientoClient />
    </Suspense>
  );
}
