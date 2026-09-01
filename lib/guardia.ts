import 'server-only';
import { redirect } from 'next/navigation';
import { sesionActiva, type Sesion } from './acceso';

/**
 * Puerta de cada pantalla del panel.
 *
 * Se llama al principio de CADA página bajo /edit/panel y al principio de
 * CADA acción que escribe. No basta con comprobarlo en un middleware: un
 * middleware mal configurado deja pasar, y el error no se nota hasta que
 * alguien lo aprovecha. La comprobación va donde está el riesgo.
 */
export async function exigirPanel(): Promise<Sesion> {
  const sesion = await sesionActiva();
  if (!sesion) redirect('/edit');
  return sesion;
}
