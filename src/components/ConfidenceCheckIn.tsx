import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  appendConfidenceEntry,
  getBand,
  type ConfidenceEntry,
} from '@/infrastructure/athleteBands';
import { emitConfidence } from '@/infrastructure/teamEmit';

type Props = {
  bandId: string;
  alreadyLogged: boolean;
  todayEntry?: ConfidenceEntry;
  onSubmitted: (entry: ConfidenceEntry) => void;
};

const Slider = ({
  label,
  value,
  onChange,
  color,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}) => (
  <div>
    <div className="flex justify-between items-baseline mb-1">
      <label className="text-xs uppercase tracking-widest text-white/70">
        {label}
      </label>
      <span
        className="font-display text-2xl tabular-nums"
        style={{ color }}
      >
        {value}
      </span>
    </div>
    <input
      type="range"
      min={1}
      max={10}
      step={1}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[var(--moxie-accent)]"
      style={{ accentColor: color }}
    />
  </div>
);

export const ConfidenceCheckIn = ({
  bandId,
  alreadyLogged,
  todayEntry,
  onSubmitted,
}: Props) => {
  const [confidence, setConfidence] = useState(todayEntry?.confidence ?? 7);
  const [focus, setFocus] = useState(todayEntry?.focus ?? 7);
  const [energy, setEnergy] = useState(todayEntry?.energy ?? 7);
  const [busy, setBusy] = useState(false);

  if (alreadyLogged && todayEntry) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/5 border border-white/10 rounded-xl p-5"
      >
        <div className="text-xs uppercase tracking-widest text-accent-moxie/80 mb-2">
          Logged today ✓
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat label="Confidence" value={todayEntry.confidence} color="#39ff14" />
          <Stat label="Focus" value={todayEntry.focus} color="#ffffff" />
          <Stat label="Energy" value={todayEntry.energy} color="#ffb020" />
        </div>
      </motion.div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const entry: ConfidenceEntry = {
      date: new Date().toISOString().slice(0, 10),
      confidence,
      focus,
      energy,
    };
    try {
      await appendConfidenceEntry(bandId, entry);
      getBand(bandId)
        .then((band) => band && emitConfidence(band, entry.confidence))
        .catch((err) => console.warn('team-emit confidence failed', err));
      onSubmitted(entry);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
    >
      <div>
        <div className="text-xs uppercase tracking-widest text-accent-moxie/80 mb-1">
          Daily Check-In
        </div>
        <div className="font-display text-2xl text-white">
          HOW ARE YOU TODAY?
        </div>
      </div>
      <Slider
        label="Confidence"
        value={confidence}
        onChange={setConfidence}
        color="#39ff14"
      />
      <Slider label="Focus" value={focus} onChange={setFocus} color="#ffffff" />
      <Slider
        label="Energy"
        value={energy}
        onChange={setEnergy}
        color="#ffb020"
      />
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-accent-moxie text-black font-display tracking-widest text-base py-3 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50"
      >
        {busy ? 'Saving...' : 'Log it'}
      </button>
    </form>
  );
};

const Stat = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div>
    <div
      className="font-display text-3xl tabular-nums"
      style={{ color }}
    >
      {value}
    </div>
    <div className="text-xs text-white/50 uppercase tracking-widest mt-1">
      {label}
    </div>
  </div>
);
