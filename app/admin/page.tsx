"use client";

import { useCallback, useEffect, useState } from "react";
import { LogoutButton } from "../components/LogoutButton";
import {
  approveDriver,
  fetchAdminDrivers,
  type AdminDriver,
} from "../lib/db";

export default function AdminPage() {
  const [drivers, setDrivers] = useState<AdminDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const rows = await fetchAdminDrivers();
      setDrivers(rows);
    } catch {
      setError("No se pudieron cargar los domiciliarios.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function aprobar(id: string) {
    setSavingId(id);
    try {
      await approveDriver(id);
      setDrivers((list) =>
        list.map((d) => (d.id === id ? { ...d, estado: "aprobado" } : d))
      );
    } catch {
      setError("No se pudo aprobar. Inténtalo de nuevo.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="app-shell">
      <header className="header">
        <LogoutButton redirectTo="/admin/login" />
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Admin</h1>
      <p className="section-desc">
        Aprueba domiciliarios reales de Supabase cuando ya revisaste sus
        documentos por fuera.
      </p>

      {loading && <p className="muted">Cargando domiciliarios…</p>}
      {error && <p className="muted">{error}</p>}

      {!loading && drivers.length === 0 && (
        <p className="muted">Aún no hay domiciliarios registrados.</p>
      )}

      <div className="list">
        {drivers.map((d) => (
          <div key={d.id} className="list-item">
            <div className="list-item-title">{d.nombre}</div>
            <div className="list-item-meta">{d.telefono}</div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 12,
              }}
            >
              <span
                className={
                  d.estado === "aprobado"
                    ? "status status--done"
                    : "status status--muted"
                }
              >
                <span className="status-dot" />
                {d.estado}
              </span>
              {d.estado === "pendiente" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: "auto", minHeight: 40, padding: "0 16px" }}
                  onClick={() => void aprobar(d.id)}
                  disabled={savingId === d.id}
                >
                  {savingId === d.id ? "Aprobando…" : "Aprobar"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
