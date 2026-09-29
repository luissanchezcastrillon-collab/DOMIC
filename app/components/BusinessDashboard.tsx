import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  ClipboardList,
  MapPinned,
  Plus,
  Radar,
  Route,
  User,
  type LucideIcon,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

type DashItem = {
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  count?: number;
};

const groups: { label: string; items: DashItem[] }[] = [
  {
    label: "Mi negocio",
    items: [
      {
        title: "Mi perfil",
        desc: "Nombre, dirección y contacto",
        href: "/negocio/perfil",
        icon: User,
      },
      {
        title: "Directorio",
        desc: "Categoría, horario, WhatsApp, menú, redes y Maps",
        href: "/negocio/directorio",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "Seguimiento en vivo",
    items: [
      {
        title: "Mapa · buscando",
        desc: "Esperando que un domiciliario acepte",
        href: "/negocio/cercanos",
        icon: Radar,
        badge: "Preview",
      },
      {
        title: "Mapa · seguimiento",
        desc: "Ver domiciliario en ruta",
        href: "/negocio/seguimiento",
        icon: Route,
        badge: "Preview",
      },
      {
        title: "Mis pedidos",
        desc: "Historial y estado de domicilios",
        href: "/negocio/pedidos",
        icon: ClipboardList,
        count: 3,
      },
    ],
  },
];

export function BusinessDashboard() {
  return (
    <main className="app-shell dir-shell">
      <header className="header">
        <LogoutButton redirectTo="/negocio/login" />
        <div className="brand brand--sm">domic</div>
      </header>

      <section className="biz-dash-heading">
        <h1 className="section-title">Negocio</h1>
        <p className="section-desc">
          Gestiona tu perfil y solicita domiciliarios
        </p>
      </section>

      <Link href="/negocio/nuevo" className="biz-dash-primary">
        <span className="biz-dash-primary__icon" aria-hidden>
          <MapPinned size={20} />
        </span>
        <span className="biz-dash-primary__text">
          <span className="biz-dash-primary__title">Nuevo domicilio</span>
          <span className="biz-dash-primary__desc">
            Pedir domiciliario cercano
          </span>
        </span>
        <ChevronRight size={20} aria-hidden />
      </Link>

      <div className="biz-dash-groups">
        {groups.map((group) => (
          <section key={group.label}>
            <h2 className="biz-dash-group__label">{group.label}</h2>
            <div className="biz-dash-card">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.title}>
                    {i > 0 && <div className="biz-dash-card__line" />}
                    <Link href={item.href} className="biz-dash-item">
                      <span className="biz-dash-item__icon" aria-hidden>
                        <Icon size={20} />
                      </span>
                      <span className="biz-dash-item__main">
                        <span className="biz-dash-item__top">
                          <span className="biz-dash-item__title">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="biz-dash-item__badge">
                              {item.badge}
                            </span>
                          )}
                        </span>
                        <span className="biz-dash-item__desc">{item.desc}</span>
                      </span>
                      {typeof item.count === "number" && (
                        <span className="biz-dash-item__count">{item.count}</span>
                      )}
                      <ChevronRight
                        size={16}
                        className="biz-dash-item__chevron"
                        aria-hidden
                      />
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="dir-suggest">
        <Link href="/negocio/registro" className="dir-suggest__btn">
          <Plus size={16} aria-hidden />
          Agregar negocio
        </Link>
      </div>
    </main>
  );
}
