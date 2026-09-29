"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
  loading: () => <div className="domic-map domic-map--skeleton" />,
});

const ORIGEN = { lat: 4.3948, lng: -76.0772 };
const DESTINO = { lat: 4.3895, lng: -76.0718 };
const START = { lat: 4.3975, lng: -76.0748 };

const STEPS = [
  "Motocarro asignado",
  "En camino a recogerte",
  "Viaje en curso",
] as const;

function SeguimientoInner() {
  const params = useSearchParams();
  const origenLabel = params.get("o") ?? "Parque principal";
  const destinoLabel = params.get("d") ?? "Terminal de transportes";
  const fareLabel = `$${Number(params.get("fare") ?? "5000").toLocaleString("es-CO")}`;

  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setT((x) => x + 1), 1200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (t === 4) setStep(1);
    if (t === 9) setStep(2);
  }, [t]);

  const pos = useMemo(() => {
    if (step < 2) {
      const p = Math.min(1, t / 9);
      return {
        lat: START.lat + (ORIGEN.lat - START.lat) * p,
        lng: START.lng + (ORIGEN.lng - START.lng) * p,
      };
    }
    const p = Math.min(1, (t - 9) / 10);
    return {
      lat: ORIGEN.lat + (DESTINO.lat - ORIGEN.lat) * p,
      lng: ORIGEN.lng + (DESTINO.lng - ORIGEN.lng) * p,
    };
  }, [step, t]);

  const eta =
    step < 2
      ? `${Math.max(1, 4 - Math.floor(t / 2))} min`
      : `${Math.max(1, 8 - Math.floor((t - 9) / 1.2))} min`;

  const markers = useMemo(
    () => [
      {
        id: "pasajero",
        lat: ORIGEN.lat,
        lng: ORIGEN.lng,
        kind: "pasajero" as const,
        label: "Recogida",
      },
      {
        id: "destino",
        lat: DESTINO.lat,
        lng: DESTINO.lng,
        kind: "cliente" as const,
        label: "Destino",
      },
      {
        id: "moto",
        lat: pos.lat,
        lng: pos.lng,
        kind: "motocarro" as const,
        label: "Don Luis",
      },
    ],
    [pos.lat, pos.lng]
  );

  const route = useMemo((): [number, number][] => {
    if (step < 2) {
      return [
        [pos.lat, pos.lng],
        [ORIGEN.lat, ORIGEN.lng],
      ];
    }
    return [
      [pos.lat, pos.lng],
      [DESTINO.lat, DESTINO.lng],
    ];
  }, [pos.lat, pos.lng, step]);

  return (
    <main className="app-shell app-shell--map">
      <header className="header">
        <Link href="/viaje" className="header-back">
          ← Viaje
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <MapView
        center={[pos.lat, pos.lng]}
        zoom={15}
        markers={markers}
        route={route}
      />

      <div className="map-sheet">
        <div className="track-eta">
          <div>
            <div className="track-eta__time">{eta}</div>
            <div className="track-eta__addr">
              {step < 2
                ? `Recogida · ${origenLabel}`
                : `Hacia · ${destinoLabel}`}
            </div>
          </div>
          <span className="pill">🛺 Motocarro</span>
        </div>

        <div className="driver-card">
          <div className="driver-avatar driver-avatar--lg">L</div>
          <div className="driver-info">
            <div className="driver-name">Don Luis</div>
            <div className="driver-meta">★ 4.9 · Motocarro · {fareLabel}</div>
          </div>
          <a
            className="call-btn"
            href="tel:+573000000000"
            aria-label="Llamar a Don Luis"
          >
            📞
          </a>
        </div>

        <ol className="track-steps">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={
                i < step
                  ? "track-steps__item track-steps__item--done"
                  : i === step
                    ? "track-steps__item track-steps__item--current"
                    : "track-steps__item"
              }
            >
              {label}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}

export default function ViajeSeguimientoPage() {
  return (
    <Suspense
      fallback={
        <main className="app-shell">
          <p className="muted">Cargando viaje…</p>
        </main>
      }
    >
      <SeguimientoInner />
    </Suspense>
  );
}
