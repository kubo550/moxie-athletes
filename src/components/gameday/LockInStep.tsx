import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CUES = [
  'Lock In.',
  'Eyes up.',
  'Slow it down.',
  'You belong here.',
  'This is your moment.',
];

const LOCK_IN_DURATION = 60;

type Props = {
  onComplete: () => void;
};

export const LockInStep = ({ onComplete }: Props) => {
  const [remaining, setRemaining] = useState(LOCK_IN_DURATION);
  const [cueIdx, setCueIdx] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current?.play().catch(() => {});
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const left = Math.max(0, Math.ceil(LOCK_IN_DURATION - elapsed));
      setRemaining(left);
      setCueIdx(
        Math.min(
          CUES.length - 1,
          Math.floor((elapsed / LOCK_IN_DURATION) * CUES.length)
        )
      );
      if (elapsed >= LOCK_IN_DURATION) {
        clearInterval(tick);
        onComplete();
      }
    }, 250);
    return () => clearInterval(tick);
  }, [onComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      {/* TODO(jake): replace with final Lock In audio file */}
      <audio ref={audioRef} src="" preload="auto" />

      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[420px] h-[420px] rounded-full bg-accent-moxie/10 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-56 h-56 rounded-full border-2 border-accent-moxie/70"
      />
      <motion.div
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-32 h-32 rounded-full bg-accent-moxie/30"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.div
          key={cueIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-5xl text-white tracking-wide"
        >
          {CUES[cueIdx]}
        </motion.div>
        <div className="font-display text-7xl text-accent-moxie tabular-nums">
          {remaining}
        </div>
      </div>

      <button
        onClick={onComplete}
        className="absolute bottom-24 text-white/40 text-xs uppercase tracking-widest hover:text-white/80"
      >
        Skip
      </button>
    </div>
  );
};
