"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoutButton } from "../components/LogoutButton";
import { getMyDriver, getMyProfile } from "../lib/auth";

export default function DomiciliarioPerfilPage() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [estado, setEstado] = useState("pendiente");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profile, driver] = await Promise.all([
          getMyProfile(),
          getMyDriver(),
        ]);
        if (cancelled) return;
        setNombre(profile?.full_name ?? "");
        setTelefono(profile?.phone ?? "");
        setEstado(driver?.status ?? "pendiente");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="app-shell">
      <header className="header">
        <LogoutButton redirectTo="/domiciliario/login" />
        <div className="brand brand--sm">domic</div>
      </header>

      <div className="nav-tabs">
        <Link href="/domiciliario">Turno</Link>
        <Link href="/domiciliario/perfil" className="active">
          Perfil
        </Link>
      </div>

      <h1 className="section-title">Mi perfil</h1>
      <p className="section-desc">
        Documentos (cédula y licencia) se envían por fuera. Aquí ves tus datos y
        si el admin ya te aprobó.
      </p>

      {loading ? (
        <p className="muted">Cargando…</p>
      ) : (
        <div className="stack-lg">
          <div className="field">
            <label htmlFor="nombre">Nombre completo</label>
            <input id="nombre" value={nombre} readOnly />
          </div>
          <div className="field">
            <label htmlFor="tel">Teléfono</label>
            <input id="tel" value={telefono} readOnly />
          </div>

          <div className="kv">
            <div className="kv-row">
              <span>Estado</span>
              <strong
                style={{
                  color: estado === "aprobado" ? "var(--gold)" : "var(--muted)",
                }}
              >
                {estado === "aprobado"
                  ? "Aprobado"
                  : estado === "rechazado"
                    ? "Rechazado"
                    : estado === "suspendido"
                      ? "Suspendido"
                      : "Pendiente de aprobación"}
              </strong>
            </div>
          </div>

          {estado !== "aprobado" && (
            <p className="muted">
              Cuando el admin te apruebe, podrás activar turno y recibir
              solicitudes.
            </p>
          )}

          <LogoutButton redirectTo="/domiciliario/login" variant="button" />
        </div>
      )}
    </main>
  );
}
