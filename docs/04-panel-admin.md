# The `/edit` Panel

Design brief in one sentence: **a teacher who has never used a CMS should be
able to publish an announcement in under three minutes without asking anyone
for help, and should never be able to break the public site.**

Everything below serves that sentence.

---

## 1. Getting in

Two doors, one lock:
- Type `/edit` — the shortcut you wanted, keep it.
- A small "Personal" link in the footer — for the teacher who forgot the URL.
  This will happen. It is not a security downgrade because the URL was never
  the security (doc 01 section 3).

Login screen: one email field, one button — "Enviar enlace de acceso". They get
an email, click it, they're in. No password to remember, forget, write on a
sticky note, or share.

Once in: **"Hola, Sra. Rivera"** top-left, **"Cerrar sesión"** top-right, and a
persistent coloured strip across the top reading **"Estás en el panel de
edición — los estudiantes no ven esta pantalla."** Say it out loud, on every
screen. It is the single most anxiety-reducing element in the entire admin.

---

## 2. Panel home

Three big cards mirroring the public site, so the mental model transfers with
zero learning:

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Preguntas y     │ │    Noticias      │ │  Profesionales   │
│     Guías        │ │                  │ │                  │
│  12 publicadas   │ │  6 publicadas    │ │  4 perfiles      │
│  2 en borrador   │ │  1 en borrador   │ │                  │
│                  │ │  1 vence pronto  │ │                  │
│  [ Administrar ] │ │  [ Administrar ] │ │  [ Administrar ] │
└──────────────────┘ └──────────────────┘ └──────────────────┘

  [ ! ]  Aviso de emergencia: DESACTIVADO        [ Activar ]
```

"1 vence pronto" is the site nudging staff to keep it alive. Nobody has that
job, so the software has to.

---

## 3. The editor — split screen

Your preferred design, and the right one:

```
┌───────────────────────────┬───────────────────────────────┐
│  FORMULARIO               │  VISTA PREVIA        [📱][💻] │
│                           │                               │
│  Título                   │   ┌───────────────────────┐   │
│  [__________________]     │   │  (rendered by the     │   │
│                           │   │   SAME components the │   │
│  Resumen                  │   │   public site uses)   │   │
│  [__________________]     │   │                       │   │
│                           │   └───────────────────────┘   │
│  El mensaje               │                               │
│  [B I • 🔗]               │   Así lo verán los           │
│  [__________________]     │   estudiantes y padres.       │
│                           │                               │
│  Semáforo:  🟢 🟡 🔴      │                               │
├───────────────────────────┴───────────────────────────────┤
│ Guardado hace un momento   [Descartar] [Guardar borrador] │
│                                            [ ▸ PUBLICAR ] │
└───────────────────────────────────────────────────────────┘
```

Key decisions:

- **Preview updates live, debounced ~300ms.** Not a "refresh preview" button.
- **Preview uses the real components.** If the preview can't lie, teachers stop
  double-checking on the live site, which is where accidents happen.
- **`[📱][💻]` toggle.** Teachers care enormously about how it looks on a phone,
  and most of their audience is on one. Showing the phone frame first is
  defensible.
- **"Publicar" is the only button with the brand blue fill.** Everything else is
  an outline button. One obvious action per screen.
- **Publishing confirms once:** *"Esto aparecerá en la página de Noticias
  ahora mismo. ¿Publicar?"* — plain consequence, no jargon.

---

## 4. The rich text editor — six buttons, no more

**Bold · Italic · Bullet list · Numbered list · Link · Undo.**

That's the whole toolbar. No font picker, no color picker, no font size, no
alignment, no tables.

This is a hard-won principle, not laziness: give non-technical users a color
and size picker and within a month you have 14pt purple Comic Sans on a public
government site, and every announcement looks different in a bad way. Removing
the choice is what guarantees the site keeps looking professional after you
stop maintaining it. Say this to the client as *"así siempre se ve bien, sin
que tengan que preocuparse por el diseño."*

Paste handling: **strip all formatting on paste.** Teachers paste from Word,
and Word brings a mountain of inline HTML that will wreck the layout.

---

## 5. The template picker (Noticias)

A row of eight small live thumbnails — each one rendering *this announcement's
actual title*, not lorem. Click to switch. The preview re-renders instantly.
No warning dialog, nothing lost, fully reversible.

```
 Escoge cómo se va a ver:
 ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
 │📰  │ │📄  │ │📝  │ │📌  │ │🏛  │ │🎪  │
 └────┘ └────┘ └────┘ └────┘ └────┘ └────┘
 Periódico Artículo Notita Tablón Oficial Afiche
```

Being able to try all eight in ten seconds, risk-free, is the moment the tool
stops feeling like work and starts feeling fun. Protect that moment — don't put
a confirmation dialog in front of it.

---

## 6. Semáforo de Accesibilidad

A small traffic light in the editor that checks the announcement as it's
written and explains problems in plain Spanish:

| Check | Red message |
|---|---|
| Image has no alt text | "Falta describir la foto. ¿Qué se ve en ella?" |
| Title over ~70 chars | "El título es muy largo; se va a cortar en el celular." |
| Link text is "aquí" / "click" | "Cambia 'aquí' por algo que diga a dónde lleva." |
| ALL CAPS heading | "Los lectores de pantalla deletrean las mayúsculas." |
| PDF attached, not marked accessible | "¿Ese PDF se puede leer con lector de pantalla?" |
| Video with no captions marked | "¿Este video tiene subtítulos?" |

Two reasons this is worth building. First, it's how the site *stays* compliant
after you leave — compliance you enforce at authoring time doesn't decay.
Second, it quietly teaches the staff accessibility, one announcement at a time,
which no training session ever accomplishes.

Never ask for "alt text". Ask **"¿Qué se ve en la foto?"** and put their answer
in the `alt` attribute. Same result, and people can actually answer it.

Red blocks publishing. Yellow warns and lets them through.

---

## 7. Images

Teachers will upload 8 MB photos straight from a phone. If you let those
through, the site gets slow and it will be blamed on the site, not the photo.

Pipeline, entirely in the browser before upload:
1. Read the file, respect EXIF rotation (otherwise portrait photos land sideways).
2. Resize longest edge to 1600px, encode WebP at ~0.82 quality.
3. Show "Lista — 380 KB" so they see it worked.
4. Offer a **focal point picker**: a draggable dot on the photo, "¿Qué parte
   debe verse siempre?" Stored as `focoX/focoY` and used by every crop, so
   nobody gets decapitated in a thumbnail. It takes an afternoon and it is the
   difference between a site that looks designed and one that looks improvised.

---

## 8. Safety net

- **Autosave draft every 3s** + "Guardado hace un momento". Never lose work.
- **Version history**, last 20, with a human list: *"Sra. Rivera — 2 de sept,
  10:14 am"* and a "Restaurar" button.
- **Papelera**, 30 days. Delete asks *"Se puede recuperar por 30 días"* — which
  turns a scary action into a safe one.
- **Leaving with unsaved changes** prompts: *"Tienes cambios sin guardar."*
- **No destructive action is ever one click from the list view.**

---

## 9. Words to use and words to ban

| Never write | Write instead |
|---|---|
| Slug / URL / permalink | Dirección de la página *(auto-generated; hide it)* |
| Publish / Unpublish | Publicar / Quitar de la página |
| Draft | Borrador — solo tú lo ves |
| Metadata / SEO | *(hide entirely)* |
| Upload | Subir una foto |
| Alt text | ¿Qué se ve en la foto? |
| Save changes | Guardar |
| Archive | Guardar para después |
| Error 500 | Algo falló de nuestro lado. Tu texto está guardado. |

Every error message must say what happened, that their text is safe, and what
to do next. A teacher who loses an announcement once will not use the tool
again — that's the whole ballgame.
