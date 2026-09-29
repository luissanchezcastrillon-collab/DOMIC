import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
};

export function HeaderBack({ href, children }: Props) {
  return (
    <Link href={href} className="header-back">
      <ArrowLeft size={16} aria-hidden />
      {children}
    </Link>
  );
}

type AppHeaderProps = {
  backHref: string;
  backLabel: string;
};

export function AppHeader({ backHref, backLabel }: AppHeaderProps) {
  return (
    <header className="header">
      <HeaderBack href={backHref}>{backLabel}</HeaderBack>
      <div className="brand brand--sm">domic</div>
    </header>
  );
}
