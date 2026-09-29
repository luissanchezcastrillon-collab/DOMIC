"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getMyDriver, getMyProfile, type DriverStatus } from "../lib/auth";
import { LogoutButton } from "./LogoutButton";

type Props = {
  loginHref: string;
  children: ReactNode;
  perfilHref?: string;
};

function statusCopy(status: DriverStatus) {
  if (status === "rechazado") {
    return {
      title: "Solicitud rechazada",
      desc: "El admin no aprobó tu cuenta. Si crees que es un error, contacta a domic.",
    };
  }
  if (status === "suspendido") {
    return {
      title: "Cuenta suspendida",
      desc: "No puedes recibir viajes ni domicilios hasta que el admin reactive tu cuenta.",
    };
  }
  return {
    title: "Pendiente de aprobación",
    desc: "Ya puedes entrar, pero no usar la app todavía. El admin debe revisar tus datos y aprobarte.",
  };
}

export function DriverAccessGate({ loginHref, children, perfilHref }: Props) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [status, setStatus] = useState<DriverStatus>("pendiente");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const [profile, driver] = await Promise.all([
          getMyProfile(),
          getMyDriver(),
        ]);
        if (cancelled) return;
        if (!profile) {
          router.replace(loginHref);
          return;
        }
        setName(profile.full_name);
        const st = driver?.status ?? "pendiente";
        setStatus(st);
        setAllowed(st === "aprobado");
      } catch {
        if (!cancelled) router.replace(loginHref);
        return;
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void check();
    return () => {
      cancelled = true;
    };
  }, [loginHref, router]);

  if (!ready) {
    return (
      <main className="app-shell">
        <p className="muted center">Comprobando aprobación…</p>
      </main>
    );
  }

  if (allowed) return <>{children}</>;

  const copy = statusCopy(status);

  return (
    <main className="app-shell">
      <header className="header">
        <LogoutButton redirectTo={loginHref} />
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">{copy.title}</h1>
      <p className="section-desc">
        {name ? `Hola, ${name}. ` : ""}
        {copy.desc}
      </p>

      <div className="kv" style={{ marginBottom: 20 }}>
        <div className="kv-row">
          <span>Estado</span>
          <strong>{status}</strong>
        </div>
      </div>

      <div className="stack">
        {perfilHref && (
          <Link href={perfilHref} className="btn btn-ghost">
            Ver mi perfil
          </Link>
        )}
        <LogoutButton redirectTo={loginHref} variant="button" />
      </div>
    </main>
  );
}
