import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import {
  getCoachTeams,
  type CoachTeamRecord,
} from '@/utils/coachStorage';
import { usePageMeta } from '@/utils/usePageMeta';

export const LandingPage = () => {
  usePageMeta({
    title: 'Moxie Athletes · Mental Performance System for Athletes',
    description:
      'Train your mental game. A 60-second pre-competition ritual, AI coaches, performance breathing, and confidence tracking. Built for middle school, high school, and college athletes.',
  });

  const [coachTeams, setCoachTeams] = useState<
    Array<CoachTeamRecord & { teamCode: string }>
  >([]);
  useEffect(() => {
    setCoachTeams(getCoachTeams());
  }, []);

  const hasTeams = coachTeams.length > 0;

  return (
    <AppShell hideNav>
      <div
        className={`flex flex-col items-center px-6 py-6 text-center ${
          hasTeams ? 'min-h-[100dvh] justify-start gap-6' : 'h-[100dvh] justify-between'
        }`}
      >
        <div className="pt-2">
          <span className="font-display text-3xl tracking-[0.3em] text-white/60">
            MOXIE
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="font-display text-6xl sm:text-7xl text-white leading-none">
            MENTAL
            <br />
            <span className="text-accent-moxie">PERFORMANCE</span>
            <br />
            SYSTEM
          </h1>
          <p className="text-white/70 max-w-sm text-base mt-2">
            Built for athletes who refuse to lose the mental game. Tap your band
            to lock in.
          </p>
        </div>

        {hasTeams && (
          <section className="w-full max-w-md text-left">
            <div className="inline-flex items-center gap-1.5 text-accent-moxie text-xs uppercase tracking-widest mb-2">
              <Shield className="w-3.5 h-3.5" />
              Your Teams
            </div>
            <ul className="space-y-2">
              {coachTeams.map((t) => (
                <li key={t.teamCode}>
                  <Link
                    to={`/team/${t.teamCode}/coach`}
                    className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 hover:border-accent-moxie/40 rounded-xl px-4 py-3 transition active:scale-[0.99]"
                  >
                    <div className="min-w-0">
                      <div className="font-display text-lg tracking-wide text-white truncate">
                        {t.name.toUpperCase()}
                      </div>
                      <div className="text-[11px] font-mono text-white/45 truncate">
                        {t.teamCode}
                      </div>
                    </div>
                    <span className="text-xs uppercase tracking-widest text-accent-moxie/90 flex-shrink-0">
                      Open →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-white/40 text-[11px] mt-2 leading-relaxed">
              Saved on this device. Sign in is not required.
            </p>
          </section>
        )}

        <div className="w-full flex flex-col items-center gap-2 pb-2">
          <div className="text-white/40 text-xs uppercase tracking-widest">
            Tap your band to begin
          </div>
          <Link
            to="/team/new"
            className="text-accent-moxie text-sm uppercase tracking-widest font-display hover:underline underline-offset-4"
          >
            Coach? Create a Team →
          </Link>
          <Link
            to="/about"
            className="text-white/60 text-sm underline-offset-4 hover:text-white hover:underline"
          >
            What is Moxie Athletes?
          </Link>
        </div>
      </div>
    </AppShell>
  );
};
