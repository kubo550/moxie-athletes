import { Link } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { usePageMeta } from '@/utils/usePageMeta';

export const AboutPage = () => {
  usePageMeta({
    title: 'About — Moxie Athletes',
    description:
      'Most athletes train their bodies for hours. They train their minds for zero. Moxie Athletes is the mental performance system fixing that — built for middle school, high school, and college athletes.',
  });
  return (
    <AppShell>
      <div className="px-6 py-10 space-y-8 text-left">
        <div>
          <p className="text-accent-moxie text-xs uppercase tracking-widest mb-3">
            About
          </p>
          <h1 className="font-display text-5xl text-white leading-none">
            BUILT FOR THE
            <br />
            <span className="text-accent-moxie">MENTAL GAME</span>
          </h1>
        </div>

        <div className="space-y-5 text-white/80 leading-relaxed">
          <p>
            Most athletes train their bodies for hours every week. They train
            their minds for zero. Moxie Athletes fixes that.
          </p>
          <p>
            One tap of your band before competition runs you through a 60
            second ritual built on what elite performers actually do — lock in,
            visualize, breathe, and remind yourself who you are.
          </p>
          <p>
            Between games, build the rep. Daily mental challenges. AI coaches
            for slumps and pressure moments. Performance breathing for the
            sideline. A confidence tracker so you can see your mind getting
            stronger over time.
          </p>
          <p className="text-white/60 text-sm">
            Anonymous, private, built for middle school through college
            athletes. No login. The band is the account.
          </p>
        </div>

        <Link
          to="/"
          className="inline-block text-white/60 text-sm underline underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>
      </div>
    </AppShell>
  );
};
