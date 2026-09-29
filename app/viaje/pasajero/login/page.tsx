"use client";

import { AuthLoginForm } from "../../../components/AuthLoginForm";

export default function PasajeroLoginPage() {
  return (
    <AuthLoginForm
      title="Pasajero"
      backHref="/viajes"
      backLabel="Viajes"
      redirectTo="/viaje"
      registerHref="/viaje/pasajero/registro"
    />
  );
}
