import { motion } from 'framer-motion';

type Props = {
  mantra: string;
  onComplete: () => void;
};

export const MantraStep = ({ mantra, onComplete }: Props) => {
  return (
    <button
      onClick={onComplete}
      className="relative flex flex-col items-center justify-center min-h-[80vh] w-full px-6 text-center group"
    >
      <div className="absolute top-12 text-xs uppercase tracking-widest text-accent-moxie/80">
        Your Mantra
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="font-display text-5xl sm:text-7xl text-white max-w-2xl leading-tight tracking-wide"
      >
        "{mantra}"
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-24 text-white/60 text-sm uppercase tracking-widest"
      >
        Tap to begin
      </motion.div>
    </button>
  );
};
