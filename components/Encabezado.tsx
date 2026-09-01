import Link from 'next/link';
import { ChipRol } from './ChipRol';

export function Encabezado() {
  return (
    <header className="bg-azul-500">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded font-semibold text-white"
        >
          {/* Marcador del escudo de la escuela */}
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-sm"
          >
            CE
          </span>
          <span className="hidden sm:inline">Consejería Escolar</span>
        </Link>
        <ChipRol />
      </div>
    </header>
  );
}
