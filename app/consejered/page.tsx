import type { Metadata } from 'next';
import { TarjetaPerfil } from '@/components/TarjetaPerfil';
import { obtenerPerfiles } from '@/lib/contenido';
import { EncabezadoSeccion } from '@/components/EncabezadoSeccion';

export const metadata: Metadata = {
  title: 'El equipo',
  description:
    'El equipo de la oficina de consejería: quiénes son y dónde encontrarlos.',
};

/**
 * El tablón de corcho del pasillo.
 *
 * Es la metáfora que el propio producto sustituye — la oficina no tenía canal
 * digital, tenía un corcho en el pasillo y circulares en las mochilas. Que la
 * página del equipo SEA ese corcho no es un adorno: es la única pantalla del
 * sitio que se parece a lo que había antes, y por eso se entiende sin
 * explicarla.
 *
 * El corcho se dibuja con dos tramas de puntos en CSS, no con una imagen: pesa
 * cero, es nítido en cualquier pantalla y funciona sin conexión.
 */
export default async function PaginaPasillo() {
  const perfiles = await obtenerPerfiles();

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <EncabezadoSeccion
        cejilla="ConsejeRed"
        antes="El equipo que"
        acento="trabaja contigo"
        despues="."
        color="text-coral-700"
        lede="El tablón del pasillo. Pulsa cualquier ficha para ver dónde encontrar a esa persona y de qué se encarga."
      />

      {perfiles.length === 0 ? (
        <p className="text-gris border-tinta/25 mt-10 rounded-2xl border border-dashed p-10 text-center">
          Todavía no hay fichas en el tablón.
        </p>
      ) : (
        // Tablón real vía `border-image`, no una imagen de fondo estirada.
        // El corte de 38 px aísla el marco de madera de la foto original
        // (775x464): las cuatro esquinas se colocan enteras, los cuatro lados
        // se repiten, y el centro — el corcho — rellena el hueco con `fill`.
        // Así el tablón puede tener cualquier alto sin que la madera se
        // deforme, que es justo lo que pasa al escalar la foto entera.
        // `bg-corcho` queda debajo como respaldo si la imagen no carga.
        <div
          className="bg-corcho mt-10 border-[16px] p-5 shadow-[0_20px_45px_-20px_rgba(0,0,0,.55)] sm:border-[30px] sm:p-12"
          style={{
            borderImageSource: "url('/corcho.webp')",
            borderImageSlice: '38 fill',
            borderImageRepeat: 'round',
          }}
        >
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {perfiles.map((p, i) => (
              <li key={p.id}>
                <TarjetaPerfil perfil={p} indice={i} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
