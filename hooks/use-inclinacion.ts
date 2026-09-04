'use client';

import { useRef } from 'react';

/*
 * NOTA SOBRE EL NOMBRE, que rompe el castellano del resto del proyecto:
 * los hooks TIENEN que empezar por `use`. No es una convención de estilo —
 * es como React identifica un hook, y tanto la regla `rules-of-hooks` como
 * el compilador de React 19 se apoyan en ese prefijo para comprobar que no
 * se llama dentro de un bucle o una condición. Con `usarInclinacion` el
 * linter no reconocía la función como hook y dejaba de verificarla.
 */

/**
 * Inclina un elemento hacia el puntero.
 *
 * Las tarjetas de la portada ya nacen torcidas un grado y se enderezan al
 * pasar por encima. Ese instinto estaba bien; lo que le faltaba era que el
 * enderezamiento siguiera al cursor, que es lo que convierte una tarjeta en
 * un objeto físico clavado en un tablón.
 *
 * POR QUÉ ESCRIBE EN EL DOM Y NO EN EL ESTADO DE REACT: esto se dispara en
 * cada `pointermove`, decenas de veces por segundo. Un `useState` ahí dentro
 * volvería a renderizar el árbol entero a esa frecuencia y la página se
 * arrastraría justo en los Chromebook donde se va a usar. Escribir dos
 * variables CSS en el nodo salta el render del todo y lo compone la GPU.
 *
 * Solo cambia `--rx` y `--ry`; el giro de verdad lo aplica `.inclinable` en
 * globals.css, que está detrás de `(hover: hover) and (pointer: fine)` y de
 * `prefers-reduced-motion`. Si alguna de las dos no se cumple, este hook
 * sigue escribiendo variables que nadie lee — y no pasa nada.
 */
export function useInclinacion<T extends HTMLElement = HTMLDivElement>(
  max = 7,
) {
  const ref = useRef<T>(null);

  const mover = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${x * max * 2}deg`);
    el.style.setProperty('--rx', `${-y * max * 2}deg`);
    // Marca el estado "siguiendo al cursor" para que la transición se acorte.
    el.dataset.activo = 'si';
  };

  const salir = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--rx', '0deg');
    delete el.dataset.activo;
  };

  return { ref, onPointerMove: mover, onPointerLeave: salir };
}

/**
 * Un botón que se acerca al puntero.
 *
 * Va en UN solo botón de la portada. Es un efecto que deja de significar algo
 * en cuanto hay cinco: si todo tira del cursor, tirar del cursor ya no señala
 * nada. Aquí se lo queda «Buscar», que es el único sitio donde se espera que
 * alguien se comprometa a una acción.
 *
 * El recorrido está topado a propósito. Un botón que corre más que el cursor
 * es un botón que la gente falla.
 */
export function useIman(fuerza = 0.28, tope = 8) {
  const limitar = (v: number) => Math.max(-tope, Math.min(tope, v));

  const mover = (e: React.PointerEvent<HTMLElement>) => {
    const b = e.currentTarget;
    const r = b.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    b.style.translate = `${limitar(x * fuerza)}px ${limitar(y * fuerza)}px`;
  };

  const salir = (e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.style.translate = '';
  };

  return { onPointerMove: mover, onPointerLeave: salir };
}
