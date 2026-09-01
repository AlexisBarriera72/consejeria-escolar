import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Panel', template: '%s · Panel' },
  // El panel nunca debe aparecer en Google. No es la seguridad — esa está en
  // el servidor (lib/acceso.ts) — pero no hay ninguna razón para que estas
  // páginas se indexen.
  robots: { index: false, follow: false, nocache: true },
};

export default function LayoutPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
