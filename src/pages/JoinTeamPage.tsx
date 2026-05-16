import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import {
  getTeam,
  incrementTeamAthletes,
  recordTeamMember,
  type Team,
} from '@/infrastructure/teams';
import { joinTeam } from '@/infrastructure/athleteBands';
import { appendTeamEvent } from '@/infrastructure/teamEvents';
import { getLastBandId } from '@/utils/lastBand';
import { usePageMeta } from '@/utils/usePageMeta';
import { getSport } from '@/config/sports';

type State =
  | { kind: 'loading' }
  | { kind: 'no-band' }
  | { kind: 'missing' }
  | { kind: 'archived' }
  | { kind: 'ready'; team: Team; bandId: string }
  | { kind: 'saving'; team: Team; bandId: string }
  | { kind: 'error'; message: string };

export const JoinTeamPage = () => {
  const { teamCode } = useParams<{ teamCode: string }>();
  const navigate = useNavigate();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [nickname, setNickname] = useState('');

  usePageMeta({
    title: 'Join a Team · Moxie Athletes',
    description:
      'Add yourself to a Moxie Athletes team using a coach-shared link.',
    noindex: true,
  });

  useEffect(() => {
    if (!teamCode) return;
    let cancelled = false;
    (async () => {
      try {
        const bandId = getLastBandId();
        const team = await getTeam(teamCode);
        if (cancelled) return;
        if (!team) {
          setState({ kind: 'missing' });
          return;
        }
        if (team.archived) {
          setState({ kind: 'archived' });
          return;
        }
        if (!bandId) {
          setState({ kind: 'no-band' });
          return;
        }
        setState({ kind: 'ready', team, bandId });
      } catch (err) {
        console.error(err);
        if (!cancelled)
          setState({
            kind: 'error',
            message: "Couldn't load this team. Try the link again.",
          });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamCode]);

  if (!teamCode) {
    navigate('/');
    return null;
  }

  if (state.kind === 'loading') {
    return (
      <AppShell>
        <div className="px-6 py-16 text-center text-white/60 animate-pulse font-display tracking-widest">
          LOADING...
        </div>
      </AppShell>
    );
  }

  if (state.kind === 'missing') {
    return (
      <AppShell>
        <div className="px-6 py-12 text-center">
          <h1 className="font-display text-3xl text-white mb-2">TEAM NOT FOUND</h1>
          <p className="text-white/60 text-sm mb-6">
            This team link is invalid or has been removed.
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

  if (state.kind === 'archived') {
    return (
      <AppShell>
        <div className="px-6 py-12 text-center">
          <h1 className="font-display text-3xl text-white mb-2">
            TEAM ARCHIVED
          </h1>
          <p className="text-white/60 text-sm mb-6">
            This team is no longer active.
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

  if (state.kind === 'no-band') {
    return (
      <AppShell>
        <div className="px-6 py-12 max-w-md mx-auto text-center">
          <h1 className="font-display text-4xl text-white leading-tight mb-3">
            TAP YOUR BAND FIRST
          </h1>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Activate your Moxie band, then come back here to join the team.
            Your band is your identity. Without it we can't link you to the
            roster.
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

  if (state.kind === 'error') {
    return (
      <AppShell>
        <div className="px-6 py-12 text-center">
          <p className="text-red-400 mb-4">{state.message}</p>
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

  const team = state.kind === 'saving' ? state.team : state.team;
  const bandId = state.kind === 'saving' ? state.bandId : state.bandId;
  const sport = getSport(team.sport);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: 'saving', team, bandId });
    try {
      const trimmed = nickname.trim().slice(0, 32);
      const created = await joinTeam(bandId, team.teamCode, trimmed || null);
      if (created) {
        // Best-effort aggregates + roster doc; never block UX.
        incrementTeamAthletes(team.teamCode).catch(console.warn);
        recordTeamMember(team.teamCode, bandId, trimmed || null).catch(
          console.warn
        );
        appendTeamEvent({
          teamCode: team.teamCode,
          type: 'join',
          message: `${trimmed || 'An athlete'} joined ${team.name}`,
          nickname: trimmed || null,
        }).catch(console.warn);
      }
      navigate(`/g/${bandId}/home`, { replace: true });
    } catch (err) {
      console.error(err);
      setState({
        kind: 'error',
        message: "Couldn't join. Try again.",
      });
    }
  };

  return (
    <AppShell>
      <div className="px-6 py-8 max-w-md mx-auto">
        <Link
          to="/"
          className="text-white/60 text-sm underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-moxie/15 border border-accent-moxie mb-4">
            <Users className="w-6 h-6 text-accent-moxie" />
          </div>
          <p className="text-accent-moxie text-xs uppercase tracking-widest mb-1">
            You've been invited
          </p>
          <h1 className="font-display text-4xl text-white leading-tight">
            JOIN
            <br />
            <span className="text-accent-moxie">{team.name.toUpperCase()}</span>
          </h1>
          {sport && (
            <p className="text-white/60 text-sm mt-2">
              {sport.emoji} {sport.label}
            </p>
          )}
        </motion.div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/70 mb-2 block">
              Display Name <span className="text-white/40">(optional)</span>
            </label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder='e.g. "Sarah" or "Jersey #23"'
              maxLength={32}
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30"
            />
            <p className="text-white/45 text-[11px] mt-2 leading-relaxed">
              Shown in your team's activity feed. Leave blank to stay
              anonymous ("An athlete completed Game-Day Mode...").
            </p>
          </div>

          <button
            type="submit"
            disabled={state.kind === 'saving'}
            className="bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50"
          >
            {state.kind === 'saving' ? 'Joining...' : `Join ${team.name}`}
          </button>
        </form>
      </div>
    </AppShell>
  );
};
