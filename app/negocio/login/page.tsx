"use client";

import { AuthLoginForm } from "../../components/AuthLoginForm";

export default function NegocioLoginPage() {
  return (
    <AuthLoginForm
      title="Negocio"
      backHref="/domicilios"
      backLabel="Domicilios"
      redirectTo="/negocio"
      registerHref="/negocio/registro"
      requiredRole="negocio"
    />
  );
}
