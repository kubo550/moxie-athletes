import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Copy, Shield, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { SPORTS, type SportKey } from '@/config/sports';
import { createTeam } from '@/infrastructure/teams';
import { saveCoachTeam } from '@/utils/coachStorage';
import { usePageMeta } from '@/utils/usePageMeta';

type State =
  | { kind: 'form' }
  | { kind: 'saving' }
  | {
      kind: 'success';
      teamCode: string;
      coachKey: string;
      name: string;
    }
  | { kind: 'error'; message: string };

export const CreateTeamPage = () => {
  usePageMeta({
    title: 'Create a Team · Moxie Athletes',
    description:
      'Coaches: spin up a team in 30 seconds. Get a join link for your athletes and a private dashboard for yourself.',
  });

  const [state, setState] = useState<State>({ kind: 'form' });
  const [name, setName] = useState('');
  const [sport, setSport] = useState<SportKey>('basketball');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setState({ kind: 'saving' });
    try {
      const { teamCode, coachKey } = await createTeam({
        name: name.trim(),
        sport,
      });
      setState({ kind: 'success', teamCode, coachKey, name: name.trim() });
    } catch (err) {
      console.error(err);
      setState({
        kind: 'error',
        message: "Couldn't create the team. Check your connection.",
      });
    }
  };

  if (state.kind === 'success') {
    return <CreateTeamSuccess data={state} />;
  }

  return (
    <AppShell>
      <div className="px-6 py-8 max-w-md mx-auto">
        <Link
          to="/"
          className="text-white/60 text-sm underline-offset-4 hover:text-white"
        >
          ← Back
        </Link>

        <div className="mt-6 mb-8">
          <p className="text-accent-moxie text-xs uppercase tracking-widest mb-1 inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            For Coaches
          </p>
          <h1 className="font-display text-5xl text-white leading-none tracking-wide">
            CREATE
            <br />
            <span className="text-accent-moxie">YOUR TEAM</span>
          </h1>
          <p className="text-white/60 text-sm mt-3 leading-relaxed">
            30 seconds. No login. You'll get a join link to share with your
            athletes and a private dashboard for yourself.
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs uppercase tracking-widest text-white/70 mb-2 block">
              Team Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Lincoln High Bulldogs JV"
              maxLength={60}
              autoFocus
              className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/30 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-white/70 mb-2 block">
              Sport
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SPORTS.filter((s) => s.key !== 'general').map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSport(s.key)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-sm font-medium transition active:scale-95 ${
                    sport === s.key
                      ? 'bg-accent-moxie text-black border-accent-moxie'
                      : 'bg-white/5 text-white/85 border-white/15 hover:border-white/30'
                  }`}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {state.kind === 'error' && (
            <div className="text-red-400 text-sm">{state.message}</div>
          )}

          <button
            type="submit"
            disabled={state.kind === 'saving' || name.trim().length < 2}
            className="bg-accent-moxie text-black font-display tracking-widest text-lg py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            {state.kind === 'saving' ? 'Creating...' : 'Create Team'}
          </button>
        </form>
      </div>
    </AppShell>
  );
};

type SuccessProps = {
  data: {
    teamCode: string;
    coachKey: string;
    name: string;
  };
};

const CreateTeamSuccess = ({ data }: SuccessProps) => {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://moxieathletes.com';
  const joinUrl = `${origin}/join/${data.teamCode}`;
  const coachUrl = `${origin}/team/${data.teamCode}/coach?key=${data.coachKey}`;

  // Save to localStorage so the coach can revisit /team/:teamCode/coach
  // without the ?key= URL, and find the team again from the landing page.
  saveCoachTeam(data.teamCode, data.coachKey, data.name);

  return (
    <AppShell>
      <div className="px-6 py-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-moxie/15 border border-accent-moxie mb-4">
            <Check className="w-6 h-6 text-accent-moxie" />
          </div>
          <h1 className="font-display text-4xl text-white tracking-wide leading-none">
            TEAM CREATED
          </h1>
          <p className="text-white/70 mt-2">{data.name}</p>
        </motion.div>

        <CopyBlock
          label="Athlete Join Link"
          help="Share this with your athletes. Each athlete taps it after activating their Moxie band."
          url={joinUrl}
        />

        <div className="h-4" />

        <CopyBlock
          label="Your Coach Dashboard"
          help="Private. Only you should have this. Bookmark it. Includes your secret key."
          url={coachUrl}
          secret
        />

        <div className="mt-8 flex flex-col gap-3">
          <a
            href={coachUrl}
            className="bg-accent-moxie text-black font-display tracking-widest text-base py-3 rounded-lg uppercase text-center active:scale-[0.98] transition"
          >
            Open Coach Dashboard
          </a>
          <Link
            to="/"
            className="text-white/60 text-sm underline-offset-4 hover:text-white text-center"
          >
            Done
          </Link>
        </div>
      </div>
    </AppShell>
  );
};

const CopyBlock = ({
  label,
  help,
  url,
  secret,
}: {
  label: string;
  help: string;
  url: string;
  secret?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`bg-white/5 border ${
        secret ? 'border-accent-moxie/40' : 'border-white/10'
      } rounded-xl p-4`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs uppercase tracking-widest text-accent-moxie/90">
          {label}
        </span>
        {secret && (
          <span className="text-[10px] uppercase tracking-widest text-amber-300/90 inline-flex items-center gap-0.5">
            <Shield className="w-3 h-3" /> Keep Private
          </span>
        )}
      </div>
      <p className="text-white/55 text-xs mb-3 leading-relaxed">{help}</p>
      <div className="bg-black/40 border border-white/10 rounded-md p-2.5 font-mono text-[11px] text-white/85 break-all">
        {url}
      </div>
      <button
        onClick={copy}
        className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 hover:border-accent-moxie/50 text-white text-sm py-2.5 rounded-md transition"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-accent-moxie" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" /> Copy Link
          </>
        )}
      </button>
    </div>
  );
};
