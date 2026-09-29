"use client";

import Link from "next/link";
import { useState } from "react";
import { DriverAccessGate } from "../components/DriverAccessGate";
import { LogoutButton } from "../components/LogoutButton";

function DomiciliarioTurno() {
  const [disponible, setDisponible] = useState(false);

  return (
    <main className="app-shell">
      <header className="header">
        <LogoutButton redirectTo="/domiciliario/login" />
        <div className="brand brand--sm">domic</div>
      </header>

      <div className="nav-tabs">
        <Link href="/domiciliario" className="active">
          Turno
        </Link>
        <Link href="/domiciliario/perfil">Perfil</Link>
      </div>

      <div className="hero-center">
        <p className="muted">Estado</p>
        <div className={`big-status ${disponible ? "gold" : ""}`}>
          {disponible ? "Disponible" : "No disponible"}
        </div>
        <span className="pill">
          {disponible
            ? "Recibiendo solicitudes cercanas"
            : "Activa tu turno para recibir pedidos"}
        </span>
      </div>

      <div className="stack">
        <button
          type="button"
          className={disponible ? "btn btn-ghost" : "btn btn-primary"}
          onClick={() => setDisponible((v) => !v)}
        >
          {disponible ? "Salir de turno" : "Ponerme disponible"}
        </button>

        {disponible && (
          <Link href="/domiciliario/solicitud" className="btn btn-ghost">
            Ver solicitud
          </Link>
        )}

        <LogoutButton redirectTo="/domiciliario/login" variant="button" />
      </div>
    </main>
  );
}

export default function DomiciliarioPage() {
  return (
    <DriverAccessGate
      loginHref="/domiciliario/login"
      perfilHref="/domiciliario/perfil"
    >
      <DomiciliarioTurno />
    </DriverAccessGate>
  );
}
