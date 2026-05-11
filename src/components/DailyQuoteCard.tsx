import { useMemo } from 'react';
import { Quote } from 'lucide-react';
import { getDailyQuote } from '@/config/quotes';

export const DailyQuoteCard = () => {
  const quote = useMemo(() => getDailyQuote(), []);

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-white/8 to-white/3 border border-white/10 rounded-xl p-5 relative overflow-hidden">
        <Quote className="absolute top-3 right-3 w-5 h-5 text-accent-moxie/40" />
        <div className="text-[10px] uppercase tracking-[0.3em] text-accent-moxie/80 mb-2">
          Quote of the Day
        </div>
        <p className="text-white text-base leading-snug italic">
          “{quote.quote}”
        </p>
        <div className="mt-3 text-xs text-white/55">
          — {quote.author}
          {quote.sport && (
            <span className="text-white/40"> · {quote.sport}</span>
          )}
        </div>
      </div>
    </div>
  );
};
