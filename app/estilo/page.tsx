import type { Metadata } from 'next';
import { Boton } from '@/components/ui/Boton';
import { Tarjeta, type Acento } from '@/components/ui/Tarjeta';

export const metadata: Metadata = {
  title: 'Guía de estilo',
  // Página interna: útil para nosotros, ruido para cualquier otro.
  robots: { index: false, follow: false },
};

const PANGRAMA = '¿Cómo estás, Señor Núñez? ¡Qué bien! ÁÉÍÓÚ ñÑ üÜ';

/** Ratios calculados por scripts/verificar-contraste.mjs, no a ojo. */
const PALETA: {
  nombre: string;
  clase: string;
  hex: string;
  encima: 'tinta' | 'blanco';
  ratio: string;
}[] = [
  {
    nombre: 'azul-900',
    clase: 'bg-azul-900',
    hex: '#1e3f73',
    encima: 'blanco',
    ratio: '10.43',
  },
  {
    nombre: 'azul-700',
    clase: 'bg-azul-700',
    hex: '#2f5ea8',
    encima: 'blanco',
    ratio: '6.39',
  },
  {
    nombre: 'azul-500',
    clase: 'bg-azul-500',
    hex: '#4378c6',
    encima: 'tinta',
    ratio: '3.70 · solo grande',
  },
  {
    nombre: 'azul-300',
    clase: 'bg-azul-300',
    hex: '#899dd9',
    encima: 'tinta',
    ratio: '6.16',
  },
  {
    nombre: 'azul-100',
    clase: 'bg-azul-100',
    hex: '#dbe4f6',
    encima: 'tinta',
    ratio: '12.84',
  },
  {
    nombre: 'turquesa-700',
    clase: 'bg-turquesa-700',
    hex: '#0a7d85',
    encima: 'blanco',
    ratio: '4.90',
  },
  {
    nombre: 'turquesa-500',
    clase: 'bg-turquesa-500',
    hex: '#00bdc9',
    encima: 'tinta',
    ratio: '7.13',
  },
  {
    nombre: 'menta',
    clase: 'bg-menta',
    hex: '#75d2c1',
    encima: 'tinta',
    ratio: '9.17',
  },
  {
    nombre: 'rosa-700',
    clase: 'bg-rosa-700',
    hex: '#c4166b',
    encima: 'blanco',
    ratio: '5.72',
  },
  {
    nombre: 'rosa-500',
    clase: 'bg-rosa-500',
    hex: '#f83f98',
    encima: 'tinta',
    ratio: '4.81',
  },
  {
    nombre: 'coral',
    clase: 'bg-coral',
    hex: '#ff6e53',
    encima: 'tinta',
    ratio: '5.94',
  },
  {
    nombre: 'durazno',
    clase: 'bg-durazno',
    hex: '#ff987f',
    encima: 'tinta',
    ratio: '7.85',
  },
  {
    nombre: 'naranja',
    clase: 'bg-naranja',
    hex: '#fc7f47',
    encima: 'tinta',
    ratio: '6.46',
  },
  {
    nombre: 'ambar',
    clase: 'bg-ambar',
    hex: '#ffc226',
    encima: 'tinta',
    ratio: '10.15',
  },
  {
    nombre: 'amarillo',
    clase: 'bg-amarillo',
    hex: '#ffed76',
    encima: 'tinta',
    ratio: '13.77',
  },
  {
    nombre: 'salvia',
    clase: 'bg-salvia',
    hex: '#bcd298',
    encima: 'tinta',
    ratio: '10.01',
  },
];

const ACENTOS: Acento[] = [
  'azul',
  'turquesa',
  'menta',
  'rosa',
  'coral',
  'naranja',
  'ambar',
  'salvia',
];

function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-tinta/60 border-t pt-10">
      <h2 className="text-azul-900 mb-6 text-2xl font-bold">{titulo}</h2>
      {children}
    </section>
  );
}

export default function PaginaEstilo() {
  return (
    <div className="mx-auto max-w-4xl space-y-14 px-6 py-16">
      <header>
        <p className="text-turquesa-700 text-sm font-semibold tracking-wide uppercase">
          Página interna
        </p>
        <h1 className="text-azul-900 mt-2 text-4xl font-bold">
          Guía de estilo
        </h1>
        <p className="text-gris mt-3 max-w-2xl">
          Referencia viva del sistema de diseño (doc 03). Si algo se ve mal
          aquí, se ve mal en todo el sitio. Los contrastes los calcula{' '}
          <code className="bg-azul-100 rounded px-1.5 py-0.5 text-sm">
            npm run verificar:contraste
          </code>
          , no el ojo.
        </p>
      </header>

      <Seccion titulo="Tipografía">
        <div className="space-y-6">
          <div>
            <p className="text-gris mb-1 text-sm">Fraunces · titulares</p>
            <p className="font-titulo text-azul-900 text-4xl font-bold">
              {PANGRAMA}
            </p>
          </div>
          <div>
            <p className="text-gris mb-1 text-sm">Source Sans 3 · cuerpo</p>
            <p className="font-cuerpo text-xl">{PANGRAMA}</p>
            <p className="font-cuerpo mt-2">{PANGRAMA}</p>
            <p className="font-cuerpo text-gris mt-2 text-sm">{PANGRAMA}</p>
          </div>
          <p className="text-gris border-tinta/60 border-t pt-4 text-sm">
            Si alguna letra de arriba sale como un rectángulo vacío, esa fuente
            no sirve. Verificado glifo por glifo con{' '}
            <code className="bg-azul-100 rounded px-1.5 py-0.5">
              npm run verificar:fuentes
            </code>
            .
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Paleta">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PALETA.map((c) => (
            <div
              key={c.nombre}
              className={`${c.clase} rounded-xl p-3 ${
                c.encima === 'blanco' ? 'text-white' : 'text-tinta'
              }`}
            >
              <p className="text-sm font-semibold">{c.nombre}</p>
              <p className="font-mono text-xs opacity-80">{c.hex}</p>
              <p className="mt-4 text-xs opacity-90">
                {c.encima} · {c.ratio}:1
              </p>
            </div>
          ))}
        </div>
        <p className="text-gris mt-5 text-sm">
          Cada cuadro muestra el único color de texto permitido encima y su
          ratio real.{' '}
          <strong>
            Solo azul-900, azul-700, rosa-700 y turquesa-700 aceptan texto
            blanco.
          </strong>{' '}
          El resto son fondos que llevan tinta. azul-500 incluido: da 4.43 sobre
          blanco y AA pide 4.5.
        </p>
      </Seccion>

      <Seccion titulo="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Boton variante="primario">Publicar</Boton>
          <Boton variante="secundario">Guardar borrador</Boton>
          <Boton variante="fantasma">Cancelar</Boton>
          <Boton variante="primario" disabled>
            Desactivado
          </Boton>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Boton variante="primario" tamano="grande">
            Soy estudiante
          </Boton>
          <Boton variante="secundario" tamano="grande">
            Soy madre, padre o encargado
          </Boton>
        </div>
        <p className="text-gris mt-5 text-sm">
          Pasa con Tab por los botones: el foco es un aro doble — oscuro por
          dentro, ámbar por fuera — para que se vea tanto sobre papel como sobre
          el azul del encabezado.
        </p>
      </Seccion>

      <Seccion titulo="Tarjetas y acentos">
        <div className="grid gap-4 sm:grid-cols-2">
          {ACENTOS.slice(0, 4).map((a) => (
            <Tarjeta key={a} acento={a}>
              <h3 className="text-azul-900 text-lg font-bold">Acento {a}</h3>
              <p className="text-gris mt-1 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </Tarjeta>
          ))}
        </div>
      </Seccion>

      <Seccion titulo="Foco sobre fondo oscuro">
        <div className="bg-azul-900 flex flex-wrap gap-3 rounded-[1.25rem] p-6">
          <a
            href="#contenido"
            className="rounded-lg bg-white/10 px-4 py-2 font-semibold text-white"
          >
            Enlace en encabezado
          </a>
          <a
            href="#contenido"
            className="rounded-lg bg-white/10 px-4 py-2 font-semibold text-white"
          >
            Otro enlace
          </a>
        </div>
        <p className="text-gris mt-4 text-sm">
          Tab hasta aquí. El halo ámbar es lo que hace visible el foco sobre
          azul oscuro; el aro oscuro solo no se vería.
        </p>
      </Seccion>
    </div>
  );
}
