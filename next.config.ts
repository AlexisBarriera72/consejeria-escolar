import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // No anunciar que esto corre en Next. Un dato menos para quien busque
  // vulnerabilidades conocidas por versión.
  poweredByHeader: false,

  // Fallar el build si hay errores de tipo. Es incómodo hoy y barato;
  // descubrir el error en producción no lo es.
  //
  // Nota: en Next 16 el lint ya no se configura aquí — `next lint` se eliminó
  // y ESLint corre por su cuenta (`npm run lint`). El build ya no lo ejecuta,
  // así que hay que llamarlo aparte, y por eso está en `npm run verificar`.
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
