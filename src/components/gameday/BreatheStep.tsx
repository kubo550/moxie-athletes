import { BreathingCircle } from '@/components/BreathingCircle';

const TOTAL = 16; // one full 4-4-4-4 cycle

type Props = {
  onComplete: () => void;
};

export const BreatheStep = ({ onComplete }: Props) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="absolute top-12 text-xs uppercase tracking-[0.3em] text-accent-moxie/90">
        Step 2 · Breathe
      </div>

      <BreathingCircle
        pattern={{ inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }}
        totalSeconds={TOTAL}
        onComplete={onComplete}
      />

      <button
        onClick={onComplete}
        className="absolute bottom-24 text-white/40 text-xs uppercase tracking-widest hover:text-white/80"
      >
        Skip
      </button>
    </div>
  );
};
