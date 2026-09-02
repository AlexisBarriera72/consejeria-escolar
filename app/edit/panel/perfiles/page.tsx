import Link from 'next/link';
import { randomUUID } from 'node:crypto';
import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { FotoPerfil } from '@/components/FotoPerfil';
import { exigirPanel } from '@/lib/guardia';
import { panelPerfiles } from '@/lib/contenido';

export default async function ListaPerfiles() {
  const sesion = await exigirPanel();
  const perfiles = await panelPerfiles();

  return (
    <MarcoPanel
      correo={sesion.correo}
      titulo="Profesionales"
      descripcion="El equipo que aparece en El Pasillo."
      volverA={{ href: '/edit/panel', texto: 'Panel' }}
    >
      <Link
        href={`/edit/panel/perfiles/${randomUUID()}`}
        className="bg-azul-700 hover:bg-azul-900 inline-block rounded-xl px-6 py-3 font-semibold text-white"
      >
        + Añadir a alguien
      </Link>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {perfiles.map((p) => (
          <li key={p.id}>
            <Link
              href={`/edit/panel/perfiles/${p.id}`}
              className="border-borde hover:border-azul-500 flex items-center gap-4 rounded-xl border bg-white px-4 py-3"
            >
              <FotoPerfil perfil={p} tamano="chica" />
              <span className="min-w-0 flex-1">
                <span className="text-tinta block truncate font-medium">
                  {p.nombre}
                </span>
                <span className="text-gris block truncate text-sm">
                  {p.puesto}
                </span>
              </span>
              {p.estado === 'borrador' ? (
                <span className="bg-ambar/40 text-tinta shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold">
                  Borrador
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </MarcoPanel>
  );
}
