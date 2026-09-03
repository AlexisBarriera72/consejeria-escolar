import type { Metadata, Viewport } from 'next';
import { clasesDeFuente } from './fuentes';
import { ProveedorRol } from '@/components/ProveedorRol';
import { PortalEntrada } from '@/components/PortalEntrada';
import { BannerAviso } from '@/components/BannerAviso';
import { Encabezado } from '@/components/Encabezado';
import { PiePagina } from '@/components/PiePagina';
import { RegistroSW } from '@/components/RegistroSW';
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
          {/* SIN fondo, a propósito. El contenido se apoya directamente en la
              malla, igual que los márgenes, así que no hay ningún borde donde
              se note un cambio de superficie: antes había una hoja de
              pergamino y su esquina redondeada se veía como una costura.

              Lo que hace posible quitarla es que la malla ya viene premezclada
              al 55% sobre pergamino (ver --mezcla-* en globals.css) y que seis
              tokens de texto se oscurecieron para aguantarla. El contraste no
              lo sostiene ninguna superficie: lo sostiene la paleta. */}
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
