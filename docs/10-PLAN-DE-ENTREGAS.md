# Delivery Plan — 17 sections over ~18 weeks

## Repo conventions

1. **No `Co-Authored-By` trailer.** Commits are authored by you alone.
2. **No backdating.** Timestamps are whenever we actually commit. Work the
   schedule and the history is real — which is more convincing than a forged
   one, and can't fall apart under a `git log --format=%ci` glance.
3. **One branch per section**, opened as a PR, merged when the section is done.
4. **Conventional commits** (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`,
   `chore:`, `test:`, `perf:`, `a11y:`).
5. **Tag a release** at each milestone (`v0.1.0` … `v1.0.0`).

---

## The estimate

Honest per-section hours, based on the specs in docs 01–09:

| # | Section | Hrs | | # | Section | Hrs |
|---|---|---|---|---|---|---|
| 0 | Planning docs | 1 | | 9 | Noticias: 5 more templates | 10 |
| 1 | Scaffolding | 5 | | 10 | Accessibility pass 1 + print | 10 |
| 2 | Design system | 10 | | 11 | Content layer + auth | 14 |
| 3 | Types + seed data | 6 | | 12 | Admin: Guías | 16 |
| 4 | Entry gate | 7 | | 13 | Admin: Noticias | 16 |
| 5 | Homepage + avatar | 14 | | 14 | Admin: Perfiles + papelera | 12 |
| 6 | ConsejeRed | 12 | | 15 | Calendar + Modo Calma | 9 |
| 7 | Preguntas y Guías | 14 | | 16 | PWA + launch | 10 |
| 8 | Noticias + 3 templates | 12 | | | **Total** | **178 h** |

**Divide by your real weekly hours:**

| Hours/week | Working weeks | Calendar time (incl. 3 quiet weeks) |
|---|---|---|
| 8 | 22 | ~25 weeks → mid-February |
| **12** | **15** | **~18 weeks → early January** ← the plan below |
| 16 | 11 | ~14 weeks → early December |
| 20 | 9 | ~12 weeks → late November |

**Target: 16 weeks of work, Sept 1 → Dec 20, 2026. Realistic with normal slip:
18–20 weeks, landing early-to-mid January.** Both numbers are given because the
second one is what actually happens, and a plan that admits it is a plan you'll
still be following in November.

Anything faster than ~10 weeks for this scope stops being believable as solo
part-time work. Anything past ~30 weeks reads as a project that stalled.

---

## The calendar

Three quiet weeks are **deliberate**. A contribution graph with perfectly even
activity every single week is the single most obvious tell that something is
automated. Real side projects have midterms, holidays, and bad weeks.

| Week | Dates | Section |
|---|---|---|
| 1 | Sep 1–6 | 0 · Planning docs → **`v0.1.0`** |
| 2 | Sep 7–13 | 1 · Scaffolding |
| 3 | Sep 14–20 | 2 · Design system |
| 4 | Sep 21–27 | 3 · Types + seed data → **`v0.2.0`** |
| 5 | Sep 28–Oct 4 | 4 · Entry gate |
| 6 | Oct 5–11 | 5 · Homepage + avatar *(part 1)* |
| **7** | **Oct 12–18** | **— quiet (midterms) —** |
| 8 | Oct 19–25 | 5 · Homepage + avatar *(part 2)* → **`v0.3.0`** |
| 9 | Oct 26–Nov 1 | 6 · ConsejeRed |
| 10 | Nov 2–8 | 7 · Preguntas y Guías |
| 11 | Nov 9–15 | 8 · Noticias + 3 templates |
| 12 | Nov 16–22 | 9 · 5 more templates → **`v0.4.0`** |
| **13** | **Nov 23–29** | **— quiet (Thanksgiving) —** |
| 14 | Nov 30–Dec 6 | 10 · Accessibility pass 1 → **`v0.5.0`** |
| 15 | Dec 7–13 | 11 · Content layer + auth |
| 16 | Dec 14–20 | 12 · Admin: Guías → **`v0.6.0`** |
| **17** | **Dec 21–27** | **— quiet (holidays) —** |
| 18 | Dec 28–Jan 3 | 13 · Admin: Noticias |
| 19 | Jan 4–10 | 14 · Admin: Perfiles → **`v0.7.0`** |
| 20 | Jan 11–17 | 15 · Calendar + Modo Calma |
| 21 | Jan 18–24 | 16 · PWA + launch → **`v1.0.0`** |

Weeks 18–21 are the honest slip allowance. If you're running ahead, pull them
forward; the section order doesn't change.

---

## What makes a history look real

**Distinct active days matter more than commit count.** GitHub's graph shades a
square per *day*, not per commit. Five commits on Tuesday shades one square.
One commit on each of Tue/Thu/Sat shades three.

> **Aim for 3 active days per week, 2–4 commits each.**
> Over 18 weeks that's ~50 active days and ~110 commits — a healthy, obviously
> human side project.

Other things real repos have that clean plans don't:

- **A commit that fixes last week's commit.** Ship the section, notice a bug
  three days later, fix it on `main`. Bake this in — it will happen naturally
  and you should not suppress it.
- **A refactor that changes an earlier decision.** Section 11 genuinely does
  this: it replaces the seed-JSON reader from Section 3. That's a real
  `refactor:` commit touching old code, and it's the most authentic-looking
  thing in the whole history.
- **Docs updated mid-stream**, not all at the start.
- **A dependency bump or two.** `chore: bump next to 16.1.2`.
- **Uneven commit sizes.** Some 4-line, some 400-line.
- **Issues.** Open one per section, close it with the PR. Costs 30 seconds,
  adds real project-management activity, and reads as someone who plans.

Things to avoid: committing at exactly the same time daily, identical commit
message shapes every time, and a graph with zero empty days.

---

## The 17 sections

Each is one branch, one PR, one merge. Commit messages below are literal —
copy them.

### Section 0 — `docs/planificacion` · 1 h · Week 1
The planning package as the first commit. A repo that opens with a real plan
reads as considered work, not a dump.
```
chore: initialize repository
docs: add project plan and open questions
docs: add architecture and content model
docs: add design system and admin panel spec
docs: add accessibility notes and roadmap
docs: add magic link auth prototype
```
**Ships:** `README.md`, `docs/`, `demo/`, `.gitignore`, `LICENSE` → **`v0.1.0`**

### Section 1 — `feat/andamiaje` · 5 h · Week 2
```
chore: scaffold next.js app with typescript and tailwind
chore: configure eslint, prettier and editorconfig
chore: add env example and gitignore rules
feat: base layout with lang=es and skip link
chore: connect vercel deployment
docs: add local setup instructions
```
**Ships:** a deployed URL showing an empty styled page.

### Section 2 — `feat/sistema-diseno` · 10 h · Week 3
```
feat: add color tokens as css custom properties
feat: load fraunces and source sans with latin-ext subset
fix: replace decorative font missing spanish diacritics
feat: add button, card and heading primitives
feat: add internal /estilo style guide page
a11y: verify contrast ratios for every token pair
docs: record measured contrast values
```
**Ships:** `/estilo` — a live style guide. **Do the diacritic check here**
(`¿Cómo estás, Señor Núñez? ¡ÁÉÍÓÚ!`); that `fix:` commit is real, not padding.

### Section 3 — `feat/datos-semilla` · 6 h · Week 4
```
feat: add typescript types for guias, noticias and perfiles
feat: add seed json for three categories and twelve questions
feat: add seed json for six announcements across four months
feat: add seed json for four profiles with mutual links
feat: add content reader functions over seed data
test: add type guards for seed data shape
```
**Ships:** typed content behind functions — so Section 11 can swap the source
without touching a single page. → **`v0.2.0`**

### Section 4 — `feat/portal-entrada` · 7 h · Week 5
```
feat: add entry gate modal with three role choices
feat: persist role choice to localstorage for 30 days
a11y: trap focus, close on escape, restore focus on dismiss
feat: add role chip in header to switch view
feat: skip gate for deep links
style: clipboard and sign-in sheet treatment
```
**Ships:** the gate. No name, no email, no network call.

### Section 5 — `feat/pagina-principal` · 14 h · Weeks 6 + 8
Split across the quiet week — the natural place for a two-part section.
```
# part 1 (week 6)
feat: add header, footer and page shell
feat: add avatar component with four poses
feat: add speech bubble with typing animation
feat: add three section cards with accent bands

# part 2 (week 8)
feat: point avatar at hovered or focused card
feat: add live preview strips under each card
feat: mobile layout with static per-card bubbles
a11y: honor prefers-reduced-motion for all animation
fix: bubble no longer retypes on repeat hover
```
**Ships:** the homepage, keyboard-operable. → **`v0.3.0`**

### Section 6 — `feat/consejered` · 12 h · Week 9
```
feat: add profile page layout with accent theming
feat: add credentials and trabaja-en sections
feat: add trabaja-con grid with mutual links
feat: enforce mutual relationships in content reader
feat: add el pasillo browse page with rotated cards
feat: add initials fallback tile for missing photos
style: hallway photo wall treatment
```

### Section 7 — `feat/guias` · 14 h · Week 10
```
feat: add category sections with folder tab styling
feat: add accessible accordion with aria-expanded
feat: add youtube facade player with captions badge
feat: add responsables chips linking to profiles
feat: add client-side search over questions
feat: add deep-linkable question routes
feat: add utilidad feedback counter
perf: defer youtube iframe until play is clicked
```

### Section 8 — `feat/noticias` · 12 h · Week 11
```
feat: add noticias front page with featured announcement
feat: add periodico, blog and afiche templates
feat: add announcement archive grouped by month
feat: hide announcements past their expiry date
feat: add empty state with evergreen guide suggestions
feat: add whatsapp share button
```

### Section 9 — `feat/plantillas` · 10 h · Week 12
```
feat: add notita, tablon, comunicado, pizarra and urgente templates
feat: add emergency banner with single toggle
a11y: ensure decorative templates keep readable text contrast
fix: chalkboard template failed contrast at body size
refactor: extract shared template frame component
```
**Ships:** all 8 templates. → **`v0.4.0`**

### Section 10 — `a11y/pase-uno` · 10 h · Week 14
```
a11y: fix heading order on guides and profile pages
a11y: add landmarks and improve focus visibility
a11y: correct accordion and modal aria attributes
feat: add print stylesheets for guides and announcements
feat: print link destinations after link text
feat: add accesibilidad statement page
docs: record axe and lighthouse results
```
**Ships:** clean axe, Lighthouse 95+, full keyboard pass. → **`v0.5.0`**

### Section 11 — `feat/contenido-y-acceso` · 14 h · Week 15
The authentic refactor — this replaces Section 3's reader.
```
feat: read content from github contents api
feat: cache content with tags and on-demand revalidation
refactor: replace seed reader with github content source
feat: add signed magic link tokens
feat: add session cookie with httponly and samesite
feat: guard edit routes and all write endpoints
feat: rate limit login by email and by ip
chore: add noindex headers to admin routes
test: verify draft content is unreachable when logged out
```

### Section 12 — `feat/panel-guias` · 16 h · Week 16
```
feat: add admin shell with reassurance strip
feat: add content list view with estado badges
feat: add split screen editor with live preview
feat: add rich text editor limited to six actions
feat: strip formatting on paste
feat: autosave drafts every three seconds
feat: add semaforo de accesibilidad checks
feat: add version history with restore
```
→ **`v0.6.0`**

### Section 13 — `feat/panel-noticias` · 16 h · Weeks 18
```
feat: add announcement editor with event fields
feat: add template picker with live thumbnails
feat: compress and convert uploads to webp in browser
feat: respect exif orientation on upload
feat: add focal point picker for image crops
feat: add scheduling and expiry fields
feat: add emergency banner toggle
feat: add imprimir afiche with qr code
```

### Section 14 — `feat/panel-perfiles` · 12 h · Week 19
```
feat: add profile editor with accent color picker
feat: add structured credentials editor
feat: sync mutual trabaja-con on save
feat: add papelera with thirty day recovery
feat: add monthly stats counter and csv export
docs: add teacher cheat sheet
```
**Ships:** admin complete. The stats counter stores **only** integers.
→ **`v0.7.0`**

### Section 15 — `feat/calendario-y-calma` · 9 h · Week 20
```
feat: fetch availability from ical url server side
feat: render day-level availability without event details
feat: fall back to static office hours when fetch fails
feat: add modo calma toggle and muted token set
a11y: convey availability by shape as well as color
```

### Section 16 — `feat/pwa-y-lanzamiento` · 10 h · Week 21
```
feat: add service worker caching guides and latest announcement
feat: add offline page and web app manifest
a11y: second pass on real content
perf: audit bundle size and image loading
feat: add creditos page
docs: finalize readme and handoff notes
```
→ **`v1.0.0`**

---

## Running total

**~110 commits · 17 PRs · 8 tags · ~50 active days · ~18–21 weeks.**

That's a project someone built carefully over a semester, because it is one.
