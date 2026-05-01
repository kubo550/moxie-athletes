import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import {
  BreathingCircle,
  type BreathingPattern,
} from '@/components/BreathingCircle';
import { usePageMeta } from '@/utils/usePageMeta';

type Preset = {
  id: string;
  name: string;
  blurb: string;
  pattern: BreathingPattern;
  totalSeconds: number;
};

const PRESETS: Preset[] = [
  {
    id: 'reset-between-plays',
    name: 'Reset Between Plays',
    blurb: '30s · fast reset · between reps, sets, points',
    pattern: { inhale: 3, holdIn: 0, exhale: 3, holdOut: 0 },
    totalSeconds: 30,
  },
  {
    id: 'pre-game-anxiety',
    name: 'Calm Pre-Game Anxiety',
    blurb: '~3 min · slow box · before the whistle',
    pattern: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
    totalSeconds: 180,
  },
  {
    id: 'halftime-reset',
    name: 'Halftime Reset',
    blurb: '~1 min · medium · between halves or rounds',
    pattern: { inhale: 4, holdIn: 0, exhale: 6, holdOut: 0 },
    totalSeconds: 60,
  },
];

export const BreathingPage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const [active, setActive] = useState<Preset | null>(null);
  const home = bandId ? `/g/${bandId}/home` : '/';
  usePageMeta({
    title: 'Performance Breathing — Moxie Athletes',
    description:
      'Three breathing presets built for athletes — reset between plays, calm pre-game anxiety, halftime reset.',
    noindex: !!bandId,
  });

  if (active) {
    return (
      <div className="fixed inset-0 bg-black z-40 flex flex-col">
        <header className="px-4 h-14 flex items-center justify-between border-b border-white/10">
          <button
            onClick={() => setActive(null)}
            className="text-white/70 hover:text-white"
          >
            ← Stop
          </button>
          <div className="font-display text-base tracking-wider">
            {active.name.toUpperCase()}
          </div>
          <div className="w-10" />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <BreathingCircle
            pattern={active.pattern}
            totalSeconds={active.totalSeconds}
            onComplete={() => setActive(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <AppShell bandId={bandId}>
      <div className="px-4 py-8">
        <Link
          to={home}
          className="text-white/60 text-sm underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>
        <div className="mt-6 mb-6">
          <p className="text-accent-moxie text-xs uppercase tracking-widest mb-1">
            Performance Breathing
          </p>
          <h1 className="font-display text-4xl text-white tracking-wider">
            BREATHE LIKE A PRO
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Pick a session for the moment you're in.
          </p>
        </div>

        <ul className="space-y-3">
          {PRESETS.map((p, i) => (
            <motion.li
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setActive(p)}
                className="w-full text-left bg-white/5 border border-white/10 hover:border-accent-moxie/50 rounded-xl p-5 transition active:scale-[0.99]"
              >
                <div className="font-display text-2xl tracking-wide text-white">
                  {p.name.toUpperCase()}
                </div>
                <p className="text-sm text-white/60 mt-1">{p.blurb}</p>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
};
