"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ChevronRight,
  Landmark,
  MapPin,
  Package,
  Shield,
} from "lucide-react";
import BrandBannerIntro from "./components/BrandBannerIntro";
import { MotocarroIcon } from "./components/MotocarroIcon";
import { useMunicipio } from "./components/MunicipioProvider";

export default function HomePage() {
  const { municipio, ready } = useMunicipio();
  const [introDone, setIntroDone] = useState(false);
  const onIntroComplete = useCallback(() => setIntroDone(true), []);

  /* Splash: solo letrero + motocarro al centro */
  if (!ready || !introDone) {
    return (
      <main className="app-shell app-shell--home app-shell--splash">
        <div className="home-splash">
          {ready ? (
            <BrandBannerIntro onComplete={onIntroComplete} />
          ) : (
            <p className="muted center">Cargando…</p>
          )}
        </div>
      </main>
    );
  }

  /* Menú después de que pasa el motocarro */
  return (
    <main className="app-shell app-shell--home">
      <header className="home-top">
        <div className="brand brand--sm">domic</div>
        <Link href="/municipio" className="home-muni">
          <MapPin size={14} aria-hidden />
          <span>{municipio?.name ?? "Elegir municipio"}</span>
        </Link>
      </header>

      <section className="home-hello">
        <h1 className="home-hello__title">Hola, ¿qué necesitas hoy?</h1>
        <p className="home-hello__sub">Elige un servicio para empezar</p>
      </section>

      <nav className="home-services" aria-label="Elige un servicio">
        <Link href="/viajes" className="home-service home-service--primary">
          <span className="home-service__icon" aria-hidden>
            <MotocarroIcon size={22} />
          </span>
          <span className="home-service__text">
            <span className="home-service__name">Viajes</span>
            <span className="home-service__desc">Motocarro y pasajeros</span>
          </span>
          <ChevronRight size={20} aria-hidden />
        </Link>

        <Link href="/domicilios" className="home-service">
          <span className="home-service__icon" aria-hidden>
            <Package size={22} />
          </span>
          <span className="home-service__text">
            <span className="home-service__name">Domicilios</span>
            <span className="home-service__desc">
              Cliente, negocio y entregas
            </span>
          </span>
          <ChevronRight size={20} aria-hidden />
        </Link>

        <Link href="/turismo" className="home-service">
          <span className="home-service__icon" aria-hidden>
            <Landmark size={22} />
          </span>
          <span className="home-service__text">
            <span className="home-service__name">Turismo</span>
            <span className="home-service__desc">Planes y miradores</span>
          </span>
          <ChevronRight size={20} aria-hidden />
        </Link>
      </nav>

      <Link href="/admin/login" className="home-admin-btn">
        <Shield size={16} aria-hidden />
        Panel de administración
      </Link>
    </main>
  );
}
