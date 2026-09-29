"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import { useMunicipio } from "../../components/MunicipioProvider";
import { fetchTurismoCategories, submitTurismoPlace } from "../../lib/db";
import { TURISMO_CATEGORIES, type TurismoCategory } from "../../lib/turismo";

export default function TurismoRegistrarPage() {
  const { municipio } = useMunicipio();
  const [categories, setCategories] =
    useState<TurismoCategory[]>(TURISMO_CATEGORIES);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("sitios");
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [cuando, setCuando] = useState("");
  const [contacto, setContacto] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTurismoCategories()
      .then((rows) => {
        if (rows.length) setCategories(rows);
      })
      .catch(() => {
        /* keep preview categories */
      });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await submitTurismoPlace({
        municipioId: municipio?.id ?? "zarzal",
        categoryId: categoria,
        name: nombre,
        description: descripcion,
        location: ubicacion,
        eventWhen: cuando,
        contact: contacto,
      });
      setSaved(true);
    } catch {
      setError("No se pudo enviar. Revisa la conexión e inténtalo de nuevo.");
    } finally {
      setSending(false);
    }
  }

  if (saved) {
    return (
      <main className="app-shell">
        <AppHeader backHref="/turismo" backLabel="Turismo" />
        <h1 className="section-title">Enviado</h1>
        <p className="section-desc">
          Gracias. Tu sugerencia quedó en Supabase para {municipio?.name ?? "el municipio"}
          y se revisará antes de publicarla.
        </p>
        <Link href="/turismo" className="btn btn-primary">
          Volver a Turismo
        </Link>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <AppHeader backHref="/turismo" backLabel="Turismo" />

      <h1 className="section-title">Registrar lugar</h1>
      <p className="section-desc">
        Agrega un sitio, cancha, cine, gym, evento o fundación
        {municipio ? ` de ${municipio.name}` : ""}.
      </p>

      <form className="stack-lg" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Cancha del barrio El Prado"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="descripcion">Qué es / qué hay</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Describe el lugar o la actividad"
            rows={3}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="ubicacion">Ubicación o barrio</label>
          <input
            id="ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Ej. Cerca al parque principal"
          />
        </div>

        <div className="field">
          <label htmlFor="cuando">Fecha / horario (opcional)</label>
          <input
            id="cuando"
            value={cuando}
            onChange={(e) => setCuando(e.target.value)}
            placeholder="Ej. Sáb 26 jul · 9:00 a.m. o Lun–Vie 6–9 p.m."
          />
        </div>

        <div className="field">
          <label htmlFor="contacto">WhatsApp o contacto (opcional)</label>
          <input
            id="contacto"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            placeholder="Ej. 300 123 4567"
          />
        </div>

        {error && <p className="muted">{error}</p>}

        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Enviando…" : "Enviar registro"}
        </button>
      </form>
    </main>
  );
}
