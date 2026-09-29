"use client";

import Link from "next/link";
import { useState } from "react";
import { DriverAccessGate } from "../../components/DriverAccessGate";

const flow = [
  { key: "aceptado", label: "Pedido aceptado", next: "Voy al local" },
  { key: "en_camino", label: "En camino al local", next: "Llegué al local" },
  { key: "en_local", label: "En el local", next: "Salí con el pedido" },
  { key: "en_ruta", label: "En ruta al cliente", next: "Marcar entregado" },
  { key: "entregado", label: "Entregado", next: null },
] as const;

function EntregaActivaContent() {
  const [index, setIndex] = useState(0);
  const current = flow[index];
  const done = current.key === "entregado";

  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/domiciliario" className="header-back">
          ← Turno
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <div className="hero-center" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <p className="muted">Entrega activa</p>
        <div className={`big-status ${done ? "" : "gold"}`} style={done ? { color: "var(--success)" } : undefined}>
          {current.label}
        </div>
      </div>

      <div className="kv" style={{ marginBottom: 28 }}>
        <div className="kv-row">
          <span>Recoger</span>
          <strong>Calle 5 #10-20</strong>
        </div>
        <div className="kv-row">
          <span>Entregar</span>
          <strong>Carrera 8 #3-15</strong>
        </div>
        <div className="kv-row">
          <span>Cliente</span>
          <strong>María López</strong>
        </div>
        <div className="kv-row">
          <span>Cobrar / vuelto</span>
          <strong>$18.000 / $32.000</strong>
        </div>
      </div>

      <div className="stack">
        {!done && current.next && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIndex((i) => i + 1)}
          >
            {current.next}
          </button>
        )}
        {done && (
          <Link href="/domiciliario" className="btn btn-success">
            Volver al turno
          </Link>
        )}
      </div>
    </main>
  );
}

export default function EntregaActivaPage() {
  return (
    <DriverAccessGate
      loginHref="/domiciliario/login"
      perfilHref="/domiciliario/perfil"
    >
      <EntregaActivaContent />
    </DriverAccessGate>
  );
}
