# Moxie Athletes

Mental Performance System for middle school, high school, and college
athletes. NFC / QR bracelet + web app + coach dashboard. No login. The band
is the account.

> **Looking for product usage docs?** See `USER_GUIDE.md`.
> **Working on the codebase?** Read `AGENTS.md` first.

## Stack

- React 18 + TypeScript + Vite + SWC
- React Router 7
- Firebase (Firestore) shared with `moxie-daily`, registered as a separate
  Firebase app named `moxie-athletes`
- Framer Motion, Tailwind 4, shadcn primitives, Axios, nanoid
- `vite-plugin-pwa` for offline / install-to-home-screen

## Setup

```sh
cp .env.example .env   # fill in Firebase + backend URL
npm install
npm run dev
```

## Routes

### Public

| Path        | Page                                              |
| ----------- | ------------------------------------------------- |
| `/`         | Landing. Shows "Your Teams" if any are saved.     |
| `/about`    | What Moxie Athletes is.                           |
| `/team/new` | Coach creates a team.                             |

### Athlete (band-aware)

| Path                          | Page                                            |
| ----------------------------- | ----------------------------------------------- |
| `/g/:bandId`                  | Activate (first tap) or Game-Day Mode (returning). |
| `/g/:bandId/home`             | Athlete home with mantra, reps, team feed, etc. |
| `/g/:bandId/edit`             | Edit mantra (device-fingerprint gated).         |
| `/g/:bandId/postgame`         | 90-second post-game reflection.                 |
| `/g/:bandId/breathe`          | Performance breathing presets.                  |
| `/g/:bandId/coach`            | AI Coach list.                                  |
| `/g/:bandId/coach/:coachId`   | AI Coach chat.                                  |
| `/g/:bandId/tracker`          | Confidence / focus / energy tracker.            |
| `/g/:bandId/wallpaper`        | Daily wallpaper viewer + download.              |

### Team

| Path                            | Page                                          |
| ------------------------------- | --------------------------------------------- |
| `/join/:teamCode`               | Athlete joins a team via coach-shared link.   |
| `/team/:teamCode/coach`         | Coach dashboard (gated by coach key in URL or localStorage). |

The `/breathe`, `/coach`, `/tracker` paths also work unbranded, but the
tracker enters an empty state without a band.

## Identity model

- No auth. The bandId in the URL + a localStorage `crypto.randomUUID()`
  fingerprint are the identity.
- Edit access (mantra, etc.) requires the fingerprint to match the one
  stored at activation.
- Firestore collections:
  - `athleteBands/{bandId}`: per-band state (mantra, sport, streak,
    confidence log, journal log, team memberships)
  - `teams/{teamCode}`: team aggregates + coach key
  - `teams/{teamCode}/members/{bandId}`: roster (display name, joined at)
  - `teamEvents/{eventId}`: feed events (gameday, postgame, streaks, etc.)

## Generate band IDs for manufacturing

```sh
npm run generate:bands -- --count 1000
npm run generate:bands -- --count 500 \
  --domain https://moxieathletes.com \
  --out band-ids.csv
```

CSV columns: `id,url`. Hand to the bracelet manufacturer for bulk NFC
encoding.

## Code conventions

See `AGENTS.md`. The big ones:

- No em-dashes (`—`) in user-facing copy.
- Mobile-first. Test at 375px width.
- Privacy-first. Coach dashboards never show individual athlete data.
- All team aggregate writes are best-effort. They must never block the
  athlete UX.

## Open placeholders

Code is annotated with `// TODO(jake)` for items that need real assets or
production decisions:

- Final domain (default placeholder is `moxieathletes.com`)
- Final color palette + logo (current accent: electric green `#39ff14`)
- Lock In / Halftime / Pre-Game audio MP3s
- Real wallpaper artwork (currently generative SVGs)
- AI coach system prompts (frontend sends `coachType`)
- Firestore security rules. Currently MUST be tightened before launch.
  See `USER_GUIDE.md` privacy section.

## Reference

The sibling repo `../moxie-daily` is read-only reference. Components and
patterns were adapted, not imported.
