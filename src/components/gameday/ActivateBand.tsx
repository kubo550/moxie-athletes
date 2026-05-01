import { useState } from 'react';
import { motion } from 'framer-motion';
import { SPORTS, type SportKey, getSport } from '@/config/sports';

type Props = {
  onActivate: (mantra: string, sport: SportKey) => Promise<void>;
};

export const ActivateBand = ({ onActivate }: Props) => {
  const [step, setStep] = useState<'sport' | 'mantra'>('sport');
  const [sport, setSport] = useState<SportKey | null>(null);
  const [mantra, setMantra] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sportConfig = getSport(sport);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sport) return;
    const trimmed = mantra.trim();
    if (trimmed.length < 2) {
      setError('Make it real. At least a few words.');
      return;
    }
    if (trimmed.length > 100) {
      setError('Keep it short — under 100 characters.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onActivate(trimmed, sport);
    } catch (err) {
      console.error(err);
      setError('Could not activate. Try again.');
      setSubmitting(false);
    }
  };

  if (step === 'sport') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md text-center"
        >
          <div className="text-accent-moxie text-xs uppercase tracking-widest mb-3">
            New Band · Step 1 of 2
          </div>
          <h1 className="font-display text-5xl text-white leading-none mb-3">
            WHAT'S YOUR
            <br />
            <span className="text-accent-moxie">SPORT?</span>
          </h1>
          <p className="text-white/60 text-sm mb-8">
            We'll suggest mantras that hit different.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {SPORTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSport(s.key)}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-lg border text-sm font-medium transition active:scale-95 ${
                  sport === s.key
                    ? 'bg-accent-moxie text-black border-accent-moxie'
                    : 'bg-white/5 text-white/85 border-white/15 hover:border-white/30'
                }`}
              >
                <span className="text-lg">{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>

          <button
            disabled={!sport}
            onClick={() => setStep('mantra')}
            className="w-full bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-40"
          >
            Next
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        <div className="text-accent-moxie text-xs uppercase tracking-widest mb-3">
          New Band · Step 2 of 2
        </div>
        <h1 className="font-display text-5xl text-white leading-none mb-3">
          WHAT'S YOUR
          <br />
          <span className="text-accent-moxie">MANTRA?</span>
        </h1>
        <p className="text-white/60 text-sm mb-6">
          The phrase you'll see every time you tap in before competition.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <textarea
            value={mantra}
            onChange={(e) => setMantra(e.target.value)}
            placeholder="Type your mantra..."
            rows={2}
            maxLength={120}
            autoFocus
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-4 text-white text-xl text-center placeholder:text-white/30 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30 resize-none"
          />

          {sportConfig && (
            <div className="text-left">
              <div className="text-white/40 text-xs uppercase tracking-widest mb-2">
                {sportConfig.emoji} {sportConfig.label} starters
              </div>
              <div className="flex flex-wrap gap-2">
                {sportConfig.mantraExamples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setMantra(ex)}
                    className="bg-white/5 border border-white/15 hover:border-accent-moxie/60 text-white/85 text-sm px-3 py-1.5 rounded-full text-left"
                  >
                    "{ex}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50"
          >
            {submitting ? 'Activating...' : 'Lock It In'}
          </button>

          <button
            type="button"
            onClick={() => setStep('sport')}
            className="text-white/50 text-xs uppercase tracking-widest hover:text-white"
          >
            ← Change sport
          </button>
        </form>
      </motion.div>
    </div>
  );
};
