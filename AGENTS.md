# Agent Instructions

Conventions for AI assistants and contributors working on this codebase.

## Copy style

**No em-dashes (`—`) in user-facing strings.** Replace them with periods,
commas, colons, or sentence splits. Em-dashes create long visual pauses that
read as AI-generated and break the punchy, sport-serious tone we want.

Applies to:
- JSX text content
- `usePageMeta` titles / descriptions
- `usePageMeta` social-share copy
- Coach greetings, suggestions, error messages, button labels
- `<meta>` content in `index.html`
- Quote and challenge text in `src/config/`
- Comments in code (for stylistic consistency; not strictly user-visible but
  keeps the codebase uniform)

### How to replace

| Original pattern                       | Use instead             |
| -------------------------------------- | ----------------------- |
| `Eyes up — you got this`               | `Eyes up. You got this` |
| `Built for athletes — middle school…`  | `Built for athletes. Middle school…` or `Built for athletes: middle school…` |
| `What happened — and what next?`       | `What happened, and what next?` |
| Page title `X — Moxie Athletes`        | `X · Moxie Athletes`    |
| Quote attribution `— Author`           | `· Author`              |

### What stays

- En-dash `–` (U+2013) as a **missing-value placeholder** in stat displays
  (e.g. `value={confidence ?? '–'}`). It's a visual marker, not prose.
- Hyphen `-` in compound words (`pre-game`, `4-4-4-4`, `Game-Day Mode`).

### Tone reminders

- Sport-serious, locker-room punchy. Short sentences. Verbs. No motivational
  fluff like "you got this 💪✨".
- Athletes 12-22 years old. Voice should sound like a coach, not a wellness
  app.
- Don't editorialize within product copy. State actions.

## Tech invariants

- Mobile-first; test at iPhone width (375px) in DevTools.
- `100dvh` instead of `100vh` for full-screen layouts (iOS Safari address bar).
- All Firestore writes are best-effort for team/event aggregates; never block
  athlete UX on them.
- Privacy-first: coach dashboard never shows individual mantras, confidence
  scores, or post-game reflections. Aggregates only. Roster shows nickname +
  join date only.
- No auth. Identity is `bandId` in URL + `crypto.randomUUID()` device
  fingerprint in localStorage. Edit gates check fingerprint match.

## File patterns

- New page: `src/pages/XPage.tsx`, route in `src/App.tsx`, set
  `usePageMeta({ title, description?, noindex? })` first thing in the
  component. `noindex: true` for everything under `/g/:bandId/*`,
  `/team/:teamCode/*`.
- New Firestore helper: `src/infrastructure/<domain>.ts`. Pure
  read/write functions, no UI. UI components/hooks call these.
- New shared UI component: `src/components/<Name>.tsx`. shadcn primitives
  live in `src/components/ui/`.

## TypeScript

- `noUnusedLocals` + `noUnusedParameters` are on. Don't leave dead vars.
- Avoid `any`. Prefer `unknown` + narrowing.
- Use `type` imports (`import type { X }`) where possible.
