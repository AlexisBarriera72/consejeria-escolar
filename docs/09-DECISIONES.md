# Decisions Locked

Answers from 2026-09-01. These supersede the recommendations in docs 00–08
wherever they conflict.

| #   | Question        | Decision                                                                                |
| --- | --------------- | --------------------------------------------------------------------------------------- |
| Q1  | Name + email    | **Collect neither.** See section 1.                                                     |
| Q2  | Puerto Rico?    | **Yes**                                                                                 |
| Q3  | Auth            | ~~Magic link~~ → **single password** (see section 6)                                    |
| Q4  | Budget          | **$0.** New domain later.                                                               |
| Q5  | Account owner   | **You.** Personal project for a family member — _not_ district property. See section 3. |
| Q6  | Video           | **YouTube links**, facade embed                                                         |
| Q7  | Real names      | TBD                                                                                     |
| Q8  | Two-way channel | **None.** One addition: a read-only availability calendar. Section 4.                   |
| Q9  | Deadline        | TBD                                                                                     |

Approved from doc 06: student/parent lens · Semáforo de Accesibilidad ·
`expiraEn` · Imprimir afiche + QR · Offline PWA · ConsejeRed /
El Pasillo · auto-mutual `trabajaCon` · per-person accent color · diacritic check.

---

## 1. The stats question — you don't need the data you were about to collect

You want _"stats on a spreadsheet every month to see what students or parents
access the site."_

That is a **count**, not an identity. You never needed the names or the emails.

So: **drop both fields.** The entry gate becomes three buttons and nothing else:

```
              ¿Quién nos visita hoy?

   [ Soy estudiante ]   [ Soy madre, padre o encargado ]

              Continuar como invitado
```

Behind it, one anonymous increment:

```
INCR stats:2026-09:estudiante
```

No name. No email. No IP. No cookie ID. Nothing that identifies a person — the
counter literally cannot be traced back to anyone, because there is nothing in
it but a number.

A `localStorage` flag (`contado:2026-09`) makes each browser count once per
month, so the number means "distinct visitors", which is what a spreadsheet
actually wants.

**What she gets in the admin, and what you export as CSV:**

| Mes             | Estudiantes | Encargados | Invitados | Total |
| --------------- | ----------- | ---------- | --------- | ----- |
| Septiembre 2026 | 412         | 87         | 55        | 554   |
| Octubre 2026    | 388         | 143        | 61        | 592   |

Plus, free, from the `vistas` counter already in doc 02: **which guides get
opened most.** That's more useful to a counselor than a visitor list — it tells
her what students are actually worried about.

You get 100% of the reporting, and the privacy analysis in doc 07 collapses to
a single sentence: _we don't collect personal information._

> If she later says she genuinely wants to know _who_ visited — that's a
> different product with a different legal footing. Push back once, hard. A
> counselor knowing which specific students read the guide about anxiety is
> exactly the kind of chilling effect that stops students from reading it.

**Keep the "Hola, María" greeting?** Optional and easy: one name field, stored
in `localStorage`, never transmitted. Copy: _"Esto se guarda solo en tu
navegador. No lo enviamos a ningún lado."_ True statement, warm result, zero
exposure. Your call — the site works fine without it.

---

## 2. Data layer — changed recommendation

**Doc 01 recommended Supabase. I'm withdrawing that.** Research turned up a
disqualifying detail:

> **Supabase pauses free-tier projects after 7 days of inactivity**, and
> unpausing requires someone to log into the dashboard and click a button.

A school site goes quiet over Christmas break and dead-quiet over summer. Your
aunt's website would break every July, and the fix requires _you_, from
wherever you are. That's the exact failure this project has to avoid.

Also, Supabase's default SMTP allows **2 auth emails per hour** — enough to
lock her out of her own site on a bad morning.

### New recommendation: the repo _is_ the database

```
contenido/
  guias.json
  noticias.json
  perfiles.json
  aviso.json
```

- **Write:** the admin panel commits via the GitHub Contents API.
- **Read:** server-side fetch, cached with a tag.
- **Publish:** commit, then `revalidateTag('noticias')` → live in ~2 seconds.
  No rebuild, no 40-second wait.

| Why it fits this project exactly |                                                                           |
| -------------------------------- | ------------------------------------------------------------------------- |
| Never pauses, never expires      | GitHub and Vercel are accounts you already own                            |
| Version history is free          | `git log` **is** the "last 20 versions" feature from doc 04               |
| Survives you                     | Content is plain JSON in a repo. Even if Vercel vanishes, it's all there. |
| $0 forever                       | Not "$0 tier" — actually free                                             |
| No cold starts                   | Nothing to wake up                                                        |

Auth needs **no database at all** — the demo proves it. Tokens are signed, not
stored; the staff list is an environment variable. For two editors, that's the
right size.

The one genuinely stateful thing is the monthly counter → **Upstash Redis free
tier**, three keys per month. ~15 lines.

**Final stack:**

```
Next.js (App Router) + TypeScript + Tailwind   → Vercel (free)
Content        → JSON in the GitHub repo, written via GitHub API
Auth           → one password, scrypt hash in an env var (see section 6)
Stats          → Upstash Redis counters (free), zero PII
Images         → committed to the repo, WebP-compressed in-browser first
Video          → YouTube unlisted + facade embed
```

Four services, all free, none of which pause.

_Rejected: Neon (auto-resumes, unlike Supabase — but free-tier compute hours
get tight on a site woken by every visitor). Keep it as the upgrade path if
content volume ever outgrows JSON files, which for ~20 guides it will not._

---

## 3. The legal picture is much lighter than doc 07 says — correction

Doc 07 was written assuming this was a district property. **It isn't** — it's a
personal project for a family member. That changes the analysis, and I'd rather
correct it than let you over-engineer for a regime that doesn't bind you:

- **ADA Title II** binds _public entities_. A personal site your aunt runs is
  not one. The April 2027/2028 deadlines don't apply to you.
- **PR Ley 229 de 2003** obligates _"toda entidad pública del Estado Libre
  Asociado"_. Same reasoning — not you.
- **COPPA** applies to operators of _commercial_ websites and services.
  Non-commercial and nonprofit operators are generally outside its scope. And
  after section 1, it's doubly moot: you collect nothing.
- **FERPA** governs education records held by the school. You hold none.

**So why keep building to WCAG 2.1 AA anyway?** Two real reasons, neither of
them legal:

1. **The audience.** Some students at this school are blind, dyslexic, or use a
   keyboard instead of a mouse. They're the reason, not the deadline.
2. **Adoption is the goal.** The day the school links to this site or adopts
   it, it inherits every obligation above _on day one_, with no grace period.
   Building it right costs nothing now. Retrofitting it costs a rewrite.

Doc 07's checklist stays exactly as written. Only its _motivation_ changes —
from "you must" to "you should, and here's the trapdoor if it's ever adopted."

The Semáforo de Accesibilidad is now even more valuable: it's the thing that
keeps the site compliant when you're not around to check.

---

## 4. The availability calendar

Read-only. No booking, no requests, no messages — consistent with "no two-way
channel."

### The privacy trap, stated plainly

**Do not embed her main Google Calendar.** A school counselor's calendar
contains event titles like _"Reunión con Juan Pérez — seguimiento"_. Publishing
that on a website is a serious disclosure about a specific student. The default
Google Calendar embed shows event titles.

### The safe design

1. She creates a **separate calendar** named `Disponibilidad`.
2. She puts only generic blocks in it: `Libre`, `Libre`, `No disponible`. No
   names, ever. Nothing sensitive exists in the calendar to leak.
3. Belt and braces: set that calendar's access to **"See only free/busy (hide
   details)"** — a real Google Calendar setting.
4. She shares its **secret iCal address** (Settings → Access permissions →
   "Secret address in iCal format").
5. `CALENDARIO_ICS_URL` goes in a Vercel env var. **Never in the repo** — that
   URL is a password. It can be reset from Google Calendar if it leaks.
6. The site fetches the `.ics` server-side every 30 minutes, and renders
   **only day-level availability**:

```
   Septiembre 2026
   L   M   M   J   V
   1   2   3   4   5
   ●   ●   ○   ●   ○      ● libre   ○ ocupada
```

Never render event titles. Not even into the HTML where "nobody will look" —
View Source is one keystroke.

Use `ical.js` for parsing; her availability will almost certainly be a weekly
recurring event, and `RRULE` expansion is the part you do not want to hand-roll.

Fallback when the fetch fails: show her office hours as static text from her
profile (`contacto.horario`, doc 02) and a line — _"Confirma con ella antes de
venir."_ Never show a stale calendar as if it were current.

> Note: the Google Calendar connector in this session isn't authorized, so I
> can't read her calendar from here. Not needed — the site reads the iCal URL
> at runtime. If you ever want me to inspect it directly, authorize the
> connector in your claude.ai settings.

---

## 5. What changes in the earlier docs

- **Doc 00 Q1, Q2, Q3, Q4, Q5, Q6, Q8** — answered above.
- **Doc 01 section 1** — Supabase withdrawn, see section 2 here.
- **Doc 02** — add `Disponibilidad` and `EstadisticaMensual`; drop any
  `visitante` model that stored a name or email.
- **Doc 03** — add `/calendario`; add the Modo Calma token block.
- **Doc 07** — motivation corrected per section 3; the checklist is unchanged.
- **Doc 08** — Fase 5 becomes "GitHub content layer + auth" instead of
  "Supabase"; the calendar joins Fase 7.

---

## 6. Auth: magic link → single password

**Supersedes Q3.** The magic link was built, tested and shipped, then replaced
once the interview confirmed only one person will ever edit.

The magic link solved a problem this project turns out not to have: knowing
_which_ of several editors made a change. With a single editor it added two
dependencies — an email provider and an inbox — plus a failure mode (mail not
arriving) in exchange for nothing.

**Carried over unchanged**, because it was right the first time: the signed
HttpOnly session cookie, the constant-time comparison, and the guard
re-checked inside every write route rather than only on the page.

**What genuinely changed:** a password _can_ be brute-forced; a one-time link
cannot. So the attempt limit stops being a nicety and becomes the primary
defence — ten tries per IP per fifteen minutes.

Three implementation notes worth keeping:

- The password is never stored. `ADMIN_PASSWORD_HASH` holds a salted scrypt
  hash, produced by `node scripts/generar-clave.mjs "…"`.
- **The separator is a colon, not the customary dollar sign.** Next runs
  `.env` files through dotenv-expand, which reads a dollar followed by
  characters as a variable name and substitutes empty — so the hash arrived
  truncated and login failed with a bare 401 and no explanation. Do not
  "tidy" this back to the conventional format.
- The session embeds a fingerprint of the hash, so changing the password
  invalidates any open session. That is the point: you change it _because_
  someone saw it.

`demo/magic-link/` stays in the repo as a working reference if a second editor
ever appears.

---

## 7. Despliegue: dos cuentas de GitHub y por qué Vercel bloqueaba

El repositorio vive en **AlexisBarriera72** (privado) y la cuenta de Vercel es
**TastyWetNut** (`wetnut's projects`, plan hobby). Son cuentas distintas y esa
asimetría tiene consecuencias reales.

### El bloqueo

Un `git push` disparaba un despliegue que Vercel dejaba en estado `BLOCKED`,
**sin una sola línea de registro de construcción** y con `errorLink` apuntando
a `troubleshoot-project-collaboration#team-configuration`. No es un fallo del
código: Vercel se niega antes de empezar a construir.

La comparación entre los dos primeros despliegues lo deja claro:

|     | commit    | `source`                          | estado  |
| --- | --------- | --------------------------------- | ------- |
| #1  | `1aa2ae9` | `importSource: import-candidates` | READY   |
| #2  | `a4dad36` | `source: "git"`                   | BLOCKED |

Mismo repositorio, misma rama y **el mismo autor** (`TastyWetNut` en los dos).
Lo único que cambia es quién lo inicia: el primero se lanzó a mano desde el
panel, como el usuario que había iniciado sesión; el segundo lo disparó el
webhook del push, hecho con el token de AlexisBarriera72.

En el plan hobby, Vercel solo acepta despliegues por git cuando la identidad
de GitHub que empuja es la que está conectada a la cuenta de Vercel.

### Lo que NO lo arregla

Añadir TastyWetNut como colaborador del repositorio. Eso cambia los permisos
**de GitHub**; la comprobación que falla es **de Vercel**, sobre qué cuenta de
GitHub está conectada. Son dos capas distintas y tocar la primera no mueve la
segunda.

### El arreglo

La máquina tenía credenciales de las dos cuentas en el Administrador de
credenciales de Windows, pero Git Credential Manager las busca por _host_, así
que la de AlexisBarriera72 tapaba la otra. Se resuelve pidiendo la credencial
por ruta, solo en este repositorio:

```
git config --local credential.https://github.com.useHttpPath true
```

Con eso git pregunta por `github.com/AlexisBarriera72/consejeria-escolar` en
vez de por `github.com` a secas, y recibe la de TastyWetNut — que tiene
permiso de escritura en el repositorio. Los demás repositorios de la máquina
siguen usando la credencial global y no se enteran.

Es `--local`: vive en `.git/config`, no se versiona. **Quien clone este
repositorio en otra máquina tendrá que volver a ponerlo.**

### Protección de despliegue

Los proyectos nuevos de Vercel nacen con _Vercel Authentication_ activada, así
que todas las URL respondían 302 hacia `vercel.com/sso-api` y el sitio no se
veía sin iniciar sesión en Vercel. Está desactivada a propósito: el sitio es
para estudiantes y familias, y una pared de inicio de sesión lo hace inútil.
