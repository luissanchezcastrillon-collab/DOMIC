"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "../components/AppHeader";
import { useMunicipio, useMunicipioList } from "../components/MunicipioProvider";

export default function ElegirMunicipioPage() {
  const router = useRouter();
  const list = useMunicipioList();
  const { municipio, setMunicipioId } = useMunicipio();

  return (
    <main className="app-shell">
      <AppHeader backHref="/" backLabel="Inicio" />

      <h1 className="section-title">Tu municipio</h1>
      <p className="section-desc">
        domic funciona en varios municipios. Elige el tuyo para ver negocios,
        viajes y turismo de esa zona.
      </p>

      <div className="muni-list">
        {list.map((m) => {
          const active = municipio?.id === m.id;
          return (
            <button
              key={m.id}
              type="button"
              className={`muni-item${active ? " muni-item--active" : ""}`}
              onClick={() => {
                setMunicipioId(m.id);
                router.push("/");
              }}
            >
              <span className="muni-item__name">{m.name}</span>
              <span className="muni-item__meta">{m.departamento}</span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
