# Ideas Worth Stealing

You asked for suggestions that don't usually come up. These are ranked roughly
by value-per-hour-of-work. Numbers 1, 4, 6 and 11 are the ones I'd fight for.

---

## 1. Make the student/parent choice actually *do* something

Right now the entry gate asks who you are and then... nothing changes. That's a
question with no payoff, and users notice.

Instead, let the answer become a **lens** over the same content:

| | Estudiante | Madre / padre / encargado |
|---|---|---|
| Homepage order | Preguntas first | Noticias first |
| Tone of section blurbs | "Busca respuestas rápidas" | "Manténgase informado" |
| Guides shown first | Personal / social | Académico, becas, requisitos |
| Profile card emphasis | "Dónde encontrarla" | "Credenciales y contacto" |

A persistent header chip — **"Viendo como: Estudiante ▾"** — lets anyone switch
in one click, so nothing is hidden and nothing is lost. It's one field in
`localStorage` and a few conditional sorts.

This is one site that feels like two, for maybe four hours of work, and it's
the answer to "why did you ask me who I am?"

---

## 2. Name the avatar, and let the students name it

Run a one-week poll — paper ballots in the counselor's office. The winning name
goes in the code. You now have a character students refer to by name, and a
hundred students who feel a small ownership of the school website.

This costs nothing and it is the single highest-leverage thing you can do for
adoption. Software people almost never think of it because it isn't software.

---

## 3. Physical–digital bridge: print the QR, hang it in the hallway

Every guide and every announcement is deep-linkable (doc 02). So add one admin
button: **"Imprimir afiche"**. It generates a print-ready 8.5x11 sheet with the
headline, the key detail, and a big QR code back to the web version.

The counselor prints it, staples it to the corkboard outside her office, and
every student who walks past can scan it. That's how you get traffic to a school
website — not SEO. Hallways.

Generate the QR client-side; it's a small dependency and no server round-trip.

---

## 4. Real print stylesheets

Not "print the page badly". A genuine `@media print` pass on every guide,
announcement and profile: drop the nav, drop the avatar, black text on white,
expand every accordion, and **print the destination of every link in
parentheses after its text** (`a[href]::after { content: " (" attr(href) ")" }`).

Why this matters more here than on a normal site: a meaningful fraction of
parents will not read this on a screen. They'll get a paper copy in a student's
backpack. Guides about financial aid, permission requirements, and graduation
checklists get printed and handed out. Make the paper version good on purpose.

Roughly 40 lines of CSS. Almost nobody does it. It is very noticeable.

---

## 5. "Modo Calma"

A small toggle in the header — a moon or a leaf icon — that:
- desaturates the bright accents to their muted equivalents
- removes all motion and the avatar's animation
- increases line spacing
- switches to a heavier, more legible body weight

This is a **school counseling** site. Some of the people arriving here are
anxious, overstimulated, or neurodivergent, and a wall of hot pink and
turquoise is genuinely hostile to them. Offering a calm version is both a
kindness and, in this specific context, thematically perfect. It also happens
to cover several accessibility bases at once.

Implementation: one `data-modo="calma"` attribute on `<html>` and an alternate
set of CSS custom property values. Because the whole palette is already
tokenized (doc 03), this costs one CSS block.

---

## 6. Offline mode

If this is Puerto Rico, this stops being a nice-to-have. Make it a PWA with a
service worker that caches all guides and the most recent announcement.

Then, when the power or the network is out, a student opens the site and sees:
**"Estás sin conexión. Estas guías siguen disponibles."** and the guides work.

During and after a storm, when a school website is *most* needed, is exactly
when it is normally unreachable. Also delivers a real "add to home screen"
install, which makes it feel like an app rather than a bookmark.

---

## 7. "Ediciones anteriores" as an actual stack of newspapers

The news archive shouldn't be a list of links. Render it as **overlapping
folded newspaper front pages**, stacked by month, slightly rotated, that fan
out when you hover a month. Click one and it opens.

Same data, same routes, ten times more memorable. Costs some CSS transforms.
This is the kind of thing that makes a student show the site to a friend.

---

## 8. The three anti-rot features

School websites don't die at launch, they die in month seven. Three cheap
defenses, all specified elsewhere in these docs:

1. **`expiraEn`** on announcements — content deletes itself (doc 02).
2. **"1 vence pronto"** on the admin home — the site nudges staff (doc 04).
3. **A graceful empty state.** When there are no current announcements, don't
   show a blank page or a stale item. Show something evergreen: "Mientras
   tanto, estas guías te pueden ayudar" plus the three most-viewed guides. The
   site should never look abandoned, even when it is.

Design the empty state as carefully as the full state. Most projects don't, and
the empty state is what a surprising number of visitors actually see.

---

## 9. Three easter eggs that survive a principal

1. **The avatar reacts to the clock.** Before 7am: "¿Tan temprano?" After 10pm:
   "Deberías estar durmiendo 😴". On the last day of school it says something
   different. Pure string lookup, zero risk, students absolutely notice.
2. **Konami code → "modo fiesta"**: confetti in the palette colors for three
   seconds, then back to normal. Nothing breaks, nothing persists, and it's
   disabled under `prefers-reduced-motion`.
3. **A hidden `/gracias` page** thanking the staff by name, linked only from a
   tiny dot in the footer. Teachers find it eventually. It's a good day when
   they do.

Skip anything that alters content, hides information, or can't be exited.

---

## 10. Two words about the "Trabaja con" graph

Beyond auto-mutuality (doc 02 section 3): once you have the graph, you can
render a small **"Conoce al equipo"** node diagram on the ConsejeRed landing
page — dots in each person's accent color, lines between colleagues. It's
honest data visualization, it's pretty, and it communicates "these people work
together" faster than any paragraph.

Keep it decorative and non-essential, with a plain text list underneath for
screen readers.

---

## 11. Write the teacher cheat sheet as a deliverable

One page. Spanish. Six screenshots. Printed and taped inside a drawer:

1. Cómo entrar al panel
2. Cómo escribir un anuncio
3. Cómo escoger el diseño
4. Cómo poner una foto
5. Cómo deshacer un error
6. A quién llamar si algo falla

This is not documentation busywork. A CMS that nobody remembers how to use is
a CMS that gets used twice. This page is the difference between the project
being *finished* and the project being *adopted*, and it takes an afternoon.

Put a link to it inside the admin as a permanent "¿Necesitas ayuda?" button.

---

## 12. Things I'd advise against

- **Comments.** Moderating comments from minors is a real job, and nobody at
  the school has it.
- **A live chat widget.** Same problem, plus it implies someone is watching,
  and if the message is a crisis, nobody is.
- **Autoplaying anything.** WCAG failure and universally hated.
- **A login wall for students.** It kills usage instantly and creates the
  privacy exposure of doc 07.
- **Full MySpace mode** — custom CSS per profile, glitter, profile songs. Funny
  for one week; then it's unreadable, inaccessible, and permanent.
- **Google Analytics.** On a minors' site without a district data agreement,
  don't. Use a cookieless, no-PII alternative or nothing.

---

## 13. If you want one "wow" feature

**The template picker with live thumbnails** (doc 04 section 5). Watching your
own announcement instantly redraw as a 1920s newspaper, then a handwritten
note, then a chalkboard — with your real words in it, in ten seconds, risk-free
— is the demo that will make the counselor say yes to everything else.

Build that early, even before it's wired to a database. It's your pitch.
