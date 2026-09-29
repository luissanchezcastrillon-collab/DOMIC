import { Bike, Store, User } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import Link from "next/link";

export default function DomiciliosHubPage() {
  return (
    <main className="app-shell">
      <AppHeader backHref="/" backLabel="Inicio" />

      <h1 className="section-title">Domicilios</h1>
      <p className="section-desc">Cliente, negocio o domiciliario.</p>

      <nav className="role-pick" aria-label="Rol en domicilios">
        <Link
          href="/directorio"
          className="role-pick__item role-pick__item--primary"
        >
          <span className="role-pick__name">
            <User size={18} aria-hidden />
            Soy cliente
          </span>
          <span className="role-pick__desc">Directorio de negocios</span>
        </Link>
        <Link href="/negocio/login" className="role-pick__item">
          <span className="role-pick__name">
            <Store size={18} aria-hidden />
            Soy negocio
          </span>
          <span className="role-pick__desc">Solicitar domiciliario cercano</span>
        </Link>
        <Link href="/domiciliario/login" className="role-pick__item">
          <span className="role-pick__name">
            <Bike size={18} aria-hidden />
            Soy domiciliario
          </span>
          <span className="role-pick__desc">Turno y solicitudes de entrega</span>
        </Link>
      </nav>
    </main>
  );
}
