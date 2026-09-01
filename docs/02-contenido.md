# Content Model

Design rule for the whole app: **one schema, many skins.** A teacher fills in
the same handful of fields every time; the visual variety comes from which
template renders those fields. That's what makes the admin simple *and* the
site look rich.

All models carry these shared fields:

```ts
type Base = {
  id: string;                    // uuid
  estado: 'borrador' | 'publicado';
  creadoEn: string;              // ISO
  actualizadoEn: string;
  actualizadoPor: string;        // staff display name
  eliminadoEn: string | null;    // soft delete -> Papelera, 30 days
};
```

`locale` is deliberately included even though only `'es'` will ever be filled at
launch. Adding it now is free; retrofitting it later means touching every query.

---

## 1. Guías y Preguntas

```ts
type Categoria = Base & {
  titulo: string;              // ES: "Académico"
  descripcion: string;         // one line, shown under the title
  color: TokenColor;           // from the palette, doc 03
  icono: string;               // icon name
  orden: number;
};

type Pregunta = Base & {
  categoriaId: string;
  slug: string;                // /guias/como-pedir-una-cita
  pregunta: string;            // the accordion header
  respuesta: RichText;         // bold / italic / list / link only
  video: Video | null;
  adjuntos: Adjunto[];         // PDFs, forms
  responsables: string[];      // perfil ids -> the "( )" names you described
  orden: number;
  vistas: number;              // anonymous counter, no PII
  util: { si: number; no: number };  // "¿Te sirvió?" — aggregate only
};

type Video = {
  tipo: 'youtube' | 'vimeo' | 'archivo';
  url: string;
  titulo: string;
  subtitulosUrl: string | null;  // .vtt — REQUIRED for self-hosted (doc 07)
  duracionSeg: number | null;
};

type Adjunto = {
  url: string;
  nombre: string;              // ES: "Permiso de excursión.pdf"
  tipo: string;                // mime
  tamanoBytes: number;         // so the UI can warn "2.4 MB"
  esAccesible: boolean;        // staff-confirmed; drives a warning badge
};
```

Note `responsables` is an array of profile IDs, not free-text names. That means
when someone leaves and their profile is updated, every guide that references
them updates automatically. Free-text names rot immediately.

---

## 2. Noticias / Anuncios

One schema. Eight templates read from it. Fields a template doesn't use are
simply not rendered.

```ts
type Anuncio = Base & {
  slug: string;
  plantilla: PlantillaId;      // see doc 03 section 6 — changeable after publish

  // The teacher fills in these and nothing else:
  titulo: string;              // ES: "Título"
  bajada: string | null;       // ES: "Resumen en una línea"
  cuerpo: RichText;            // ES: "El mensaje"
  imagen: Imagen | null;
  etiquetas: string[];         // ES: "Becas", "Eventos", "Avisos"

  // Event fields — the form only shows these if "Es un evento" is checked:
  fechaEvento: string | null;
  horaTexto: string | null;    // ES: "3:00 pm" — free text, not a time picker.
                               // Teachers write "después del almuerzo" and
                               // that should be allowed.
  lugar: string | null;

  autorPerfilId: string | null;
  destacado: boolean;          // pinned to the top of /noticias
  publicarEn: string;          // scheduling
  expiraEn: string | null;     // auto-hide. The anti-rot field.
};

type Imagen = {
  url: string;
  alt: string;                 // REQUIRED to publish. See doc 04 section 6.
  ancho: number;
  alto: number;
  focoX: number; focoY: number; // 0..1, so crops never decapitate anyone
};
```

**`expiraEn` is the most important field in this file.** Nobody at a school has
the job of deleting last month's news. If it can expire itself, the site stays
alive without anyone maintaining it. Default it to 60 days after `publicarEn`
and let them override.

**`horaTexto` as free text, not a time picker,** is a small decision with a big
payoff. Time pickers on phones are miserable and teachers genuinely do write
"durante el receso".

### The emergency banner (separate, singular)

```ts
type Aviso = {
  activo: boolean;
  mensaje: string;             // one line, plain text
  nivel: 'info' | 'urgente';
  enlace: string | null;
  actualizadoEn: string;
};
```

One row, ever. A single toggle in the admin. Renders above everything on every
page. For a Puerto Rico school this is the field that matters in October.

---

## 3. Perfiles (ConsejeRed)

```ts
type Perfil = Base & {
  slug: string;                // /consejered/maria-rivera
  nombre: string;
  puesto: string;              // ES: "Consejera Escolar"
  escuela: string;

  foto: Imagen | null;         // null -> initials tile in colorTema
  colorTema: TokenColor;       // their MySpace-y personal accent

  estadoDelDia: string | null; // ES: "Hoy: aceptando citas" — the mood line
  frase: string | null;        // a favorite quote

  bio: RichText;

  credenciales: {              // structured, not free text
    titulo: string;            // ES: "M.A. en Consejería"
    institucion: string;
    anio: number | null;
  }[];

  trabajaEn: string[];         // ES: "Trabaja en" — programs / projects
  trabajaCon: string[];        // perfil ids — auto-mutual, see below

  contacto: {
    email: string | null;
    extension: string | null;
    oficina: string | null;    // ES: "Salón 12, al lado de la biblioteca"
    horario: string | null;    // ES: "Lunes a jueves, 8:00–11:00 am"
  };
  orden: number;
};
```

**`trabajaCon` should be enforced mutual.** When Sra. Rivera adds Sr. Colón,
Sr. Colón gets Sra. Rivera. This is not a technical nicety — a one-directional
staff graph means somebody notices they weren't listed back, and that is a real
feeling in a real workplace. Make it symmetric and the problem never exists.

**`oficina` written as a landmark** ("al lado de la biblioteca") rather than a
room number is how students actually navigate a school. Prompt for it that way
in the admin.

---

## 4. Version history

```ts
type Version = {
  id: string;
  entidad: 'pregunta' | 'anuncio' | 'perfil' | 'categoria';
  entidadId: string;
  datos: unknown;              // full snapshot
  guardadoEn: string;
  guardadoPor: string;
  nota: string | null;         // ES: "Corregí la fecha"
};
```

Keep 20 per item, drop the oldest. Storage is negligible; the confidence it
buys a nervous first-time editor is not.

---

## 5. Seed data

Ship `/seed/*.json` with:
- 3 categories, 4 Lorem Ipsum questions each, 2 with a video, 1 with a PDF
- 6 announcements, one per template, spread across 4 months so the archive has
  something to show
- 4 profiles so `trabajaCon` has a real graph to render
- 1 inactive emergency banner

Build every public page against this seed **before** any database exists. It
lets you finish and review the entire front end without touching auth, and it
doubles as your demo data when you show the counselor.
