import Link from 'next/link';

export function PiePagina() {
  return (
    <footer className="bg-azul-100 mt-20">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-tinta font-semibold">Consejería Escolar</p>
        <p className="text-gris mt-1 text-sm">
          Escuela Superior [Nombre] · Lorem ipsum dolor sit amet, consectetur
          adipiscing elit.
        </p>

        <nav
          aria-label="Enlaces del pie"
          className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm"
        >
          <Link href="/guias" className="text-azul-700 rounded underline">
            Preguntas y Guías
          </Link>
          <Link href="/noticias" className="text-azul-700 rounded underline">
            Noticias
          </Link>
          <Link href="/consejered" className="text-azul-700 rounded underline">
            Profesionales
          </Link>
          {/* La puerta discreta al panel. No es seguridad — la seguridad
              está en el servidor (doc 01 §3) — es para que el personal
              no tenga que acordarse de una dirección secreta. */}
          <Link href="/edit" className="text-gris rounded underline">
            Personal
          </Link>
        </nav>

        <p className="text-gris mt-6 text-xs">
          Este sitio no recoge datos personales.
        </p>
      </div>
    </footer>
  );
}
