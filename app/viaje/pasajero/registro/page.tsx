"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useMunicipio } from "../../../components/MunicipioProvider";
import { authErrorMessage, signUpAccount } from "../../../lib/auth";

export default function PasajeroRegistroPage() {
  const router = useRouter();
  const { municipio } = useMunicipio();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.includes("@")) {
      setError("Usa un correo real, por ejemplo tu@correo.com");
      return;
    }
    setLoading(true);
    try {
      const data = await signUpAccount({
        email,
        password,
        fullName: nombre,
        phone: telefono,
        role: "cliente",
        municipioId: municipio?.id ?? "zarzal",
      });
      if (!data.session) {
        setInfo(
          "Cuenta creada. Confirma el correo si te llegó un mensaje y luego entra."
        );
        return;
      }
      router.push("/viaje");
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
        <Link href="/viaje/pasajero/login" className="header-back">
          ← Entrar
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Crear cuenta</h1>
      <p className="section-desc">
        Regístrate para pedir motocarro
        {municipio ? ` en ${municipio.name}` : ""}.
      </p>

      <form className="stack-lg" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        {error && <p className="muted">{error}</p>}
        {info && <p className="muted">{info}</p>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creando…" : "Registrarme"}
        </button>
      </form>
    </main>
  );
}
