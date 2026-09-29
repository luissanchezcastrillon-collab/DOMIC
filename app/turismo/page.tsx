"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Clapperboard,
  Dumbbell,
  HeartHandshake,
  Landmark,
  MapPinned,
  Plus,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { useMunicipio } from "../components/MunicipioProvider";
import { fetchTurismoCategories, fetchTurismoPlaces } from "../lib/db";
import {
  TURISMO_CATEGORIES,
  type TurismoCategory,
  type TurismoCategoryId,
} from "../lib/turismo";

const ICONS: Record<TurismoCategoryId, LucideIcon> = {
  sitios: Landmark,
  canchas: Trophy,
  cine: Clapperboard,
  fitness: Dumbbell,
  eventos: MapPinned,
  fundaciones: HeartHandshake,
};

export default function TurismoHubPage() {
  const { municipio, ready } = useMunicipio();
  const [categories, setCategories] =
    useState<TurismoCategory[]>(TURISMO_CATEGORIES);
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    async function load() {
      try {
        const [cats, places] = await Promise.all([
          fetchTurismoCategories(),
          fetchTurismoPlaces(municipio?.id),
        ]);
        if (cancelled) return;
        if (cats.length) setCategories(cats);
        const next: Record<string, number> = {};
        for (const p of places) {
          next[p.categoryId] = (next[p.categoryId] ?? 0) + 1;
        }
        setCounts(next);
      } catch {
        /* keep preview */
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [municipio?.id, ready]);

  return (
    <main className="app-shell app-shell--explore">
      <AppHeader backHref="/" backLabel="Inicio" />

      <h1 className="section-title">Turismo</h1>
      <p className="section-desc">
        Qué hacer en {municipio?.name ?? "el pueblo"}: sitios, deporte, cultura,
        eventos y más. También puedes registrar un lugar o actividad.
      </p>

      <Link href="/turismo/registrar" className="biz-dash-primary">
        <span className="biz-dash-primary__icon" aria-hidden>
          <Plus size={20} />
        </span>
        <span className="biz-dash-primary__text">
          <span className="biz-dash-primary__title">Registrar lugar</span>
          <span className="biz-dash-primary__desc">
            Sitio, cancha, evento o fundación
          </span>
        </span>
        <ChevronRight size={20} aria-hidden />
      </Link>

      <section className="biz-dash-groups" style={{ marginTop: 28 }}>
        <h2 className="biz-dash-group__label">Explorar</h2>
        <div className="biz-dash-card">
          {categories.map((cat, i) => {
            const Icon = ICONS[cat.id] ?? Landmark;
            const count = counts[cat.id] ?? 0;
            return (
              <div key={cat.id}>
                {i > 0 && <div className="biz-dash-card__line" />}
                <Link href={`/turismo/${cat.id}`} className="biz-dash-item">
                  <span className="biz-dash-item__icon" aria-hidden>
                    <Icon size={20} />
                  </span>
                  <span className="biz-dash-item__main">
                    <span className="biz-dash-item__top">
                      <span className="biz-dash-item__title">{cat.title}</span>
                    </span>
                    <span className="biz-dash-item__desc">{cat.desc}</span>
                  </span>
                  <span className="biz-dash-item__count">{count}</span>
                  <ChevronRight
                    size={16}
                    className="biz-dash-item__chevron"
                    aria-hidden
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
