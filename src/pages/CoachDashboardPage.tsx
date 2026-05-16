import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  Award,
  ClipboardList,
  Flame,
  Share2,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { InviteAthletesCard } from '@/components/InviteAthletesCard';
import { TeamMembersList } from '@/components/TeamMembersList';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getTeam, topMantras, type Team } from '@/infrastructure/teams';
import {
  getTeamEvents,
  type TeamEvent,
} from '@/infrastructure/teamEvents';
import { getSport } from '@/config/sports';
import { getCoachKey, saveCoachTeam } from '@/utils/coachStorage';
import { usePageMeta } from '@/utils/usePageMeta';

type State =
  | { kind: 'loading' }
  | { kind: 'missing' }
  | { kind: 'unauthorized' }
  | { kind: 'ready'; team: Team; events: TeamEvent[] }
  | { kind: 'error'; message: string };

export const CoachDashboardPage = () => {
  const { teamCode } = useParams<{ teamCode: string }>();
  const [params] = useSearchParams();
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [keyInput, setKeyInput] = useState('');

  usePageMeta({
    title: 'Coach Dashboard · Moxie Athletes',
    noindex: true,
  });

  useEffect(() => {
    if (!teamCode) return;
    const urlKey = params.get('key');
    const key = urlKey ?? getCoachKey(teamCode);

    let cancelled = false;
    (async () => {
      try {
        const team = await getTeam(teamCode);
        if (cancelled) return;
        if (!team) {
          setState({ kind: 'missing' });
          return;
        }
        if (!key || key !== team.coachKey) {
          setState({ kind: 'unauthorized' });
          return;
        }
        // Persist (or refresh) the team + key so this coach can find it again
        // from the landing page without re-pasting the URL.
        saveCoachTeam(teamCode, team.coachKey, team.name);
        const events = await getTeamEvents(teamCode, 30);
        if (cancelled) return;
        setState({ kind: 'ready', team, events });
      } catch (err) {
        console.error('coach dashboard load failed', err);
        if (!cancelled) {
          const detail =
            err instanceof Error ? err.message : String(err ?? 'Unknown error');
          setState({
            kind: 'error',
            message: detail,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamCode, params]);

  if (!teamCode) return null;

  if (state.kind === 'loading') {
    return (
      <AppShell>
        <div className="px-6 py-16 text-center text-white/60 animate-pulse font-display tracking-widest">
          LOADING DASHBOARD...
        </div>
      </AppShell>
    );
  }

  if (state.kind === 'missing') {
    return (
      <AppShell>
        <div className="px-6 py-12 max-w-md mx-auto text-center">
          <h1 className="font-display text-3xl text-white mb-2">
            TEAM NOT FOUND
          </h1>
          <p className="text-white/60 text-sm mb-6">
            This dashboard link is invalid or the team was removed.
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

  if (state.kind === 'unauthorized') {
    return (
      <AppShell>
        <div className="px-6 py-10 max-w-md mx-auto">
          <div className="inline-flex items-center gap-2 text-amber-300/90 text-xs uppercase tracking-widest mb-3">
            <Shield className="w-3.5 h-3.5" />
            Authorization Required
          </div>
          <h1 className="font-display text-3xl text-white leading-tight mb-3">
            ENTER YOUR
            <br />
            <span className="text-accent-moxie">COACH KEY</span>
          </h1>
          <p className="text-white/65 text-sm mb-6 leading-relaxed">
            Paste the coach key from the URL you got when creating the team.
            We'll save it to this device so you don't have to do it again.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const k = keyInput.trim();
              if (!k) return;
              // Save with teamCode as a placeholder name. If the key is correct
              // the next page load will overwrite name with the real team name.
              saveCoachTeam(teamCode, k, teamCode);
              window.location.reload();
            }}
            className="flex flex-col gap-3"
          >
            <input
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste your coach key here"
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/30 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30"
            />
            <button
              type="submit"
              disabled={!keyInput.trim()}
              className="bg-accent-moxie text-black font-display tracking-widest text-base py-3 rounded-lg uppercase disabled:opacity-50"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </AppShell>
    );
  }

  if (state.kind === 'error') {
    return (
      <AppShell>
        <div className="px-6 py-12 max-w-md mx-auto">
          <h1 className="font-display text-2xl text-white mb-3">
            DASHBOARD ERROR
          </h1>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm font-mono break-words mb-4">
            {state.message}
          </div>
          <p className="text-white/65 text-sm leading-relaxed mb-4">
            Most likely a Firestore index is missing for the team-events
            query. Open the browser console. Firestore prints a clickable URL
            you can use to auto-create the index in one click.
          </p>
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

  return <DashboardView team={state.team} events={state.events} />;
};

const DashboardView = ({
  team,
  events,
}: {
  team: Team;
  events: TeamEvent[];
}) => {
  const sport = getSport(team.sport);
  const topFive = useMemo(() => topMantras(team.mantraCounts, 5), [team.mantraCounts]);
  const avgConfidence =
    team.confidenceCount > 0
      ? (team.confidenceSum / team.confidenceCount).toFixed(1)
      : null;
  const hasAthletes = team.athleteCount > 0;
  const [inviteOpen, setInviteOpen] = useState(false);

  // Rough "weekly engagement": events in last 7 days. Not perfect but cheap.
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekEvents = events.filter(
    (e) => (e.createdAt?.toMillis?.() ?? 0) >= weekAgo
  );

  return (
    <AppShell>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-accent-moxie text-xs uppercase tracking-widest mb-1">
              <Shield className="w-3 h-3" />
              Coach Dashboard
            </div>
            <h1 className="font-display text-4xl text-white leading-tight tracking-wide">
              {team.name.toUpperCase()}
            </h1>
            <div className="text-xs text-white/55 mt-1">
              {sport ? `${sport.emoji} ${sport.label} · ` : ''}
              {team.athleteCount} athlete
              {team.athleteCount !== 1 ? 's' : ''} ·{' '}
              <span className="font-mono">{team.teamCode}</span>
            </div>
          </div>
          {hasAthletes && (
            <button
              onClick={() => setInviteOpen(true)}
              aria-label="Invite athletes"
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-accent-moxie/50 text-white text-xs uppercase tracking-widest px-3 py-2 rounded-full transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Invite
            </button>
          )}
        </div>

        {!hasAthletes && (
          <>
            <div className="px-1">
              <div className="font-display text-base text-accent-moxie tracking-widest uppercase mb-1">
                Step 1
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Your dashboard goes live the moment your first athlete joins.
                Send them the link.
              </p>
            </div>
            <InviteAthletesCard
              teamCode={team.teamCode}
              teamName={team.name}
            />
          </>
        )}

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent
            showOverlay
            className="bg-black/95 border-white/10 sm:max-w-md"
          >
            <DialogHeader>
              <DialogTitle className="font-display text-xl tracking-widest text-white">
                INVITE ATHLETES
              </DialogTitle>
              <DialogDescription className="text-white/65 text-sm">
                Share the link with the rest of your roster.
              </DialogDescription>
            </DialogHeader>
            <InviteAthletesCard
              teamCode={team.teamCode}
              teamName={team.name}
            />
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-2 gap-3">
          <BigStat
            icon={<Zap className="w-4 h-4" />}
            label="Game-Days"
            value={team.totalGameDays}
            color="#39ff14"
          />
          <BigStat
            icon={<Trophy className="w-4 h-4" />}
            label="Mental Reps"
            value={team.totalMentalReps}
            color="#ffb020"
          />
          <BigStat
            icon={<Activity className="w-4 h-4" />}
            label="Avg Confidence"
            value={avgConfidence ?? '–'}
            sub={
              avgConfidence
                ? `${team.confidenceCount} check-ins`
                : 'No check-ins yet'
            }
            color="#47bfff"
          />
          <BigStat
            icon={<ClipboardList className="w-4 h-4" />}
            label="Post-Games"
            value={team.totalPostGames}
            color="#ff2e2e"
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-accent-moxie" />
            <span className="font-display text-lg tracking-widest text-white">
              MOST-USED MANTRAS
            </span>
          </div>
          {topFive.length === 0 ? (
            <div className="text-sm text-white/50">
              No mantras tracked yet. Athletes' mantras start appearing here as
              soon as they tap Game-Day Mode.
            </div>
          ) : (
            <ul className="space-y-2">
              {topFive.map((m, i) => (
                <li
                  key={m.text}
                  className="flex items-center gap-3 bg-white/5 rounded-md px-3 py-2"
                >
                  <span className="font-display text-accent-moxie tabular-nums">
                    #{i + 1}
                  </span>
                  <span className="flex-1 text-white text-sm italic truncate">
                    "{m.text}"
                  </span>
                  <span className="text-white/55 text-xs tabular-nums">
                    {m.count}×
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <TeamMembersList teamCode={team.teamCode} />

        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-display text-xl tracking-widest text-white inline-flex items-center gap-2">
              <Flame className="w-4 h-4 text-accent-moxie" />
              ACTIVITY FEED
            </h2>
            <span className="text-xs uppercase tracking-widest text-white/55">
              {weekEvents.length} this week
            </span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/5">
            {events.length === 0 ? (
              <div className="p-4 text-sm text-white/55">
                No activity yet. Wait until your athletes start using Game-Day
                Mode.
              </div>
            ) : (
              events.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 p-3"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-moxie/12 border border-accent-moxie/35 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-accent-moxie" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white leading-snug">
                      {e.message}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div className="inline-flex items-center gap-1.5 text-white/55 text-[10px] uppercase tracking-widest mb-2">
            <Users className="w-3 h-3" />
            Privacy
          </div>
          <p className="text-white/65 text-xs leading-relaxed">
            Aggregate stats only. No individual athlete data is shown or
            stored against names. Athletes choose their own display names.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

const BigStat = ({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div
      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest"
      style={{ color }}
    >
      {icon}
      {label}
    </div>
    <div
      className="font-display text-3xl tabular-nums leading-none mt-2"
      style={{ color }}
    >
      {value}
    </div>
    {sub && <div className="text-[11px] text-white/45 mt-1">{sub}</div>}
  </div>
);
