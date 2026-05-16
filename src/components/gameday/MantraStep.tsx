import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MIN_VIEW_MS = 4000;

type Props = {
  mantra: string;
  onComplete: () => void;
};

// "Own The Moment". Final step. Holds the athlete's mantra full-screen.
// Tap-to-begin is locked for the first ~4s so it can't be dismissed by mistake.
export const MantraStep = ({ mantra, onComplete }: Props) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), MIN_VIEW_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <button
      onClick={() => ready && onComplete()}
      className="relative flex flex-col items-center justify-center min-h-[80vh] w-full px-6 text-center group"
    >
      <div className="absolute top-12 text-xs uppercase tracking-[0.3em] text-accent-moxie/90">
        Step 6 · Own The Moment
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="font-display text-5xl sm:text-7xl text-white max-w-2xl leading-tight tracking-wide"
      >
        "{mantra}"
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 0.7 : 0 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-24 text-white/70 text-sm uppercase tracking-widest"
      >
        Tap to begin
      </motion.div>
    </button>
  );
};
