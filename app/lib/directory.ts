export type DirectoryBiz = {
  id: string;
  name: string;
  description?: string;
  /** Etiqueta corta bajo el nombre (ej. Buffet) */
  tag?: string;
  /** Ej: Lun–Dom 11:00 a.m. – 9:00 p.m. */
  hours?: string;
  /** Hora apertura 0–23 para estado Abierto (preview) */
  openHour?: number;
  /** Hora cierre 0–23 */
  closeHour?: number;
  phone?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  link?: string;
  linkLabel?: string;
  socialUrl?: string;
  address?: string;
  mapsUrl?: string;
};

export type DirectorySection = {
  id: string;
  title: string;
  /** Singular para ficha: RESTAURANTE */
  singular: string;
  businesses: DirectoryBiz[];
};

export function mapsLinkFor(biz: Pick<DirectoryBiz, "mapsUrl" | "address">) {
  if (biz.mapsUrl) return biz.mapsUrl;
  if (biz.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address)}`;
  }
  return null;
}

/** Estado abierto según hora local (preview simple) */
export function businessOpenStatus(biz: DirectoryBiz) {
  const openH = biz.openHour ?? 11;
  const closeH = biz.closeHour ?? 21;
  const hour = new Date().getHours();
  const open = hour >= openH && hour < closeH;
  const closeLabel =
    closeH <= 12 ? `${closeH}:00 a.m.` : `${closeH === 12 ? 12 : closeH - 12}:00 p.m.`;
  return {
    open,
    label: open ? "Abierto" : "Cerrado",
    detail: open
      ? `Abierto ahora · cierra ${closeLabel}`
      : `Cerrado · abre ${openH > 12 ? openH - 12 : openH}:00 ${openH >= 12 ? "p.m." : "a.m."}`,
  };
}

export function bizInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export const DIRECTORY_CATEGORIES = [
  { id: "restaurantes", title: "Restaurantes" },
  { id: "farmacias", title: "Farmacias" },
  { id: "tiendas", title: "Tiendas" },
  { id: "ferreterias", title: "Ferreterías" },
  { id: "panaderias", title: "Panaderías" },
] as const;

export const AURA_MAPS_URL =
  "https://www.google.com/maps/place/AURA+RESTAURANT/@4.3948526,-76.0698768/17z/data=!3m1!4b1!4m6!3m5!1s0x8e384913bbb2f129:0xb539196ec6033af!8m2!3d4.3948526!4d-76.0698768!16s%2Fg%2F11n9g5zm9m";

export const AURA_MENU_URL =
  "https://menu.pirpos.com/menu/69b893bc86db806b86e47284/HAMBURGUESAS%20NOCHE?qrCode=true";

export const AURA_EXAMPLE: DirectoryBiz = {
  id: "aura",
  name: "Aura Restaurante",
  tag: "Buffet",
  description:
    "Único restaurante tipo buffet en la región. Puedes pedir por WhatsApp o desde su menú digital.",
  hours: "Lun–Dom · 11:00 a.m. – 9:00 p.m.",
  openHour: 11,
  closeHour: 21,
  whatsapp: "573135912392",
  phoneDisplay: "313 591 2392",
  address: "Aura Restaurant, Zarzal",
  mapsUrl: AURA_MAPS_URL,
  link: AURA_MENU_URL,
  linkLabel: "Ver menú y pedir",
  socialUrl: "https://www.instagram.com/aurarestaurant.col/",
};

export const DIRECTORY_SECTIONS: DirectorySection[] = [
  {
    id: "restaurantes",
    title: "Restaurantes",
    singular: "Restaurante",
    businesses: [AURA_EXAMPLE],
  },
  {
    id: "farmacias",
    title: "Farmacias",
    singular: "Farmacia",
    businesses: [],
  },
  {
    id: "tiendas",
    title: "Tiendas",
    singular: "Tienda",
    businesses: [],
  },
  {
    id: "ferreterias",
    title: "Ferreterías",
    singular: "Ferretería",
    businesses: [],
  },
  {
    id: "panaderias",
    title: "Panaderías",
    singular: "Panadería",
    businesses: [],
  },
];

export function findBusiness(id: string) {
  for (const section of DIRECTORY_SECTIONS) {
    const biz = section.businesses.find((b) => b.id === id);
    if (biz) return { biz, section };
  }
  return null;
}
