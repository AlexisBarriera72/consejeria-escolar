import type { Metadata, Viewport } from 'next';
import { clasesDeFuente } from './fuentes';
import { ProveedorRol } from '@/components/ProveedorRol';
import { PortalEntrada } from '@/components/PortalEntrada';
import { BannerAviso } from '@/components/BannerAviso';
import { Encabezado } from '@/components/Encabezado';
import { PiePagina } from '@/components/PiePagina';
import { RegistroSW } from '@/components/RegistroSW';
import { GUION_CALMA } from '@/lib/calma';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Consejería Escolar',
    template: '%s · Consejería Escolar',
  },
  description:
    'Guías, noticias y contactos de la oficina de consejería escolar.',
};

export const viewport: Viewport = {
  themeColor: '#4378c6',
  // Sin maximumScale ni userScalable:false. Bloquear el zoom rompe el
  // criterio 1.4.4 de WCAG y es una de las formas más comunes de dejar
  // fuera a alguien con baja visión.
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // lang="es" no es decorativo: sin esto un lector de pantalla lee el
    // español con voz y reglas de pronunciación en inglés.
    <html lang="es" className={clasesDeFuente}>
      <head>
        {/* Corre antes de pintar: sin esto, quien tiene el modo calma
            activado ve medio segundo de colores fuertes en cada carga. */}
        <script dangerouslySetInnerHTML={{ __html: GUION_CALMA }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ProveedorRol>
          <a href="#contenido" className="salto-contenido">
            Saltar al contenido
          </a>
          <PortalEntrada />
          {/* Encima de todo, en todas las páginas. Cuando cierra la escuela
              por un aviso de huracán, esto es lo único que importa. */}
          <BannerAviso />
          <Encabezado />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <PiePagina />
          <RegistroSW />
        </ProveedorRol>
      </body>
    </html>
  );
}
