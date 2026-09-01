# Build Order

The sequencing principle: **build the entire public site against fake local
data first.** No database, no auth, no accounts. You get a complete, reviewable,
demo-able website in a fraction of the time, you can show the counselor
something real early, and you never debug "is this a data problem or a layout
problem" — because for several phases there is no data layer to blame.

---

## Fase 0 — Decisions (no code)

- Answer BLOCKERS Q1–Q9 in `00-PREGUNTAS.md`
- Create the repo. `.gitignore` with `.env*.local` in the **first** commit
- Decide domain + who owns the deploy account (Q5)
- Run the doc 05 design prompts, pick directions
- Commission the avatar art: minimum 4 poses (neutral, point-left,
  point-center, point-right), ideally 6

**Done when:** you know who owns the account and what happens to the email.

## Fase 1 — Shell

- Next.js + TypeScript + Tailwind, deployed to Vercel on day one
- Design tokens from doc 03 as CSS custom properties
- Fonts loaded, Spanish diacritics verified in every one
- `PortalEntrada` modal — focus trap, Esc, `localStorage`, skippable
- Header, footer, skip link, `<html lang="es">`
- `/seed/*.json` written (doc 02 section 5)

**Done when:** a deployed URL shows the gate and an empty styled homepage.

## Fase 2 — Homepage

- `AvatarGuia` + `BurbujaDialogo`, hover **and keyboard focus** driven
- Three `BotonGrande` cards with live previews from seed data
- Mobile variant: static avatar, permanent per-card bubbles
- `prefers-reduced-motion` wired

**Done when:** tabbing through the three buttons moves the avatar's arm.

## Fase 3 — The three public sections

All reading from seed JSON. Build in this order:

1. **ConsejeRed** — simplest, and finishing a whole section fast is good for
   morale. Profile page, El Pasillo browse, `trabajaCon` bubbles.
2. **Preguntas y Guías** — categories, accordions, video facade, person chips,
   client-side search, deep links.
3. **Noticias** — front page, archive, and **all eight templates**.

**Done when:** every public page works, keyboard-navigable, on fake data.

## Fase 4 — Accessibility pass #1

Do this *now*, not at the end. Fixing a11y in a 3-page app is an afternoon;
fixing it in a finished app is a rewrite.

- axe DevTools clean, Lighthouse 95+
- Full keyboard pass, full NVDA pass in Spanish
- Print stylesheets (doc 06 section 4)
- `/accesibilidad` page

**Done when:** you can navigate the whole site with the mouse unplugged.

## Fase 5 — Data + auth

- Supabase schema from doc 02, **RLS on from the start**
- Magic-link login, session cookie, `/edit` guard
- Swap seed JSON for real queries — public pages should barely change if the
  data layer was kept behind clean functions
- Rate limit login, `noindex` on `/edit/*`, Zod on every write route

**Done when:** logged out, you cannot read a `borrador` row through the API.
Test this deliberately.

## Fase 6 — Admin: Guías

The simplest of the three, so it's where you work out the shared patterns.

- List view, split-screen editor, live preview
- Tiptap locked to six buttons, paste-as-plain-text
- Autosave, version history, papelera
- Semáforo de Accesibilidad

**Done when:** you can add, edit and delete a guide without touching code.

## Fase 7 — Admin: Noticias + Perfiles

- The template picker with live thumbnails — **build this well, it's the demo**
- Scheduling, `expiraEn`, emergency banner toggle
- Image pipeline: EXIF, resize, WebP, focal point
- Profiles editor, auto-mutual `trabajaCon`, accent color picker

**Done when:** a teacher can publish in all eight templates in three minutes.

## Fase 8 — Real content

- Real Spanish copy replaces Lorem Ipsum
- **Video captions corrected** — start this in Fase 3, not here
- PDFs checked for real text
- Photo consent confirmed for any student images

## Fase 9 — Launch

- PWA + offline (doc 06 section 6)
- Cheap Android phone on cell data test
- Accessibility pass #2 on real content — new content, new problems
- Teacher cheat sheet printed (doc 06 section 11)
- **30 minutes of training with the actual staff, watching them use it
  without helping.** Every place they hesitate is a bug. Write them down.
- `/creditos` page with your name on it

---

## Handoff — fill this in before you leave

Leave this in the repo. It is the difference between a site that survives you
and one that quietly dies.

```
Domain registrar:            ______  renews ______  paid by ______
Deploy account (Vercel):     ______  owner ______
Database (Supabase):         ______  owner ______
Who can add a new editor:    ______
Who to call if it breaks:    ______
Where the source code lives: ______
Cheat sheet lives:           ______
```

---

## Cut list, if time runs short

Cut in this order. Everything above the line still ships a real product:

8. Node graph on ConsejeRed (doc 06 §10)
7. Newspaper-stack archive (doc 06 §7) — plain list works
6. PWA / offline (doc 06 §6)
5. Modo Calma (doc 06 §5)
4. Templates 7 and 8 — six is plenty
3. Scheduling — publishing now is fine at v1
2. Version history — papelera alone covers most accidents
1. Student/parent lens (doc 06 §1) — the gate can just say hello

— never cut below this line —

- Accessibility (doc 07). It's the law here, not a feature.
- The preview-before-publish flow. It's the thing they actually asked for.
- `expiraEn`. Without it the site is dead in seven months.
- The teacher cheat sheet. Without it, nobody uses any of this.
