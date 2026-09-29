"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const MapView = dynamic(() => import("../../components/MapView"), {
  ssr: false,
  loading: () => <div className="domic-map domic-map--skeleton" />,
});

const NEGOCIO = { lat: 4.538, lng: -75.672 };

const DRIVERS = [
  {
    id: "1",
    name: "Carlos M.",
    rating: "4.9",
    vehicle: "Moto",
    km: "0.4 km",
    lat: 4.5402,
    lng: -75.6698,
    initial: "C",
  },
  {
    id: "2",
    name: "Andrés P.",
    rating: "4.8",
    vehicle: "Moto",
    km: "0.6 km",
    lat: 4.5355,
    lng: -75.6755,
    initial: "A",
  },
  {
    id: "3",
    name: "Julián R.",
    rating: "5.0",
    vehicle: "Moto-carro",
    km: "0.8 km",
    lat: 4.5415,
    lng: -75.6742,
    initial: "J",
  },
  {
    id: "4",
    name: "Diego S.",
    rating: "4.7",
    vehicle: "Moto",
    km: "1.1 km",
    lat: 4.5348,
    lng: -75.6685,
    initial: "D",
  },
];

const ACCEPT_DELAY_MS = 3200;

export default function CercanosPage() {
  const router = useRouter();
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const markers = useMemo(
    () => [
      {
        id: "negocio",
        lat: NEGOCIO.lat,
        lng: NEGOCIO.lng,
        kind: "negocio" as const,
        label: "Tu local",
      },
      ...DRIVERS.map((d) => ({
        id: d.id,
        lat: d.lat,
        lng: d.lng,
        kind: "domiciliario" as const,
        label: d.name,
      })),
    ],
    []
  );

  useEffect(() => {
    const acceptTimer = window.setTimeout(() => {
      setAcceptedId(DRIVERS[0].id);
    }, ACCEPT_DELAY_MS);

    const navTimer = window.setTimeout(() => {
      router.push(`/negocio/seguimiento?d=${DRIVERS[0].id}`);
    }, ACCEPT_DELAY_MS + 900);

    return () => {
      window.clearTimeout(acceptTimer);
      window.clearTimeout(navTimer);
    };
  }, [router]);

  return (
    <main className="app-shell app-shell--map">
      <header className="header">
        <Link href="/negocio/nuevo" className="header-back">
          ← Pedido
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <MapView center={[NEGOCIO.lat, NEGOCIO.lng]} zoom={15} markers={markers} />

      <div className="map-sheet">
        <div className="map-sheet__head">
          <h1 className="section-title" style={{ margin: 0 }}>
            {acceptedId ? "¡Pedido aceptado!" : "Esperando que acepten…"}
          </h1>
          <span className="pill pill--gold">Pago $7.000</span>
        </div>
        <p className="muted" style={{ margin: "6px 0 14px", fontSize: "0.85rem" }}>
          {acceptedId
            ? `${DRIVERS[0].name} tomó el pedido · yendo a seguimiento`
            : `Notificado a ${DRIVERS.length} cercanos · el primero que acepte lo toma`}
        </p>

        {!acceptedId && (
          <div className="wait-banner" aria-live="polite">
            <span className="wait-dots" aria-hidden>
              <i />
              <i />
              <i />
            </span>
            Buscando respuesta
          </div>
        )}

        <div className="driver-list">
          {DRIVERS.map((d) => {
            const isAccepted = acceptedId === d.id;
            return (
              <div
                key={d.id}
                className={`driver-row${isAccepted ? " driver-row--accepted" : ""}`}
              >
                <div className="driver-avatar">{d.initial}</div>
                <div className="driver-info">
                  <div className="driver-name">
                    {d.name}{" "}
                    <span className="driver-rating">★ {d.rating}</span>
                  </div>
                  <div className="driver-meta">
                    {d.vehicle} · {d.km}
                  </div>
                </div>
                <span
                  className={`driver-status${isAccepted ? " driver-status--ok" : ""}`}
                >
                  {isAccepted ? "Aceptó" : "Notificado"}
                </span>
              </div>
            );
          })}
        </div>

        <Link href="/negocio/nuevo" className="btn btn-ghost wait-cancel">
          Cancelar búsqueda
        </Link>
      </div>
    </main>
  );
}
