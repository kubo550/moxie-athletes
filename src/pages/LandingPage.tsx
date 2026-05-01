import { Link } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { usePageMeta } from '@/utils/usePageMeta';

export const LandingPage = () => {
  usePageMeta({
    title: 'Moxie Athletes — Mental Performance System for Athletes',
    description:
      'Train your mental game. A 60-second pre-competition ritual, AI coaches, performance breathing, and confidence tracking — built for middle school, high school, and college athletes.',
  });
  return (
    <AppShell hideNav>
      <div className="min-h-screen flex flex-col items-center justify-between px-6 py-10 text-center">
        <div className="pt-8">
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
          <p className="text-white/70 max-w-sm text-base mt-4">
            Built for athletes who refuse to lose the mental game. Tap your band
            to lock in.
          </p>
        </div>

        <div className="w-full flex flex-col items-center gap-3 pb-10">
          <div className="text-white/40 text-xs uppercase tracking-widest">
            Tap your band to begin
          </div>
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
