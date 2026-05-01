import { getFromLocalStorage, setToLocalStorage } from '@/utils/localStorage';

const DEVICE_FINGERPRINT_KEY = 'moxie_device_fingerprint';

export const getDeviceFingerprint = (): string => {
  const existing = getFromLocalStorage<string>(DEVICE_FINGERPRINT_KEY);
  if (existing) return existing;

  const fingerprint = crypto.randomUUID();
  setToLocalStorage(DEVICE_FINGERPRINT_KEY, fingerprint);
  return fingerprint;
};
