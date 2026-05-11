import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const WORDS = ['ATTACK.', 'GO.', 'NOW.'];
const STEP_DURATION = 10000; // 10s
const PER_WORD_MS = STEP_DURATION / WORDS.length;

type Props = {
  onComplete: () => void;
};

export const AttackStep = ({ onComplete }: Props) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= WORDS.length) {
      onComplete();
      return;
    }
    navigator.vibrate?.(80);
    const t = setTimeout(() => setIdx((i) => i + 1), PER_WORD_MS);
    return () => clearTimeout(t);
  }, [idx, onComplete]);

  if (idx >= WORDS.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center overflow-hidden">
      <div className="absolute top-12 text-xs uppercase tracking-[0.3em] text-accent-moxie/90 z-10">
        Step 5 · Attack
      </div>

      {/* fast intensity pulse */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[420px] h-[420px] rounded-full bg-accent-moxie/15 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 rounded-full border-2 border-accent-moxie/80"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 font-display text-8xl sm:text-9xl text-accent-moxie tracking-wider"
          style={{ textShadow: '0 0 40px rgba(57,255,20,0.6)' }}
        >
          {WORDS[idx]}
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onComplete}
        className="absolute bottom-24 text-white/40 text-xs uppercase tracking-widest hover:text-white/80 z-10"
      >
        Skip
      </button>
    </div>
  );
};
