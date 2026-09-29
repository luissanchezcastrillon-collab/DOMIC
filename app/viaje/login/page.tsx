"use client";

import { AuthLoginForm } from "../../components/AuthLoginForm";

export default function ConductorLoginPage() {
  return (
    <AuthLoginForm
      title="Conductor"
      backHref="/viajes"
      backLabel="Viajes"
      redirectTo="/viaje/conductor"
      registerHref="/viaje/registro"
      requiredRole="domiciliario"
    />
  );
}
