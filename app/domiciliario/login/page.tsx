"use client";

import { AuthLoginForm } from "../../components/AuthLoginForm";

export default function DomiciliarioLoginPage() {
  return (
    <AuthLoginForm
      title="Domiciliario"
      backHref="/domicilios"
      backLabel="Domicilios"
      redirectTo="/domiciliario"
      registerHref="/domiciliario/registro"
      requiredRole="domiciliario"
    />
  );
}
