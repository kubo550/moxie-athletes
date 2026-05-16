// Per-device record of teams this user created (and therefore has the coachKey
// for). Used to surface a "Your Teams" entry point on the landing page so a
// coach can find their dashboard after navigating away.
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '@/utils/localStorage';

const KEY = 'moxie_coach_keys';

export type CoachTeamRecord = {
  coachKey: string;
  name: string;
  createdAt: number; // ms epoch
};

type StoredMap = Record<string, CoachTeamRecord | string>;

const readRaw = (): StoredMap => getFromLocalStorage<StoredMap>(KEY) ?? {};

const normalize = (
  raw: CoachTeamRecord | string,
  teamCode: string
): CoachTeamRecord => {
  if (typeof raw === 'string') {
    return { coachKey: raw, name: teamCode, createdAt: 0 };
  }
  return raw;
};

export const getCoachTeams = (): Array<
  CoachTeamRecord & { teamCode: string }
> => {
  const raw = readRaw();
  return Object.entries(raw)
    .map(([teamCode, value]) => ({ teamCode, ...normalize(value, teamCode) }))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const getCoachKey = (teamCode: string): string | null => {
  const raw = readRaw();
  const entry = raw[teamCode];
  if (!entry) return null;
  return typeof entry === 'string' ? entry : entry.coachKey;
};

export const saveCoachTeam = (
  teamCode: string,
  coachKey: string,
  name: string
) => {
  const raw = readRaw();
  raw[teamCode] = {
    coachKey,
    name,
    createdAt: Date.now(),
  };
  setToLocalStorage(KEY, raw);
};

export const forgetCoachTeam = (teamCode: string) => {
  const raw = readRaw();
  delete raw[teamCode];
  setToLocalStorage(KEY, raw);
};
