import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const LINES = [
  'I am ready.',
  'I have done the work.',
  'I trust myself.',
];

const STEP_DURATION = 8000; // 8s total
const PER_LINE_MS = STEP_DURATION / LINES.length;

type Props = {
  onComplete: () => void;
};

export const BelieveStep = ({ onComplete }: Props) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= LINES.length) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setIdx((i) => i + 1), PER_LINE_MS);
    return () => clearTimeout(t);
  }, [idx, onComplete]);

  if (idx >= LINES.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      <div className="absolute top-12 text-xs uppercase tracking-[0.3em] text-accent-moxie/90">
        Step 3 · Believe
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="font-display text-5xl sm:text-6xl text-white max-w-md leading-tight"
        >
          {LINES[idx]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-24 flex gap-2">
        {LINES.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === idx ? 'bg-accent-moxie w-6' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
      <button
        onClick={onComplete}
        className="absolute bottom-12 text-white/40 text-xs uppercase tracking-widest hover:text-white/80"
      >
        Skip
      </button>
    </div>
  );
};
