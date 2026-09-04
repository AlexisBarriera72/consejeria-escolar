import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Créditos',
  description: 'Quién hizo este sitio y con qué.',
};

export default function PaginaCreditos() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <h1 className="font-titulo text-tinta text-[2.75rem] leading-[0.95] font-bold tracking-[-0.035em] sm:text-[3.5rem]">
        Créditos
      </h1>

      <p className="text-tinta mt-6">
        Este sitio lo hizo <strong>Alexis</strong> para la oficina de consejería
        de la escuela.
      </p>

      <section className="mt-10">
        <h2 className="font-titulo text-azul-900 text-xl font-bold">
          Hecho con
        </h2>
        <ul className="text-tinta mt-3 list-disc space-y-1 pl-5">
          <li>Next.js, React y TypeScript</li>
          <li>Tailwind CSS</li>
          <li>
            Tipografías <em>Fraunces</em> y <em>Source Sans 3</em>, de Google
            Fonts, servidas desde este mismo sitio
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-titulo text-azul-900 text-xl font-bold">
          Sobre tu privacidad
        </h2>
        <p className="text-tinta mt-3">
          Este sitio no recoge datos personales. No pide tu nombre ni tu correo,
          no pone cookies de seguimiento y no usa servicios de publicidad ni de
          analítica de terceros.
        </p>
        <p className="text-tinta mt-3">
          Lo único que se guarda es un número: cuántas personas entraron cada
          mes como estudiante, como encargado o como invitado. Ese número no se
          puede relacionar con nadie, porque no se guarda nada con lo que
          relacionarlo.
        </p>
        <p className="text-tinta mt-3">
          Los videos están en YouTube y no se carga nada de ahí hasta que pulsas
          «Reproducir».
        </p>
      </section>

      <p className="border-tinta/60 mt-12 border-t pt-6">
        <Link href="/accesibilidad" className="text-azul-700 underline">
          Ver la declaración de accesibilidad
        </Link>
      </p>
    </div>
  );
}
