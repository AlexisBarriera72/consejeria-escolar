# Open Questions

You asked for an excessive amount. Here are 104. Answer the 9 **BLOCKERS**
first — they change architecture. Everything else can be answered while code is
already being written, or defaulted to my recommendation in brackets.

Format: `[REC: x]` = what I'd do if you never answer.

---

## A. BLOCKERS — answer these before the first commit

**Q1. What actually happens to the name + email from the entry gate?**
Three very different apps:
- (a) Never leaves the browser. Stored in `localStorage`, only used to say
  "Hola, María" in the header. No server, no database, no legal exposure.
- (b) Sent to a server so staff can see who visited.
- (c) Sent to a mailing list / newsletter.

(b) and (c) mean you are storing PII from minors → COPPA, FERPA, a privacy
notice, a retention policy, and probably district legal sign-off.
**[REC: (a). It gives you 100% of the warmth for 0% of the liability.]**

**Q2. Is this Puerto Rico?** "Consejera Escolar" + Spanish-only + district
points there, but I'm not assuming. It decides whether **Ley 229 de 2003**
and annual OGP/PRATP accessibility audits apply on top of ADA Title II.

**Q3. How many people can edit, and do you need to know *who* edited?**
- One shared password, nobody is named → simplest, no accountability, and when
  one person leaves everyone changes passwords.
- Per-person accounts (magic-link email, no password to forget) → you get
  "Editado por Sra. Rivera, 3 de sept." and you can revoke one person.

**[REC: per-person magic link. Strictly easier for non-technical staff than
remembering a password, and it's the accountability the district will want.]**

**Q4. Is there a budget, even $0–20/month?** Decides Supabase/Neon free tier vs
git-as-database vs paid. Also: **who pays for and renews the domain in year
three?** School sites die at renewal time more than at launch time.
**[REC: assume $0. Everything below fits free tiers.]**

**Q5. Who owns the deploy account?** If it's your personal Vercel/GitHub and you
graduate or move on, the district loses the site. Transferring later is
annoying; creating a district-owned account now is 10 minutes.

**Q6. Videos: YouTube/Vimeo links, or files uploaded to the site?** Uploaded
files mean storage cost + bandwidth + you must produce captions yourself.
YouTube unlisted means free hosting + auto-captions to correct.
**[REC: YouTube unlisted, embedded with a click-to-load facade.]**

**Q7. Real school + real staff names at launch, or placeholders all the way?**
Real staff photos and names have their own consent question (Q57, Q70).

**Q8. Does the counselor want any two-way channel** — appointment requests,
anonymous question box, contact form? Every one of those makes this an app that
*receives* student information, which is a completely different privacy and
duty-of-care posture than a site that only *publishes*.
**[REC: launch publish-only. Add later, deliberately.]**

**Q9. Deadline / occasion?** Start of semester, a board presentation, a class
project grade? Changes what Phase 1 must contain.

---

## B. The entry gate ("¿Quién nos visita?")

10. Can it be dismissed with Esc / clicking outside, or is it a hard stop?
    **[REC: dismissible — a hard modal on first paint is an accessibility and
    bounce-rate problem, and screen readers handle it badly.]**
11. Once someone picks "Estudiante", do we remember forever, for the session, or
    ask every visit? **[REC: remember 30 days, show a small "Estudiante" chip in
    the header to switch.]**
12. Does the student/parent choice **change the site**, or is it just a label?
    See doc 06 section 1 — this is the biggest missed opportunity in the spec.
13. Should there be a third option — **Maestro / Personal**? Staff visit too,
    and it's a natural, non-suspicious place to put the route to `/edit`.
14. Any option for grandparents / guardians? In PR, "encargado" is often the
    right word, not "padre". **[REC: label it "Madre, padre o encargado".]**
15. If someone types an email, do we validate it? Do we ever email them?
16. Is the gate skippable by direct link (someone shares a deep link to a
    guide)? **[REC: yes — never block deep links; show a dismissible strip.]**
17. Copy tone: "¿Quién nos visita hoy?" vs "Bienvenido" vs "Firma la hoja"?
18. Should the gate remember the *name* but not require it? (name optional,
    email optional, both skippable)
19. What does a returning visitor see? "¡Hola otra vez, María!" is delightful.

## C. Homepage & the avatar

20. Who is the avatar? A generic friendly character, a stylized version of the
    real counselor, the school mascot, or an object (a lighthouse, an owl, a
    coquí)? You said the avatar art is handled separately — but I need to know
    **how many poses** to spec: minimum 4 (neutral + point-left + point-center +
    point-right), ideally 6 (add waving, thinking).
21. Does the avatar have a name? Naming it makes it a character students refer
    to. **[REC: yes, name it. Let students name it — instant buy-in.]**
22. Static PNG set, an SVG with swappable arms, or a Lottie animation? Affects
    file size and how the hover swap is coded.
23. Should the avatar ever speak unprompted (idle after 8s: "¿Buscas algo?") or
    only on hover? **[REC: only on hover; idle chatter gets annoying fast.]**
24. Exactly three buttons forever, or could a fourth appear (Calendario,
    Recursos, Contacto)? Build the layout for 3–5, or hard-code 3?
25. The "little preview under each button" — what is it? Last 2 news headlines /
    3 sample question titles / 3 staff avatars? **[REC: yes, live data — it
    makes the homepage feel alive and it costs nothing.]**
26. Order of the three: Preguntas, Noticias, Profesionales — is that priority
    order? What does the counselor most want clicked?
27. Header shows "Consejera Escolar" + a name + a school name. Is the name a
    person or a department? Singular "Consejera" implies one person.
28. School logo/crest available? School colors — do they clash with this
    palette? (This matters; districts get territorial about brand.)
29. Is there a district-level site this must link back to or visually match?
30. Mobile: your spec says avatar stationary at top + a bubble on each button.
    Should the avatar shrink on scroll into a small corner helper, or scroll
    away? **[REC: scroll away. A sticky character eats phone screen.]**
31. Landscape phone / tablet — a third breakpoint, or just phone + desktop?
32. Does keyboard focus (Tab) trigger the avatar point? It must, for
    accessibility. Confirm you want that.
33. Footer: what's legally required — district address, non-discrimination
    notice, accessibility statement, Title IX contact? Districts usually have a
    mandated footer block. Ask the school for theirs.

## D. Preguntas y Guías

34. Exactly 3 categories forever, or should staff be able to add a 4th?
    **[REC: make categories data, not code. Costs nothing now.]**
35. Exactly 4 questions per category, or "about 4"? **[REC: unlimited.]**
36. Category names? Even placeholders. My guess, based on the ASCA model:
    "Académico", "Personal / Social", "Vocacional y Universidad".
37. Does every question have a video, or is video optional? **[REC: optional —
    forcing a video means empty players or blocked publishing.]**
38. Can one question have text + video + a PDF download? (Permission slips,
    college checklists — PDFs are how schools actually communicate.)
39. **If PDFs: are they accessible PDFs?** A scanned image of a form fails WCAG.
    This is the most common way school sites fail audits. See doc 07.
40. The "( )" with names next to each section — is that *who to ask about this
    topic*, or *who made the guide*? Different labels: "Pregúntale a:" vs
    "Preparado por:".
41. Can one question link to more than one person?
42. Should questions be searchable? **[REC: yes — client-side, ~10 lines.]**
43. Should a question be linkable/shareable? (`/guias/como-pedir-una-cita`)
    **[REC: yes, and it makes the QR poster idea in doc 06 work.]**
44. One accordion open at a time, or many? **[REC: many — people compare.]**
45. Should answers support bold/lists/links, or plain text only? Rich text means
    building or buying an editor. **[REC: a *small* rich text editor — bold,
    italic, bullet list, link. Nothing more. See doc 04.]**
46. Print a single guide? Print all guides as a packet? **[REC: both, cheap.]**
47. "¿Te sirvió esta guía?" thumbs up/down — anonymous, aggregate only. Yes/no?
48. Is any guide parent-only or student-only?

## E. Noticias

49. How often will announcements actually be posted — weekly, monthly, twice a
    year? Be honest. A site showing a 7-month-old "news" item looks dead, and
    the fix (auto-hide + evergreen fallback) has to be designed in from the start.
50. Who writes them — one counselor, or several staff?
51. Do announcements need approval before going public, or does whoever wrote it
    publish it? **[REC: no approval step at v1. Add if the principal asks.]**
52. Does a post ever need **scheduling** ("publish Monday 7am")?
53. Does a post need an **expiry** ("hide after the event")? **[REC: yes. This
    single field is what keeps school sites from rotting.]**
54. Confirm the 8 templates in doc 03 section 6 — which 6 ship first?
55. Can staff change a template *after* publishing without losing the text?
    **[REC: yes — one schema, many skins. That's the whole design.]**
56. Front page: 1 featured + a list, or a grid? What if there are zero
    announcements — what does the page say?
57. **Photo consent:** will announcements include photos of students? Districts
    almost always require signed photo releases. Who checks?
58. Archive: by month, by year, by category, or one long list?
59. Categories/tags for news? ("Becas", "Eventos", "Avisos", "Salud mental")
60. Should news posts show an author linking to their profile? (You said yes —
    confirm the link target is the profile, not an email address.)
61. Emergency banner that overrides everything (school closure, hurricane)? In
    PR this is not hypothetical. **[REC: yes — one toggle, one line of text, top
    of every page, red. Possibly the highest-value feature in this section.]**
62. Comments from students/parents? **[REC: absolutely not. Moderating minors'
    comments is a job nobody at the school has time for.]**
63. Share an announcement to WhatsApp? In PR, WhatsApp *is* the parent
    communication channel. **[REC: yes — WhatsApp first, not Facebook first.]**

## F. Perfiles (the "MySpace" section)

64. **Name it.** My candidates, ranked:
    1. **ConsejeRed** — consejero + red. Reads like a real product name.
    2. **El Pasillo** — "the hallway", profiles as lockers. Strong visual hook.
    3. **MiConsejero** — your suggestion; clearest, least distinctive.
    4. **Nuestra Gente**, **Cuadro de Honor**, **La Sala**

    **[REC: "ConsejeRed" as the product name, "El Pasillo" as the browse page.]**
65. How much MySpace? (a) a nostalgic wink — status line, "Trabaja con" bubbles,
    a personal accent color; (b) full 2005 cosplay — glitter, autoplay song,
    custom backgrounds. **[REC: (a). (b) is funny for one week, then it's
    unreadable for parents and an accessibility failure.]**
66. Can each person pick their own **accent color** from the palette? MySpace
    customization spirit, zero risk. **[REC: yes — best fun-per-effort feature
    in the app.]**
67. "Estado de hoy" / mood line — do it? e.g. "Hoy estoy: aceptando citas".
68. Should the profile show office hours / where to find them physically? (This
    is what students actually need most.)
69. Direct email link on a profile — yes, contact form, or neither?
70. Photo required? What if a staff member declines? (Need a nice initials
    fallback tile in their accent color.)
71. "Trabaja con" — mutual automatically? If A lists B, does B list A?
    **[REC: yes, auto-mutual. Otherwise the graph goes lopsided, teachers
    notice, and feelings get hurt. This is a real social dynamic, not a
    technical detail.]**
72. Is there a hierarchy (director → counselors → aides), or is everyone flat?
    **[REC: flat. Hierarchy in a staff directory creates politics.]**
73. Credentials: free text, or structured (título / institución / año)?
    **[REC: structured — renders consistently, looks far more professional.]**
74. "Works on" — projects, programs, or committees? Wording: "Trabaja en" vs
    "Proyectos" vs "Áreas de apoyo".
75. Non-counselor staff too (bibliotecaria, enfermera, trabajador social)?
    **[REC: yes — one directory beats three.]**
76. Can a profile be hidden without being deleted? **[REC: yes, a "borrador"
    state. People go on leave.]**
77. Order on the browse page: alphabetical, custom drag order, or random each
    load? (Random is charming and politically neutral.)

## G. The `/edit` panel

78. Should `/edit` be a secret URL, or a plain small "Personal" link in the
    footer? **Secret URLs are not security**, and they mostly cause staff to
    forget how to get in. **[REC: a plain footer link + real auth. Keep `/edit`
    working too, as the shortcut you like.]**
79. Confirm you understand: a password checked in browser JavaScript is readable
    by any visitor who opens DevTools. It **must** be checked on the server.
    This is non-negotiable and it's why doc 01 recommends what it does.
80. Are teachers on shared/public computers? Then: short session, obvious
    "Cerrar sesión", no "remember me". **[REC: 8-hour session.]**
81. Will they edit from a **phone**? Teachers do everything on phones. If yes,
    the admin has to be responsive too — that's real work, budget for it.
82. Undo: how far back? **[REC: keep the last 20 versions of every item with a
    "Restaurar esta versión" button. This is the feature that saves you a
    panicked phone call at 9pm.]**
83. Permanent delete, or a "Papelera" they can recover from? **[REC: papelera,
    30 days. Non-technical users delete things by accident.]**
84. Prevent two people editing the same item? **[REC: don't lock; warn if you
    can, otherwise last-write-wins plus version history.]**
85. Do they need to upload images? Then: who resizes the 8 MB phone photo?
    **[REC: the browser, before upload. See doc 04 section 7.]**
86. Preview side-by-side with the form, or a separate "Ver cómo quedará" button?
    **[REC: side-by-side on desktop, a button on phone. Side-by-side is what you
    described and it's the right call.]**
87. What happens if they close the tab mid-edit? **[REC: autosave to draft every
    3s + "Guardado hace un momento". Never lose a teacher's work.]**
88. Panel in Spanish — confirm no English jargon at all: no "slug", no
    "metadata", no "publish/unpublish".
89. Do you want a **one-page printed Spanish cheat sheet** for staff? **[REC:
    yes. It's the difference between a site they use and one they don't.]**
90. A "modo práctica" sandbox where a nervous teacher can try things without
    publishing? (Cheap: it's draft mode with a friendly label.)

## H. Global / polish

91. Dark mode? **[REC: skip v1. Nice-to-have, doubles design QA.]**
92. English version ever? **[REC: don't build it, but key the content model by
    locale from day one. Free now, costly later.]**
93. Offline support (PWA)? For a PR school, "the guides still work when the power
    is out" is genuinely valuable. See doc 06 section 6.
94. Analytics — do you want to know what's popular? **[REC: cookieless, no-PII
    only. Never Google Analytics on a minors' site without a district data
    agreement.]**
95. Custom domain, or a free `*.vercel.app` URL?
96. Does the school have an existing site this replaces or lives inside?
97. How will students find this? QR in the hallway, a link in Google Classroom,
    morning announcements? (Changes what the landing experience should be.)
98. Do you want a favicon / app icon designed? (Yes — see doc 05, prompt 10.)
99. Indexable by Google, or unlisted? **[REC: indexable, unless it contains
    anything student-specific.]**
100. Any easter eggs allowed, or strictly buttoned-up? I have three in doc 06
     section 9 that survive a principal's review.
101. Do you want a `/creditos` page naming the student who built it? (Say yes.
     It's your work.)
102. Any brand rules from the district — required logo placement, font, "colors
     must match district blue"? Get this *before* design, not after.
103. Who maintains this after you? Doc 08 has a handoff section to fill in.
104. What is the one thing that, if this site did it well, would make the
     counselor say "this is better than what we had"? Build that first.
