import { MarcoPanel } from '@/components/panel/MarcoPanel';
import { DescargarCsv } from '@/components/panel/DescargarCsv';
import { exigirPanel } from '@/lib/guardia';
import { aCsv, obtenerEstadisticas } from '@/lib/estadisticas';
import { mesYAno } from '@/lib/fechas';

export default async function PaginaEstadisticas() {
  const sesion = await exigirPanel();
  const datos = await obtenerEstadisticas();
  const meses = Object.keys(datos).sort().reverse();

  return (
    <MarcoPanel
      usuario={sesion.usuario}
      titulo="Estadísticas"
      descripcion="Cuánta gente visita el sitio cada mes."
      volverA={{ href: '/edit/panel', texto: 'Panel' }}
    >
      <div className="bg-menta/25 text-tinta rounded-xl px-5 py-4">
        <p className="font-semibold">Aquí no hay datos personales.</p>
        <p className="mt-1 text-sm">
          Lo único que se guarda es cuál de los tres botones se pulsó. No hay
          nombres, ni correos, ni direcciones IP: no se puede saber quién
          visitó, solo cuántas personas lo hicieron.
        </p>
      </div>

      {meses.length === 0 ? (
        <p className="text-gris border-borde mt-8 rounded-2xl border border-dashed p-10 text-center">
          Todavía no hay visitas registradas.
        </p>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-borde border-b">
                  <th className="text-gris py-2 pr-4 font-medium">Mes</th>
                  <th className="text-gris py-2 pr-4 font-medium">
                    Estudiantes
                  </th>
                  <th className="text-gris py-2 pr-4 font-medium">
                    Encargados
                  </th>
                  <th className="text-gris py-2 pr-4 font-medium">Invitados</th>
                  <th className="text-gris py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {meses.map((m) => {
                  const c = datos[m] ?? {};
                  const e = c.estudiante ?? 0;
                  const n = c.encargado ?? 0;
                  const i = c.invitado ?? 0;
                  return (
                    <tr key={m} className="border-borde border-b">
                      <td className="text-tinta py-2.5 pr-4 capitalize">
                        {mesYAno(`${m}-15T12:00:00.000Z`)}
                      </td>
                      <td className="text-tinta py-2.5 pr-4">{e}</td>
                      <td className="text-tinta py-2.5 pr-4">{n}</td>
                      <td className="text-tinta py-2.5 pr-4">{i}</td>
                      <td className="text-tinta py-2.5 font-semibold">
                        {e + n + i}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <DescargarCsv csv={aCsv(datos)} />
          </div>
        </>
      )}
    </MarcoPanel>
  );
}
