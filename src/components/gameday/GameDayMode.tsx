import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LockInStep } from './LockInStep';
import { BreatheStep } from './BreatheStep';
import { BelieveStep } from './BelieveStep';
import { VisualizationStep } from './VisualizationStep';
import { AttackStep } from './AttackStep';
import { MantraStep } from './MantraStep';
import { GameDayIntro } from './GameDayIntro';
import type { Sponsor } from '@/infrastructure/athleteBands';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '@/utils/localStorage';

type Props = {
  bandId: string;
  mantra: string;
  sponsor?: Sponsor | null;
};

const STEPS = [
  'lock-in',
  'breathe',
  'believe',
  'visualize',
  'attack',
  'mantra',
] as const;
type Step = (typeof STEPS)[number];

const INTRO_SEEN_KEY = 'moxie_seen_gameday_intro';

export const GameDayMode = ({ bandId, mantra, sponsor }: Props) => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const step: Step = STEPS[stepIdx];

  useEffect(() => {
    const seen = getFromLocalStorage<string>(INTRO_SEEN_KEY);
    setShowIntro(!seen);
  }, []);

  const dismissIntro = () => {
    setToLocalStorage(INTRO_SEEN_KEY, '1');
    setShowIntro(false);
  };

  const next = () => {
    if (stepIdx < STEPS.length - 1) {
      setStepIdx((i) => i + 1);
    } else {
      navigate(`/g/${bandId}/home`);
    }
  };

  if (showIntro) {
    return <GameDayIntro onLockIn={dismissIntro} />;
  }

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
            {step === 'breathe' && <BreatheStep onComplete={next} />}
            {step === 'believe' && <BelieveStep onComplete={next} />}
            {step === 'visualize' && <VisualizationStep onComplete={next} />}
            {step === 'attack' && <AttackStep onComplete={next} />}
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

      <div className="pb-6 pt-2 flex justify-center gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all ${
              i === stepIdx
                ? 'w-6 bg-accent-moxie'
                : i < stepIdx
                  ? 'w-3 bg-white/40'
                  : 'w-3 bg-white/15'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
