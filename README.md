# MOXIE Athletes

Mental Performance System for middle school → college athletes.

Bracelet-based, no-login mental ritual app. Each NFC/QR band has a unique URL
(`/g/:bandId`) — tap to set a personal mantra (first time) or run a 60-second
pre-competition ritual (returning).

## Stack

- React 18 + TypeScript + Vite + SWC
- React Router 7
- Firebase (Firestore) — shared with `moxie-daily`, separate Firebase app
- Framer Motion · Tailwind 4 · shadcn primitives · Axios · nanoid

## Setup

```sh
cp .env.example .env   # fill in Firebase + backend URL
npm install
npm run dev
```

## Routes

| Path                       | Purpose                                                |
| -------------------------- | ------------------------------------------------------ |
| `/`                        | Unbranded landing — "Tap your band to begin"           |
| `/about`                   | About the system                                       |
| `/g/:bandId`               | Band entry — activate (first tap) or Game-Day Mode     |
| `/g/:bandId/home`          | Band-aware home (mantra · reps · coach · breathe · tracker) |
| `/g/:bandId/edit`          | Edit mantra (fingerprint-gated)                        |
| `/g/:bandId/breathe`       | Performance breathing presets                          |
| `/g/:bandId/coach`         | AI Coach list                                          |
| `/g/:bandId/coach/:coachId`| Coach chat                                             |
| `/g/:bandId/tracker`       | Confidence / focus / energy daily tracker              |

The `/breathe`, `/coach`, `/tracker` paths also work without a band, but
tracker enters an empty state.

## Identity model

- No auth. The bandId in the URL + a localStorage `crypto.randomUUID()`
  fingerprint are the identity.
- Edit access requires the fingerprint to match the one stored at activation.
- Firestore collection: `athleteBands/{bandId}`.

## Generate band IDs for manufacturing

```sh
npm run generate:bands -- --count 1000
npm run generate:bands -- --count 500 --domain https://moxieathletes.com --out band-ids.csv
```

CSV columns: `id,url`. Hand the CSV to the bracelet manufacturer for bulk
NFC encoding.

## Open placeholders (TODO(jake))

- Final domain (default placeholder is `moxieathletes.com`)
- Final color palette + logo (current accent: electric green `#39ff14`)
- Audio files for Lock In, Halftime, Pre-Game (silent `<audio>` placeholders)
- AI coach system prompts (frontend sends `coachType` to the backend)
- About copy is a starter draft

## Reference

The sibling repo `../moxie-daily` is read-only reference. Components and
patterns were adapted, not imported.
