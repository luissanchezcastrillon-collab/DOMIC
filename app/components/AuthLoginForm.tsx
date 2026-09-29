"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authErrorMessage, getMyProfile, signIn, type AppRole } from "../lib/auth";
import { supabase } from "../lib/supabase";

type Props = {
  title: string;
  backHref: string;
  backLabel: string;
  redirectTo: string;
  registerHref?: string;
  requiredRole?: AppRole;
  description?: string;
};

export function AuthLoginForm({
  title,
  backHref,
  backLabel,
  redirectTo,
  registerHref,
  requiredRole,
  description,
}: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Usa un correo real, por ejemplo tu@correo.com");
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      if (requiredRole) {
        const profile = await getMyProfile();
        if (!profile || profile.role !== requiredRole) {
          await supabase.auth.signOut();
          setError(
            requiredRole === "admin"
              ? "Esta cuenta no es de administrador."
              : `Esta cuenta no es de ${requiredRole}.`
          );
          return;
        }
      }
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="header">
        <Link href={backHref} className="header-back">
          ← {backLabel}
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">{title}</h1>
      <p className="section-desc">
        {description ??
          (registerHref
            ? "Entra con tu correo. Si no tienes cuenta, regístrate."
            : "Entra con tu correo.")}
      </p>

      <form className="stack-lg" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        {error && <p className="muted">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      {registerHref && (
        <p className="center muted" style={{ marginTop: 24 }}>
          ¿No tienes cuenta?{" "}
          <Link href={registerHref} style={{ color: "var(--gold)" }}>
            Regístrate
          </Link>
        </p>
      )}
    </main>
  );
}
