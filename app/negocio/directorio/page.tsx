"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AURA_EXAMPLE, DIRECTORY_CATEGORIES } from "../../lib/directory";

export default function NegocioDirectorioPage() {
  const [nombre, setNombre] = useState(AURA_EXAMPLE.name);
  const [categoria, setCategoria] = useState("restaurantes");
  const [descripcion, setDescripcion] = useState(AURA_EXAMPLE.description ?? "");
  const [horario, setHorario] = useState(AURA_EXAMPLE.hours ?? "");
  const [whatsapp, setWhatsapp] = useState(AURA_EXAMPLE.phoneDisplay ?? "");
  const [direccion, setDireccion] = useState(AURA_EXAMPLE.address ?? "");
  const [mapsUrl, setMapsUrl] = useState(AURA_EXAMPLE.mapsUrl ?? "");
  const [menuUrl, setMenuUrl] = useState(AURA_EXAMPLE.link ?? "");
  const [redesUrl, setRedesUrl] = useState(AURA_EXAMPLE.socialUrl ?? "");
  const [saved, setSaved] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(true);
  }

  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/negocio" className="header-back">
          ← Negocio
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Directorio</h1>
      <p className="section-desc">
        Ejemplo cargado: Aura (pin de Maps desde su Linktree). Menú, redes y
        ubicación son opcionales.
      </p>

      <form className="stack-lg" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="nombre">Nombre del negocio</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Aura Restaurante"
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
            {DIRECTORY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="descripcion">Descripción breve</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Qué ofreces en una o dos frases"
            rows={3}
          />
        </div>

        <div className="field">
          <label htmlFor="horario">Horario de atención</label>
          <input
            id="horario"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            placeholder="Ej. Lun–Dom 11:00 a.m. – 9:00 p.m."
            required
          />
        </div>

        <div className="field">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="313 591 2392"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="direccion">Dirección (opcional)</label>
          <input
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            placeholder="Texto que ve el cliente"
          />
        </div>

        <div className="field">
          <label htmlFor="maps">Link de Google Maps (opcional)</label>
          <input
            id="maps"
            type="url"
            value={mapsUrl}
            onChange={(e) => setMapsUrl(e.target.value)}
            placeholder="Pega el link de Compartir / UBICACIÓN del pin"
          />
        </div>

        <div className="field">
          <label htmlFor="menu">Link del menú digital (opcional)</label>
          <input
            id="menu"
            type="url"
            value={menuUrl}
            onChange={(e) => setMenuUrl(e.target.value)}
            placeholder="Pirpos, Linktree u otro — solo si lo tienes"
          />
          <p className="field-hint">
            Opcional. Si no lo llenas, el cliente solo verá WhatsApp (y Maps /
            redes si los agregas).
          </p>
        </div>

        <div className="field">
          <label htmlFor="redes">Redes sociales (opcional)</label>
          <input
            id="redes"
            type="url"
            value={redesUrl}
            onChange={(e) => setRedesUrl(e.target.value)}
            placeholder="https://instagram.com/... o Facebook"
          />
        </div>

        {saved && (
          <p className="center muted">
            Guardado en preview. Luego se publicará en el directorio del cliente.
          </p>
        )}

        <button type="submit" className="btn btn-primary">
          Guardar en directorio
        </button>
      </form>
    </main>
  );
}
