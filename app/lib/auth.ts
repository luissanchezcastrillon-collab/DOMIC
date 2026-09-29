import { supabase } from "./supabase";

export type AppRole = "cliente" | "negocio" | "domiciliario" | "admin";

export function authErrorMessage(error: unknown) {
  const msg =
    error && typeof error === "object" && "message" in error
      ? String((error as { message: string }).message)
      : "";
  const lower = msg.toLowerCase();
  if (lower.includes("email not confirmed")) {
    return "Confirma tu correo antes de entrar (revisa la bandeja o spam).";
  }
  if (lower.includes("invalid login")) {
    return "Correo o contraseña incorrectos.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "Ese correo ya tiene cuenta. Entra con tu contraseña.";
  }
  if (lower.includes("password")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  return msg || "No se pudo completar. Inténtalo de nuevo.";
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpAccount(input: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: Exclude<AppRole, "admin">;
  municipioId?: string;
  businessName?: string;
  address?: string;
  categoryId?: string;
}) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone ?? "",
        role: input.role,
        municipio_id: input.municipioId ?? "zarzal",
        business_name: input.businessName ?? "",
        address: input.address ?? "",
        category_id: input.categoryId ?? "tiendas",
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, municipio_id")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type DriverStatus = "pendiente" | "aprobado" | "rechazado" | "suspendido";

export type MyDriver = {
  id: string;
  status: DriverStatus;
  municipio_id: string;
  vehicle_type: string;
  is_online: boolean;
};

export async function getMyDriver(): Promise<MyDriver | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("drivers")
    .select("id, status, municipio_id, vehicle_type, is_online")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (data) return data as MyDriver;

  const profile = await getMyProfile();
  if (!profile || profile.role !== "domiciliario") return null;

  const { data: created, error: createErr } = await supabase
    .from("drivers")
    .insert({
      profile_id: user.id,
      municipio_id: profile.municipio_id || "zarzal",
      vehicle_type: "motocarro",
      status: "pendiente",
    })
    .select("id, status, municipio_id, vehicle_type, is_online")
    .single();
  if (createErr) throw createErr;
  return created as MyDriver;
}
