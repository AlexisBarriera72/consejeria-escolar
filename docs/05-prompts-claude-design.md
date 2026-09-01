# Claude Design Prompts

Copy-paste ready. Every prompt repeats the palette because Claude Design starts
each canvas cold. The avatar is excluded per your instruction — prompts 2 and 3
leave a labeled placeholder box for it.

**Shared preamble — paste at the top of every prompt below:**

> Palette (use exactly these hex values):
> blue `#4378c6` (brand fill), dark blue `#2f5ea8` (only blue that carries white
> text), deep navy `#1e3f73`, periwinkle `#899dd9`, pale blue `#dbe4f6`,
> turquoise `#00bdc9`, deep teal `#0a7d85`, mint `#75d2c1`, pink `#f83f98`,
> deep pink `#c4166b`, coral `#ff6e53`, peach `#ff987f`, orange `#fc7f47`,
> amber `#ffc226`, yellow `#ffed76`, sage `#bcd298`.
> Ink `#16202e`, warm paper background `#fbfaf7`.
>
> Hard rules: **only `#2f5ea8` and `#c4166b` may have white text on them.**
> Every other color is a background that takes `#16202e` ink text. Yellow and
> amber are never text colors. Headings: Fraunces. Body: Source Sans 3.
> All copy in Spanish, body text as Lorem Ipsum.
> Concept: everything should feel like a friendly school counselor's office —
> clipboards, folder tabs, cork boards, pinned paper, a photo wall.

---

## 1. Entry gate — "la hoja de firmas"

> Design a welcome modal for a Spanish-language school counseling website,
> shown once when a student or parent first arrives.
>
> Make it look like a **clipboard hanging by an office door**: a warm cream
> ruled sheet of paper clipped under a metal clip at the top, sitting on a
> softly blurred blue office background. Slight tilt, maybe 1 degree. Soft
> realistic shadow under the clip.
>
> Content on the sheet — **no input fields at all**, just three choices:
> - Heading: "¿Quién nos visita hoy?"
> - Subheading, small, grey: "Solo para saber cuánta gente nos visita. No
>   guardamos ningún dato personal."
> - Two large side-by-side buttons: "Soy estudiante" and
>   "Soy madre, padre o encargado"
> - A smaller, quieter third button below both: "Continuar como invitado"
>
> The two role buttons are the visual heroes — large, ~64px tall, rounded 14px.
> Student button uses `#2f5ea8` with white text; parent button uses white with
> a 2px `#2f5ea8` border and `#2f5ea8` text. The guest button is plain text
> with an underline, clearly a third-tier option but not hidden. Show a visible
> keyboard focus ring on one button.
>
> Since there are no fields, let the ruled sign-in-sheet lines still show
> faintly behind the buttons — the clipboard metaphor survives without the form.
>
> Give me desktop (560px wide modal) and mobile (full-width bottom sheet)
> artboards.

---

## 2. Homepage — desktop

> Design the homepage of a Spanish-language school counseling website for
> middle and high school students and their parents. Playful but genuinely
> professional — a school district will approve this.
>
> Top to bottom:
> 1. Slim header bar in `#4378c6`. Left: small school crest placeholder.
>    Right: a pill chip reading "Estudiante" with a small chevron.
> 2. Centered title block: "Consejería Escolar" large in Fraunces `#1e3f73`;
>    below it "Sra. [Nombre Apellido]" medium; below that, smaller and in grey,
>    "Escuela Superior [Nombre]".
> 3. **A large empty rounded rectangle, ~320x420px, centered, labeled
>    "AVATAR — placeholder".** Do not draw a character. To its upper right,
>    draw an empty speech bubble with a tail pointing down-left toward the
>    placeholder, containing two lines of Lorem Ipsum.
> 4. Below: three large cards in a row, each ~300px wide:
>    - "Preguntas y Guías" — turquoise accent `#00bdc9`
>    - "Noticias" — pink accent `#f83f98`
>    - "Profesionales" — orange accent `#fc7f47`
>    Each card: a colored top band, a bold Spanish title in ink, and beneath the
>    card a small preview strip — the guides card shows 3 short question titles
>    as folder tabs, the news card shows 2 headlines with dates, the
>    professionals card shows 3 small circular photo placeholders.
> 5. Footer strip in `#dbe4f6` with placeholder district text.
>
> Show the middle card in a hovered state: lifted 4px, stronger shadow, its
> accent band thickened.
>
> Background `#fbfaf7`. Generous whitespace. This must not look like a
> template — give the cards some real character (paper texture, a subtle folder
> tab shoulder, a slight rotation on the preview strip).

---

## 3. Homepage — mobile

> Same site as the previous prompt, phone width 390px.
>
> - Header bar `#4378c6`, 52px.
> - Title block, centered, smaller.
> - **Empty avatar placeholder box ~180x220px, centered, labeled "AVATAR".**
>   No speech bubble attached to it here.
> - Three stacked full-width cards, each ~130px tall, 16px gutters.
>   **Each card has its own small speech bubble anchored to its top-right
>   corner**, overlapping the card edge slightly, containing one short line of
>   Lorem Ipsum. The bubbles are permanently visible, not tooltips.
> - Under each card, one collapsed preview line.
>
> Show two artboards: top of page, and scrolled down so the avatar is gone and
> only the cards are visible.

---

## 4. Preguntas y Guías

> Design a FAQ / guides page for a Spanish school counseling site, styled as a
> **filing cabinet**.
>
> - Page heading "Preguntas y Guías" in Fraunces `#1e3f73`, with a search field
>   to its right, placeholder "Buscar una pregunta...".
> - Three category sections stacked. Each has a **folder tab shoulder** at its
>   top-left with the category name — tabs in `#00bdc9`, `#75d2c1`, `#bcd298`
>   respectively, ink text.
> - Inside each category, four accordion rows. Show the first row of the first
>   category **expanded**, containing:
>   - a paragraph of Lorem Ipsum
>   - a 16:9 video player with a poster image placeholder, a large centered
>     round play button, and a small "CC" captions badge in the corner
>   - below the video, a small pill row labeled "Pregúntale a:" with two person
>     chips (tiny circular photo + name), each chip using a different accent.
> - Collapsed rows show the question and a small plus icon.
> - At the bottom of the expanded row: two small ghost buttons, "Imprimir esta
>   guía" and "¿Te sirvió esta guía? 👍 👎".
>
> Include a visible keyboard focus ring on one collapsed row.
> Desktop and mobile artboards.

---

## 5. Noticias front page

> Design the news landing page for a Spanish school counseling website.
>
> - A featured announcement at top, rendered as an **old-time newspaper**: a
>   Playfair Display masthead reading "El Boletín Escolar", a hairline rule
>   under it with a dateline "Martes, 1 de septiembre de 2026 · Edición 12",
>   a large headline, a subhead, and two columns of Lorem Ipsum with a drop cap.
>   Very faint newsprint paper texture. Ink on `#fbfaf7`.
> - Below, a heading "Anuncios anteriores" and a 2-column grid of 6 smaller
>   announcement cards. Each card is visually a *miniature* of a different
>   template: one lined-notebook note with tape corners, one cork board with a
>   pushpin, one formal memo, one bold event poster in `#c4166b`, one green
>   chalkboard, one clean blog card. Each shows a date and a small author chip.
> - A right-hand sidebar box titled "Profesionales" with three person chips
>   (circular photo + name + role), each in a different accent color.
> - At the very top of the page, above everything, show a dismissed/inactive
>   state emergency bar in `#ffc226` with ink text, one line of Lorem Ipsum.
>
> Mobile artboard: sidebar collapses below the grid, grid goes single column.

---

## 6. The eight announcement templates

> Design eight variations of the SAME school announcement, on one canvas as
> eight separate artboards, each 800x1000. Every artboard shows identical
> content — headline "Lorem Ipsum Dolor Sit Amet", a one-line subhead, three
> paragraphs of Lorem Ipsum, a date "12 de septiembre", a place, and a small
> author chip — rendered in a completely different style:
>
> 1. **Periódico** — Playfair masthead, hairline rules, two columns, drop cap,
>    faint newsprint texture, ink only.
> 2. **Artículo** — clean modern blog: big top image placeholder, single
>    column, generous leading, `#2f5ea8` accents.
> 3. **Notita** — ruled notebook paper, Caveat handwriting for the headline
>    only (body stays legible sans-serif), washi tape at two corners, rotated
>    1.5 degrees, warm shadow.
> 4. **Tablón** — cork texture background, white paper sheet pinned with a red
>    pushpin, soft shadow, slight rotation.
> 5. **Comunicado Oficial** — formal district memo. Circular seal placeholder
>    top-left, a PARA / DE / FECHA / ASUNTO block with rules, no color at all
>    except `#1e3f73`. Serious and plain.
> 6. **Afiche** — event poster. Enormous headline, a giant date badge circle in
>    `#c4166b` with white text, one bold `#fc7f47` color field, minimal body.
> 7. **Pizarra** — dark green chalkboard, chalk-style headline, faint eraser
>    smudges, a wooden frame edge. Body text must stay high contrast white.
> 8. **Urgente** — a thick `#c4166b` bar across the top with white text
>    "AVISO IMPORTANTE", then tight high-contrast ink text on white. No
>    decoration whatsoever.
>
> Critical: in all eight, the body text must remain real, high-contrast,
> readable text. Decoration lives behind the text, never inside it.

---

## 7. ConsejeRed profile page

> Design a staff profile page for a Spanish school website. The tone is a
> knowing, tasteful nod to 2005-era MySpace profiles — warm and personal, but
> it must still pass a school district's approval. Nostalgic, not chaotic.
>
> Two-column desktop layout, ~1100px:
>
> **Left column (narrow):**
> - Large square photo placeholder with a thick border in that person's accent
>   color (`#fc7f47` here) and a slight tilt.
> - Under it, a status line in a small tinted box: "Hoy: Lorem ipsum dolor" —
>   this is the MySpace mood line, keep it playful.
> - A contact block: "Salón 12, al lado de la biblioteca" / "Lunes a jueves,
>   8:00–11:00 am" / an email link.
>
> **Right column (wide):**
> - Name in Fraunces, large. Role beneath it, smaller, grey. School under that.
> - A pull-quote in `#bcd298` tint with a Lorem Ipsum favorite quote.
> - Section "Sobre mí" — two Lorem paragraphs.
> - Section "Credenciales" — three rows, each with a degree, an institution,
>   and a year, aligned in a clean structured list, not bullets.
> - Section "Trabaja en" — five rounded tag pills in mixed accent colors.
> - Section "Trabaja con" — the MySpace "Top 8" reimagined: six person cards in
>   a 3x2 grid, each a circular photo placeholder + name + tiny role, each card
>   tinted with that person's own accent color. Make these look clickable.
>
> Also design the browse page as a second artboard: a heading "El Pasillo", and
> a grid of 8 staff cards that reads like a hallway photo wall — cards slightly
> rotated at different angles, varied accent borders, hung with a subtle pin
> or tape detail. One card shows an initials-only fallback tile instead of a
> photo.

---

## 8. Admin — split-screen editor

> Design an admin content editor for Spanish-speaking schoolteachers who are
> not comfortable with technology. Calm, spacious, obvious. Desktop 1440px.
>
> - Top: a full-width reassurance strip in `#dbe4f6` with ink text:
>   "Estás en el panel de edición — los estudiantes no ven esta pantalla."
>   Left of it "Hola, Sra. Rivera", right "Cerrar sesión".
> - Split 45/55.
> - **Left, the form:** large labels, tall inputs, lots of breathing room.
>   Fields: "Título", "Resumen", "El mensaje" (with a minimal 6-button rich
>   text toolbar: bold, italic, bullets, numbers, link, undo — nothing else),
>   "Foto" with a dashed drop zone reading "Arrastra una foto aquí", a required
>   field beneath it labeled "¿Qué se ve en la foto?", a checkbox "Es un
>   evento", and a date field "Quitar de la página el:".
> - Between the form and the footer, an **accessibility traffic light panel**:
>   a small card with a green, a yellow and a red dot, showing one yellow item
>   — "El título es muy largo; se va a cortar en el celular."
> - **Right, the live preview:** the announcement rendered in the "periódico"
>   style inside a subtle browser-frame outline. Above it, a small segmented
>   toggle with a phone icon and a desktop icon (phone selected), and a caption
>   "Así lo verán los estudiantes y padres."
> - Sticky bottom bar: grey text "Guardado hace un momento" on the left; on the
>   right an outline "Guardar borrador" button and one solid `#2f5ea8`
>   "Publicar" button. Publicar is the only filled button on the screen.
>
> Everything is bigger than a typical CMS — target 17px body, 48px inputs.

---

## 9. Admin — template picker and panel home

> Two artboards for the same Spanish school admin tool.
>
> **Artboard A — Panel home:** heading "Panel de edición", then three large
> cards side by side: "Preguntas y Guías / 12 publicadas / 2 en borrador",
> "Noticias / 6 publicadas / 1 en borrador / 1 vence pronto" (this line in
> amber with a small clock icon), "Profesionales / 4 perfiles". Each card has
> one "Administrar" button. Below the cards, a wide low-key panel: "Aviso de
> emergencia" with a large off-state toggle and grey helper text.
>
> **Artboard B — Template picker:** a horizontal strip labeled "Escoge cómo se
> va a ver:" with eight small preview thumbnails (roughly 150x190) in a row.
> Each thumbnail is a tiny faithful rendering of one of the eight announcement
> templates from prompt 6, showing the SAME headline text in each. The third
> one is selected — a 3px `#2f5ea8` ring and a small check badge. Labels
> beneath each: Periódico, Artículo, Notita, Tablón, Oficial, Afiche, Pizarra,
> Urgente.

---

## 10. Availability calendar

> Design a read-only availability calendar for a Spanish school counseling
> website. It shows which days the counselor is free. **It is not a booking
> system** — there is no button to request or reserve anything.
>
> - Heading "¿Cuándo está disponible?" with a month name and prev/next arrows.
> - A month grid, Monday to Friday only (no weekend columns — a school
>   counselor doesn't work weekends and the empty columns waste phone width).
> - Each day cell shows the date number and one status dot:
>   `#75d2c1` filled = libre, hollow grey ring = ocupada, faint grey = no
>   lectivo. **Never show event titles or any text describing an appointment.**
> - A legend beneath: "● Libre  ○ Ocupada  · No lectivo".
> - Below the grid, a card repeating her office hours as plain text: "Salón 12,
>   al lado de la biblioteca · Lunes a jueves, 8:00–11:00 am" with a line
>   "Confirma con ella antes de venir."
> - Design a second state artboard: the calendar failed to load. It shows only
>   the office-hours card plus a quiet grey note "No pudimos cargar el
>   calendario en este momento." No error icon, no red, no alarm.
>
> Critical: status must not be conveyed by color alone — the filled vs. hollow
> dot shape carries the same information for colorblind users. Mobile artboard
> too, where the grid must stay readable at 390px.

---

## 11. Modo Calma — before / after

> Design a single artboard showing the same school-website page twice, side by
> side, labeled "Normal" and "Modo Calma".
>
> **Left (Normal):** the standard bright palette — a `#f83f98` section header,
> `#00bdc9` and `#fc7f47` accent cards, tight 1.5 line spacing, a decorative
> illustration.
>
> **Right (Modo Calma):** identical layout and identical content, but every
> accent desaturated to roughly 25% of its chroma toward grey, the illustration
> reduced to a faint outline, line spacing opened to 1.9, body text one weight
> heavier, and all decorative borders removed. Still warm and designed — not
> greyscale, not "broken". It should look like a deliberate quiet mode, the way
> a good reading app looks.
>
> Between them, show the toggle control itself: a small pill in the header with
> a leaf icon and the label "Modo calma", shown in both off and on states.

---

## 12. Brand sheet + app icon

> Design a one-page brand sheet for "Consejería Escolar", a Spanish-language
> school counseling website.
>
> Include: the full 16-color palette as labeled swatches with hex codes, each
> swatch annotated with whether it takes white or dark text; a type specimen
> showing Fraunces at 3 sizes and Source Sans 3 at 3 sizes, with the Spanish
> pangram "¿Cómo estás, Señor Núñez? ¡Qué bien! ÁÉÍÓÚ" rendered in each; a
> button inventory (primary, secondary, ghost, disabled, focused); an
> accessibility note block; and 6 app-icon concepts in a row — a rounded square
> icon combining a speech bubble with a school motif (a folder tab, an open
> door, a lighthouse, a coquí, an owl, a pin), in `#4378c6` and `#ffc226`.
> Clean, calm, editorial layout.
