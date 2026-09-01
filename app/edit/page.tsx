import { redirect } from 'next/navigation';
import { FormularioAcceso } from '@/components/panel/FormularioAcceso';
import { sesionActiva } from '@/lib/acceso';

export default async function PaginaAcceso({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await sesionActiva()) redirect('/edit/panel');
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <h1 className="font-titulo text-azul-900 text-3xl font-bold">
        Entrar al panel
      </h1>
      <p className="text-gris mt-2">
        Esta pantalla es solo para el personal de la escuela.
      </p>
      <div className="mt-8">
        <FormularioAcceso error={error} />
      </div>
    </div>
  );
}
