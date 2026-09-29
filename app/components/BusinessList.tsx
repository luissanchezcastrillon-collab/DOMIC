"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Croissant,
  Minus,
  Pill,
  Plus,
  Search,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useMunicipio } from "@/app/components/MunicipioProvider";
import { fetchDirectory } from "@/app/lib/db";
import {
  DIRECTORY_SECTIONS,
  businessOpenStatus,
  type DirectorySection,
} from "@/app/lib/directory";

const ICONS: Record<string, LucideIcon> = {
  restaurantes: UtensilsCrossed,
  farmacias: Pill,
  tiendas: ShoppingBag,
  ferreterias: Wrench,
  panaderias: Croissant,
};

export function BusinessList() {
  const { municipio, ready } = useMunicipio();
  const [sections, setSections] = useState<DirectorySection[]>(DIRECTORY_SECTIONS);
  const [openId, setOpenId] = useState<string | null>("restaurantes");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    setLoading(true);
    fetchDirectory(municipio?.id)
      .then((rows) => {
        if (!cancelled && rows.length) setSections(rows);
      })
      .catch(() => {
        if (!cancelled) setSections(DIRECTORY_SECTIONS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [municipio?.id, ready]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((c) => ({
        ...c,
        businesses: c.businesses.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            (b.tag?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter(
        (c) => c.title.toLowerCase().includes(q) || c.businesses.length > 0
      );
  }, [query, sections]);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <main className="app-shell dir-shell">
      <header className="header">
        <Link href="/domicilios" className="header-back">
          <ArrowLeft size={16} aria-hidden />
          Domicilios
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <section className="dir-heading">
        <h1 className="section-title">Negocios</h1>
        <p className="section-desc">
          {loading
            ? "Cargando negocios…"
            : municipio
              ? `En ${municipio.name}. Elige una categoría`
              : "Elige una categoría"}
        </p>
      </section>

      <label className="dir-search">
        <Search size={16} className="dir-search__icon" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar negocio o categoría"
          aria-label="Buscar negocio o categoría"
        />
      </label>

      <section className="dir-cards">
        {filtered.map((cat: DirectorySection) => {
          const isOpen =
            openId === cat.id ||
            (query.trim().length > 0 && cat.businesses.length > 0);
          const Icon = ICONS[cat.id] ?? ShoppingBag;

          return (
            <div
              key={cat.id}
              className={`dir-cat${isOpen ? " dir-cat--open" : ""}`}
            >
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                aria-expanded={isOpen}
                className="dir-cat__head"
              >
                <span className="dir-cat__icon" aria-hidden>
                  <Icon size={20} />
                </span>
                <span className="dir-cat__title">{cat.title}</span>
                <span className="dir-cat__count">{cat.businesses.length}</span>
                <span className="dir-cat__chevron" aria-hidden>
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>

              {isOpen && (
                <div className="dir-cat__body">
                  {cat.businesses.length === 0 ? (
                    <p className="dir-biz--empty">
                      Aún no hay negocios en esta categoría.
                    </p>
                  ) : (
                    cat.businesses.map((b) => {
                      const status = businessOpenStatus(b);
                      return (
                        <Link
                          key={b.id}
                          href={`/directorio/${b.id}`}
                          className="dir-biz-row"
                        >
                          <span className="dir-biz-row__avatar" aria-hidden>
                            {b.name.charAt(0)}
                          </span>
                          <span className="dir-biz-row__main">
                            <span className="dir-biz-row__top">
                              <span className="dir-biz-row__name">{b.name}</span>
                              {status.open && (
                                <span className="dir-biz-row__status dir-biz-row__status--open">
                                  <i />
                                  Abierto
                                </span>
                              )}
                            </span>
                            {b.tag && (
                              <span className="dir-biz-row__tag">{b.tag}</span>
                            )}
                          </span>
                          <ChevronRight
                            size={16}
                            className="dir-biz-row__go"
                            aria-hidden
                          />
                        </Link>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <div className="dir-suggest">
        <button type="button" className="dir-suggest__btn">
          <Plus size={16} aria-hidden />
          Sugerir negocio
        </button>
      </div>
    </main>
  );
}
