# Moxie Athletes · User Guide

A walkthrough of how the app works for everyone who'll touch it: athletes,
coaches, and sponsors. No technical background required.

---

## What is Moxie Athletes

A mental-performance system for middle school, high school, and college
athletes. The product has three parts:

1. A physical **NFC / QR bracelet** (the "band") with a unique URL printed
   on it.
2. The **web app** the band opens to: `moxieathletes.com/g/yourbandid`.
3. A separate **coach dashboard** for trainers managing a roster.

No login, no signup. The band is the account.

---

## For athletes

### First tap (activation)

1. Tap your phone to the Moxie band (NFC) or scan the QR.
2. The app opens to your unique URL.
3. Pick your sport (basketball, football, wrestling, etc.).
4. Type your **mantra**: the phrase you'll see before every competition.
   Examples: "I am the storm", "Trust the reps", "Next play".
5. Tap **Lock It In**. You land on your home screen.

> Your mantra is private. Only you see it on this band.

### Game-Day Mode (every tap after activation)

Tap your band before competition. You'll get a 60-second cinematic ritual,
6 steps:

1. **LOCK IN**: pulsing visual, settle your nervous system
2. **BREATHE**: one full 4-4-4-4 box-breath cycle
3. **BELIEVE**: affirmations to silence doubt
4. **VISUALIZE**: see yourself making the play
5. **ATTACK**: intensity ramp, fast pulse, energy spike
6. **OWN THE MOMENT**: your mantra full-screen, tap to begin

First time you trigger Game-Day Mode you'll see a short intro explaining
what it is. After that, it just runs.

### Home screen

Once activated, your home page (`/g/yourbandid/home`) shows:

- **Your mantra** + a big Game-Day Mode button + streak counter
- **Quote of the Day** from elite athletes
- **Today's Mental Reps**: 5 daily mind-game challenges (lock in for first 5
  min of warm-up, encourage a teammate, etc.). Tap to check off.
- **Your team feed** if you've joined a team (see "Joining a team" below)
- **Wallpaper of the Day**: daily phone wallpaper, save to your photos
- Quick links to:
  - **Post-Game**: 90-second reflection after a competition
  - **AI Coach**: chat with 6 mental-game coaches (pre-game nerves, slump
    recovery, etc.)
  - **Breathe**: three performance breathing presets
  - **Tracker**: log confidence, focus, and energy daily, see your trend

### Joining a team

Your coach will send you a link like:

```
https://moxieathletes.com/join/bulldogs-2026-abc1
```

1. **First**, make sure you've already tapped your band at least once on this
   device. The join page needs to know which band is yours.
2. Open the join link.
3. Type a **display name** (optional). This is what teammates and your coach
   see in the team activity feed. Leave it blank to stay anonymous.
4. Tap **Join**. Done.

You can be on multiple teams (school team + club team). When you're on more
than one, tabs appear on your home so you can switch which team feed you're
viewing.

### Editing your mantra

Tap **Edit** in your home page header (only visible on the device that
activated the band). Type a new mantra, save. Other devices see the band
as read-only.

### Lost your band / different device

If you tap your band on a new device, you'll see your mantra and Game-Day
Mode like normal. But you **can't edit your mantra** from a device that
didn't activate the band. This is the only thing protecting your band from
someone else changing it.

---

## For coaches

### Creating a team

1. Go to `moxieathletes.com` or tap **Coach? Create a Team** on the landing
   page.
2. Type your team name (e.g. "Lincoln High Bulldogs JV") and pick the sport.
3. Tap **Create Team**.
4. You'll get two links:

   - **Athlete join link**: share this with your team. Each athlete needs to
     activate their band first, then open this link to join the roster.
   - **Coach dashboard link** (private, with a secret key in the URL):
     bookmark this. It's the only way back to your private dashboard.

Both links are also saved on your device. Returning to `moxieathletes.com`
shows a **Your Teams** section with a tap-to-open button for each.

### The coach dashboard

The dashboard lives at `moxieathletes.com/team/your-team-code/coach`. What
you see:

- **Team aggregate stats**: total Game-Day rituals run, mental reps
  completed, average confidence score (1–10), post-game reflections
- **Most-used mantras** across your team
- **Roster**: list of athletes who've joined, with display name + when they
  joined. You can **remove an athlete** (two-tap confirm: tap X once to arm,
  tap Confirm to remove).
- **Activity feed**: positive events only (game-day completions, streaks,
  post-games). No low scores, no failures, no embarrassing rankings.
- **Invite Athletes**:
  - If no one's joined yet, the invite card is the hero of the page.
  - Once athletes start joining, the invite card collapses to a small
    **Invite** button in the header. Tap it, get a copy/share dialog. Use
    the system share sheet on iPhone / Android to send via iMessage,
    WhatsApp, email, etc.

### Privacy

The coach dashboard **never** shows individual athlete data:

- No individual mantras
- No individual confidence scores
- No individual post-game reflections
- No "who tapped when"

You see counts and averages across the whole team. Athletes pick their own
display name (or stay anonymous).

This is intentional and is the FERPA-friendly line. If you need detailed
1:1 conversations with an athlete, that's a private conversation between
you and them, not data you should ever export from this app.

### Re-sharing the join link

On your dashboard:

- **0 athletes joined**: big invite card front and center.
- **1+ athletes joined**: small **Invite** button in the header. Tap it to
  open the share dialog any time.

### Forgetting your coach link / new device

Your secret coach key is saved in your browser's local storage on the device
you used to create the team. If you switch devices:

1. Make sure you saved the original coach dashboard URL (the one with
   `?key=…` in it) somewhere safe.
2. Open that URL on the new device. The key gets saved locally and you're
   in.
3. Lost the URL entirely? You'll need to recreate the team. There's
   currently no recovery flow (this is a deliberate MVP simplification).

---

## For sponsors

When a local business sponsors a team:

- The sponsor's name and message can be attached to the team. Every Game-Day
  Mode session for athletes on that team shows a subtle **Powered by [Brand]**
  pill at the top of the cinematic ritual.
- Sponsor info also surfaces on the athlete's home page as a card.
- The coach dashboard tracks meaningful metrics (Game-Day completions,
  mental reps, confidence trends) that a sponsor can ask for as a regular
  ROI report.

To set a sponsor on a team, the team data needs to be edited directly
(no UI for this yet). Ask the Moxie team to do it for you.

---

## Daily routines that work

- **Morning**: open your home, do one mental rep. Take a screenshot of the
  wallpaper if it hits.
- **Pre-practice or pre-game**: tap your band. Run Game-Day Mode. 60 seconds.
- **Post-competition**: open Post-Game, answer the 3 questions. 90 seconds.
- **Evening**: open Tracker, log your confidence / focus / energy. 15 seconds.

Total: under 4 minutes a day. Most athletes won't do all of it every day.
That's fine. The point is to make any of these reachable in one tap.

---

## Troubleshooting

**The dashboard says "Couldn't load…"** is usually a Firestore index issue
or a security rules issue. Check the browser console; Firestore prints a
clickable URL to fix it.

**Join page says "Tap your band first"** means you need to have activated a
band on the device first. Open your band URL once, then come back to the
join link.

**Athlete's mantra never changes** means they're on a different device than
the one that activated the band. The original device controls edit access.

**Stale team data**: taps and reps update aggregates asynchronously and
may take a few seconds to show on the dashboard. Refresh.

---

## Privacy summary

- No login, no email, no phone number.
- Each band is identified by a random URL only.
- Each device has its own random fingerprint stored locally.
- Coach dashboards show aggregates only. No individual data.
- Athletes can pick a display name per team or stay anonymous.

If you find something that doesn't match this, that's a bug. Please flag
it.
