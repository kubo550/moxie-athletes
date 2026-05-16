import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { getBand, updateMantra } from '@/infrastructure/athleteBands';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';
import { usePageMeta } from '@/utils/usePageMeta';

type State =
  | { kind: 'loading' }
  | { kind: 'editing'; mantra: string }
  | { kind: 'readonly'; mantra: string | null }
  | { kind: 'missing' }
  | { kind: 'error'; message: string };

export const BandEditPage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  usePageMeta({ title: 'Edit Mantra · Moxie Athletes', noindex: true });

  useEffect(() => {
    if (!bandId) return;
    let cancelled = false;

    const run = async () => {
      try {
        const band = await getBand(bandId);
        if (cancelled) return;
        if (!band) {
          setState({ kind: 'missing' });
          return;
        }
        const fingerprint = getDeviceFingerprint();
        if (
          band.deviceFingerprint &&
          band.deviceFingerprint !== fingerprint
        ) {
          setState({ kind: 'readonly', mantra: band.mantra });
        } else {
          setState({ kind: 'editing', mantra: band.mantra ?? '' });
          setDraft(band.mantra ?? '');
        }
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setState({
            kind: 'error',
            message: "Couldn't load this band right now.",
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

  return (
    <AppShell bandId={bandId}>
      <div className="px-6 py-8 max-w-md mx-auto">
        <Link
          to={`/g/${bandId}/home`}
          className="text-white/60 text-sm underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>

        <h1 className="font-display text-4xl text-white mt-6 mb-2">
          EDIT MANTRA
        </h1>

        {state.kind === 'loading' && (
          <div className="text-white/60 mt-6">Loading...</div>
        )}

        {state.kind === 'error' && (
          <div className="text-red-400 mt-6">{state.message}</div>
        )}

        {state.kind === 'missing' && (
          <div className="text-white/70 mt-6">
            This band isn't activated yet.{' '}
            <Link
              to={`/g/${bandId}`}
              className="text-accent-moxie underline underline-offset-4"
            >
              Activate it
            </Link>
            .
          </div>
        )}

        {state.kind === 'readonly' && (
          <div className="mt-6 space-y-4">
            <div className="bg-white/5 border border-white/15 rounded-lg p-5">
              <div className="text-white/40 text-xs uppercase tracking-widest mb-2">
                Mantra
              </div>
              <div className="text-white text-lg italic">
                "{state.mantra ?? '–'}"
              </div>
            </div>
            <div className="text-white/60 text-sm leading-relaxed">
              This band is bound to a different device. Only the original
              athlete can edit their mantra.
            </div>
          </div>
        )}

        {state.kind === 'editing' && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const trimmed = draft.trim();
              if (trimmed.length < 2) return;
              setSaving(true);
              try {
                await updateMantra(bandId, trimmed);
                setSaved(true);
                setState({ kind: 'editing', mantra: trimmed });
                setTimeout(() => setSaved(false), 1500);
              } catch (err) {
                console.error(err);
              } finally {
                setSaving(false);
              }
            }}
            className="mt-6 flex flex-col gap-4"
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              maxLength={120}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-4 text-white text-lg placeholder:text-white/30 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30 resize-none"
            />
            <button
              type="submit"
              disabled={saving || draft.trim().length < 2}
              className="bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
};
