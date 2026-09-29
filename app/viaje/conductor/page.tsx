"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DriverAccessGate } from "../../components/DriverAccessGate";
import { LogoutButton } from "../../components/LogoutButton";
import { estimateFare, formatCop } from "../../lib/fare";

function ConductorTurno() {
  const router = useRouter();
  const [disponible, setDisponible] = useState(false);
  const [solicitud, setSolicitud] = useState(true);
  const demo = estimateFare("parque", "la-z");

  return (
    <main className="app-shell">
      <header className="header">
        <LogoutButton redirectTo="/viaje/login" />
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Conductor</h1>
      <p className="section-desc">Motocarro · recibe y acepta viajes</p>

      <div className="hero-center" style={{ marginBottom: 20 }}>
        <p className="muted">Estado</p>
        <div className={`big-status ${disponible ? "gold" : ""}`}>
          {disponible ? "Disponible" : "Fuera de servicio"}
        </div>
        <span className="pill">🛺 Tu motocarro</span>
      </div>

      <div className="stack">
        <button
          type="button"
          className={disponible ? "btn btn-ghost" : "btn btn-primary"}
          onClick={() => setDisponible((v) => !v)}
        >
          {disponible ? "Salir de turno" : "Ponerme disponible"}
        </button>

        {disponible && solicitud && (
          <div
            className="driver-card"
            style={{ flexDirection: "column", alignItems: "stretch", gap: 14 }}
          >
            <div>
              <div className="driver-name">Nueva solicitud de viaje</div>
              <div className="driver-meta" style={{ marginTop: 6 }}>
                {demo.origin.name} → {demo.dest.name}
              </div>
              <div className="driver-meta">
                {demo.zoneLabel} · ~{demo.km} km
              </div>
              <div className="fare-box" style={{ marginTop: 12 }}>
                <div className="fare-box__label">Ganas</div>
                <div className="fare-box__value">{formatCop(demo.fare)}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ flex: 1 }}
                onClick={() => setSolicitud(false)}
              >
                Rechazar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => {
                  const q = new URLSearchParams({
                    o: demo.origin.name,
                    d: demo.dest.name,
                    fare: String(demo.fare),
                    zone: demo.zone,
                  });
                  router.push(`/viaje/seguimiento?${q.toString()}`);
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}

        {disponible && !solicitud && (
          <p className="center muted">Esperando nuevos viajes…</p>
        )}

        <LogoutButton redirectTo="/viaje/login" variant="button" />
      </div>
    </main>
  );
}

export default function ConductorViajePage() {
  return (
    <DriverAccessGate loginHref="/viaje/login">
      <ConductorTurno />
    </DriverAccessGate>
  );
}
