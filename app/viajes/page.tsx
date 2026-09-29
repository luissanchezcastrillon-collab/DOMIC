import Link from "next/link";
import { AppHeader } from "../components/AppHeader";
import { MotocarroIcon } from "../components/MotocarroIcon";

export default function ViajesHubPage() {
  return (
    <main className="app-shell">
      <AppHeader backHref="/" backLabel="Inicio" />

      <h1 className="section-title">Viajes</h1>
      <p className="section-desc">Pide un motocarro o sal a conducir.</p>

      <nav className="role-pick" aria-label="Rol en viajes">
        <Link href="/viaje" className="role-pick__item role-pick__item--primary">
          <span className="role-pick__name">
            <MotocarroIcon size={18} />
            Pedir viaje
          </span>
          <span className="role-pick__desc">Origen, destino y seguimiento</span>
        </Link>
        <Link href="/viaje/pasajero/login" className="role-pick__item">
          <span className="role-pick__name">Soy pasajero</span>
          <span className="role-pick__desc">Entra o crea tu cuenta</span>
        </Link>
        <Link href="/viaje/login" className="role-pick__item">
          <span className="role-pick__name">
            <MotocarroIcon size={18} />
            Soy conductor
          </span>
          <span className="role-pick__desc">Entra o regístrate · motocarro</span>
        </Link>
      </nav>
    </main>
  );
}
