import type { ReactNode } from "react";

type IconProps = { className?: string };

function Svg({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function IconUtensils({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 2v7c0 1.1.9 2 2 2h0a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </Svg>
  );
}

export function IconPill({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </Svg>
  );
}

export function IconStore({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
    </Svg>
  );
}

export function IconWrench({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </Svg>
  );
}

export function IconBread({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 13c0-3 2-6 6-6s6 3 6 6v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-5Z" />
      <path d="M6 13a4 4 0 0 1-2-3.5C4 7 6 5 9 5" />
      <path d="M18 13a4 4 0 0 0 2-3.5C20 7 18 5 15 5" />
    </Svg>
  );
}

export function IconWhatsApp({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M21 11.5a8.4 8.4 0 0 1-1.2 4.4 8.5 8.5 0 0 1-12.1 2.7L3 20l1.5-4.5a8.5 8.5 0 1 1 16.5-4Z" />
      <path d="M9.2 9.8c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.1-.2.3 0 .5.3.4.8 1 1.4 1.5.7.6 1.3.9 1.6 1 .3.1.5.1.6-.1l.5-.6c.1-.2.3-.2.5-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.3.7-.3.3-1.2.8-2.2.7-1.1-.1-3.5-1.1-5.2-3.2-1.5-1.8-2-3.6-2.1-4.2 0-.9.5-1.5.7-1.7Z" />
    </Svg>
  );
}

export function IconMenu({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </Svg>
  );
}

export function IconPhone({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />
    </Svg>
  );
}

export function IconSocial({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4" />
      <path d="m8.6 10.5 6.8-4" />
    </Svg>
  );
}

export function IconMapPin({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function IconClock({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </Svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

export const CATEGORY_ICONS = {
  restaurantes: IconUtensils,
  farmacias: IconPill,
  tiendas: IconStore,
  ferreterias: IconWrench,
  panaderias: IconBread,
} as const;
