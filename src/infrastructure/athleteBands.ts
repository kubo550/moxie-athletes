import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export type ConfidenceEntry = {
  date: string;
  confidence: number;
  focus: number;
  energy: number;
};

export type JournalEntry = {
  date: string;
  bestMoment: string;
  hardestMoment: string;
  lesson: string;
};

export type Sponsor = {
  name: string;
  message?: string;
};

// One row per team the athlete has joined. Sorted by joinedAt desc when used
// as the "primary" team (most recently joined wins by default).
export type TeamMembership = {
  teamCode: string;
  nickname: string | null;
  joinedAt: Timestamp;
};

export type AthleteBand = {
  mantra: string | null;
  sport: string | null;
  activatedAt: Timestamp | null;
  deviceFingerprint: string | null;
  tapCount: number;
  lastTappedAt: Timestamp | null;
  confidenceLog: ConfidenceEntry[];
  journalLog: JournalEntry[];
  streakCount: number;
  streakLastDate: string | null;
  sponsor: Sponsor | null;
  teamMemberships: TeamMembership[];
};

const COLLECTION = 'athleteBands';

const bandRef = (bandId: string) => doc(db, COLLECTION, bandId);

const todayKey = () => new Date().toISOString().slice(0, 10);

const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

export const getBand = async (bandId: string): Promise<AthleteBand | null> => {
  const snap = await getDoc(bandRef(bandId));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<AthleteBand>;
  return {
    mantra: data.mantra ?? null,
    sport: data.sport ?? null,
    activatedAt: data.activatedAt ?? null,
    deviceFingerprint: data.deviceFingerprint ?? null,
    tapCount: data.tapCount ?? 0,
    lastTappedAt: data.lastTappedAt ?? null,
    confidenceLog: data.confidenceLog ?? [],
    journalLog: data.journalLog ?? [],
    streakCount: data.streakCount ?? 0,
    streakLastDate: data.streakLastDate ?? null,
    sponsor: data.sponsor ?? null,
    teamMemberships: data.teamMemberships ?? [],
  };
};

export const activateBand = async (
  bandId: string,
  mantra: string,
  deviceFingerprint: string,
  sport: string | null = null
) => {
  await setDoc(bandRef(bandId), {
    mantra,
    sport,
    activatedAt: serverTimestamp(),
    deviceFingerprint,
    tapCount: 1,
    lastTappedAt: serverTimestamp(),
    confidenceLog: [],
    journalLog: [],
    streakCount: 1,
    streakLastDate: todayKey(),
    sponsor: null,
    teamMemberships: [],
  });
};

const computeNextStreak = (
  prevCount: number,
  prevDate: string | null
): { streakCount: number; streakLastDate: string } => {
  const today = todayKey();
  if (prevDate === today) {
    return { streakCount: prevCount, streakLastDate: today };
  }
  if (prevDate === yesterdayKey()) {
    return { streakCount: prevCount + 1, streakLastDate: today };
  }
  return { streakCount: 1, streakLastDate: today };
};

export const recordTap = async (
  bandId: string,
  prev?: Pick<AthleteBand, 'streakCount' | 'streakLastDate'>
) => {
  const next = computeNextStreak(
    prev?.streakCount ?? 0,
    prev?.streakLastDate ?? null
  );
  await updateDoc(bandRef(bandId), {
    tapCount: increment(1),
    lastTappedAt: serverTimestamp(),
    streakCount: next.streakCount,
    streakLastDate: next.streakLastDate,
  });
  return next;
};

export const updateMantra = async (bandId: string, mantra: string) => {
  await updateDoc(bandRef(bandId), { mantra });
};

export const updateSport = async (bandId: string, sport: string) => {
  await updateDoc(bandRef(bandId), { sport });
};

export const appendConfidenceEntry = async (
  bandId: string,
  entry: ConfidenceEntry
) => {
  await updateDoc(bandRef(bandId), {
    confidenceLog: arrayUnion(entry),
  });
};

export const appendJournalEntry = async (
  bandId: string,
  entry: JournalEntry
) => {
  await updateDoc(bandRef(bandId), {
    journalLog: arrayUnion(entry),
  });
};

// Idempotent: joining the same team twice is a no-op. Otherwise appends.
export const joinTeam = async (
  bandId: string,
  teamCode: string,
  nickname: string | null
) => {
  const band = await getBand(bandId);
  if (!band) throw new Error('Band not found');
  if (band.teamMemberships.some((m) => m.teamCode === teamCode)) return false;
  const membership: TeamMembership = {
    teamCode,
    nickname: nickname && nickname.trim() ? nickname.trim() : null,
    joinedAt: Timestamp.now(),
  };
  await updateDoc(bandRef(bandId), {
    teamMemberships: [...band.teamMemberships, membership],
  });
  return true;
};

export const leaveTeam = async (bandId: string, teamCode: string) => {
  const band = await getBand(bandId);
  if (!band) return;
  const next = band.teamMemberships.filter((m) => m.teamCode !== teamCode);
  await updateDoc(bandRef(bandId), { teamMemberships: next });
};

// Sorted most-recent-joined first. UI uses [0] as the visual "primary" by default.
export const sortMembershipsByRecency = (memberships: TeamMembership[]) =>
  [...memberships].sort((a, b) => {
    const ta = a.joinedAt?.toMillis?.() ?? 0;
    const tb = b.joinedAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
