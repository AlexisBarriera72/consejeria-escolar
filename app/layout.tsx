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
          {/* La hoja sobre la que va TODO el contenido — pergamino al 70%,
              así que la malla se ve por debajo al 30% y el color llega
              también al centro de la página, no solo a los márgenes.

              El 70% es el resultado de una medición, no una preferencia: el
              texto necesita un mínimo de pergamino debajo para no romper AA.
              Con la paleta original el margen daba para un 3% de color; se
              llegó al 30% oscureciendo seis tokens de texto entre un 1% y un
              19%. Bajar este 70% sin volver a oscurecer la paleta rompe el
              contraste — y salta en verificar-contraste.mjs, que comprueba
              todo el texto contra `papel-malla`, el punto más oscuro de la
              malla al 30%. */}
          <main
            id="contenido"
            className="bg-papel/70 mx-2 flex-1 rounded-3xl shadow-[0_12px_44px_-24px_rgba(22,32,46,.55)] sm:mx-4 lg:mx-8 xl:mx-16"
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
