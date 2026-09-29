type Props = {
  size?: number;
  className?: string;
};

/** Ícono line-art de motocarro (3 ruedas + cabina), estilo del mockup. */
export function MotocarroIcon({ size = 22, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* Ruedas traseras (par) + delantera */}
      <circle cx="5" cy="17.5" r="2.4" />
      <circle cx="9.2" cy="17.5" r="2.4" />
      <circle cx="18.5" cy="17.5" r="2.4" />
      {/* Cabina / caja */}
      <path d="M2.8 14.8V8.2h8.2v6.6" />
      <path d="M4.2 8.2 5.4 5h5.2l1.2 3.2" />
      {/* Chasis hacia delante */}
      <path d="M11 12.2h3.2L17 15.4h1.2" />
      <path d="M14.2 12.2V9.8h1.6" />
      {/* Manillar */}
      <path d="M18.5 15.1V11.2l1.8-1.6" />
    </svg>
  );
}
