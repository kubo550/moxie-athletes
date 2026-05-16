// Helpers that emit a team event + bump the right aggregate counters on the
// team doc, for every team the athlete is on. All writes are best-effort;
// nothing here should ever block the athlete UX.
import type {
  AthleteBand,
  TeamMembership,
} from '@/infrastructure/athleteBands';
import { appendTeamEvent } from '@/infrastructure/teamEvents';
import {
  incrementTeamCounter,
  recordTeamConfidence,
  recordTeamMantra,
} from '@/infrastructure/teams';
import { formatActor } from '@/infrastructure/teamEvents';

const safe = (p: Promise<unknown>) =>
  p.catch((err) => console.warn('team-emit failed', err));

export const emitGameDayComplete = (band: AthleteBand) => {
  if (!band.teamMemberships.length) return;
  band.teamMemberships.forEach((m) => {
    safe(incrementTeamCounter(m.teamCode, 'totalGameDays'));
    safe(
      appendTeamEvent({
        teamCode: m.teamCode,
        type: 'gameday',
        message: `${formatActor(m.nickname)} completed Game-Day Mode${
          band.mantra ? `: "${band.mantra}"` : ''
        }`,
        nickname: m.nickname,
      })
    );
    if (band.mantra) safe(recordTeamMantra(m.teamCode, band.mantra));
  });
};

export const emitPostGame = (band: AthleteBand) => {
  band.teamMemberships.forEach((m) => {
    safe(incrementTeamCounter(m.teamCode, 'totalPostGames'));
    safe(
      appendTeamEvent({
        teamCode: m.teamCode,
        type: 'postgame',
        message: `${formatActor(m.nickname)} logged a post-game reflection`,
        nickname: m.nickname,
      })
    );
  });
};

const STREAK_MILESTONES = new Set([3, 7, 14, 21, 30, 60, 90, 180, 365]);

export const emitStreakIfMilestone = (
  band: AthleteBand,
  newStreakCount: number
) => {
  if (!STREAK_MILESTONES.has(newStreakCount)) return;
  band.teamMemberships.forEach((m) => {
    safe(
      appendTeamEvent({
        teamCode: m.teamCode,
        type: 'streak',
        message: `${formatActor(m.nickname)} is on a ${newStreakCount}-day streak 🔥`,
        nickname: m.nickname,
      })
    );
  });
};

export const emitMentalRep = (memberships: TeamMembership[]) => {
  memberships.forEach((m) => {
    safe(incrementTeamCounter(m.teamCode, 'totalMentalReps'));
  });
};

export const emitConfidence = (band: AthleteBand, confidence: number) => {
  band.teamMemberships.forEach((m) => {
    safe(recordTeamConfidence(m.teamCode, confidence));
  });
};
