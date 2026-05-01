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
