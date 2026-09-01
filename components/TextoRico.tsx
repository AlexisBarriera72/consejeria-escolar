/**
 * Pinta el HTML guardado en el contenido (bios, respuestas, anuncios).
 *
 * ⚠ PENDIENTE PARA LA SECCIÓN 11 ⚠
 * Hoy el HTML viene de contenido/*.json, que escribimos nosotros, así que es
 * de fiar. En cuanto el panel deje que el personal escriba, deja de serlo:
 * `dangerouslySetInnerHTML` con texto de otra persona es un XSS de manual.
 *
 * Este componente existe para que ese arreglo tenga UN solo sitio donde
 * hacerse. Ninguna página debe llamar a dangerouslySetInnerHTML por su
 * cuenta — siempre a través de aquí.
 *
 * Plan: sanear en la ESCRITURA (al guardar en el panel), con una lista
 * blanca de p, strong, em, ul, ol, li, a, br — exactamente los seis botones
 * del editor (doc 04 §4) — y volver a sanear aquí al leer, por si acaso.
 */
export function TextoRico({
  html,
  className = '',
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={`[&_a]:text-azul-700 space-y-3 [&_a]:underline [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
