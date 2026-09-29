import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { AppHeader } from "../../components/AppHeader";
import { fetchTurismoCategories, fetchTurismoPlaces } from "../../lib/db";
import { turismoCategoryById } from "../../lib/turismo";

type Props = { params: Promise<{ categoria: string }> };

export default async function TurismoCategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const cats = await fetchTurismoCategories().catch(() => []);
  const cat =
    cats.find((c) => c.id === categoria) ?? turismoCategoryById(categoria);
  if (!cat) notFound();

  const places = await fetchTurismoPlaces(null, categoria).catch(() => []);

  return (
    <main className="app-shell app-shell--explore">
      <AppHeader backHref="/turismo" backLabel="Turismo" />

      <h1 className="section-title">{cat.title}</h1>
      <p className="section-desc">{cat.desc}</p>

      {places.length === 0 ? (
        <p className="muted">Aún no hay registros en esta categoría.</p>
      ) : (
        <div className="list">
          {places.map((p) => (
            <Link
              key={p.id}
              href={`/turismo/${categoria}/${p.id}`}
              className="list-item turismo-list-item"
            >
              <div className="turismo-list-item__main">
                <div className="list-item-title">{p.name}</div>
                <div className="list-item-meta">
                  {p.when ? `${p.when} · ` : ""}
                  {p.short}
                </div>
              </div>
              <ChevronRight size={16} className="biz-dash-item__chevron" aria-hidden />
            </Link>
          ))}
        </div>
      )}

      <div className="dir-suggest" style={{ marginTop: 24 }}>
        <Link href="/turismo/registrar" className="dir-suggest__btn">
          Registrar en {cat.title.toLowerCase()}
        </Link>
      </div>
    </main>
  );
}
