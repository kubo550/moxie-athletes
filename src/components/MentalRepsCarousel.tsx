import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { type Challenge, getDailyChallenges } from '@/config/challenges';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '@/utils/localStorage';

const COMPLETED_KEY = 'moxie_completed_reps';

type CompletedState = {
  date: string;
  ids: string[];
};

export const MentalRepsCarousel = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setChallenges(getDailyChallenges(5));

    const saved = getFromLocalStorage<CompletedState>(COMPLETED_KEY);
    if (saved && saved.date === today) {
      setCompleted(new Set(saved.ids));
    } else {
      setCompleted(new Set());
      setToLocalStorage(COMPLETED_KEY, { date: today, ids: [] });
    }
  }, []);

  const toggle = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompleted(next);
    setToLocalStorage(COMPLETED_KEY, {
      date: new Date().toISOString().slice(0, 10),
      ids: Array.from(next),
    });
  };

  if (challenges.length === 0) return null;

  return (
    <section className="w-full">
      <div className="px-4 mb-3 flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-wider text-white">
          TODAY'S MENTAL REPS
        </h2>
        <span className="text-xs uppercase tracking-widest text-accent-moxie/80">
          {completed.size}/{challenges.length}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory px-4">
        {challenges.map((c, i) => {
          const isDone = completed.has(c.id);
          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => toggle(c.id)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex-shrink-0 snap-start w-[260px] min-h-[150px] rounded-xl text-left p-4 border transition-all active:scale-[0.98] ${
                isDone
                  ? 'bg-accent-moxie/10 border-accent-moxie/40'
                  : 'bg-white/5 border-white/10 hover:border-white/25'
              }`}
            >
              {isDone && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-accent-moxie rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-black" />
                </div>
              )}
              <div className="text-xs uppercase tracking-widest text-accent-moxie/80 mb-2">
                Rep #{i + 1}
              </div>
              <h3
                className={`font-display text-xl text-white mb-2 ${
                  isDone ? 'line-through text-white/60' : ''
                }`}
              >
                {c.title}
              </h3>
              <p className="text-sm text-white/70 leading-snug">
                {c.description}
              </p>
            </motion.button>
          );
        })}
        <div className="flex-shrink-0 w-1" />
      </div>
    </section>
  );
};
