# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary — students.** Spanish-speaking teenagers at a Puerto Rico high
school. They arrive on a cheap Android phone, on cell data, in a hallway
between classes, with about thirty seconds and one specific question. Many
arrive because they saw something on paper and want the rest of it.

**Secondary — madres, padres y encargados.** In Puerto Rico "encargado" is
the accurate word: grandmothers, aunts and other guardians raise a meaningful
share of these students, and "padres" excludes them. They arrive to find out
what is happening at the school, often from a link forwarded on WhatsApp.

**Editor — one person.** The school counselor. Not technically trained. She
is the *only* person who will log in and publish. Confirmed, not assumed.

## Product Purpose

The counseling office currently has **no digital channel at all**. What
guidance exists reaches people through a hallway corkboard and printed
circulars sent home in backpacks. Both disappear: the paper comes down, the
circular is lost, and the information is gone.

This gives the office a place to publish guides, announcements and
who-to-ask-about-what, that outlives the day the paper was on the wall.

Success is a student who finds an answer without having to ask, and a
counselor who still uses the tool in month seven.

## Positioning

Not a school website and not a CMS. It is a publishing tool **sized for one
non-technical person with no budget and no technical support** — and every
mechanism in it exists to survive that fact:

- Announcements carry an expiry date and retire themselves, so the site
  cannot rot when nobody has the job of cleaning it up.
- Publishing is one short form and six formatting buttons; the visual variety
  comes from eight templates over one schema, not from more work.
- Accessibility is enforced at the moment of authoring, in plain Spanish, so
  compliance does not decay when the person who built it is gone.

A generic school-site builder cannot truthfully claim any of those, because
they are all consequences of designing for a single unsupported editor.

## Operating Context

- **The incumbent channel is paper, and it continues.** A hallway corkboard
  and backpack circulars. The site does not replace them; it has to *reach*
  them. Printing and QR are load-bearing, not extras.
- **Puerto Rico.** Hurricane season means power and network outages, and a
  school site matters most exactly when it is least reachable.
- **WhatsApp is the parent channel.** An announcement that cannot be
  forwarded in two taps is not shared at all.
- **School-year rhythm.** Long quiet stretches over summer with no edits and
  little traffic. Any dependency that sleeps, pauses or expires during that
  window is a dependency that breaks the site every July.
- **The editor works alone**, likely from a phone, in gaps between students.

## Capabilities and Constraints

- **Spanish only.** The content model is keyed by locale but only `es` is
  populated, and no second language is planned.
- **$0 budget, permanently.** All infrastructure sits on free tiers of
  accounts the developer personally owns (GitHub, Vercel).
- **No personal data is collected.** No name, no email, no IP, no tracking
  cookie. The only server-side record is an anonymous monthly count of which
  of three buttons was pressed.
- **Content lives as JSON in the git repository**, written through the GitHub
  API. There is no database.
- **Publish-only.** The site does not receive information from students. No
  comments, no contact form, no appointment booking, no anonymous question
  box. The one read-only exception is a free/busy availability calendar.
- **Videos are YouTube links**, never self-hosted.
- **This is a personal project for a family member — not district property.**
  It is not operated by the school or the Departamento de Educación, which is
  why ADA Title II and PR Ley 229 do not legally bind it.

**Explicitly undecided:**

- The real name of the school and of the counselor. Both are placeholders
  (`Escuela Superior [Nombre]`, `Sra. [Nombre Apellido]`).
- Whether anyone other than the counselor ever appears as a profile. Only one
  person edits; whether the site still presents a *team* is open.
- Whether the school or district ever adopts it. If they do, the accessibility
  obligations above land immediately and with no grace period.

## Brand Commitments

- **Name:** Consejería Escolar.
- **Palette:** pinned by the user from three reference screenshots, with blue
  as the anchor. Binding.
- **Language:** Spanish throughout, using Puerto Rico terminology —
  "encargado", not "padre".
- **Section naming:** the staff area is **ConsejeRed**; its browse page is
  **El Pasillo**. Chosen deliberately over "MiConsejero".
- **No school logo or crest exists.** The header shows a placeholder.

## Evidence on Hand

**There is none yet, and future work must not invent any.**

- All 20 content records are Lorem Ipsum.
- All four staff profiles — María Rivera, Luis Colón, Ana Santos, Carmen
  Méndez — were fabricated as seed data by the developer. **They are not real
  people.** Only one real person is involved.
- Zero photographs. No logo. No documents. No captions.

Real content is expected from the counselor **within the next few weeks**.
Until it arrives, nothing may state or imply a staff name, a credential, a
school name, a testimonial, a visitor count, or any other fact about the real
office.

## Product Principles

1. **One person maintains this.** Any feature that assumes a second editor,
   an administrator, or a support channel is a feature that will fail.
2. **It replaces paper, so it must reach paper.** Print output and QR codes
   are part of the product, not decoration.
3. **Never collect what is not needed.** The counter is a number and can
   never become a person. A counselor knowing which student read the guide
   about anxiety is exactly the chilling effect that stops them reading it.
4. **Publish, do not receive.** Accepting student information would make this
   a different product with a duty of care nobody is staffed to meet.
5. **Content goes stale before it goes missing.** Design for expiry and
   graceful emptiness, not for accumulation.

## Accessibility & Inclusion

WCAG 2.1 AA is the working standard. It is **not** legally binding here — a
personal project is not a Title II public entity — so the reason is the
audience, not the deadline:

- Students with low vision, dyslexia, and students who navigate by keyboard.
- Cheap Android phones, cell data, and sunlit hallways, which is where
  low-contrast and heavy pages actually fail.
- `lang="es"` throughout, so screen readers use Spanish pronunciation.
- Motion sensitivity, and a quiet mode for anxious or overstimulated visitors
  arriving at a counseling site.

If the school ever adopts the site, these become legal obligations on day one
with no transition period. That is the reason to hold the standard now.
