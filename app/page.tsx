import { EnlaceBoton } from '@/components/ui/Boton';
import { Tarjeta } from '@/components/ui/Tarjeta';

export default function PaginaInicio() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-turquesa-700 text-sm font-semibold tracking-wide uppercase">
        Secciones 1–3 · Andamiaje, diseño y datos
      </p>

      <h1 className="text-azul-900 mt-3 text-4xl font-bold">
        Consejería Escolar
      </h1>

      <p className="text-gris mt-4">
        El proyecto arranca aquí. Esta página se reemplaza en la Sección 5 por
        la página principal con el avatar y las tres tarjetas.
      </p>

      <Tarjeta acento="turquesa" className="mt-10">
        <h2 className="text-azul-900 text-lg font-bold">Listo hasta ahora</h2>
        <ul className="text-gris mt-3 space-y-1.5 text-sm">
          <li>Next.js, TypeScript y Tailwind configurados</li>
          <li>Idioma del documento en español</li>
          <li>Enlace para saltar al contenido (prueba con Tab)</li>
          <li>Aro de foco doble, visible sobre claro y sobre oscuro</li>
          <li>Animación reducida si el sistema lo pide</li>
          <li>Paleta y tipografía verificadas por script</li>
        </ul>
      </Tarjeta>

      <div className="mt-8">
        <EnlaceBoton href="/estilo" variante="secundario">
          Ver la guía de estilo
        </EnlaceBoton>
      </div>

      <p className="text-gris border-borde mt-10 border-t pt-6 text-sm">
        Prueba de tildes: ¿Cómo estás, Señor Núñez? ¡Qué bien! ÁÉÍÓÚ ñÑ üÜ
      </p>
    </div>
  );
}
