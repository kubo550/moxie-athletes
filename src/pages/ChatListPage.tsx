import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import { ATHLETE_COACHES } from '@/config/coaches';
import { usePageMeta } from '@/utils/usePageMeta';

export const ChatListPage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const base = bandId ? `/g/${bandId}/coach` : '/coach';
  const home = bandId ? `/g/${bandId}/home` : '/';
  usePageMeta({
    title: 'AI Coach · Moxie Athletes',
    description:
      'Anonymous, private AI coaching for athletes. Pre-game nerves, slumps, mistakes, pressure, and injury mindset.',
    noindex: !!bandId,
  });

  return (
    <AppShell bandId={bandId}>
      <div className="px-4 py-8">
        <Link
          to={home}
          className="text-white/60 text-sm underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>
        <div className="mt-6 mb-6">
          <p className="text-accent-moxie text-xs uppercase tracking-widest mb-1">
            AI Coach
          </p>
          <h1 className="font-display text-4xl text-white tracking-wider">
            PICK YOUR COACH
          </h1>
          <p className="text-white/60 text-sm mt-2">
            Anonymous. Private. Trained for what athletes actually go through.
          </p>
        </div>

        <ul className="space-y-3">
          {ATHLETE_COACHES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`${base}/${c.id}`}
                className="flex items-stretch rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent-moxie/40 transition-all active:scale-[0.99]"
              >
                <div
                  className={`w-20 sm:w-24 bg-gradient-to-br ${c.accentClass} flex items-center justify-center font-display text-3xl tracking-wider text-white/80`}
                >
                  {c.name
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex-1 p-4">
                  <div className="font-display text-xl tracking-wide text-white">
                    {c.name.toUpperCase()}
                  </div>
                  <p className="text-sm text-white/60 mt-1">{c.description}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
};
