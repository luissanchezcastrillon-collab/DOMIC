"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
  loading: () => <div className="domic-map domic-map--skeleton" />,
});

const NEGOCIO = { lat: 4.538, lng: -75.672 };
const CLIENTE = { lat: 4.5428, lng: -75.6662 };

const DRIVERS: Record<
  string,
  {
    name: string;
    rating: string;
    trips: string;
    initial: string;
    start: { lat: number; lng: number };
  }
> = {
  "1": {
    name: "Carlos M.",
    rating: "4.9",
    trips: "1240 viajes",
    initial: "C",
    start: { lat: 4.5402, lng: -75.6698 },
  },
  "2": {
    name: "Andrés P.",
    rating: "4.8",
    trips: "890 viajes",
    initial: "A",
    start: { lat: 4.5355, lng: -75.6755 },
  },
  "3": {
    name: "Julián R.",
    rating: "5.0",
    trips: "610 viajes",
    initial: "J",
    start: { lat: 4.5415, lng: -75.6742 },
  },
  "4": {
    name: "Diego S.",
    rating: "4.7",
    trips: "420 viajes",
    initial: "D",
    start: { lat: 4.5348, lng: -75.6685 },
  },
};

const STEPS = [
  "Domiciliario asignado",
  "Recogiendo en el local",
  "En camino al cliente",
] as const;

export default function SeguimientoClient() {
  const params = useSearchParams();
  const id = params.get("d") ?? "1";
  const driver = DRIVERS[id] ?? DRIVERS["1"];

  const [step, setStep] = useState(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setT((x) => x + 1);
    }, 1200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (t === 5) setStep(1);
    if (t === 10) setStep(2);
  }, [t]);

  const pos = useMemo(() => {
    const from = driver.start;
    if (step === 0) {
      const p = Math.min(1, t / 5);
      return {
        lat: from.lat + (NEGOCIO.lat - from.lat) * p,
        lng: from.lng + (NEGOCIO.lng - from.lng) * p,
      };
    }
    if (step === 1) return { ...NEGOCIO };
    const p = Math.min(1, (t - 10) / 8);
    return {
      lat: NEGOCIO.lat + (CLIENTE.lat - NEGOCIO.lat) * p,
      lng: NEGOCIO.lng + (CLIENTE.lng - NEGOCIO.lng) * p,
    };
  }, [driver.start, step, t]);

  const eta =
    step === 2
      ? Math.max(1, 8 - (t - 10))
      : Math.max(2, 6 - Math.floor(t / 2));

  const markers = useMemo(
    () => [
      {
        id: "negocio",
        lat: NEGOCIO.lat,
        lng: NEGOCIO.lng,
        kind: "negocio" as const,
        label: "Local",
      },
      {
        id: "cliente",
        lat: CLIENTE.lat,
        lng: CLIENTE.lng,
        kind: "cliente" as const,
        label: "Cliente",
      },
      {
        id: "moto",
        lat: pos.lat,
        lng: pos.lng,
        kind: "domiciliario" as const,
        label: driver.name,
      },
    ],
    [pos, driver.name]
  );

  const route = useMemo((): [number, number][] => {
    if (step < 2) {
      return [
        [pos.lat, pos.lng],
        [NEGOCIO.lat, NEGOCIO.lng],
      ];
    }
    return [
      [NEGOCIO.lat, NEGOCIO.lng],
      [pos.lat, pos.lng],
      [CLIENTE.lat, CLIENTE.lng],
    ];
  }, [pos, step]);

  return (
    <main className="app-shell app-shell--map">
      <header className="header">
        <Link href="/negocio/pedidos" className="header-back">
          ← Pedidos
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <MapView
        center={[pos.lat, pos.lng]}
        zoom={15}
        markers={markers}
        route={route}
      />

      <div className="map-sheet map-sheet--track">
        <div className="track-eta">
          <div>
            <div className="track-eta__time">Llega en {eta} min</div>
            <div className="track-eta__addr">
              {step < 2
                ? "Hacia tu local · Calle 5 #10-20"
                : "Hacia Calle 10 #23-45, Apto 302"}
            </div>
          </div>
          <span className="pill">🛵 Moto</span>
        </div>

        <div className="driver-card">
          <div className="driver-avatar driver-avatar--lg">{driver.initial}</div>
          <div className="driver-info">
            <div className="driver-name">{driver.name}</div>
            <div className="driver-meta">
              ★ {driver.rating} · {driver.trips}
            </div>
          </div>
          <a
            className="call-btn"
            href="tel:+573000000000"
            aria-label={`Llamar a ${driver.name}`}
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
              <span className="track-steps__badge">
                {i < step ? "✓" : i + 1}
              </span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
