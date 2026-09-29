export type ZoneKind = "urbano" | "corregimiento" | "municipio";

export type Place = {
  id: string;
  name: string;
  zone: ZoneKind;
  /** Distancia aprox. desde el centro urbano (km) */
  kmFromCenter: number;
};

/** Sentinel: dirección escrita a mano */
export const OTHER_PLACE_ID = "__other__";

/** Lugares de ejemplo para preview de tarifas */
export const PLACES: Place[] = [
  { id: "parque", name: "Parque principal", zone: "urbano", kmFromCenter: 0 },
  {
    id: "terminal",
    name: "Terminal de transportes",
    zone: "urbano",
    kmFromCenter: 1.2,
  },
  { id: "hospital", name: "Hospital", zone: "urbano", kmFromCenter: 1.8 },
  {
    id: "la-paila",
    name: "La Paila",
    zone: "corregimiento",
    kmFromCenter: 12,
  },
  {
    id: "la-z",
    name: "Mirador La Z",
    zone: "corregimiento",
    kmFromCenter: 8,
  },
  {
    id: "vallejuelo",
    name: "Vallejuelo",
    zone: "corregimiento",
    kmFromCenter: 9,
  },
  {
    id: "aguaazul",
    name: "Agua Azul",
    zone: "corregimiento",
    kmFromCenter: 14,
  },
  {
    id: "roldanillo",
    name: "Roldanillo",
    zone: "municipio",
    kmFromCenter: 18,
  },
  {
    id: "la-union",
    name: "La Unión",
    zone: "municipio",
    kmFromCenter: 22,
  },
];

export const ZONE_GROUP_ORDER: { zone: ZoneKind; label: string }[] = [
  { zone: "urbano", label: "Casco urbano" },
  { zone: "corregimiento", label: "Corregimiento" },
  { zone: "municipio", label: "Otro municipio" },
];

const ZONE_LABEL: Record<ZoneKind, string> = {
  urbano: "Casco urbano",
  corregimiento: "Corregimiento",
  municipio: "Otro municipio",
};

/** Bandas de tarifa (preview): base + km × tarifa (redondeo a $500) */
const ZONE_RATE: Record<
  ZoneKind,
  { base: number; perKm: number; minFare: number; defaultKm: number; defaultMin: number }
> = {
  urbano: { base: 4000, perKm: 900, minFare: 4000, defaultKm: 1.2, defaultMin: 5 },
  corregimiento: {
    base: 7000,
    perKm: 1100,
    minFare: 8000,
    defaultKm: 8,
    defaultMin: 20,
  },
  municipio: {
    base: 12000,
    perKm: 1300,
    minFare: 15000,
    defaultKm: 22,
    defaultMin: 40,
  },
};

function roundTo500(n: number) {
  return Math.round(n / 500) * 500;
}

export function placeById(
  id: string,
  catalog: Place[] = PLACES
): Place | undefined {
  if (id === OTHER_PLACE_ID) {
    return {
      id: OTHER_PLACE_ID,
      name: "Otro · escribir dirección",
      zone: "municipio",
      kmFromCenter: 22,
    };
  }
  return catalog.find((p) => p.id === id);
}

export function zoneLabel(zone: ZoneKind) {
  return ZONE_LABEL[zone];
}

export function formatCop(amount: number) {
  return `$${amount.toLocaleString("es-CO")}`;
}

export function resolvePlaceLabel(
  id: string,
  custom: string,
  fallback: string,
  catalog: Place[] = PLACES
) {
  if (id === OTHER_PLACE_ID) {
    const t = custom.trim();
    return t || fallback;
  }
  return placeById(id, catalog)?.name ?? fallback;
}

/**
 * Tarifa = según la zona más lejana del recorrido
 * + distancia entre origen y destino.
 * "Otro" cuenta como otro municipio.
 */
export function estimateFare(
  originId: string,
  destId: string,
  catalog: Place[] = PLACES
) {
  const origin = placeById(originId, catalog) ?? catalog[0] ?? PLACES[0];
  const dest = placeById(destId, catalog) ?? catalog[1] ?? PLACES[1];

  const crossZone = origin.zone !== dest.zone;

  const km =
    originId === OTHER_PLACE_ID || destId === OTHER_PLACE_ID
      ? Math.max(
          ZONE_RATE.municipio.defaultKm,
          Math.abs(dest.kmFromCenter - origin.kmFromCenter)
        )
      : Math.max(0.5, Math.abs(dest.kmFromCenter - origin.kmFromCenter));

  const zone: ZoneKind =
    origin.zone === "municipio" || dest.zone === "municipio"
      ? "municipio"
      : origin.zone === "corregimiento" || dest.zone === "corregimiento"
        ? "corregimiento"
        : "urbano";

  const rate = ZONE_RATE[zone];
  const raw = rate.base + km * rate.perKm;
  let fare = Math.max(rate.minFare, roundTo500(raw));
  let kmOut = Math.round(km * 10) / 10;
  let etaMin = Math.max(
    5,
    Math.round(km * (zone === "urbano" ? 3.5 : zone === "corregimiento" ? 2.8 : 2.4))
  );

  if (crossZone) {
    fare = roundTo500(fare * 1.15);
    kmOut = Math.round(kmOut * 1.2 * 10) / 10;
    etaMin = Math.round(etaMin * 1.2);
  }

  return {
    fare,
    km: kmOut,
    etaMin,
    zone,
    zoneLabel: ZONE_LABEL[zone],
    crossZone,
    origin,
    dest,
  };
}
