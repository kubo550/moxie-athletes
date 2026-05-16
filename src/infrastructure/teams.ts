import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type {
  Sponsor,
  TeamMembership,
} from '@/infrastructure/athleteBands';

const COLLECTION = 'teams';

// Mirror of mantraCounts entry on team doc. Stored as a map keyed by lowercased
// mantra; we keep the original casing alongside the count so the dashboard can
// render the most-used mantra without losing case.
export type MantraCount = {
  text: string;
  count: number;
};

export type Team = {
  teamCode: string;
  name: string;
  sport: string;
  coachKey: string; // shown once on creation, used to gate the coach dashboard
  athleteCount: number;
  totalTaps: number;
  totalMentalReps: number;
  totalGameDays: number;
  totalPostGames: number;
  confidenceSum: number;
  confidenceCount: number;
  mantraCounts: Record<string, MantraCount>;
  sponsor: Sponsor | null;
  createdAt: Timestamp | null;
  lastActivityAt: Timestamp | null;
  archived: boolean;
};

const teamRef = (teamCode: string) => doc(db, COLLECTION, teamCode);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'team';

const randomSuffix = (len = 5) => {
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
};

const randomCoachKey = () => {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
};

export const generateTeamCode = (name: string) =>
  `${slugify(name)}-${randomSuffix()}`;

export const getTeam = async (teamCode: string): Promise<Team | null> => {
  const snap = await getDoc(teamRef(teamCode));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<Team>;
  return {
    teamCode,
    name: data.name ?? '',
    sport: data.sport ?? '',
    coachKey: data.coachKey ?? '',
    athleteCount: data.athleteCount ?? 0,
    totalTaps: data.totalTaps ?? 0,
    totalMentalReps: data.totalMentalReps ?? 0,
    totalGameDays: data.totalGameDays ?? 0,
    totalPostGames: data.totalPostGames ?? 0,
    confidenceSum: data.confidenceSum ?? 0,
    confidenceCount: data.confidenceCount ?? 0,
    mantraCounts: data.mantraCounts ?? {},
    sponsor: data.sponsor ?? null,
    createdAt: data.createdAt ?? null,
    lastActivityAt: data.lastActivityAt ?? null,
    archived: data.archived ?? false,
  };
};

export const createTeam = async (input: { name: string; sport: string }) => {
  const teamCode = generateTeamCode(input.name);
  const coachKey = randomCoachKey();
  await setDoc(teamRef(teamCode), {
    name: input.name.trim(),
    sport: input.sport,
    coachKey,
    athleteCount: 0,
    totalTaps: 0,
    totalMentalReps: 0,
    totalGameDays: 0,
    totalPostGames: 0,
    confidenceSum: 0,
    confidenceCount: 0,
    mantraCounts: {},
    sponsor: null,
    createdAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
    archived: false,
  });
  return { teamCode, coachKey };
};

export const incrementTeamAthletes = async (teamCode: string) => {
  await updateDoc(teamRef(teamCode), {
    athleteCount: increment(1),
    lastActivityAt: serverTimestamp(),
  });
};

export const incrementTeamCounter = async (
  teamCode: string,
  field: 'totalTaps' | 'totalMentalReps' | 'totalGameDays' | 'totalPostGames',
  delta = 1
) => {
  await updateDoc(teamRef(teamCode), {
    [field]: increment(delta),
    lastActivityAt: serverTimestamp(),
  });
};

export const recordTeamConfidence = async (teamCode: string, score: number) => {
  await updateDoc(teamRef(teamCode), {
    confidenceSum: increment(score),
    confidenceCount: increment(1),
    lastActivityAt: serverTimestamp(),
  });
};

export const recordTeamMantra = async (teamCode: string, mantra: string) => {
  const key = mantra.trim().toLowerCase().slice(0, 80);
  if (!key) return;
  await updateDoc(teamRef(teamCode), {
    [`mantraCounts.${key}.text`]: mantra.trim(),
    [`mantraCounts.${key}.count`]: increment(1),
    lastActivityAt: serverTimestamp(),
  });
};

export const topMantras = (
  mantraCounts: Record<string, MantraCount>,
  n = 5
): MantraCount[] =>
  Object.values(mantraCounts)
    .filter((m) => m.text && m.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, n);

// Roster. Subcollection at teams/{teamCode}/members/{bandId}. Used by the
// coach dashboard for member-management. NEVER expose individual athlete
// stats (mantra, confidence scores, journals). Only nickname + join date.

export type TeamMember = {
  bandId: string;
  nickname: string | null;
  joinedAt: Timestamp | null;
};

const membersCol = (teamCode: string) =>
  collection(db, COLLECTION, teamCode, 'members');

const memberRef = (teamCode: string, bandId: string) =>
  doc(db, COLLECTION, teamCode, 'members', bandId);

const bandDocRef = (bandId: string) => doc(db, 'athleteBands', bandId);

export const recordTeamMember = async (
  teamCode: string,
  bandId: string,
  nickname: string | null
) => {
  await setDoc(memberRef(teamCode, bandId), {
    bandId,
    nickname,
    joinedAt: serverTimestamp(),
  });
};

export const listTeamMembers = async (
  teamCode: string
): Promise<TeamMember[]> => {
  const snap = await getDocs(membersCol(teamCode));
  return snap.docs.map((d) => {
    const data = d.data() as Partial<TeamMember>;
    return {
      bandId: d.id,
      nickname: data.nickname ?? null,
      joinedAt: data.joinedAt ?? null,
    };
  });
};

// Best-effort removal. Drops the member subcollection doc, strips the
// teamMembership from the athlete's band, and decrements team.athleteCount.
// No transaction (Firestore can't span collections trivially), so partial
// failure may leave drift. Acceptable for MVP scale.
export const kickFromTeam = async (teamCode: string, bandId: string) => {
  await deleteDoc(memberRef(teamCode, bandId)).catch((err) => {
    console.warn('member delete failed', err);
  });

  try {
    const bandSnap = await getDoc(bandDocRef(bandId));
    if (bandSnap.exists()) {
      const data = bandSnap.data() as { teamMemberships?: TeamMembership[] };
      const filtered = (data.teamMemberships ?? []).filter(
        (m) => m.teamCode !== teamCode
      );
      await updateDoc(bandDocRef(bandId), { teamMemberships: filtered });
    }
  } catch (err) {
    console.warn('band membership strip failed', err);
  }

  await updateDoc(teamRef(teamCode), {
    athleteCount: increment(-1),
    lastActivityAt: serverTimestamp(),
  }).catch((err) => {
    console.warn('athleteCount decrement failed', err);
  });
};
