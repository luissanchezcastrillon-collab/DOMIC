"use client";

import { AuthLoginForm } from "../../components/AuthLoginForm";

export default function AdminLoginPage() {
  return (
    <AuthLoginForm
      title="Admin"
      backHref="/"
      backLabel="Inicio"
      redirectTo="/admin"
      requiredRole="admin"
      description="Solo cuentas con rol admin. No se registra desde aquí."
    />
  );
}
