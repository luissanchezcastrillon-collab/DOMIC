import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  businessOpenStatus,
  mapsLinkFor,
  type DirectoryBiz,
  type DirectorySection,
} from "@/app/lib/directory";

type Props = {
  biz: DirectoryBiz;
  section: DirectorySection;
};

export function RestaurantDetail({ biz, section }: Props) {
  const maps = mapsLinkFor(biz);
  const status = businessOpenStatus(biz);
  const menuLabel = biz.linkLabel ?? "Ver menú";

  const secondary = [
    maps ? { label: "Maps", href: maps, icon: Map } : null,
    biz.socialUrl
      ? { label: "Redes", href: biz.socialUrl, icon: Share2 }
      : null,
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: typeof Map;
  }[];

  return (
    <main className="app-shell dir-shell">
      <header className="header">
        <Link href="/directorio" className="header-back">
          <ArrowLeft size={16} aria-hidden />
          {section.title}
        </Link>
        <div className="brand brand--sm">domic</div>
      </header>

      <section className="dir-detail-block">
        <p className="dir-detail__cat">{section.singular}</p>
        <h1 className="dir-detail__title">{biz.name}</h1>

        <div
          className={`dir-detail__badge${
            status.open ? " dir-detail__badge--open" : ""
          }`}
        >
          <i />
          <span>{status.detail}</span>
        </div>

        {biz.description && (
          <p className="dir-detail__lead">{biz.description}</p>
        )}
      </section>

      <section className="dir-detail__card">
        {biz.hours && (
          <div className="dir-detail__row">
            <span className="dir-detail__row-icon-wrap" aria-hidden>
              <Clock size={16} />
            </span>
            <div>
              <div className="dir-detail__row-label">Horario</div>
              <div className="dir-detail__row-value">{biz.hours}</div>
            </div>
          </div>
        )}
        {biz.hours && biz.address && <div className="dir-detail__divider" />}
        {biz.address && (
          <div className="dir-detail__row">
            <span className="dir-detail__row-icon-wrap" aria-hidden>
              <MapPin size={16} />
            </span>
            <div>
              <div className="dir-detail__row-label">Dirección</div>
              <div className="dir-detail__row-value">{biz.address}</div>
            </div>
          </div>
        )}
      </section>

      <section className="dir-detail-foot">
        {biz.whatsapp && (
          <a
            className="dir-wa-btn"
            href={`https://wa.me/${biz.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} aria-hidden />
            Pedir por WhatsApp
          </a>
        )}

        {biz.link && (
          <>
            <a
              className="dir-menu-btn"
              href={biz.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Menu size={20} aria-hidden />
              {menuLabel}
            </a>
            <p className="dir-menu-hint">
              Este local tiene menú digital: míralo y pide desde ahí si quieres.
            </p>
          </>
        )}

        {secondary.length > 0 && (
          <div
            className={`dir-sec-grid${
              secondary.length === 2 ? " dir-sec-grid--2" : ""
            }`}
          >
            {secondary.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="dir-sec-btn"
              >
                <Icon size={16} aria-hidden />
                {label}
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
