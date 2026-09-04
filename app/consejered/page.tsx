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
    <div className="contenedor py-12">
      <EncabezadoSeccion
        cejilla="ConsejeRed"
        antes="El equipo que"
        acento="trabaja contigo"
        despues="."
        color="text-coral-700"
        lede="El tablón del pasillo. Pulsa cualquier ficha para ver dónde encontrar a esa persona y de qué se encarga."
      />

      {perfiles.length === 0 ? (
        <p className="text-gris border-tinta/60 mt-10 rounded-[1.25rem] border border-dashed p-10 text-center">
          Todavía no hay fichas en el tablón.
        </p>
      ) : (
        // El tablón va en DOS capas, y esa separación es lo que quita las
        // costuras que cruzaban el corcho:
        //   · El marco, con border-image y un corte de 35 px medido sobre la
        //     foto. SIN `fill`, para que no rellene también el centro.
        //   · El corcho, recortado a su propio archivo y puesto de fondo con
        //     `cover`: al escalarse en vez de repetirse no hay junta posible.
        //     El corcho es ruido, no un patrón — se estira bien y se nota
        //     fatal cuando se embaldosa, que era el bug.
        // `padding-box` evita que el fondo asome por debajo del marco.
        // `bg-corcho` queda de respaldo si la imagen no carga.
        <div
          className="bg-corcho mt-10 border-[16px] p-5 shadow-[0_20px_45px_-20px_rgba(0,0,0,.55)] sm:border-[30px] sm:p-12"
          style={{
            borderImageSource: "url('/corcho-marco.webp')",
            borderImageSlice: '35',
            borderImageRepeat: 'stretch',
            backgroundImage: "url('/corcho-centro.webp')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundClip: 'padding-box',
          }}
        >
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {perfiles.map((p, i) => (
              <li key={p.id} className="revelar">
                <TarjetaPerfil perfil={p} indice={i} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
