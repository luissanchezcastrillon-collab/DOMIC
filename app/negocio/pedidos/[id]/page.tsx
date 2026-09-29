"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";

const steps = [
  "buscando",
  "aceptado",
  "en camino al local",
  "en el local",
  "en ruta",
  "entregado",
] as const;

export default function PedidoDetallePage() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? "demo";
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (id !== "demo") {
      setStep(id === "3" ? 5 : 4);
      return;
    }
    const t = setInterval(() => {
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 2500);
    return () => clearInterval(t);
  }, [id]);

  const estado = steps[step];
  const done = estado === "entregado";

  return (
    <main className="app-shell">
      <AppHeader backHref="/negocio/pedidos" backLabel="Pedidos" />

      <h1 className="section-title">Pedido</h1>
      <p className="section-desc">María López · Carrera 8 #3-15</p>

      <div className="stack-lg">
        <div className="center">
          <span className={done ? "status status--done" : "status"}>
            <span className="status-dot" />
            {estado}
          </span>
          {id === "demo" && step < 5 && (
            <p className="muted" style={{ marginTop: 12, fontSize: "0.85rem" }}>
              Vista previa: el estado avanza solo
            </p>
          )}
        </div>

        <hr className="divider" />

        <div className="kv-card">
          <div className="kv">
            <div className="kv-row">
              <span>Qué lleva</span>
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
            <div className="kv-row">
              <span>Domiciliario</span>
              <strong>{step === 0 ? "Buscando…" : "Andrés P."}</strong>
            </div>
          </div>
        </div>

        {done && (
          <p className="center" style={{ color: "var(--success)" }}>
            Entrega completada
          </p>
        )}
      </div>
    </main>
  );
}
