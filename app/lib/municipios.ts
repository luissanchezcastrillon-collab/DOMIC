export type Municipio = {
  id: string;
  name: string;
  departamento: string;
  /** Centro urbano para mapas (preview) */
  center: { lat: number; lng: number };
};

/** Municipios donde DOMIC puede operar (preview) */
export const MUNICIPIOS: Municipio[] = [
  {
    id: "zarzal",
    name: "Zarzal",
    departamento: "Valle del Cauca",
    center: { lat: 4.3948, lng: -76.0772 },
  },
  {
    id: "roldanillo",
    name: "Roldanillo",
    departamento: "Valle del Cauca",
    center: { lat: 4.413, lng: -76.155 },
  },
  {
    id: "la-union",
    name: "La Unión",
    departamento: "Valle del Cauca",
    center: { lat: 4.533, lng: -76.103 },
  },
];

export const MUNICIPIO_STORAGE_KEY = "domic_municipio_id";

export function municipioById(id: string | null | undefined) {
  if (!id) return undefined;
  return MUNICIPIOS.find((m) => m.id === id);
}
