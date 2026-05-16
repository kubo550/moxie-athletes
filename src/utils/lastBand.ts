// Tracks the most recently active band on this device so flows that don't have
// a bandId in the URL (like /join/:teamCode) can find it. Not a security
// boundary; just a UX hint.
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '@/utils/localStorage';

const KEY = 'moxie_last_band_id';

export const setLastBandId = (bandId: string) => {
  setToLocalStorage(KEY, bandId);
};

export const getLastBandId = (): string | null =>
  getFromLocalStorage<string>(KEY);
