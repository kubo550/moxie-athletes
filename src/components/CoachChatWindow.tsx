import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type AthleteCoach } from '@/config/coaches';
import { askByApiCall } from '@/utils/api/chat';
import { type Message, Role } from '@/types/QuoteType';

type Props = {
  coach: AthleteCoach;
  backHref: string;
};

export const CoachChatWindow = ({ coach, backHref }: Props) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: coach.greeting, role: Role.assistant },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const askBot = async (userText: string) => {
    setBusy(true);
    setError(false);
    const userMsg: Message = {
      id: Date.now(),
      content: userText,
      role: Role.user,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    try {
      const res = await askByApiCall(next, coach.id);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, content: res.reply, role: Role.assistant },
      ]);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await askBot(text);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-black/70 border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            to={backHref}
            className="text-white/70 hover:text-white text-lg"
            aria-label="Back"
          >
            ←
          </Link>
          <div>
            <div className="font-display text-lg tracking-wide leading-none">
              {coach.name.toUpperCase()}
            </div>
            <div className="text-xs text-white/40">{coach.description}</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-2xl mx-auto w-full">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === Role.assistant ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`px-4 py-2.5 rounded-2xl max-w-[78%] text-[15px] leading-snug ${
                m.role === Role.assistant
                  ? 'bg-white/10 text-white rounded-bl-md'
                  : 'bg-accent-moxie text-black rounded-br-md font-medium'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-center text-sm">
            Couldn't reach the coach. Try again.
          </div>
        )}

        {!busy && messages.length === 1 && coach.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end pt-2">
            {coach.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => askBot(s)}
                className="bg-white/5 border border-white/15 rounded-full px-3 py-1.5 text-sm text-white/85 hover:border-accent-moxie/60 hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 bg-black/90 backdrop-blur border-t border-white/10 p-3">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Type your message..."
            className="flex-1 bg-white/8 border border-white/15 rounded-full px-4 py-3 focus:outline-none focus:border-accent-moxie focus:ring-2 focus:ring-accent-moxie/30 text-white placeholder:text-white/40"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="bg-accent-moxie text-black font-display tracking-wider uppercase px-5 rounded-full disabled:opacity-50 active:scale-95 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
