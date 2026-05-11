import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wind,
  MessageCircleHeart,
  LineChart,
  Zap,
  Pencil,
  Flame,
  ClipboardList,
} from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { MentalRepsCarousel } from '@/components/MentalRepsCarousel';
import { DailyQuoteCard } from '@/components/DailyQuoteCard';
import { WallpaperOfTheDayCard } from '@/components/WallpaperOfTheDayCard';
import {
  type AthleteBand,
  getBand,
} from '@/infrastructure/athleteBands';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';
import { getSport } from '@/config/sports';
import { usePageMeta } from '@/utils/usePageMeta';

const todayKey = () => new Date().toISOString().slice(0, 10);
const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

const formatStreak = (band: AthleteBand): { count: number; live: boolean } => {
  if (!band.streakLastDate || band.streakCount <= 0)
    return { count: 0, live: false };
  const live =
    band.streakLastDate === todayKey() ||
    band.streakLastDate === yesterdayKey();
  return { count: live ? band.streakCount : 0, live };
};

export const BandHomePage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  usePageMeta({ title: 'Your Band — Moxie Athletes', noindex: true });
  const [band, setBand] = useState<AthleteBand | null>(null);
  const [loading, setLoading] = useState(true);
  const isOwner = (() => {
    if (!band?.deviceFingerprint) return true;
    return band.deviceFingerprint === getDeviceFingerprint();
  })();

  useEffect(() => {
    if (!bandId) return;
    (async () => {
      try {
        setBand(await getBand(bandId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [bandId]);

  if (!bandId) return null;
  const streak = band ? formatStreak(band) : { count: 0, live: false };
  const sport = getSport(band?.sport ?? null);

  return (
    <AppShell bandId={bandId}>
      <div className="px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-accent-moxie/15 to-transparent border border-accent-moxie/30 rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs uppercase tracking-widest text-accent-moxie/90">
              Your Mantra
            </div>
            {streak.count > 0 && (
              <div className="inline-flex items-center gap-1 bg-orange-500/15 border border-orange-500/40 text-orange-300 text-xs font-display tracking-widest uppercase px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" />
                {streak.count} day{streak.count !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <div className="font-display text-2xl text-white leading-tight italic">
            {loading ? '...' : band?.mantra ? `"${band.mantra}"` : 'Set one →'}
          </div>
          {sport && (
            <div className="text-white/40 text-xs mt-1">
              {sport.emoji} {sport.label}
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <Link
              to={`/g/${bandId}`}
              className="inline-flex items-center gap-2 bg-accent-moxie text-black font-display tracking-wider text-sm uppercase px-4 py-2 rounded-full active:scale-95 transition"
            >
              <Zap className="w-4 h-4" />
              Game-Day Mode
            </Link>
            {isOwner && (
              <Link
                to={`/g/${bandId}/edit`}
                className="text-xs uppercase tracking-widest text-white/60 hover:text-white inline-flex items-center gap-1"
              >
                <Pencil className="w-3 h-3" /> Edit
              </Link>
            )}
          </div>
        </motion.div>

        <DailyQuoteCard />

        <MentalRepsCarousel />

        <WallpaperOfTheDayCard bandId={bandId} />

        <div className="grid grid-cols-2 gap-3">
          <HomeCard
            to={`/g/${bandId}/postgame`}
            icon={<ClipboardList className="w-5 h-5" />}
            label="Post-Game"
            sub="3 questions · 90 sec"
            colSpan
          />
          <HomeCard
            to={`/g/${bandId}/coach`}
            icon={<MessageCircleHeart className="w-5 h-5" />}
            label="AI Coach"
            sub="Pre-game · slumps · pressure"
          />
          <HomeCard
            to={`/g/${bandId}/breathe`}
            icon={<Wind className="w-5 h-5" />}
            label="Breathe"
            sub="Reset · pre-game · halftime"
          />
          <HomeCard
            to={`/g/${bandId}/tracker`}
            icon={<LineChart className="w-5 h-5" />}
            label="Tracker"
            sub="Confidence · focus · energy"
            colSpan
          />
        </div>

        {band?.sponsor && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
            <div className="text-[10px] uppercase tracking-widest text-white/50">
              Powered by
            </div>
            <div className="font-display text-xl text-white tracking-wide mt-0.5">
              {band.sponsor.name.toUpperCase()}
            </div>
            {band.sponsor.message && (
              <div className="text-xs text-white/60 mt-1">
                {band.sponsor.message}
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

const HomeCard = ({
  to,
  icon,
  label,
  sub,
  colSpan,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
  colSpan?: boolean;
}) => (
  <Link
    to={to}
    className={`bg-white/5 border border-white/10 hover:border-accent-moxie/40 rounded-xl p-4 transition active:scale-[0.98] ${
      colSpan ? 'col-span-2' : ''
    }`}
  >
    <div className="text-accent-moxie mb-2">{icon}</div>
    <div className="font-display text-xl tracking-wider text-white">
      {label.toUpperCase()}
    </div>
    <div className="text-xs text-white/55 mt-1">{sub}</div>
  </Link>
);
