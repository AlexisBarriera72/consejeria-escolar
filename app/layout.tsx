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
          {/* La hoja de pergamino sobre la que va TODO el contenido.
              Existe por una razón medida, no estética: con la malla de color
              detrás, el texto directamente encima rompía AA — `coral-700`
              solo tiene 0.16 de margen sobre el pergamino y cualquier color
              por debajo se lo come. Poniendo el contenido en su propia hoja,
              cada combinación de texto del sitio sigue midiéndose contra
              `papel` exactamente igual que antes, y la malla puede ir a plena
              saturación. Los márgenes crecen con la pantalla porque es el
              único sitio por donde se ve el color. */}
          <main
            id="contenido"
            className="bg-papel mx-2 flex-1 rounded-3xl shadow-[0_12px_44px_-24px_rgba(22,32,46,.55)] sm:mx-4 lg:mx-8 xl:mx-16"
          >
            {children}
          </main>
          <PiePagina />
          <RegistroSW />
        </ProveedorRol>
      </body>
    </html>
  );
}
