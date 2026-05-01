import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/AppShell';
import {
  appendJournalEntry,
  type JournalEntry,
} from '@/infrastructure/athleteBands';
import { usePageMeta } from '@/utils/usePageMeta';

const PROMPTS = [
  {
    key: 'bestMoment',
    title: 'Best moment.',
    sub: 'One play, rep, or moment you owned today.',
    placeholder: 'I stayed locked in on the final possession.',
  },
  {
    key: 'hardestMoment',
    title: 'Hardest moment.',
    sub: 'What broke your focus or hurt? No filter.',
    placeholder: 'Coach pulled me after my second mistake.',
  },
  {
    key: 'lesson',
    title: 'One lesson.',
    sub: 'What does today teach the next you?',
    placeholder: 'Reset faster. Next play.',
  },
] as const;

export const PostGamePage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const navigate = useNavigate();
  usePageMeta({ title: 'Post-Game Reflection — Moxie Athletes', noindex: true });
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    bestMoment: '',
    hardestMoment: '',
    lesson: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!bandId) {
    return (
      <AppShell>
        <div className="px-6 py-10 text-center">
          <p className="text-white/70 mb-4">
            Tap your band to log a post-game reflection.
          </p>
          <Link
            to="/"
            className="text-accent-moxie underline underline-offset-4"
          >
            Back home
          </Link>
        </div>
      </AppShell>
    );
  }

  const current = PROMPTS[idx];
  const value = answers[current.key];
  const isLast = idx === PROMPTS.length - 1;

  const next = async () => {
    if (!isLast) {
      setIdx(idx + 1);
      return;
    }
    setBusy(true);
    setError(null);
    const entry: JournalEntry = {
      date: new Date().toISOString().slice(0, 10),
      bestMoment: answers.bestMoment.trim(),
      hardestMoment: answers.hardestMoment.trim(),
      lesson: answers.lesson.trim(),
    };
    try {
      await appendJournalEntry(bandId, entry);
      navigate(`/g/${bandId}/home`);
    } catch (err) {
      console.error(err);
      setError("Couldn't save. Try again.");
      setBusy(false);
    }
  };

  return (
    <AppShell bandId={bandId}>
      <div className="min-h-[80vh] flex flex-col px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/g/${bandId}/home`}
            className="text-white/60 text-sm hover:text-white"
          >
            ← Skip
          </Link>
          <div className="flex gap-1">
            {PROMPTS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${
                  i === idx
                    ? 'w-8 bg-accent-moxie'
                    : i < idx
                      ? 'w-4 bg-white/40'
                      : 'w-4 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-accent-moxie text-xs uppercase tracking-widest mb-2">
          Post-Game · {idx + 1} of 3
        </div>

        <motion.div
          key={current.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 flex flex-col"
        >
          <h1 className="font-display text-4xl text-white leading-tight">
            {current.title}
          </h1>
          <p className="text-white/60 text-sm mt-1 mb-6">{current.sub}</p>

          <textarea
            autoFocus
            value={value}
            onChange={(e) =>
              setAnswers({ ...answers, [current.key]: e.target.value })
            }
            placeholder={current.placeholder}
            rows={5}
            maxLength={500}
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-4 text-white text-base placeholder:text-white/30 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30 resize-none"
          />

          {error && <div className="text-red-400 text-sm mt-3">{error}</div>}

          <div className="mt-auto pt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={next}
              disabled={busy}
              className="w-full bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50"
            >
              {busy ? 'Saving...' : isLast ? 'Lock It In' : 'Next'}
            </button>
            {idx > 0 && (
              <button
                type="button"
                onClick={() => setIdx(idx - 1)}
                className="text-white/50 text-xs uppercase tracking-widest hover:text-white"
              >
                ← Back
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
};
