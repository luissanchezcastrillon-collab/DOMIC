import Link from "next/link";
import { notFound } from "next/navigation";
import { AppHeader } from "../../../components/AppHeader";
import { MotocarroIcon } from "../../../components/MotocarroIcon";
import { fetchPlaces, fetchTurismoCategories, fetchTurismoPlace } from "../../../lib/db";
import { estimateFare, formatCop } from "../../../lib/fare";
import { turismoCategoryById, turismoPlaceById } from "../../../lib/turismo";

type Props = { params: Promise<{ categoria: string; id: string }> };

export default async function TurismoDetallePage({ params }: Props) {
  const { categoria, id } = await params;
  const [cats, dbPlace, places] = await Promise.all([
    fetchTurismoCategories().catch(() => []),
    fetchTurismoPlace(id).catch(() => null),
    fetchPlaces().catch(() => []),
  ]);

  const cat =
    cats.find((c) => c.id === categoria) ?? turismoCategoryById(categoria);
  const place = dbPlace ?? turismoPlaceById(id);
  if (!cat || !place || place.categoryId !== categoria) notFound();

  const quote = place.farePlaceId
    ? estimateFare("parque", place.farePlaceId, places.length ? places : undefined)
    : null;

  return (
    <main className="app-shell app-shell--explore">
      <AppHeader backHref={`/turismo/${categoria}`} backLabel={cat.title} />

      <section className="explore-spot">
        <p className="explore-spot__kicker">{cat.title}</p>
        <h1 className="explore-spot__title">{place.name}</h1>
        <p className="explore-spot__lead">{place.detail}</p>

        <dl className="explore-spot__meta">
          <div>
            <dt>Tipo</dt>
            <dd>{place.short}</dd>
          </div>
          {place.when && (
            <div>
              <dt>Cuándo</dt>
              <dd>{place.when}</dd>
            </div>
          )}
          {place.meta && (
            <div>
              <dt>Dónde</dt>
              <dd>{place.meta}</dd>
            </div>
          )}
          {quote && (
            <>
              <div>
                <dt>Desde el centro</dt>
                <dd>
                  ~{quote.km} km · ~{quote.etaMin} min
                </dd>
              </div>
              <div>
                <dt>Ida estimada</dt>
                <dd>{formatCop(quote.fare)}</dd>
              </div>
            </>
          )}
        </dl>

        {place.farePlaceId && (
          <Link
            href={`/viaje?destino=${place.farePlaceId}`}
            className="btn btn-primary btn--with-icon"
            style={{ marginTop: 8 }}
          >
            <MotocarroIcon size={22} />
            Pedir viaje
          </Link>
        )}
      </section>
    </main>
  );
}
