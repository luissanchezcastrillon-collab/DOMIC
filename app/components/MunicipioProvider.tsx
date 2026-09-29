"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchMunicipios } from "../lib/db";
import {
  MUNICIPIO_STORAGE_KEY,
  MUNICIPIOS,
  type Municipio,
} from "../lib/municipios";

type Ctx = {
  municipio: Municipio | null;
  municipios: Municipio[];
  setMunicipioId: (id: string) => void;
  ready: boolean;
};

const MunicipioContext = createContext<Ctx | null>(null);

export function MunicipioProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const [municipios, setMunicipios] = useState<Municipio[]>(MUNICIPIOS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rows = await fetchMunicipios();
        if (!cancelled && rows.length) setMunicipios(rows);
      } catch {
        /* keep preview list */
      }

      try {
        const saved = window.localStorage.getItem(MUNICIPIO_STORAGE_KEY);
        if (saved) setId(saved);
      } catch {
        /* ignore */
      }

      if (!cancelled) setReady(true);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const setMunicipioId = useCallback((next: string) => {
    setId(next);
    try {
      window.localStorage.setItem(MUNICIPIO_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => {
    const municipio = municipios.find((m) => m.id === id) ?? null;
    return {
      municipio,
      municipios,
      setMunicipioId,
      ready,
    };
  }, [id, municipios, ready, setMunicipioId]);

  return (
    <MunicipioContext.Provider value={value}>
      {children}
    </MunicipioContext.Provider>
  );
}

export function useMunicipio() {
  const ctx = useContext(MunicipioContext);
  if (!ctx) {
    throw new Error("useMunicipio debe usarse dentro de MunicipioProvider");
  }
  return ctx;
}

export function useMunicipioList() {
  return useMunicipio().municipios;
}
