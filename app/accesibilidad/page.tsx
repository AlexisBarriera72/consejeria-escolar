import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accesibilidad',
  description:
    'Cómo trabajamos la accesibilidad de este sitio y cómo avisarnos si algo no funciona.',
};

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-titulo text-azul-900 text-xl font-bold">{titulo}</h2>
      <div className="text-tinta mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function PaginaAccesibilidad() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-titulo text-tinta text-[2.75rem] leading-[0.95] font-bold tracking-[-0.035em] sm:text-[3.5rem]">
        Accesibilidad
      </h1>
      <p className="text-gris mt-3">
        Este sitio está hecho para que lo pueda usar todo el mundo, incluidas
        las personas que navegan con teclado, con lector de pantalla o con la
        letra muy aumentada.
      </p>

      <Seccion titulo="Qué hicimos">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Todo el sitio se puede usar sin ratón, solo con la tecla Tab.</li>
          <li>
            El indicador de foco es siempre visible, sobre fondo claro y sobre
            fondo oscuro.
          </li>
          <li>
            Los colores se eligieron midiendo el contraste, no a ojo. Ninguna
            combinación de texto baja del mínimo que pide WCAG 2.1 nivel AA.
          </li>
          <li>Si tu sistema pide menos movimiento, aquí no se mueve nada.</li>
          <li>
            Se puede ampliar la letra hasta el 200% sin que se corte nada.
          </li>
          <li>Las guías se abren y se leen aunque no cargue el JavaScript.</li>
          <li>
            Cada guía y cada anuncio se pueden imprimir en una hoja limpia.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="Qué todavía no está resuelto">
        <p>Preferimos decirlo a que te lo encuentres:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            Los videos están alojados en YouTube. Los subtítulos automáticos en
            español no siempre son exactos. Si un video te hace falta y los
            subtítulos no ayudan, escríbenos y te lo contamos por otra vía.
          </li>
          <li>
            Algunos documentos PDF pueden venir escaneados. Cuando sabemos que
            uno no se puede leer con lector de pantalla, lo avisamos junto al
            enlace.
          </li>
        </ul>
      </Seccion>

      <Seccion titulo="¿Encontraste una barrera?">
        <p>
          Cuéntanoslo. No hace falta que sepas explicar el problema en términos
          técnicos: con decir qué querías hacer y qué pasó, nos sirve.
        </p>
        <p>
          Puedes hablar con cualquiera del{' '}
          <Link href="/consejered" className="text-azul-700 underline">
            equipo de consejería
          </Link>{' '}
          o pasar por la oficina.
        </p>
      </Seccion>

      <p className="text-gris border-tinta/60 mt-12 border-t pt-6 text-sm">
        Última revisión: septiembre de 2026. Este sitio se revisa con
        herramientas automáticas y a mano, con teclado y con lector de pantalla.
      </p>
    </div>
  );
}
