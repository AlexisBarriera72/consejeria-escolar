import 'server-only';
import ICAL from 'ical.js';

/**
 * Disponibilidad de la consejera, leída de un calendario iCal.
 *
 * ⚠ LA TRAMPA DE PRIVACIDAD (doc 09 §4) ⚠
 *
 * El calendario principal de una consejera escolar contiene títulos como
 * "Reunión con Juan Pérez — seguimiento". Publicar eso en una página web es
 * revelar información concreta sobre un estudiante concreto.
 *
 * Por eso esta función NUNCA devuelve el título de un evento. Solo devuelve,
 * por día, si hay algo ocupado o no. Los títulos ni siquiera salen de aquí,
 * así que no pueden acabar en el HTML por descuido — «ver código fuente» es
 * una tecla.
 *
 * Además, la configuración correcta es un calendario APARTE llamado
 * "Disponibilidad" con bloques genéricos, no el calendario de trabajo. Así,
 * aunque la URL secreta se filtrara, no hay nada sensible que filtrar.
 */

export type Dia = { fecha: string; ocupado: boolean };

export type Disponibilidad =
  { ok: true; dias: Dia[] } | { ok: false; motivo: 'sin-configurar' | 'error' };

const claveDia = (d: Date) => d.toISOString().slice(0, 10);

export async function obtenerDisponibilidad(
  desde = new Date(),
  dias = 42,
): Promise<Disponibilidad> {
  const url = process.env.CALENDARIO_ICS_URL;
  if (!url) return { ok: false, motivo: 'sin-configurar' };

  let texto: string;
  try {
    const res = await fetch(url, {
      // Media hora de caché: el calendario de una escuela no cambia por
      // minutos, y así no se golpea a Google en cada visita.
      next: { revalidate: 1800 },
    });
    if (!res.ok) return { ok: false, motivo: 'error' };
    texto = await res.text();
  } catch {
    return { ok: false, motivo: 'error' };
  }

  try {
    const componente = new ICAL.Component(ICAL.parse(texto));
    const eventos = componente
      .getAllSubcomponents('vevent')
      .map((v) => new ICAL.Event(v));

    const inicio = new Date(desde);
    inicio.setHours(0, 0, 0, 0);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + dias);

    const ocupados = new Set<string>();

    for (const evento of eventos) {
      if (evento.isRecurrenceException()) continue;

      if (evento.isRecurring()) {
        // La parte que no conviene escribir a mano: la disponibilidad de una
        // consejera es casi siempre un evento semanal, y expandir un RRULE
        // correctamente (con excepciones, cambios de horario de verano y
        // fines de serie) es justo donde se rompen las implementaciones
        // caseras. Para esto está la librería.
        const iterador = evento.iterator();
        let siguiente = iterador.next();
        let vueltas = 0;
        while (siguiente && vueltas < 500) {
          const cuando = siguiente.toJSDate();
          if (cuando > fin) break;
          if (cuando >= inicio) ocupados.add(claveDia(cuando));
          siguiente = iterador.next();
          vueltas++;
        }
      } else {
        const cuando = evento.startDate.toJSDate();
        if (cuando >= inicio && cuando <= fin) ocupados.add(claveDia(cuando));
      }
    }

    const resultado: Dia[] = [];
    for (let i = 0; i < dias; i++) {
      const d = new Date(inicio);
      d.setDate(d.getDate() + i);
      const clave = claveDia(d);
      resultado.push({ fecha: clave, ocupado: ocupados.has(clave) });
    }

    return { ok: true, dias: resultado };
  } catch {
    return { ok: false, motivo: 'error' };
  }
}
