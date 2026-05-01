import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export type BreathPhase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';

export type BreathingPattern = {
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
};

const PHASE_LABEL: Record<BreathPhase, string> = {
  inhale: 'Breathe In',
  'hold-in': 'Hold',
  exhale: 'Breathe Out',
  'hold-out': 'Hold',
};

type Props = {
  pattern: BreathingPattern;
  totalSeconds: number;
  vibrate?: boolean;
  onComplete?: () => void;
};

export const BreathingCircle = ({
  pattern,
  totalSeconds,
  vibrate = true,
  onComplete,
}: Props) => {
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [remaining, setRemaining] = useState(totalSeconds);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
    setRemaining(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const left = Math.max(0, Math.ceil(totalSeconds - elapsed));
      setRemaining(left);
      if (elapsed >= totalSeconds) {
        clearInterval(tick);
        onComplete?.();
      }
    }, 200);
    return () => clearInterval(tick);
  }, [totalSeconds, onComplete]);

  useEffect(() => {
    let cancelled = false;
    const sequence: { phase: BreathPhase; ms: number }[] = [
      { phase: 'inhale', ms: pattern.inhale * 1000 },
      { phase: 'hold-in', ms: pattern.holdIn * 1000 },
      { phase: 'exhale', ms: pattern.exhale * 1000 },
      { phase: 'hold-out', ms: pattern.holdOut * 1000 },
    ];
    let i = 0;
    const run = () => {
      if (cancelled) return;
      const step = sequence[i % sequence.length];
      if (step.ms === 0) {
        i++;
        run();
        return;
      }
      setPhase(step.phase);
      if (vibrate && (step.phase === 'inhale' || step.phase === 'exhale')) {
        navigator.vibrate?.(40);
      }
      setTimeout(() => {
        i++;
        run();
      }, step.ms);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [pattern, vibrate]);

  const phaseScale = {
    inhale: 1.4,
    'hold-in': 1.4,
    exhale: 0.7,
    'hold-out': 0.7,
  } as const;

  const phaseDuration = {
    inhale: pattern.inhale,
    'hold-in': 0.2,
    exhale: pattern.exhale,
    'hold-out': 0.2,
  } as const;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          className="absolute rounded-full bg-accent-moxie/20 border border-accent-moxie/60"
          style={{ width: '100%', height: '100%' }}
          animate={{ scale: phaseScale[phase] }}
          transition={{
            duration: phaseDuration[phase],
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute rounded-full bg-accent-moxie/30 border-2 border-accent-moxie"
          style={{ width: '70%', height: '70%' }}
          animate={{ scale: phaseScale[phase] }}
          transition={{
            duration: phaseDuration[phase],
            ease: 'easeInOut',
          }}
        />
        <div className="relative z-10 text-center">
          <div className="font-display text-3xl text-white tracking-wider">
            {PHASE_LABEL[phase]}
          </div>
        </div>
      </div>
      <div className="text-white/50 text-sm font-display tracking-widest">
        {remaining}s
      </div>
    </div>
  );
};
