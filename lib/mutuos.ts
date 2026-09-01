/**
 * Hace mutuas las relaciones "trabaja con".
 *
 * Función pura y sin dependencias, a propósito: así se puede probar sola,
 * sin arrastrar los JSON ni el framework. Ver scripts/verificar-mutuos.mjs.
 *
 * El porqué no es técnico. Si María pone a Luis y Luis no pone a María, el
 * grafo queda cojo — y la persona que no aparece lo nota. Se resuelve
 * calculándolo, no pidiéndole a nadie que se acuerde de reciprocar.
 */

export type ConRelaciones = { id: string; trabajaCon: string[] };

export function conRelacionesMutuas<T extends ConRelaciones>(lista: T[]): T[] {
  const mutuos = new Map<string, Set<string>>();
  const existe = new Set(lista.map((p) => p.id));

  for (const p of lista) mutuos.set(p.id, new Set());

  for (const p of lista) {
    for (const otroId of p.trabajaCon) {
      // Se ignoran las referencias a perfiles borrados, en borrador o a
      // uno mismo. Sin esto, un perfil eliminado deja huecos por todo el sitio.
      if (!existe.has(otroId) || otroId === p.id) continue;
      mutuos.get(p.id)?.add(otroId);
      mutuos.get(otroId)?.add(p.id);
    }
  }

  return lista.map((p) => ({
    ...p,
    trabajaCon: [...(mutuos.get(p.id) ?? [])],
  }));
}
