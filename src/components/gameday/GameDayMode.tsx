import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LockInStep } from './LockInStep';
import { VisualizationStep } from './VisualizationStep';
import { BreathingStep } from './BreathingStep';
import { MantraStep } from './MantraStep';
import type { Sponsor } from '@/infrastructure/athleteBands';

type Props = {
  bandId: string;
  mantra: string;
  sponsor?: Sponsor | null;
};

const STEPS = ['lock-in', 'visualize', 'breathe', 'mantra'] as const;
type Step = (typeof STEPS)[number];

export const GameDayMode = ({ bandId, mantra, sponsor }: Props) => {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);
  const step: Step = STEPS[stepIdx];

  const next = () => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      navigate(`/g/${bandId}/home`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {step === 'lock-in' && <LockInStep onComplete={next} />}
            {step === 'visualize' && <VisualizationStep onComplete={next} />}
            {step === 'breathe' && <BreathingStep onComplete={next} />}
            {step === 'mantra' && (
              <MantraStep mantra={mantra} onComplete={next} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {sponsor && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-white/5 border border-white/10 backdrop-blur rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-white/60">
            Powered by{' '}
            <span className="text-white/85 font-medium">{sponsor.name}</span>
          </div>
        </div>
      )}

      <div className="pb-6 pt-2 flex justify-center gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all ${
              i === stepIdx
                ? 'w-8 bg-accent-moxie'
                : i < stepIdx
                  ? 'w-4 bg-white/40'
                  : 'w-4 bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
