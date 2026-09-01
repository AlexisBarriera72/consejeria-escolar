# Accessibility & Legal

> ## ⚠ Correction — read this first
>
> This document was written assuming the site was **district property**. It
> isn't: it's a personal project for a family member. That means **ADA Title II,
> PR Ley 229, COPPA and FERPA do not legally bind this site.** See
> [`09-DECISIONES.md` §3](09-DECISIONES.md) for the reasoning.
>
> **The checklist in section 4 stays exactly as written.** Only the motivation
> changes:
>
> - Students at this school are blind, dyslexic, or navigate by keyboard. They
>   are the reason, not a deadline.
> - The day the school links to or adopts this site, every obligation below
>   lands at once with no grace period. Building it right costs nothing now.
>
> Sections 1–3 below are retained as reference for that day, and because they
> are what makes the case if you ever pitch this to the district.

Retrofitting accessibility after mockups are approved is where projects lose
weeks. Nothing here blocks a single feature you asked for. It changes *how* a
few of them are built.

---

## 1. ADA Title II — this site is a regulated public entity

A public school district website falls under **ADA Title II**. The DOJ's web
accessibility rule sets **WCAG 2.1 Level AA** as the technical standard, and it
covers not just pages but **PDFs, online forms, and third-party platforms** used
to deliver public services — so the guides' PDF attachments and your embedded
YouTube videos are both in scope.

**The deadlines moved.** DOJ extended them by one year after districts and
higher-ed associations reported they couldn't meet the originals:

| Entity size | Deadline |
|---|---|
| Serving 50,000+ | **April 26, 2027** |
| Serving under 50,000 | **April 26, 2028** |

Today is September 2026, so there's real runway — but this site will be *built*
inside that window, and building it right the first time is free while fixing
it later is not.

## 2. Puerto Rico — Ley 229 de 2003 (if applicable, see BLOCKER Q2)

If this is a Puerto Rico school, a second regime stacks on top:

- **Ley Núm. 229 del 2 de septiembre de 2003** (amended by Ley 154 de 2016)
  obligates every public entity of Puerto Rico that has or develops a web page
  to comply with its accessibility design requirements.
- Pages must be evaluated with an accessibility validator against **WCAG 2.1 or
  the most current version at the time of evaluation**.
- **OGP and PRATP conduct inspections or monitoring at least once a year.**

That last point is the practical one: this is not theoretical compliance that
nobody checks. Somebody runs a validator against government pages annually.

Build the `/accesibilidad` page (an accessibility statement with a contact
method for reporting barriers) — it's expected under both regimes and it's an
hour of work.

---

## 3. Student privacy — the entry gate

This is BLOCKER Q1, and here is the reasoning behind my recommendation.

**COPPA** requires verifiable parental consent before collecting personal
information from children under 13 — and "personal information" explicitly
includes **a child's name or contact information**. There *is* a school-consent
exception: a school can consent on behalf of parents, but only where the
information is collected for the use and benefit of the school and for no other
commercial purpose. Privacy specialists also warn that a blanket start-of-year
sign-off may not be valid notification for a specific service.

**FERPA** requires written guardian authorization before information from a
student's education records is released to outside apps and websites.

**Also relevant:** children age out of COPPA at 13, but 17 of the 20 state
comprehensive privacy laws currently in force reach past age 13 — so "they're
in high school" is not the exemption people assume it is.

### What this means concretely

| Design | Legal weight |
|---|---|
| Name + email stay in `localStorage`, never sent anywhere | **Essentially none.** No collection = nothing to consent to. |
| Name + email POSTed to a server and stored | COPPA + FERPA analysis, privacy notice, retention policy, district legal review |
| Name + email used for email/newsletter | All of the above, plus consent records |

**Recommendation: keep it client-side.** You get the entire warm experience —
"Hola, María" in the header, remembering their choice, personalizing the
homepage — with zero data leaving the browser and zero legal surface.

If you go that route, one line of honest copy on the gate does a lot of work:

> *"Esto se guarda solo en tu navegador. No lo enviamos a ningún lado."*

And it has the advantage of being true.

---

## 4. The checklist that actually catches problems

### Design phase
- [ ] Every text/background pair measured, not eyeballed (doc 03 table)
- [ ] Nothing communicated by color alone — status needs an icon or a word too
- [ ] Focus ring visible on every interactive element, in every mockup
- [ ] Tap targets 44x44px minimum
- [ ] Text can zoom to 200% without content being cut off
- [ ] Decorative fonts checked for `ñ ¿ ¡ á é í ó ú ü ÁÉÍÓÚ` (doc 03 section 3)

### Build phase
- [ ] `<html lang="es">` — screen readers pick the wrong voice without it
- [ ] Real semantic landmarks: `header`, `nav`, `main`, `footer`
- [ ] Heading levels never skip (h1 → h2 → h3)
- [ ] Accordions use `<button aria-expanded>`, not clickable `<div>`s
- [ ] The entry modal traps focus, closes on Esc, returns focus on close
- [ ] Avatar image is `alt=""` (decorative) — the bubble text is the content
- [ ] Every content image has real alt text, enforced at authoring (doc 04 §6)
- [ ] `prefers-reduced-motion` honored everywhere
- [ ] Whole site operable by keyboard alone — tab through it with no mouse
- [ ] "Saltar al contenido" skip link as the first focusable element
- [ ] Form errors announced, not just colored red

### Content phase
- [ ] **Every video has real captions.** Auto-captions corrected by a human.
      Budget 3x the video's runtime. This is the deadline risk on this project.
- [ ] PDFs are real text, not scans of paper. A scanned form is a hard fail and
      it is the most common way school sites fail an audit.
- [ ] No "haz clic aquí" link text — links must make sense read out of context
- [ ] No text baked into images

### Before launch
- [ ] axe DevTools clean on every page type
- [ ] Lighthouse accessibility 95+
- [ ] One full pass with a real screen reader (NVDA is free) in Spanish
- [ ] One pass with the keyboard only
- [ ] One pass on a cheap Android phone on cell data
- [ ] `/accesibilidad` statement published with a contact for reporting barriers

---

## 5. Where this project is most likely to fail an audit

Ranked by probability, from experience with sites shaped like this one:

1. **Videos without corrected captions.** Highest risk, entirely a content
   problem, and the easiest to postpone until it's too late. Start early.
2. **Scanned PDFs.** The school will hand you a photographed permission slip.
3. **Bright color carrying text** — exactly what doc 03's table prevents.
4. **The decorative announcement templates** — chalkboard and handwriting are
   where contrast quietly dies. Keep decoration behind the text layer.
5. **The entry modal** — focus trapping and Esc handling are easy to skip.
6. **Missing alt text** — which is why the Semáforo blocks publishing without it.

Four of those six are content problems, not code problems. That's why the
accessibility traffic light in the admin (doc 04 section 6) is the highest-value
compliance feature in the whole build: it moves the check to the moment of
authoring, where the person who can fix it is already sitting.

---

## Sources

- [DOJ Extends ADA Title II Web Compliance Deadline](https://accessible.org/news/doj-extends-ada-title-ii-web-compliance-deadline/)
- [DOJ Extends Title II ADA Web Accessibility Rule Compliance Deadlines](https://www.consumerfinancialserviceslawmonitor.com/2026/04/doj-extends-title-ii-ada-web-accessibility-rule-compliance-deadlines-for-state-and-local-governments/)
- [Public School ADA Title II Website Compliance Requirements](https://www.accessibility.works/blog/k-as-public-school-digital-web-accessibility-compliance/)
- [ADA Title II Web Accessibility Requirements for Public Entities](https://titleii.org/title-ii-web-accessibility)
- [Ley Núm. 229 del 2 de septiembre del 2003 (PRATP)](https://www.pratp.upr.edu/accesibilidad-paginas-web/ley-num-229-del-2-de-septiembre-del-2003-ley-para-garantizar-el-acceso-de-informacion-a-las-personas-con-impedimentos/)
- [Guías de Accesibilidad de la Ley 229 para Páginas Web de Agencias del Gobierno de PR](https://www.pratp.upr.edu/accesibilidad-paginas-web/guias-de-accesibilidad-de-la-ley-229-para-paginas-web-de-agencias-del-gobierno-de-puerto-rico/)
- [Accesibilidad Digital — Gobierno de Puerto Rico](https://www.accesibilidad.pr.gov/)
- [COPPA and Schools: The (Other) Federal Student Privacy Law, Explained — EdWeek](https://www.edweek.org/technology/coppa-and-schools-the-other-federal-student-privacy-law-explained/2017/07)
- [Legal Overview: Key Laws Relevant to the Protection of Student Data — EFF](https://www.eff.org/issues/student-privacy/legalanalysis)
- [FERPA vs COPPA Compliance Guide 2026](https://privacylawmap.com/blog/ferpa-vs-coppa-compliance-student-data-privacy-guide)
- [ASCA National Model](https://schoolcounselor.org/About-School-Counseling/ASCA-National-Model-for-School-Counseling-Programs)
- [Programa de Consejería Profesional en el Escenario Escolar (DEPR)](https://de.pr.gov/secretaria-auxiliar-de-apoyo-integrado/programa-de-consejeria-profesional-en-el-escenario-escolar-pcpee/)
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms) · [Vidstack Player](https://vidstack.io/) · [Next.js Draft Mode](https://vercel.com/docs/draft-mode)
