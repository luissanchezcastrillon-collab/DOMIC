"use client";

import Link from "next/link";
import { useState } from "react";

export default function NegocioPerfilPage() {
  const [nombre, setNombre] = useState("Tienda Don José");
  const [direccion, setDireccion] = useState("Calle 5 #10-20");
  const [telefono, setTelefono] = useState("300 123 4567");
  const [saved, setSaved] = useState(false);

  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/negocio" className="header-back">
          ← Negocio
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Perfil del negocio</h1>
      <p className="section-desc">Estos datos se usan al crear cada domicilio.</p>

      <form
        className="stack-lg"
        onSubmit={(e) => {
          e.preventDefault();
          setSaved(true);
        }}
      >
        <div className="field">
          <label htmlFor="nombre">Nombre del negocio</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="direccion">Dirección</label>
          <input
            id="direccion"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>

        {saved && (
          <p className="center muted">Perfil guardado (solo vista previa)</p>
        )}

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </main>
  );
}
