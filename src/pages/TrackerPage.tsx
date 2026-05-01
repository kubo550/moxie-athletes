import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ConfidenceChart } from '@/components/ConfidenceChart';
import { ConfidenceCheckIn } from '@/components/ConfidenceCheckIn';
import {
  getBand,
  type ConfidenceEntry,
} from '@/infrastructure/athleteBands';
import { usePageMeta } from '@/utils/usePageMeta';

type State =
  | { kind: 'loading' }
  | { kind: 'no-band' }
  | { kind: 'ready'; entries: ConfidenceEntry[] }
  | { kind: 'error' };

const today = () => new Date().toISOString().slice(0, 10);

export const TrackerPage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [range, setRange] = useState<7 | 30>(7);
  usePageMeta({
    title: 'Confidence Tracker — Moxie Athletes',
    description:
      'Daily confidence, focus, and energy check-ins — track how your mental game gets stronger over time.',
    noindex: true,
  });

  useEffect(() => {
    if (!bandId) {
      setState({ kind: 'no-band' });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const band = await getBand(bandId);
        if (cancelled) return;
        if (!band) {
          setState({ kind: 'no-band' });
          return;
        }
        setState({ kind: 'ready', entries: band.confidenceLog });
      } catch (err) {
        console.error(err);
        if (!cancelled) setState({ kind: 'error' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bandId]);

  return (
    <AppShell bandId={bandId}>
      <div className="px-4 py-8 space-y-6">
        <Link
          to={bandId ? `/g/${bandId}/home` : '/'}
          className="text-white/60 text-sm underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>
        <div>
          <p className="text-accent-moxie text-xs uppercase tracking-widest mb-1">
            Tracker
          </p>
          <h1 className="font-display text-4xl text-white tracking-wider">
            CONFIDENCE TREND
          </h1>
        </div>

        {state.kind === 'loading' && (
          <div className="text-white/60 animate-pulse">Loading...</div>
        )}

        {state.kind === 'error' && (
          <div className="text-red-400">Couldn't load your tracker.</div>
        )}

        {state.kind === 'no-band' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
            <div className="font-display text-2xl text-white mb-2">
              TAP YOUR BAND TO START TRACKING
            </div>
            <p className="text-white/60 text-sm">
              Confidence tracking is tied to your Moxie band so the data stays
              private and yours.
            </p>
          </div>
        )}

        {state.kind === 'ready' && bandId && (
          <>
            <ConfidenceCheckIn
              bandId={bandId}
              alreadyLogged={state.entries.some((e) => e.date === today())}
              todayEntry={state.entries.find((e) => e.date === today())}
              onSubmitted={(entry) =>
                setState({
                  kind: 'ready',
                  entries: [...state.entries, entry],
                })
              }
            />

            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-display text-lg tracking-wider text-white">
                  TREND
                </div>
                <div className="flex gap-1 bg-black/40 rounded-full p-1 text-xs">
                  {[7, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setRange(d as 7 | 30)}
                      className={`px-3 py-1 rounded-full transition ${
                        range === d
                          ? 'bg-accent-moxie text-black'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
              <ConfidenceChart entries={state.entries} days={range} />
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
};
