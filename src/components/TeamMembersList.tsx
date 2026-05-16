import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserMinus, Users, X } from 'lucide-react';
import {
  kickFromTeam,
  listTeamMembers,
  type TeamMember,
} from '@/infrastructure/teams';

type Props = {
  teamCode: string;
};

const formatJoined = (millis: number | null): string => {
  if (!millis) return '–';
  const diff = Date.now() - millis;
  const d = Math.floor(diff / (24 * 60 * 60 * 1000));
  if (d < 1) return 'today';
  if (d < 2) return 'yesterday';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
};

export const TeamMembersList = ({ teamCode }: Props) => {
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState(false);
  const [confirmingKick, setConfirmingKick] = useState<string | null>(null);
  const [kicking, setKicking] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await listTeamMembers(teamCode);
        if (!cancelled) setMembers(list);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [teamCode]);

  // Two-tap kick: first tap arms the confirm state (3s window). Second tap
  // within the window actually kicks. Auto-resets on timeout or outside tap.
  useEffect(() => {
    if (!confirmingKick) return;
    const t = setTimeout(() => setConfirmingKick(null), 3000);
    return () => clearTimeout(t);
  }, [confirmingKick]);

  const onKick = async (bandId: string) => {
    if (confirmingKick !== bandId) {
      setConfirmingKick(bandId);
      return;
    }
    setConfirmingKick(null);
    setKicking(bandId);
    try {
      await kickFromTeam(teamCode, bandId);
      setMembers((prev) => prev?.filter((m) => m.bandId !== bandId) ?? null);
    } catch (err) {
      console.error('kick failed', err);
    } finally {
      setKicking(null);
    }
  };

  const visibleCount = members?.length ?? 0;

  return (
    <section className="bg-white/5 border border-white/10 rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div className="font-display text-lg tracking-widest text-white inline-flex items-center gap-2">
          <Users className="w-4 h-4 text-accent-moxie" />
          ROSTER
        </div>
        <span className="text-xs uppercase tracking-widest text-white/55">
          {visibleCount} {visibleCount === 1 ? 'member' : 'members'}
        </span>
      </div>

      {error && (
        <div className="text-sm text-red-400">Couldn't load the roster.</div>
      )}

      {!error && members === null && (
        <div className="text-sm text-white/55 animate-pulse">Loading roster...</div>
      )}

      {!error && members && members.length === 0 && (
        <div className="text-sm text-white/55">
          No one's joined yet. Share the link and they'll appear here.
        </div>
      )}

      {!error && members && members.length > 0 && (
        <ul className="space-y-1.5">
          {members.map((m, i) => {
            const millis = m.joinedAt?.toMillis?.() ?? null;
            const isConfirming = confirmingKick === m.bandId;
            const isKicking = kicking === m.bandId;
            return (
              <motion.li
                key={m.bandId}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition ${
                  isConfirming
                    ? 'bg-red-500/15 border border-red-500/40'
                    : 'bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">
                    {m.nickname || (
                      <span className="text-white/50 italic">
                        Anonymous athlete
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/45 mt-0.5">
                    joined {formatJoined(millis)} ·{' '}
                    <span className="font-mono">
                      {m.bandId.slice(0, 6)}…
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onKick(m.bandId)}
                  disabled={isKicking}
                  aria-label={
                    isConfirming ? 'Confirm remove' : 'Remove from team'
                  }
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest px-2.5 py-1.5 rounded-md border transition disabled:opacity-50 ${
                    isConfirming
                      ? 'bg-red-500/20 border-red-500/50 text-red-200 hover:bg-red-500/30'
                      : 'bg-white/5 border-white/15 text-white/65 hover:border-red-500/40 hover:text-red-300'
                  }`}
                >
                  {isKicking ? (
                    'Removing...'
                  ) : isConfirming ? (
                    <>
                      <UserMinus className="w-3 h-3" /> Confirm
                    </>
                  ) : (
                    <X className="w-3 h-3" />
                  )}
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}

      <p className="text-[11px] text-white/40 mt-3 leading-relaxed">
        Privacy: only display names + join dates. No individual mantras,
        check-ins, or scores are shown.
      </p>
    </section>
  );
};
