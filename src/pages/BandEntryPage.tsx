import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ActivateBand } from '@/components/gameday/ActivateBand';
import { GameDayMode } from '@/components/gameday/GameDayMode';
import {
  type AthleteBand,
  activateBand,
  getBand,
  recordTap,
} from '@/infrastructure/athleteBands';
import {
  emitGameDayComplete,
  emitStreakIfMilestone,
} from '@/infrastructure/teamEmit';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';
import { setLastBandId } from '@/utils/lastBand';
import { usePageMeta } from '@/utils/usePageMeta';

type Status =
  | { kind: 'loading' }
  | { kind: 'activate' }
  | { kind: 'play'; band: AthleteBand }
  | { kind: 'error'; message: string };

export const BandEntryPage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>({ kind: 'loading' });
  usePageMeta({ title: 'Game-Day Mode · Moxie Athletes', noindex: true });

  useEffect(() => {
    if (!bandId) return;
    setLastBandId(bandId);
    let cancelled = false;

    const run = async () => {
      try {
        const band: AthleteBand | null = await getBand(bandId);

        if (!band || !band.mantra) {
          if (!cancelled) setStatus({ kind: 'activate' });
          return;
        }

        const next = await recordTap(bandId, {
          streakCount: band.streakCount,
          streakLastDate: band.streakLastDate,
        }).catch((err) => {
          // Tap-counting is best effort; never block the ritual.
          console.warn('recordTap failed', err);
          return null;
        });

        if (next && next.streakCount !== band.streakCount) {
          emitStreakIfMilestone(band, next.streakCount);
        }

        if (!cancelled)
          setStatus({
            kind: 'play',
            band,
          });
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setStatus({
            kind: 'error',
            message:
              "Couldn't reach Moxie right now. Check your connection and tap again.",
          });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [bandId]);

  if (!bandId) {
    navigate('/');
    return null;
  }

  if (status.kind === 'loading') {
    return (
      <AppShell hideNav>
        <div className="min-h-screen flex flex-col items-center justify-center text-white/60">
          <div className="font-display text-3xl tracking-widest animate-pulse">
            LOADING...
          </div>
        </div>
      </AppShell>
    );
  }

  if (status.kind === 'error') {
    return (
      <AppShell hideNav>
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="text-white/80 mb-4">{status.message}</div>
          <button
            onClick={() => window.location.reload()}
            className="text-accent-moxie underline underline-offset-4"
          >
            Try again
          </button>
        </div>
      </AppShell>
    );
  }

  if (status.kind === 'activate') {
    return (
      <AppShell hideNav>
        <ActivateBand
          onActivate={async (mantra, sport) => {
            const fingerprint = getDeviceFingerprint();
            await activateBand(bandId, mantra, fingerprint, sport);
            navigate(`/g/${bandId}/home`, { replace: true });
          }}
        />
      </AppShell>
    );
  }

  return (
    <GameDayMode
      bandId={bandId}
      mantra={status.band.mantra ?? ''}
      sponsor={status.band.sponsor}
      onComplete={() => emitGameDayComplete(status.band)}
    />
  );
};
