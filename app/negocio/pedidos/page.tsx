import Link from "next/link";

const pedidos = [
  {
    id: "demo",
    cliente: "María López",
    estado: "buscando",
    meta: "Hace 1 min",
  },
  {
    id: "2",
    cliente: "Carlos Ruiz",
    estado: "en ruta",
    meta: "Hace 12 min",
  },
  {
    id: "3",
    cliente: "Ana Gómez",
    estado: "entregado",
    meta: "Hoy 11:20",
  },
];

function statusClass(estado: string) {
  if (estado === "entregado") return "status status--done";
  if (estado === "buscando") return "status status--muted";
  return "status";
}

export default function PedidosPage() {
  return (
    <main className="app-shell">
      <header className="header">
        <Link href="/negocio" className="header-back">
          ← Negocio
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <h1 className="section-title">Mis pedidos</h1>
      <p className="section-desc">Estado en tiempo real de cada entrega.</p>

      <div className="list">
        {pedidos.map((p) => (
          <Link key={p.id} href={`/negocio/pedidos/${p.id}`} className="list-item">
            <div className="list-item-title">{p.cliente}</div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                marginTop: 8,
              }}
            >
              <span className={statusClass(p.estado)}>
                <span className="status-dot" />
                {p.estado}
              </span>
              <span className="list-item-meta">{p.meta}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
