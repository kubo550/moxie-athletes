import { BreathingCircle } from '@/components/BreathingCircle';

type Props = {
  onComplete: () => void;
};

export const BreathingStep = ({ onComplete }: Props) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-6">
      <div className="absolute top-12 text-xs uppercase tracking-widest text-accent-moxie/80">
        Box Breathing · 4-4-4-4
      </div>

      <BreathingCircle
        pattern={{ inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }}
        totalSeconds={64}
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
