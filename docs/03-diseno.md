# Design System

## 1. The organizing idea: "La Oficina"

Everything on this site should feel like walking into the counselor's office.
That metaphor does real work — it makes the site cohesive instead of "three
random pages", it gives designers concrete objects to draw, and it explains
itself to a 12-year-old without a tutorial.

| Site element | Physical thing it is |
|---|---|
| Entry gate | The **sign-in clipboard** hanging by the door |
| Homepage avatar | The person who greets you |
| Preguntas y Guías | The **filing cabinet** — labeled folder tabs, pull one open |
| Noticias | The **bulletin board** — pinned paper, layered, dated |
| ConsejeRed profiles | The **staff photo wall** in the hallway |
| Admin panel | The **desk drawer** — same objects, seen from behind the desk |

This is why the entry modal should look like a clipboard with a ruled sign-in
sheet rather than a generic centered card, and why the guides accordion should
have folder-tab shoulders rather than chevrons. Small moves, huge coherence
gain, no extra engineering.

---

## 2. Palette — with measured contrast

Blue is the anchor, per your direction. The rest are accents used in strictly
limited roles.

### Tokens

```css
:root {
  /* Blue — the spine of the site */
  --azul-900: #1e3f73;
  --azul-700: #2f5ea8;   /* text-safe blue */
  --azul-500: #4378c6;   /* THE brand blue — fills, headers, the avatar's world */
  --azul-300: #899dd9;
  --azul-100: #dbe4f6;

  /* Accents — backgrounds and edges only */
  --turquesa-700: #0a7d85;
  --turquesa-500: #00bdc9;
  --menta:        #75d2c1;
  --rosa-700:     #c4166b;
  --rosa-500:     #f83f98;
  --magenta:      #e51a68;
  --coral:        #ff6e53;
  --durazno:      #ff987f;
  --naranja:      #fc7f47;
  --ambar:        #ffc226;
  --amarillo:     #ffed76;
  --salvia:       #bcd298;

  /* Neutrals */
  --tinta:  #16202e;   /* all body text */
  --papel:  #fbfaf7;   /* page background — warm white, not #fff */
  --gris:   #5b6676;
}
```

### The measurements (WCAG 2.1, computed not guessed)

| Color | White text on it | `--tinta` text on it | On white background |
|---|---|---|---|
| `--azul-500` #4378c6 | **4.43** ✗ body / ✓ large | — | **4.43** ✗ body / ✓ large |
| `--azul-700` #2f5ea8 | **6.39** ✓ | — | **6.39** ✓ |
| `--turquesa-500` #00bdc9 | 2.30 ✗ | **7.12** ✓ | 2.30 ✗ |
| `--turquesa-700` #0a7d85 | **4.90** ✓ | — | 4.90 ✓ |
| `--magenta` #e51a68 | **4.49** ✗ (misses by 0.01) | — | 4.49 ✗ |
| `--rosa-700` #c4166b | **5.72** ✓ | — | 5.72 ✓ |
| `--coral` #ff6e53 | 2.76 ✗ | **5.94** ✓ | — |
| `--naranja` #fc7f47 | 2.54 ✗ | **6.46** ✓ | — |
| `--azul-300` #899dd9 | 2.66 ✗ | **6.16** ✓ | — |
| `--amarillo` #ffed76 | 1.19 ✗✗ | **13.77** ✓ | 1.19 — invisible |

### Two rules that fall out of the table

> **Rule 1 — Only `--azul-700` and `--rosa-700` may carry white text.**
> Every other color in this palette is a *background that takes dark ink*.

> **Rule 2 — `--azul-500` is a fill, never a text color, and never a button
> background with white text at body size.** It's 0.07 short. Use `--azul-700`
> for the button and keep `--azul-500` for large headings, panels, and the
> avatar's surroundings.

These are not pedantry. A public school district site is a Title II public
entity held to WCAG 2.1 AA (doc 07), and low-contrast bright color is the
single most common failure. Getting it right costs nothing if you decide it
now, and costs a redesign if you decide it after the counselor has fallen in
love with the mockups.

### Role assignment

- **Blue** — structure. Header, nav, the avatar's environment, primary buttons.
- **Turquesa / menta** — Preguntas y Guías.
- **Rosa / magenta** — Noticias.
- **Naranja / coral / durazno** — ConsejeRed profiles.
- **Amarillo / ámbar** — highlights, "nuevo" badges, the emergency banner's
  non-urgent state. Never text.
- **Salvia** — quiet surfaces, quotes, empty states.

Giving each of the three sections its own accent means a student always knows
which room they're standing in — and it makes the homepage's three buttons
legible at a glance even before reading them.

---

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Headings | **Fraunces** (variable) | Its optical-size and "wonk" axes let the same family read playful on the homepage and serious on a district notice. One font, two personalities. |
| Body | **Source Sans 3** | Full Latin Extended, excellent at small sizes on cheap Android screens. |
| Newspaper masthead | **Playfair Display** | Only inside the periódico template. |
| Handwriting | **Caveat** | Only inside the "notita" template. |
| Chalk | **Shantell Sans** | Only inside the pizarra template. |

> **Gotcha worth its own line: verify Spanish diacritics in every decorative
> font before committing to it.** A depressing number of handwriting and display
> fonts on Google Fonts ship without `ñ`, `¿`, `¡`, or accented capitals. Type
> `¿Cómo estás, Señor Núñez? ¡ÁÉÍÓÚ!` in every font you pick. If anything
> renders as a box or falls back mid-word, the font is disqualified — no
> exceptions, no matter how good it looks in English.

Base size 17px, line-height 1.6. Student-facing copy should target roughly a
6th-grade reading level in Spanish; parent-facing copy can go a bit higher.

---

## 4. Motion

- Avatar arm swap: 180ms ease-out. Speech bubble: fade + 4px rise, 140ms.
- Bubble text "types in" at ~25ms/char, capped at 600ms total. Skip on repeat
  hovers of the same button — cute once, irritating the fourth time.
- Accordion open: height transition 200ms.
- **Everything above is wrapped in `@media (prefers-reduced-motion: reduce)`
  and becomes instant.** Not optional. Motion sensitivity is a real
  accessibility need and it's a one-line media query.

---

## 5. Responsive behavior

| | Phone (< 768) | Desktop (>= 1024) |
|---|---|---|
| Avatar | Fixed at top, scrolls away, never points | Sticky centre, points at hovered button |
| Bubbles | Static caption on each button, always visible | One bubble, follows hover/focus |
| Buttons | Stacked, full width, ~120px tall | Three across |
| Previews | Collapsed to 1 item | 2–3 items |

The mobile treatment you specified is correct and worth stating why: **hover
does not exist on touch.** A tooltip that requires hovering is invisible to
every phone user. Making the bubbles permanent captions on mobile isn't a
downgrade — it's the only version that works.

Design mobile first. Assume most students hit this on a phone, on cell data,
in a hallway, with 30 seconds.

---

## 6. The eight announcement templates

Same data (doc 02 section 2), eight skins. Ship six; keep two in reserve.

| # | ID | ES name | Look | Best for |
|---|---|---|---|---|
| 1 | `periodico` | Periódico | Masthead, serif, 2 columns, drop cap, dateline, faint newsprint texture | The default. What the client asked for. |
| 2 | `blog` | Artículo | Clean modern, big image, generous line spacing | Long explanations |
| 3 | `notita` | Notita | Ruled notebook paper, handwriting, tape at the corners, slight rotation | Warm, informal, short |
| 4 | `corcho` | Tablón | Cork texture, white paper, a pushpin, soft drop shadow | Reminders, lists |
| 5 | `comunicado` | Comunicado Oficial | Formal memo, seal, PARA/DE/FECHA/ASUNTO block, no color | Serious district notices |
| 6 | `afiche` | Afiche | Poster: huge type, giant date badge, one bold color field | Events |
| 7 | `pizarra` | Pizarra | Chalkboard green, chalk lettering, faint eraser smudges | Daily/weekly notes |
| 8 | `urgente` | Urgente | Red bar, tight, high contrast, no decoration | Closures, emergencies |

**Accessibility constraint that applies to all eight:** every template renders
**real, selectable text** in a real DOM element. Never an image of text, never
a handwriting font at body size, never chalk-white on a texture below 4.5:1.
The decoration lives in the background layer; the text layer stays boring and
readable. Each template also gets a `@media print` rule (doc 06 section 4).

Template 8 doubles as the emergency banner's styling — build it once.

---

## 7. Component inventory

Public: `PortalEntrada`, `Encabezado`, `AvatarGuia`, `BurbujaDialogo`,
`BotonGrande`, `TarjetaPrevia`, `PestanaCategoria`, `AcordeonPregunta`,
`ReproductorVideo`, `ChipPersona`, `PlantillaAnuncio` (x8), `TarjetaAnuncio`,
`BannerAviso`, `TarjetaPerfil`, `BurbujaTrabajaCon`, `EstadoVacio`,
`ControlesAccesibilidad`, `PiePagina`.

Admin: `PantallaAcceso`, `ListaContenido`, `EditorTexto`, `SelectorPlantilla`,
`PanelVistaPrevia`, `SemaforoAccesibilidad`, `SubidorImagen`,
`HistorialVersiones`, `BarraGuardado`, `DialogoConfirmar`.

Name components in Spanish. The whole product is Spanish; mixing
`AnnouncementCard` and `TarjetaAnuncio` in one repo gets confusing fast, and
whoever maintains this after you will be a Spanish speaker.
