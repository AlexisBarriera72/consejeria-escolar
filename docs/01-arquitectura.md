# Architecture

## 1. Recommended stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Server-rendered pages (fast on bad phone connections, good SEO), Route Handlers give you a real server for auth, and Draft Mode is a built-in preview primitive — exactly the "second screen" you described. |
| Styling | **Tailwind + CSS custom properties** | Tokens in CSS vars so the 8 announcement templates can re-skin from one source. |
| Data + auth + files | **Supabase** (Postgres + Auth + Storage) | One free tier covers all three. Magic-link email login means teachers never have a password to forget. Row Level Security keeps drafts out of the public API. |
| Hosting | **Vercel** free tier | Zero-config Next.js, preview deploys per branch, free HTTPS. |
| Video | **YouTube unlisted + click-to-load facade** | Free hosting/bandwidth, auto-captions to correct. See section 5. |
| Search | **Client-side (Fuse.js)** over guides | The dataset is tiny. No server, works offline. |
| Rich text | **Tiptap**, locked to 6 buttons | See doc 04 section 4. |

**Why not a git-based CMS (Decap / Sveltia).** They're excellent and free, and
Sveltia is the actively-maintained one now (Decap has stalled; Sveltia is a
drop-in replacement, ~300 KB vs Decap's 1.5 MB). But two things disqualify them
here: their real-time rendered preview is not fully implemented, and you can't
build the "pick one of 8 newspaper templates and watch it re-render" experience
inside their generic form UI. That template picker *is* the product. Build the
admin yourself.

**The $0-forever alternative, if Supabase is rejected:** use GitHub as the
database. The admin panel commits JSON via the GitHub API; Vercel rebuilds.
Free permanently, and git history gives you version history for nothing.
Downside: 30–60 second publish delay, which non-technical staff read as
"it's broken". Keep it as plan B.

---

## 2. Route map

```
/                       Homepage (avatar + 3 buttons)
/guias                  Preguntas y Guías (categories + accordions)
/guias/[slug]           One question, deep-linkable, printable
/noticias               Front page: featured announcement + list
/noticias/[slug]        One announcement, rendered in its chosen template
/noticias/archivo       "Ediciones anteriores", grouped by month
/consejered             El Pasillo — staff browse page
/consejered/[slug]      One profile
/accesibilidad          Accessibility statement (legally expected — doc 07)
/privacidad             Privacy notice (only if Q1 answer is (b) or (c))
/creditos               Who built it

/edit                   Login screen
/edit/panel             Admin home: 3 big cards, mirrors the public site
/edit/guias             Guides list -> editor
/edit/noticias          Announcements list -> editor + template picker
/edit/perfiles          Profiles list -> editor
/edit/papelera          Trash, 30-day recovery

/api/auth/*             Login, logout, session
/api/contenido/*        CRUD. GUARDED. See section 3.
/api/preview            Enables Next.js Draft Mode
```

---

## 3. Security — read this part twice

You described `/edit` + a password. Here is the honest version.

### What does not work

- **A secret URL is not a lock.** `/edit` will end up in browser history, in a
  shared Chrome profile on a school computer, and in your git repo.
- **A password compared in browser JavaScript is public.** Anyone can press
  F12, read your bundle, and find it. This is not a theoretical risk; it is the
  single most common way small custom CMSes get defaced.
- **Hiding the admin page but leaving the API open is the classic bug.** If
  `POST /api/contenido/noticias` doesn't check the session, it does not matter
  how well hidden the page is. Attackers hit the API, not the UI.

### What to build instead

```
Browser                    Server (Route Handler)              Supabase
   |                              |                               |
   |-- email ------------------->  |-- send magic link ----------> |
   |<---------------------------- link in email ------------------|
   |-- click link -------------->  | verify token                  |
   |<-- HttpOnly, Secure,          | set session                   |
   |    SameSite=Lax cookie -----  |                               |
   |                               |                               |
   |-- POST /api/contenido ----->  | 1. read cookie                |
   |                               | 2. no session? -> 401         |
   |                               | 3. role != 'staff'? -> 403    |
   |                               | 4. validate body (Zod)        |
   |                               | 5. write ------------------>  |
```

Non-negotiables:

1. **Every write route re-checks the session.** Not middleware alone —
   middleware can be bypassed by misconfiguration. Check inside the handler.
2. **Session cookie is `HttpOnly`, `Secure`, `SameSite=Lax`.** HttpOnly means a
   cross-site script can't steal it.
3. **Rate-limit the login route.** 5 attempts per IP per 15 minutes. Without
   this a shared password is brute-forceable in an afternoon.
4. **`noindex` on all `/edit/*` routes** so the panel never lands in Google.
5. **Validate every payload server-side with Zod.** Never trust the shape of
   what the browser sends, even from your own form.
6. **Row Level Security on:** anonymous users can `SELECT` only rows where
   `estado = 'publicado'`. This is what makes drafts genuinely private — even a
   leaked API key can't read them.

### If you truly must use one shared password

Acceptable, with all of the above plus: store `ADMIN_PASSWORD_HASH` (bcrypt or
argon2) in a Vercel environment variable — never in the repo — and compare with
a timing-safe function. But re-read Q3: magic link is *less* work for both you
and the teachers, and it tells you who changed what.

---

## 4. The preview mechanism ("second screen")

Your instinct is right and it's a standard pattern, so it's cheap.

Every content row carries `estado: 'borrador' | 'publicado'` and keeps two
copies of its fields: the live one and the draft one. Then:

- **Public site** queries `WHERE estado = 'publicado'` and renders `contenido_publicado`.
- **Preview pane** renders `contenido_borrador` through *the exact same React
  components*. Not a lookalike — literally the same components. This is the
  whole trick: it's impossible for the preview to lie about how it'll look.
- **"Publicar"** copies draft into published, stamps `publicado_en` and
  `publicado_por`, and pushes the old published version onto a history table.

So the teacher's flow is:

```
Escribir  ->  Vista previa (side by side, live)  ->  [Publicar]
   ^                                                     |
   |_____________ [Restaurar versión anterior] __________|
```

Nothing they type is ever visible to a student until they press Publicar. That
is the reassurance the spec is really asking for, and it is what you should say
to them in those words.

---

## 5. Video

Use YouTube **unlisted** links, embedded behind a **facade**: render a
thumbnail + play button, and only load YouTube's ~1 MB iframe when clicked.
Loading three real YouTube iframes on a guides page can add several megabytes
before anyone presses play — brutal on a school phone plan.

Plyr is merging into **Vidstack**, so if you want one consistent skin across
both YouTube and self-hosted files, Vidstack is the forward-looking pick. If
every video is a YouTube link, you may not need a player library at all.

**Captions are not optional here.** Video without captions on a public school
site is a WCAG 1.2.2 failure and the most likely thing to get flagged. YouTube
auto-captions in Spanish are a starting point, not a finish line — someone has
to correct them. Budget 3x the video's length for that. Put it in the schedule
now so it doesn't become a launch-day surprise.

---

## 6. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # safe to expose ONLY with RLS enabled
SUPABASE_SERVICE_ROLE_KEY=          # server only. NEVER prefix NEXT_PUBLIC_
SESSION_SECRET=                     # 32+ random bytes, for signing cookies
```

`.gitignore` must contain `.env*.local` from the very first commit. A leaked
service-role key is full read/write on the whole database.
