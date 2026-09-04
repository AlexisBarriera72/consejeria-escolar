import type { ClaveSeccion } from './rol';
/**
 * Modelo de contenido (doc 02).
 *
 * `locale` va incluido aunque hoy solo se llene con 'es'. Añadirlo ahora es
 * gratis; meterlo después obliga a tocar cada consulta del proyecto.
 */

export type Estado = 'borrador' | 'publicado';
export type Locale = 'es';

export type Base = {
  id: string;
  estado: Estado;
  locale: Locale;
  creadoEn: string;
  actualizadoEn: string;
  actualizadoPor: string;
  eliminadoEn: string | null;
};

/** Color de acento, alineado con los tokens de app/globals.css. */
export type Acento =
  | 'azul'
  | 'turquesa'
  | 'menta'
  | 'rosa'
  | 'coral'
  | 'naranja'
  | 'ambar'
  | 'salvia';

export type Imagen = {
  url: string;
  /** Obligatorio para publicar. En el panel se pregunta como
   *  "¿Qué se ve en la foto?" — nadie sabe responder "alt text". */
  alt: string;
  ancho: number;
  alto: number;
  /** 0..1. Qué parte debe sobrevivir a cualquier recorte, para que nadie
   *  salga decapitado en una miniatura. */
  focoX: number;
  focoY: number;
};

export type Video = {
  tipo: 'youtube' | 'vimeo' | 'archivo';
  url: string;
  titulo: string;
  /** .vtt — obligatorio si tipo === 'archivo'. */
  subtitulosUrl: string | null;
  duracionSeg: number | null;
};

export type Adjunto = {
  url: string;
  nombre: string;
  tipo: string;
  tamanoBytes: number;
  /** Confirmado por quien lo sube. Un PDF escaneado no se puede leer con
   *  lector de pantalla y es la forma más común de fallar una auditoría. */
  esAccesible: boolean;
};

// ── Guías ──────────────────────────────────────────────────────────────────

export type Categoria = Base & {
  titulo: string;
  descripcion: string;
  acento: Acento;
  orden: number;
};

export type Pregunta = Base & {
  categoriaId: string;
  slug: string;
  pregunta: string;
  /** HTML del editor limitado a seis botones (doc 04). */
  respuesta: string;
  video: Video | null;
  adjuntos: Adjunto[];
  /** IDs de perfil, no nombres sueltos: si alguien se va, todas las guías
   *  que lo mencionan se actualizan solas. */
  responsables: string[];
  orden: number;
};

// ── Noticias ───────────────────────────────────────────────────────────────

export type PlantillaId =
  | 'periodico'
  | 'blog'
  | 'notita'
  | 'corcho'
  | 'comunicado'
  | 'afiche'
  | 'pizarra'
  | 'urgente';

export const PLANTILLAS: { id: PlantillaId; nombre: string }[] = [
  { id: 'periodico', nombre: 'Periódico' },
  { id: 'blog', nombre: 'Artículo' },
  { id: 'notita', nombre: 'Notita' },
  { id: 'corcho', nombre: 'Tablón' },
  { id: 'comunicado', nombre: 'Comunicado Oficial' },
  { id: 'afiche', nombre: 'Afiche' },
  { id: 'pizarra', nombre: 'Pizarra' },
  { id: 'urgente', nombre: 'Urgente' },
];

export type Anuncio = Base & {
  slug: string;
  plantilla: PlantillaId;
  titulo: string;
  bajada: string | null;
  cuerpo: string;
  imagen: Imagen | null;
  etiquetas: string[];
  fechaEvento: string | null;
  /** Texto libre a propósito. Los selectores de hora en teléfono son
   *  horribles y las maestras escriben "durante el receso". */
  horaTexto: string | null;
  lugar: string | null;
  autorPerfilId: string | null;
  destacado: boolean;
  publicarEn: string;
  /** El campo anti-podredumbre. Sin esto el sitio se ve muerto en marzo. */
  expiraEn: string | null;
};

export type Aviso = {
  activo: boolean;
  mensaje: string;
  nivel: 'info' | 'urgente';
  enlace: string | null;
  actualizadoEn: string;
};

// ── Perfiles (ConsejeRed) ──────────────────────────────────────────────────

export type Credencial = {
  titulo: string;
  institucion: string;
  anio: number | null;
};

export type Contacto = {
  email: string | null;
  extension: string | null;
  /** Escrito como referencia física: "al lado de la biblioteca" es como
   *  un estudiante encuentra un salón, no "Salón 12". */
  oficina: string | null;
  horario: string | null;
};

export type Perfil = Base & {
  slug: string;
  nombre: string;
  puesto: string;
  escuela: string;
  foto: Imagen | null;
  acento: Acento;
  estadoDelDia: string | null;
  frase: string | null;
  bio: string;
  credenciales: Credencial[];
  trabajaEn: string[];
  /** IDs de perfil. El lector los vuelve mutuos — ver lib/contenido.ts. */
  trabajaCon: string[];
  contacto: Contacto;
  orden: number;
};

// ── La portada ─────────────────────────────────────────────────────────────

/**
 * El texto de la página de inicio.
 *
 * Estaba escrito a mano dentro de components/Inicio.tsx, así que cambiar una
 * coma de la portada era una tarea de programación. Ahora es contenido como
 * cualquier otro y se edita desde el panel.
 *
 * El ORDEN del array `secciones` es el orden en que salen las tres tarjetas.
 * Antes lo decidía `ORDEN_SECCIONES` en lib/rol.ts según el rol; ahora manda
 * lo que la consejera coloque, que es lo único que se puede reordenar desde
 * una pantalla sin volverse un rompecabezas. Lo que SÍ sigue cambiando por
 * rol es la descripción de cada tarjeta, que es donde la lente (doc 06 §1)
 * de verdad aporta: el mismo sitio, explicado con las palabras de quien mira.
 */
export type TextoPorRol = {
  estudiante: string;
  encargado: string;
  invitado: string;
};

export type TarjetaPortada = {
  clave: ClaveSeccion;
  titulo: string;
  descripcion: TextoPorRol;
  /** El texto del enlace del final: "Abrir el archivador". */
  verbo: string;
};

export type Portada = {
  cejilla: string;
  escuela: string;
  /** El titular va partido en tres para poder poner UNA palabra en cursiva. */
  tituloAntes: string;
  tituloAcento: string;
  tituloDespues: string;
  lede: string;
  /** La nota manuscrita que señala las tarjetas, al margen del titular. */
  nota: string;
  /**
   * El párrafo del pie. Vive aquí y no en un archivo aparte por una razón
   * práctica: el editor de la portada monta la página REAL para editarla
   * encima, y una sola pieza de contenido significa un solo botón de
   * publicar. Partirlo en dos documentos obligaría a guardar dos veces para
   * un cambio que la consejera vive como uno.
   */
  piePagina: string;
  secciones: TarjetaPortada[];
  recienteEtiqueta: string;
  sinNoticias: string;
  puertaAntes: string;
  puertaAcento: string;
  puertaDespues: string;
  puertaTexto: string;
  puertaBoton: string;
  /** Cuál de los dos bloques de abajo va primero. */
  ordenAbajo: 'noticias-puerta' | 'puerta-noticias';
};
