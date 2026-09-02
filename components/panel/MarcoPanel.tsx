import Link from 'next/link';

/**
 * El marco de todas las pantallas del panel.
 *
 * La franja de arriba dice, en cada pantalla y con todas las letras, que los
 * estudiantes no ven esto. Puede parecer repetitivo. No lo es: es lo único
 * que quita el miedo a "y si publico algo sin querer", que es lo que hace que
 * una maestra no vuelva a abrir el panel después del primer día.
 */
export function MarcoPanel({
  usuario,
  titulo,
  descripcion,
  volverA,
  children,
}: {
  usuario: string;
  titulo: string;
  descripcion?: string;
  volverA?: { href: string; texto: string };
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <div className="bg-azul-100 border-b border-[#c6d4ec]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
          <p className="text-tinta text-sm">
            <strong>Estás en el panel de edición</strong> — los estudiantes no
            ven esta pantalla.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gris">{usuario}</span>
            <form action="/api/acceso/salir" method="POST">
              <button className="border-azul-700 text-azul-700 hover:bg-azul-100 rounded-lg border px-3 py-1.5 font-medium">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10">
        {volverA ? (
          <Link
            href={volverA.href}
            className="text-azul-700 rounded text-sm underline"
          >
            ← {volverA.texto}
          </Link>
        ) : null}
        <h1
          className={`font-titulo text-azul-900 text-3xl font-bold ${volverA ? 'mt-5' : ''}`}
        >
          {titulo}
        </h1>
        {descripcion ? <p className="text-gris mt-2">{descripcion}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
