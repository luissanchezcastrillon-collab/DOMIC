"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoDomicilioPage() {
  const router = useRouter();
  const [cobra, setCobra] = useState(true);
  const [cliente, setCliente] = useState("");
  const [direccion, setDireccion] = useState("");
  const [detalle, setDetalle] = useState("");
  const [valor, setValor] = useState("");
  const [pagaCon, setPagaCon] = useState("");

  const vuelto = useMemo(() => {
    const v = Number(valor);
    const p = Number(pagaCon);
    if (!cobra || !v || !p || p < v) return null;
    return p - v;
  }, [cobra, valor, pagaCon]);

  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/negocio" className="header-back">
          ← Negocio
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Nuevo domicilio</h1>
      <p className="section-desc">
        Origen: Tienda Don José · Calle 5 #10-20
      </p>

      <form
        className="stack-lg"
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/negocio/cercanos");
        }}
      >
        <div className="field">
          <label htmlFor="cliente">Nombre del cliente</label>
          <input
            id="cliente"
            placeholder="María López"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="entrega">Dirección de entrega</label>
          <input
            id="entrega"
            placeholder="Carrera 8 #3-15"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="detalle">Qué es el domicilio</label>
          <textarea
            id="detalle"
            placeholder="2 hamburguesas + gaseosa"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>¿Se cobra en la entrega?</label>
          <div className="toggle-row">
            <button
              type="button"
              className={cobra ? "active" : ""}
              onClick={() => setCobra(true)}
            >
              Sí
            </button>
            <button
              type="button"
              className={!cobra ? "active" : ""}
              onClick={() => setCobra(false)}
            >
              No
            </button>
          </div>
        </div>

        {cobra && (
          <>
            <div className="row-2">
              <div className="field">
                <label htmlFor="valor">Valor a cobrar</label>
                <input
                  id="valor"
                  inputMode="numeric"
                  placeholder="18000"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="paga">Con cuánto paga</label>
                <input
                  id="paga"
                  inputMode="numeric"
                  placeholder="50000"
                  value={pagaCon}
                  onChange={(e) => setPagaCon(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="kv">
              <div className="kv-row">
                <span>Vuelto</span>
                <strong>
                  {vuelto !== null
                    ? `$${vuelto.toLocaleString("es-CO")}`
                    : "—"}
                </strong>
              </div>
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary">
          Solicitar domiciliario
        </button>
      </form>
    </main>
  );
}
