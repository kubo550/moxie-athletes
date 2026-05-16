import {
  addDoc,
  collection,
  getDocs,
  limit as fbLimit,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '@/config/firebase';

const COLLECTION = 'teamEvents';

export type TeamEventType =
  | 'gameday'
  | 'postgame'
  | 'streak'
  | 'reps'
  | 'confidence'
  | 'join';

export type TeamEvent = {
  id: string;
  teamCode: string;
  type: TeamEventType;
  message: string;
  nickname: string | null; // null = anonymous "An athlete..."
  createdAt: Timestamp | null;
};

const eventsCol = () => collection(db, COLLECTION);

export const appendTeamEvent = async (params: {
  teamCode: string;
  type: TeamEventType;
  message: string;
  nickname: string | null;
}) => {
  await addDoc(eventsCol(), {
    teamCode: params.teamCode,
    type: params.type,
    message: params.message,
    nickname: params.nickname,
    createdAt: serverTimestamp(),
  });
};

// Single-where query; no composite index required. We sort client-side after
// fetching. Safe for the MVP scale (<<1000 events per team). If/when this grows
// we'll add a composite index on (teamCode, createdAt) and switch back to
// orderBy + server-side limit.
export const getTeamEvents = async (
  teamCode: string,
  limit = 30
): Promise<TeamEvent[]> => {
  const q = query(
    eventsCol(),
    where('teamCode', '==', teamCode),
    fbLimit(Math.max(limit * 4, 100))
  );
  const snap = await getDocs(q);
  const events = snap.docs.map((d) => {
    const data = d.data() as Omit<TeamEvent, 'id'>;
    return { id: d.id, ...data };
  });
  events.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0;
    const tb = b.createdAt?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return events.slice(0, limit);
};

export const formatActor = (nickname: string | null) =>
  nickname && nickname.trim() ? nickname.trim() : 'An athlete';
