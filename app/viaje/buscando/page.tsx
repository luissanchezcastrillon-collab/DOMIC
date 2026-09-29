"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Star } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { MotocarroIcon } from "../../components/MotocarroIcon";

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
  loading: () => <div className="domic-map domic-map--skeleton" />,
});

/** Centro urbano (preview mapa) */
const ORIGEN = { lat: 4.3948, lng: -76.0772 };
const MOTOCARRO = { lat: 4.3975, lng: -76.0748 };

const ACCEPT_MS = 2800;

function BuscandoInner() {
  const router = useRouter();
  const params = useSearchParams();
  const origen = params.get("o") ?? "Parque principal";
  const destino = params.get("d") ?? "Terminal de transportes";
  const fare = params.get("fare") ?? "5000";
  const zone = params.get("zone") ?? "urbano";
  const fareLabel = `$${Number(fare).toLocaleString("es-CO")}`;
  const [aceptado, setAceptado] = useState(false);

  const markers = useMemo(
    () => [
      {
        id: "pasajero",
        lat: ORIGEN.lat,
        lng: ORIGEN.lng,
        kind: "pasajero" as const,
        label: "Tú",
      },
      {
        id: "moto",
        lat: MOTOCARRO.lat,
        lng: MOTOCARRO.lng,
        kind: "motocarro" as const,
        label: "Motocarro",
      },
    ],
    []
  );

  useEffect(() => {
    const a = window.setTimeout(() => setAceptado(true), ACCEPT_MS);
    const n = window.setTimeout(() => {
      const q = new URLSearchParams({ o: origen, d: destino, fare, zone });
      router.push(`/viaje/seguimiento?${q.toString()}`);
    }, ACCEPT_MS + 800);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(n);
    };
  }, [destino, fare, origen, router, zone]);

  return (
    <main className="app-shell app-shell--map">
      <AppHeader backHref="/viaje" backLabel="Viaje" />

      <MapView center={[ORIGEN.lat, ORIGEN.lng]} zoom={15} markers={markers} />

      <div className="map-sheet">
        <div className="map-sheet__head">
          <h1 className="section-title" style={{ margin: 0 }}>
            {aceptado ? "¡Motocarro en camino!" : "Buscando motocarro…"}
          </h1>
          <span className="pill pill--gold">{fareLabel}</span>
        </div>
        <p className="muted" style={{ margin: "6px 0 14px", fontSize: "0.85rem" }}>
          {origen} → {destino}
        </p>

        {!aceptado && (
          <div className="wait-banner" aria-live="polite">
            <span className="wait-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            Notificando conductores cercanos
          </div>
        )}

        {aceptado && (
          <div className="driver-row driver-row--accepted">
            <div className="driver-avatar">
              <MotocarroIcon size={22} />
            </div>
            <div className="driver-info">
              <div className="driver-name">Don Luis · Motocarro</div>
              <div
                className="driver-meta"
                style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
              >
                <Star size={12} aria-hidden />
                4.9 · 0.3 km
              </div>
            </div>
            <span className="driver-status driver-status--ok">Aceptó</span>
          </div>
        )}

        <Link href="/viaje" className="btn btn-ghost wait-cancel">
          Cancelar viaje
        </Link>
      </div>
    </main>
  );
}

export default function BuscandoViajePage() {
  return (
    <Suspense
      fallback={
        <main className="app-shell">
          <p className="muted">Buscando…</p>
        </main>
      }
    >
      <BuscandoInner />
    </Suspense>
  );
}
