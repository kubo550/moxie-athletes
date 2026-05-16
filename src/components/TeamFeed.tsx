import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ClipboardList,
  Flame,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import {
  getTeamEvents,
  type TeamEvent,
  type TeamEventType,
} from '@/infrastructure/teamEvents';
import { getTeam, type Team } from '@/infrastructure/teams';

type Props = {
  teamCode: string;
  teamName?: string;
};

const ICON_BY_TYPE: Record<TeamEventType, React.ComponentType<{ className?: string }>> =
  {
    gameday: Zap,
    postgame: ClipboardList,
    streak: Flame,
    reps: Trophy,
    confidence: Activity,
    join: Sparkles,
  };

const formatRelative = (millis: number | null): string => {
  if (!millis) return '';
  const diff = Date.now() - millis;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
};

export const TeamFeed = ({ teamCode, teamName }: Props) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [events, setEvents] = useState<TeamEvent[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setEvents(null);
    setTeam(null);
    setError(false);
    (async () => {
      try {
        const [t, e] = await Promise.all([
          getTeam(teamCode),
          getTeamEvents(teamCode, 10),
        ]);
        if (cancelled) return;
        setTeam(t);
        setEvents(e);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamCode]);

  return (
    <section className="w-full">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-2xl tracking-wider text-white inline-flex items-center gap-2">
          <Users className="w-5 h-5 text-accent-moxie" />
          {(team?.name || teamName || 'TEAM').toUpperCase()}
        </h2>
        {team && team.athleteCount > 0 && (
          <span className="text-xs uppercase tracking-widest text-white/55">
            {team.athleteCount} {team.athleteCount === 1 ? 'athlete' : 'athletes'}
          </span>
        )}
      </div>

      {team && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <StatTile
            label="Game-Days"
            value={team.totalGameDays}
            color="#39ff14"
          />
          <StatTile label="Reps" value={team.totalMentalReps} color="#ffb020" />
          <StatTile
            label="Confidence"
            value={
              team.confidenceCount > 0
                ? (team.confidenceSum / team.confidenceCount).toFixed(1)
                : '–'
            }
            color="#47bfff"
          />
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl divide-y divide-white/5">
        {error && (
          <div className="p-4 text-sm text-red-400">
            Couldn't load the team feed.
          </div>
        )}
        {!error && events === null && (
          <div className="p-4 text-sm text-white/55 animate-pulse">
            Loading team activity...
          </div>
        )}
        {!error && events && events.length === 0 && (
          <div className="p-4 text-sm text-white/55">
            No team activity yet. Be the first. Complete Game-Day Mode and
            check the post-game.
          </div>
        )}
        {events &&
          events.slice(0, 8).map((e, i) => {
            const Icon = ICON_BY_TYPE[e.type] ?? Sparkles;
            const when = formatRelative(e.createdAt?.toMillis?.() ?? null);
            return (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 p-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-moxie/12 border border-accent-moxie/35 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-accent-moxie" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white leading-snug">
                    {e.message}
                  </div>
                  {when && (
                    <div className="text-[11px] text-white/45 mt-0.5">
                      {when}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
      </div>
    </section>
  );
};

const StatTile = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-center">
    <div
      className="font-display text-2xl tabular-nums leading-none"
      style={{ color }}
    >
      {value}
    </div>
    <div className="text-[10px] uppercase tracking-widest text-white/55 mt-1">
      {label}
    </div>
  </div>
);
