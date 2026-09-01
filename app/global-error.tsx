'use client';

/**
 * Pantalla de último recurso: se muestra solo si falla el propio layout raíz.
 *
 * Existe por dos motivos. El primero, obvio: la que trae Next por defecto
 * está en inglés, y este sitio es para gente que lee español.
 *
 * El segundo lo encontró la auditoría (`npm run verificar:a11y`): la pantalla
 * por defecto de Next renderiza su propio <html> SIN atributo lang y sin
 * ningún landmark. Es el único sitio de todo el proyecto donde eso pasaba, y
 * no se puede arreglar desde el layout — hay que sustituir la pantalla entera.
 * Justo el tipo de fallo que un humano leyendo el código no encuentra nunca,
 * porque el código no es suyo.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          background: '#fbfaf7',
          color: '#16202e',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          fontSize: 17,
          lineHeight: 1.6,
          padding: '2rem',
        }}
      >
        <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              color: '#1e3f73',
              margin: '0 0 .75rem',
            }}
          >
            Algo falló de nuestro lado
          </h1>
          <p style={{ color: '#5b6676', margin: '0 0 1.75rem' }}>
            No es culpa tuya. Puedes intentar de nuevo, y si sigue igual,
            avísale a la oficina de consejería.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              font: 'inherit',
              fontWeight: 600,
              padding: '.85rem 1.6rem',
              borderRadius: '.75rem',
              border: '2px solid #2f5ea8',
              background: '#2f5ea8',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Intentar de nuevo
          </button>
        </main>
      </body>
    </html>
  );
}
