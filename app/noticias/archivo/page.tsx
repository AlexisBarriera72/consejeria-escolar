import type { Metadata } from 'next';
import Link from 'next/link';
import { TarjetaAnuncio } from '@/components/TarjetaAnuncio';
import { obtenerNoticias } from '@/lib/contenido';
import { fechaCorta, mesYAno } from '@/lib/fechas';
import type { Anuncio } from '@/lib/tipos';

export const metadata: Metadata = {
  title: 'Ediciones anteriores',
  description: 'Todos los anuncios publicados, agrupados por mes.',
};

export default async function PaginaArchivo() {
  // Aquí SÍ se incluyen los vencidos: para eso está el archivo.
  const todas = await obtenerNoticias({ incluirVencidas: true });
  const ahora = new Date();

  // Agrupar por mes conservando el orden (obtenerNoticias devuelve de la más
  // reciente a la más antigua, así que los meses ya salen ordenados).
  const meses = new Map<string, Anuncio[]>();
  for (const a of todas) {
    const clave = mesYAno(a.publicarEn);
    const lista = meses.get(clave);
    if (lista) lista.push(a);
    else meses.set(clave, [a]);
  }

  return (
    <div className="contenedor py-12">
      <Link href="/noticias" className="text-azul-700 barrido rounded text-sm">
        ← Noticias
      </Link>

      <h1 className="font-titulo text-tinta mt-6 text-[2.75rem] leading-[0.95] font-bold tracking-[-0.035em] sm:text-[3.5rem]">
        Ediciones anteriores
      </h1>
      <p className="text-gris mt-3">
        Todo lo que se ha publicado, del más reciente al más antiguo.
      </p>

      {meses.size === 0 ? (
        <p className="text-gris border-tinta/60 mt-10 rounded-[1.25rem] border border-dashed p-10 text-center">
          Todavía no hay anuncios publicados.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {[...meses.entries()].map(([mes, anuncios]) => (
            <section key={mes}>
              <h2 className="font-titulo text-azul-900 border-tinta/60 border-b pb-2 text-xl font-bold capitalize">
                {mes}
                <span className="text-gris ml-3 text-sm font-normal normal-case">
                  {anuncios.length}{' '}
                  {anuncios.length === 1 ? 'anuncio' : 'anuncios'}
                </span>
              </h2>
              <div className="revelar mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {anuncios.map((a) => (
                  <TarjetaAnuncio
                    key={a.id}
                    anuncio={a}
                    fecha={fechaCorta(a.publicarEn)}
                    vencido={
                      a.expiraEn !== null && new Date(a.expiraEn) < ahora
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
