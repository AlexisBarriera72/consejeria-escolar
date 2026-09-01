'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { exigirPanel } from '@/lib/guardia';
import { crudo, guardarAviso } from '@/lib/contenido';
import type { Aviso } from '@/lib/tipos';

/**
 * Acciones de servidor del panel.
 *
 * TODAS empiezan con `exigirPanel()`. Es la regla que no se rompe: una acción
 * de servidor es un punto de entrada HTTP igual que una ruta de API, y se
 * puede invocar directamente. Que solo se llame desde una pantalla protegida
 * no protege nada.
 */

const AvisoEntrada = z.object({
  activo: z.coerce.boolean(),
  mensaje: z.string().trim().max(200),
  nivel: z.enum(['info', 'urgente']),
});

export async function guardarAvisoAccion(datos: FormData) {
  const sesion = await exigirPanel();

  const entrada = AvisoEntrada.safeParse({
    activo: datos.get('activo') === 'on',
    mensaje: datos.get('mensaje') ?? '',
    nivel: datos.get('nivel') ?? 'info',
  });
  if (!entrada.success) {
    return { ok: false, error: 'Revisa el mensaje del aviso.' };
  }

  // Un aviso activo sin texto sería una franja de color vacía en todas las
  // páginas. Se rechaza aquí, no en el navegador: la validación del cliente
  // es comodidad, la del servidor es la que cuenta.
  if (entrada.data.activo && entrada.data.mensaje.length === 0) {
    return { ok: false, error: 'Escribe el mensaje antes de activarlo.' };
  }

  const anterior = await crudo.aviso();
  const nuevo: Aviso = {
    ...anterior,
    ...entrada.data,
    actualizadoEn: new Date().toISOString(),
  };

  await guardarAviso(
    nuevo,
    `${sesion.correo} ${entrada.data.activo ? 'activó' : 'desactivó'} el aviso`,
  );
  revalidatePath('/', 'layout');
  return { ok: true };
}
