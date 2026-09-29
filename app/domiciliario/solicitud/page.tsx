"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DriverAccessGate } from "../../components/DriverAccessGate";

function SolicitudContent() {
  const router = useRouter();
  const [segundos, setSegundos] = useState(45);

  useEffect(() => {
    const t = setInterval(() => {
      setSegundos((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/domiciliario" className="header-back">
          ← Turno
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <div className="alert-block">
        <h2>Nuevo domicilio</h2>
        <p className="muted" style={{ margin: "0 0 16px" }}>
          Expira en {segundos}s · ~0.8 km
        </p>

        <div className="kv">
          <div className="kv-row">
            <span>Negocio</span>
            <strong>Tienda Don José</strong>
          </div>
          <div className="kv-row">
            <span>Recoger en</span>
            <strong>Calle 5 #10-20</strong>
          </div>
          <div className="kv-row">
            <span>Cliente</span>
            <strong>María López</strong>
          </div>
          <div className="kv-row">
            <span>Entregar en</span>
            <strong>Carrera 8 #3-15</strong>
          </div>
          <div className="kv-row">
            <span>Pedido</span>
            <strong>2 hamburguesas + gaseosa</strong>
          </div>
          <div className="kv-row">
            <span>Cobrar</span>
            <strong>$18.000</strong>
          </div>
          <div className="kv-row">
            <span>Paga con</span>
            <strong>$50.000</strong>
          </div>
          <div className="kv-row">
            <span>Vuelto</span>
            <strong>$32.000</strong>
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="stack">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => router.push("/domiciliario/entrega")}
        >
          Aceptar
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => router.push("/domiciliario")}
        >
          Rechazar
        </button>
      </div>
    </main>
  );
}

export default function SolicitudPage() {
  return (
    <DriverAccessGate
      loginHref="/domiciliario/login"
      perfilHref="/domiciliario/perfil"
    >
      <SolicitudContent />
    </DriverAccessGate>
  );
}
