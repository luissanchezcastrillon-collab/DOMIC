export type TurismoCategoryId =
  | "sitios"
  | "canchas"
  | "cine"
  | "fitness"
  | "eventos"
  | "fundaciones";

export type TurismoPlace = {
  id: string;
  categoryId: TurismoCategoryId;
  name: string;
  short: string;
  detail: string;
  meta?: string;
  /** Place id from fare.ts for "Pedir viaje", if applicable */
  farePlaceId?: string;
  when?: string;
};

export type TurismoCategory = {
  id: TurismoCategoryId;
  title: string;
  desc: string;
};

export const TURISMO_CATEGORIES: TurismoCategory[] = [
  {
    id: "sitios",
    title: "Sitios turísticos",
    desc: "Miradores, ríos, fincas y planes",
  },
  {
    id: "canchas",
    title: "Canchas deportivas",
    desc: "Fútbol, básquet, voleibol y más",
  },
  {
    id: "cine",
    title: "Cine y cultura",
    desc: "Salas, teatros y proyecciones",
  },
  {
    id: "fitness",
    title: "Fitness",
    desc: "Gimnasios, parques y entrenamiento",
  },
  {
    id: "eventos",
    title: "Eventos próximos",
    desc: "Ferias, conciertos y actividades",
  },
  {
    id: "fundaciones",
    title: "Fundaciones",
    desc: "Sociales, culturales y comunitarias",
  },
];

/** Ejemplos de preview por municipio (Zarzal y zona) */
export const TURISMO_PLACES: TurismoPlace[] = [
  {
    id: "la-z",
    categoryId: "sitios",
    name: "Mirador La Z",
    short: "Mirador · juegos",
    detail:
      "Mirador con zona de juegos: deslizador de colores y trampolines. Plan para ir en familia o con amigos y disfrutar la vista.",
    meta: "Desde el centro · motocarro disponible",
    farePlaceId: "la-z",
  },
  {
    id: "la-paila",
    categoryId: "sitios",
    name: "La Paila",
    short: "Corregimiento",
    detail:
      "Corregimiento cercano para pasear, comer y conocer el entorno rural del municipio.",
    meta: "Corregimiento",
    farePlaceId: "la-paila",
  },
  {
    id: "cancha-municipal",
    categoryId: "canchas",
    name: "Cancha municipal",
    short: "Fútbol · pública",
    detail:
      "Cancha de fútbol del municipio. Espacio abierto para partidos y encuentros barriales.",
    meta: "Casco urbano",
    farePlaceId: "parque",
  },
  {
    id: "cancha-coliseo",
    categoryId: "canchas",
    name: "Coliseo / polideportivo",
    short: "Básquet · voleibol",
    detail:
      "Espacio cubierto para básquet, voleibol y eventos deportivos del pueblo.",
    meta: "Casco urbano",
  },
  {
    id: "cine-casa-cultura",
    categoryId: "cine",
    name: "Casa de la Cultura",
    short: "Proyecciones · teatro",
    detail:
      "Espacio cultural del municipio. Consulta cartelera de cine comunitario y funciones.",
    meta: "Cartelera variable",
  },
  {
    id: "gym-centro",
    categoryId: "fitness",
    name: "Gimnasio del centro",
    short: "Pesas · cardio",
    detail:
      "Entrenamiento en el casco urbano. Horarios y tarifas los confirma el local.",
    meta: "Casco urbano",
  },
  {
    id: "parque-biosaludable",
    categoryId: "fitness",
    name: "Parque biosaludable",
    short: "Aire libre · gratis",
    detail:
      "Máquinas al aire libre en el parque principal para ejercitarse sin costo.",
    meta: "Parque principal",
    farePlaceId: "parque",
  },
  {
    id: "feria-agro",
    categoryId: "eventos",
    name: "Feria agropecuaria",
    short: "Próximo evento",
    detail:
      "Muestra agropecuaria y gastronomía local. Fecha de ejemplo para la vista previa.",
    meta: "Plaza principal",
    when: "Sáb 26 jul · 9:00 a.m.",
  },
  {
    id: "noche-cultural",
    categoryId: "eventos",
    name: "Noche cultural",
    short: "Música · danza",
    detail:
      "Presentaciones artísticas locales en el parque o la Casa de la Cultura.",
    meta: "Entrada libre",
    when: "Vie 1 ago · 7:00 p.m.",
  },
  {
    id: "fundacion-juventud",
    categoryId: "fundaciones",
    name: "Fundación Juventud Activa",
    short: "Deportes · formación",
    detail:
      "Apoya deporte y formación para jóvenes del municipio. Contacto de ejemplo en preview.",
    meta: "Comunitaria",
  },
  {
    id: "fundacion-adulto-mayor",
    categoryId: "fundaciones",
    name: "Fundación Adulto Mayor",
    short: "Acompañamiento",
    detail:
      "Actividades y acompañamiento para adultos mayores de la zona.",
    meta: "Social",
  },
];

export function turismoCategoryById(id: string) {
  return TURISMO_CATEGORIES.find((c) => c.id === id);
}

export function turismoPlacesByCategory(categoryId: string) {
  return TURISMO_PLACES.filter((p) => p.categoryId === categoryId);
}

export function turismoPlaceById(id: string) {
  return TURISMO_PLACES.find((p) => p.id === id);
}

export function turismoCount(categoryId: TurismoCategoryId) {
  return TURISMO_PLACES.filter((p) => p.categoryId === categoryId).length;
}
