# Consejería Escolar — Planning Package

Planning-only repo. No app code yet. Open this folder in VS Code and work
through `docs/` in order.

**Language convention:** these docs are dev-facing and written in English so the
implementation is unambiguous. Every string that a student, parent, or teacher
will ever see is quoted in Spanish and marked `ES:`. The shipped site is 100%
Spanish. Body copy is Lorem Ipsum until the district supplies real text.

## Read in this order

> **Start at [`docs/09-DECISIONES.md`](docs/09-DECISIONES.md).** It records the
> answers given on 2026-09-01 and **supersedes docs 00–08 wherever they
> conflict** — including a withdrawn database recommendation and a corrected
> legal analysis.

| Doc | What it settles |
|---|---|
| **`docs/09-DECISIONES.md`** | **Locked answers. Read first.** |
| **`docs/10-PLAN-DE-ENTREGAS.md`** | **17 sections, ~110 commits, ~18 weeks** |
| `demo/magic-link/` | Runnable auth demo — `node demo/magic-link/servidor.mjs` |
| `docs/00-PREGUNTAS.md` | ~100 open questions. **Answer the 9 BLOCKERS before any code.** |
| `docs/01-arquitectura.md` | Stack, hosting, auth, how `/edit` is actually secured |
| `docs/02-contenido.md` | Content models for Guías, Noticias, Perfiles |
| `docs/03-diseno.md` | "La Oficina" concept, palette w/ measured contrast, type, motion |
| `docs/04-panel-admin.md` | The hidden editor: draft → preview → publish |
| `docs/05-prompts-claude-design.md` | Copy-paste prompts for Claude Design |
| `docs/06-ideas.md` | The unusual suggestions — read this one for fun |
| `docs/07-accesibilidad-legal.md` | ADA Title II, PR Ley 229, FERPA/COPPA, captions |
| `docs/08-roadmap.md` | Build order, 8 phases |

## Three things worth knowing before you open any other file

1. **The entry gate collects nothing.** The goal was a monthly count of
   students vs. parents. That's a number, not an identity — so the name and
   email fields are gone and an anonymous counter replaces them. Full
   reporting, zero personal data. Doc 09 §1.

2. **Supabase is out.** It **pauses free projects after 7 days of inactivity**
   and needs a manual click to wake up. This site goes quiet every summer. The
   content now lives as JSON in this repo, written through the GitHub API —
   free forever, never pauses, and `git log` gives you version history for
   nothing. Doc 09 §2.

3. **The legal weight is lighter than doc 07 implies.** That doc was written
   assuming district ownership. This is a personal project, so ADA Title II,
   PR Ley 229, COPPA and FERPA don't bind it. Doc 07's checklist stays anyway —
   because blind and dyslexic students use this site, and because the day the
   school adopts it, every obligation lands at once. Doc 09 §3.
