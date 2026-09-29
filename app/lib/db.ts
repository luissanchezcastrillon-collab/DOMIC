import { supabase } from "./supabase";
import type { DirectoryBiz, DirectorySection } from "./directory";
import type { Municipio } from "./municipios";
import type { Place, ZoneKind } from "./fare";
import type {
  TurismoCategory,
  TurismoCategoryId,
  TurismoPlace,
} from "./turismo";

const TURISMO_ORDER: TurismoCategoryId[] = [
  "sitios",
  "canchas",
  "cine",
  "fitness",
  "eventos",
  "fundaciones",
];

type BusinessRow = {
  id: string;
  municipio_id: string;
  category_id: string;
  name: string;
  description: string | null;
  tag: string | null;
  hours: string | null;
  open_hour: number | null;
  close_hour: number | null;
  phone: string | null;
  phone_display: string | null;
  whatsapp: string | null;
  address: string | null;
  maps_url: string | null;
  link: string | null;
  link_label: string | null;
  social_url: string | null;
  status: string;
};

function mapBiz(row: BusinessRow): DirectoryBiz {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    tag: row.tag ?? undefined,
    hours: row.hours ?? undefined,
    openHour: row.open_hour ?? undefined,
    closeHour: row.close_hour ?? undefined,
    phone: row.phone ?? undefined,
    phoneDisplay: row.phone_display ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    address: row.address ?? undefined,
    mapsUrl: row.maps_url ?? undefined,
    link: row.link ?? undefined,
    linkLabel: row.link_label ?? undefined,
    socialUrl: row.social_url ?? undefined,
  };
}

export async function fetchMunicipios(): Promise<Municipio[]> {
  const { data, error } = await supabase
    .from("municipios")
    .select("id, name, departamento, lat, lng")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id as string,
    name: m.name as string,
    departamento: m.departamento as string,
    center: { lat: Number(m.lat), lng: Number(m.lng) },
  }));
}

export async function fetchDirectory(
  municipioId?: string | null
): Promise<DirectorySection[]> {
  const { data: cats, error: catErr } = await supabase
    .from("business_categories")
    .select("id, title, singular")
    .order("title");
  if (catErr) throw catErr;

  let query = supabase
    .from("businesses")
    .select(
      "id, municipio_id, category_id, name, description, tag, hours, open_hour, close_hour, phone, phone_display, whatsapp, address, maps_url, link, link_label, social_url, status"
    )
    .eq("status", "activo");

  if (municipioId) query = query.eq("municipio_id", municipioId);

  const { data: businesses, error: bizErr } = await query.order("name");
  if (bizErr) throw bizErr;

  const list = (businesses ?? []) as BusinessRow[];

  return (cats ?? []).map((c) => ({
    id: c.id as string,
    title: c.title as string,
    singular: c.singular as string,
    businesses: list.filter((b) => b.category_id === c.id).map(mapBiz),
  }));
}

export async function fetchBusinessById(id: string): Promise<{
  biz: DirectoryBiz;
  section: DirectorySection;
} | null> {
  const { data: row, error } = await supabase
    .from("businesses")
    .select(
      "id, municipio_id, category_id, name, description, tag, hours, open_hour, close_hour, phone, phone_display, whatsapp, address, maps_url, link, link_label, social_url, status"
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;

  const { data: cat, error: catErr } = await supabase
    .from("business_categories")
    .select("id, title, singular")
    .eq("id", row.category_id)
    .maybeSingle();
  if (catErr) throw catErr;
  if (!cat) return null;

  const biz = mapBiz(row as BusinessRow);
  return {
    biz,
    section: {
      id: cat.id as string,
      title: cat.title as string,
      singular: cat.singular as string,
      businesses: [biz],
    },
  };
}

export async function fetchTurismoCategories(): Promise<TurismoCategory[]> {
  const { data, error } = await supabase
    .from("turismo_categories")
    .select("id, title, description");
  if (error) throw error;

  const rows = data ?? [];
  return TURISMO_ORDER.map((id) => {
    const row = rows.find((r) => r.id === id);
    return {
      id,
      title: (row?.title as string) ?? id,
      desc: (row?.description as string) ?? "",
    };
  }).filter((c) => rows.some((r) => r.id === c.id));
}

export async function fetchTurismoPlaces(
  municipioId?: string | null,
  categoryId?: string | null
): Promise<TurismoPlace[]> {
  let query = supabase
    .from("turismo_places")
    .select(
      "id, category_id, name, short, detail, meta, fare_place_id, event_when, is_published"
    )
    .eq("is_published", true);

  if (municipioId) query = query.eq("municipio_id", municipioId);
  if (categoryId) query = query.eq("category_id", categoryId);

  const { data, error } = await query.order("name");
  if (error) throw error;

  return (data ?? []).map((p) => ({
    id: p.id as string,
    categoryId: p.category_id as TurismoCategoryId,
    name: p.name as string,
    short: (p.short as string) ?? "",
    detail: p.detail as string,
    meta: (p.meta as string) ?? undefined,
    farePlaceId: (p.fare_place_id as string) ?? undefined,
    when: (p.event_when as string) ?? undefined,
  }));
}

export async function fetchTurismoPlace(
  id: string
): Promise<TurismoPlace | null> {
  const { data, error } = await supabase
    .from("turismo_places")
    .select(
      "id, category_id, name, short, detail, meta, fare_place_id, event_when, is_published"
    )
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id as string,
    categoryId: data.category_id as TurismoCategoryId,
    name: data.name as string,
    short: (data.short as string) ?? "",
    detail: data.detail as string,
    meta: (data.meta as string) ?? undefined,
    farePlaceId: (data.fare_place_id as string) ?? undefined,
    when: (data.event_when as string) ?? undefined,
  };
}

export async function fetchPlaces(municipioId?: string | null): Promise<Place[]> {
  let query = supabase
    .from("places")
    .select("id, name, zone, km_from_center")
    .order("km_from_center");
  if (municipioId) query = query.eq("municipio_id", municipioId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id as string,
    name: p.name as string,
    zone: p.zone as ZoneKind,
    kmFromCenter: Number(p.km_from_center),
  }));
}

export async function submitTurismoPlace(input: {
  municipioId: string;
  categoryId: string;
  name: string;
  description: string;
  location?: string;
  eventWhen?: string;
  contact?: string;
}) {
  const { error } = await supabase.from("turismo_submissions").insert({
    municipio_id: input.municipioId,
    category_id: input.categoryId,
    name: input.name,
    description: input.description,
    location: input.location || null,
    event_when: input.eventWhen || null,
    contact: input.contact || null,
    status: "pendiente",
  });
  if (error) throw error;
}

export type AdminDriver = {
  id: string;
  nombre: string;
  telefono: string;
  email?: string;
  municipioId: string;
  estado: "pendiente" | "aprobado" | "rechazado" | "suspendido";
};

type DriverRow = {
  id: string;
  status: AdminDriver["estado"];
  municipio_id: string;
  profiles:
    | { full_name: string; phone: string | null }
    | { full_name: string; phone: string | null }[]
    | null;
};

export async function fetchAdminDrivers(): Promise<AdminDriver[]> {
  const { data: profiles, error: profileErr } = await supabase
    .from("profiles")
    .select("id, full_name, phone, municipio_id, role")
    .eq("role", "domiciliario");
  if (profileErr) throw profileErr;

  const { data: existing, error: existingErr } = await supabase
    .from("drivers")
    .select("id, profile_id");
  if (existingErr) throw existingErr;

  const existingIds = new Set((existing ?? []).map((d) => d.profile_id as string));
  const missing = (profiles ?? []).filter((p) => !existingIds.has(p.id as string));
  if (missing.length) {
    await supabase.from("drivers").insert(
      missing.map((p) => ({
        profile_id: p.id,
        municipio_id: (p.municipio_id as string) || "zarzal",
        vehicle_type: "motocarro",
        status: "pendiente",
      }))
    );
  }

  const { data, error } = await supabase
    .from("drivers")
    .select("id, status, municipio_id, profiles!profile_id ( full_name, phone )")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return ((data ?? []) as DriverRow[]).map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      nombre: profile?.full_name || "Sin nombre",
      telefono: profile?.phone || "Sin teléfono",
      municipioId: row.municipio_id,
      estado: row.status,
    };
  });
}

export async function approveDriver(id: string) {
  const { error } = await supabase
    .from("drivers")
    .update({ status: "aprobado" })
    .eq("id", id);
  if (error) throw error;
}
