import { motion } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

type Props = {
  onLockIn: () => void;
};

export const GameDayIntro = ({ onLockIn }: Props) => {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(57,255,20,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(57,255,20,0.05),_transparent_60%)]" />

      <div className="flex-1 flex flex-col justify-center px-6 py-10 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-accent-moxie text-xs uppercase tracking-[0.3em] mb-3">
            <Flame className="w-3.5 h-3.5" />
            Game-Day Mode
          </div>
          <h1 className="font-display text-5xl sm:text-6xl text-white leading-none tracking-wide">
            THE MENTAL
            <br />
            <span className="text-accent-moxie">WARM-UP</span>.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-7 space-y-4 text-white/85 text-[15px] leading-relaxed"
        >
          <p>
            Think headphones on before a game. Walking into the locker room.
            Flipping the switch.
          </p>
          <p className="text-white/65">
            This is how elite athletes lock in: cinematic, focused, calm under
            pressure.
          </p>
        </motion.div>

        <motion.ol
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-7 grid grid-cols-2 gap-2 text-xs uppercase tracking-widest text-white/70"
        >
          {[
            'Lock In',
            'Breathe',
            'Believe',
            'Visualize',
            'Attack',
            'Own The Moment',
          ].map((label, i) => (
            <li
              key={label}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-2"
            >
              <span className="text-accent-moxie font-display">{i + 1}</span>
              <span>{label}</span>
            </li>
          ))}
        </motion.ol>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 text-white/45 text-xs uppercase tracking-widest text-center"
        >
          6 steps · 60 seconds
        </motion.div>
      </div>

      <div className="px-6 pb-8 max-w-md mx-auto w-full">
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={onLockIn}
          className="w-full inline-flex items-center justify-center gap-2 bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition"
        >
          <Zap className="w-5 h-5" />
          Lock In
        </motion.button>
      </div>
    </div>
  );
};
