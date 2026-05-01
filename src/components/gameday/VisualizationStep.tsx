import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const PROMPTS = [
  'See the moment...',
  'Feel yourself making the play.',
  "You've done this before.",
  'Hear the sound. Feel the contact.',
  'This is exactly where you belong.',
];

const PER_PROMPT_MS = 8000;

type Props = {
  onComplete: () => void;
};

export const VisualizationStep = ({ onComplete }: Props) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= PROMPTS.length) {
      onComplete();
      return;
    }
    const t = setTimeout(() => setIdx((i) => i + 1), PER_PROMPT_MS);
    return () => clearTimeout(t);
  }, [idx, onComplete]);

  if (idx >= PROMPTS.length) return null;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      <div className="absolute top-12 text-xs uppercase tracking-widest text-accent-moxie/80">
        Visualize
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="font-display text-4xl sm:text-5xl text-white max-w-md leading-tight"
        >
          {PROMPTS[idx]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-24 flex gap-2">
        {PROMPTS.map((_, i) => (
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
