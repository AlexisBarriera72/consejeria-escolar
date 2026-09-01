export default function PaginaInicio() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <p className="text-sm font-semibold tracking-wide text-[#0a7d85] uppercase">
        Sección 1 · Andamiaje
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#1e3f73]">
        Consejería Escolar
      </h1>

      <p className="mt-4 text-[#5b6676]">
        El proyecto arranca aquí. Esta página se reemplaza en la Sección 5 por
        la página principal con el avatar y las tres tarjetas.
      </p>

      <ul className="mt-10 space-y-2 text-[#5b6676]">
        <li>✓ Next.js, TypeScript y Tailwind configurados</li>
        <li>✓ Idioma del documento en español</li>
        <li>✓ Enlace para saltar al contenido (prueba con la tecla Tab)</li>
        <li>✓ Anillo de foco visible</li>
        <li>✓ Animación reducida si el sistema lo pide</li>
      </ul>

      <p className="mt-10 text-sm text-[#5b6676]">
        Próximo: <strong>Sección 2</strong> — sistema de diseño y verificación
        de tildes en las fuentes.
      </p>

      <p className="mt-6 border-t border-[#e4e8ef] pt-6 text-sm text-[#5b6676]">
        Prueba de diacríticos: ¿Cómo estás, Señor Núñez? ¡Qué bien! ÁÉÍÓÚ ñÑ üÜ
      </p>
    </div>
  );
}
