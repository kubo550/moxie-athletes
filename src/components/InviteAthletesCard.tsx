import { useState } from 'react';
import { Check, Copy, Share2, Users } from 'lucide-react';

type Props = {
  teamCode: string;
  teamName: string;
};

const buildJoinUrl = (teamCode: string) => {
  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://moxieathletes.com';
  return `${origin}/join/${teamCode}`;
};

export const InviteAthletesCard = ({ teamCode, teamName }: Props) => {
  const joinUrl = buildJoinUrl(teamCode);
  const [copied, setCopied] = useState(false);

  const canShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('clipboard failed', err);
      // Fallback: select text in the visible box so the user can long-press copy.
    }
  };

  const share = async () => {
    if (!canShare) {
      copy();
      return;
    }
    try {
      await navigator.share({
        title: `Join ${teamName} on Moxie Athletes`,
        text: `${teamName} is using Moxie Athletes for mental performance. Tap your band, then open this link to join the roster:`,
        url: joinUrl,
      });
    } catch (err) {
      // User canceled or share unsupported. Silently noop.
      if (
        err instanceof DOMException &&
        (err.name === 'AbortError' || err.name === 'NotAllowedError')
      )
        return;
      console.error('share failed', err);
    }
  };

  return (
    <section className="bg-gradient-to-br from-accent-moxie/12 to-transparent border border-accent-moxie/30 rounded-2xl p-5">
      <div className="inline-flex items-center gap-1.5 text-accent-moxie text-xs uppercase tracking-widest mb-2">
        <Users className="w-3.5 h-3.5" />
        Invite Athletes
      </div>
      <p className="text-white/75 text-sm leading-relaxed mb-3">
        Share this link with your team. Each athlete activates their Moxie
        band, then opens the link to join the roster.
      </p>
      <div className="bg-black/40 border border-white/10 rounded-md px-3 py-2.5 font-mono text-[11px] text-white/85 break-all select-all mb-3">
        {joinUrl}
      </div>
      <div className="flex gap-2">
        <button
          onClick={copy}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-white/8 border border-white/15 hover:border-accent-moxie/50 text-white text-sm py-2.5 rounded-md transition active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-accent-moxie" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
        <button
          onClick={share}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-accent-moxie text-black font-display tracking-widest text-sm py-2.5 rounded-md uppercase active:scale-[0.98] transition"
        >
          <Share2 className="w-4 h-4" />
          {canShare ? 'Share' : 'Copy Link'}
        </button>
      </div>
    </section>
  );
};
