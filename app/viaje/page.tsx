"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  MapPin,
  Navigation,
  type LucideIcon,
} from "lucide-react";
import { MotocarroIcon } from "../components/MotocarroIcon";
import { useMunicipio } from "../components/MunicipioProvider";
import { fetchPlaces } from "../lib/db";
import {
  OTHER_PLACE_ID,
  PLACES,
  ZONE_GROUP_ORDER,
  estimateFare,
  formatCop,
  resolvePlaceLabel,
  type Place,
} from "../lib/fare";

type FieldProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  custom: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  onSelect: (id: string) => void;
  onCustom: (v: string) => void;
  placeholder: string;
  places: Place[];
};

function PlaceField({
  id,
  label,
  icon: Icon,
  value,
  custom,
  open,
  onToggle,
  onClose,
  onSelect,
  onCustom,
  placeholder,
  places,
}: FieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isOther = value === OTHER_PLACE_ID;
  const selected = places.find((p) => p.id === value);
  const displayValue = isOther
    ? "Otro · escribir dirección"
    : (selected?.name ?? "Elegir lugar");

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  return (
    <div className="place-field" ref={rootRef}>
      <label className="place-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="place-field__wrap">
        <button
          id={id}
          type="button"
          onClick={onToggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`place-field__btn${open ? " place-field__btn--open" : ""}`}
        >
          <Icon size={16} className="place-field__icon" aria-hidden />
          <span className="place-field__value">{displayValue}</span>
          <ChevronDown
            size={16}
            className={`place-field__chevron${open ? " place-field__chevron--open" : ""}`}
            aria-hidden
          />
        </button>

        {open && (
          <div role="listbox" className="place-menu">
            {ZONE_GROUP_ORDER.map(({ zone, label: groupLabel }) => {
              const items = places.filter((p) => p.zone === zone);
              if (!items.length) return null;
              return (
                <div key={zone} className="place-menu__group">
                  <p className="place-menu__group-label">{groupLabel}</p>
                  {items.map((p: Place) => (
                    <button
                      key={p.id}
                      type="button"
                      role="option"
                      aria-selected={value === p.id}
                      onClick={() => onSelect(p.id)}
                      className="place-menu__item"
                    >
                      <span className="place-menu__item-label">{p.name}</span>
                      {value === p.id && (
                        <Check size={16} className="place-menu__check" aria-hidden />
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
            <div className="place-menu__line" aria-hidden />
            <button
              type="button"
              role="option"
              aria-selected={isOther}
              onClick={() => onSelect(OTHER_PLACE_ID)}
              className="place-menu__item place-menu__item--other"
            >
              <span className="place-menu__item-label">
                Otro · escribir dirección
              </span>
              {isOther && (
                <Check size={16} className="place-menu__check" aria-hidden />
              )}
            </button>
          </div>
        )}
      </div>

      {isOther && (
        <input
          type="text"
          value={custom}
          onChange={(e) => onCustom(e.target.value)}
          placeholder={placeholder}
          className="place-field__custom"
          autoComplete="street-address"
        />
      )}
    </div>
  );
}

function PedirViajeForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { municipio, ready } = useMunicipio();
  const destParam = params.get("destino");
  const [places, setPlaces] = useState<Place[]>(PLACES);
  const initialDest =
    destParam && places.some((p) => p.id === destParam) ? destParam : "terminal";

  const [origenId, setOrigenId] = useState("parque");
  const [destinoId, setDestinoId] = useState(initialDest);
  const [origenCustom, setOrigenCustom] = useState("");
  const [destinoCustom, setDestinoCustom] = useState("");
  const [openField, setOpenField] = useState<"pickup" | "dropoff" | null>(null);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    fetchPlaces(municipio?.id)
      .then((rows) => {
        if (!cancelled && rows.length) setPlaces(rows);
      })
      .catch(() => {
        /* keep preview places */
      });
    return () => {
      cancelled = true;
    };
  }, [municipio?.id, ready]);

  useEffect(() => {
    if (destParam && places.some((p) => p.id === destParam)) {
      setDestinoId(destParam);
    }
  }, [destParam, places]);

  const quote = useMemo(
    () => estimateFare(origenId, destinoId, places),
    [destinoId, origenId, places]
  );

  const samePlace =
    origenId === destinoId && origenId !== OTHER_PLACE_ID;
  const otherIncomplete =
    (origenId === OTHER_PLACE_ID && !origenCustom.trim()) ||
    (destinoId === OTHER_PLACE_ID && !destinoCustom.trim());
  const canSubmit = !samePlace && !otherIncomplete;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const o = resolvePlaceLabel(origenId, origenCustom, "Origen", places);
    const d = resolvePlaceLabel(destinoId, destinoCustom, "Destino", places);
    const q = new URLSearchParams({
      o,
      d,
      fare: String(quote.fare),
      zone: quote.zone,
    });
    router.push(`/viaje/buscando?${q.toString()}`);
  }

  return (
    <>
      <h1 className="section-title">Pedir viaje</h1>
      <p className="section-desc">
        La tarifa cambia si vas al casco urbano, a un corregimiento o a otro
        municipio.
      </p>

      <form className="ride-form" onSubmit={onSubmit}>
        <PlaceField
          id="pickup"
          label="¿Dónde te recogemos?"
          icon={MapPin}
          value={origenId}
          custom={origenCustom}
          open={openField === "pickup"}
          onToggle={() =>
            setOpenField((f) => (f === "pickup" ? null : "pickup"))
          }
          onClose={() => setOpenField(null)}
          onSelect={(id) => {
            setOrigenId(id);
            setOpenField(null);
          }}
          onCustom={setOrigenCustom}
          placeholder="Ej. Calle 8 #4-20, barrio El Prado"
          places={places}
        />

        <PlaceField
          id="dropoff"
          label="¿A dónde vas?"
          icon={Navigation}
          value={destinoId}
          custom={destinoCustom}
          open={openField === "dropoff"}
          onToggle={() =>
            setOpenField((f) => (f === "dropoff" ? null : "dropoff"))
          }
          onClose={() => setOpenField(null)}
          onSelect={(id) => {
            setDestinoId(id);
            setOpenField(null);
          }}
          onCustom={setDestinoCustom}
          placeholder="Ej. Vereda El Vergel, finca La Esperanza"
          places={places}
        />

        {samePlace && (
          <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>
            Elige un destino distinto al origen.
          </p>
        )}
        {otherIncomplete && (
          <p className="muted" style={{ fontSize: "0.85rem", margin: 0 }}>
            Escribe la dirección en «Otro».
          </p>
        )}

        <div className="fare-card">
          <div className="fare-card__row">
            <div>
              <div className="fare-card__label">Tarifa estimada</div>
              <div className="fare-card__meta">
                {quote.zoneLabel} · ~{quote.km} km · ~{quote.etaMin} min
              </div>
            </div>
            <div className="fare-card__value">{formatCop(quote.fare)}</div>
          </div>
          {quote.crossZone && (
            <p className="fare-card__note">
              Incluye recargo por viaje entre zonas distintas.
            </p>
          )}
        </div>

        <div className="ride-form__cta">
          <button
            type="submit"
            className="btn btn-primary btn--with-icon"
            disabled={!canSubmit}
          >
            <MotocarroIcon size={22} />
            Pedir motocarro
          </button>
        </div>
      </form>
    </>
  );
}

export default function PedirViajePage() {
  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/viajes" className="header-back">
          <ArrowLeft size={16} aria-hidden />
          Viajes
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <Suspense fallback={<p className="muted">Cargando…</p>}>
        <PedirViajeForm />
      </Suspense>

      <p className="center muted" style={{ marginTop: 24 }}>
        <Link href="/viaje/pasajero/login" style={{ color: "var(--gold)" }}>
          Entra o regístrate
        </Link>{" "}
        para guardar tus viajes
      </p>
    </main>
  );
}
