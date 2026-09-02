import Link from 'next/link';
import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { ControlAviso } from '@/components/panel/ControlAviso';
import { exigirPanel } from '@/lib/guardia';
import {
  crudo,
  panelNoticias,
  panelPerfiles,
  panelPreguntas,
  contarVencenPronto,
} from '@/lib/contenido';

const DIAS_AVISO = 14;

export default async function PaginaPanel() {
  const sesion = await exigirPanel();

  const [preguntas, noticias, perfiles, aviso, vencenPronto] =
    await Promise.all([
      panelPreguntas(),
      panelNoticias(),
      panelPerfiles(),
      crudo.aviso(),
      contarVencenPronto(DIAS_AVISO),
    ]);

  const tarjetas = [
    {
      href: '/edit/panel/guias',
      titulo: 'Preguntas y Guías',
      publicadas: preguntas.filter((p) => p.estado === 'publicado').length,
      borradores: preguntas.filter((p) => p.estado === 'borrador').length,
      extra: null,
    },
    {
      href: '/edit/panel/noticias',
      titulo: 'Noticias',
      publicadas: noticias.filter((a) => a.estado === 'publicado').length,
      borradores: noticias.filter((a) => a.estado === 'borrador').length,
      // El sitio avisando de que hay que mantenerlo. Nadie en la escuela
      // tiene el trabajo de retirar lo viejo, así que lo recuerda el panel.
      extra: vencenPronto > 0 ? `${vencenPronto} vence(n) pronto` : null,
    },
    {
      href: '/edit/panel/perfiles',
      titulo: 'Profesionales',
      publicadas: perfiles.filter((p) => p.estado === 'publicado').length,
      borradores: perfiles.filter((p) => p.estado === 'borrador').length,
      extra: null,
    },
  ];

  return (
    <MarcoPanel
      usuario={sesion.usuario}
      titulo="Panel de edición"
      descripcion="Todo lo que publica la oficina de consejería se edita aquí."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {tarjetas.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="border-borde hover:border-azul-500 rounded-2xl border-2 bg-white p-6 transition-colors"
          >
            <h2 className="font-titulo text-azul-900 text-xl font-bold">
              {t.titulo}
            </h2>
            <p className="text-gris mt-3 text-sm">
              {t.publicadas} publicada{t.publicadas === 1 ? '' : 's'}
            </p>
            {t.borradores > 0 ? (
              <p className="text-gris text-sm">{t.borradores} en borrador</p>
            ) : null}
            {t.extra ? (
              <p className="bg-ambar text-tinta mt-3 inline-block rounded px-2 py-0.5 text-sm">
                {t.extra}
              </p>
            ) : null}
            <p className="text-azul-700 mt-5 font-semibold underline">
              Administrar
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ControlAviso aviso={aviso} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/edit/panel/papelera"
          className="border-borde hover:border-azul-500 rounded-xl border bg-white px-5 py-4"
        >
          <p className="text-tinta font-semibold">Papelera</p>
          <p className="text-gris mt-1 text-sm">
            Lo que se borró se puede recuperar por 30 días.
          </p>
        </Link>
        <Link
          href="/edit/panel/estadisticas"
          className="border-borde hover:border-azul-500 rounded-xl border bg-white px-5 py-4"
        >
          <p className="text-tinta font-semibold">Estadísticas</p>
          <p className="text-gris mt-1 text-sm">
            Cuánta gente visita el sitio cada mes.
          </p>
        </Link>
      </div>
    </MarcoPanel>
  );
}
