import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Wallpaper as WallpaperIcon, Download } from 'lucide-react';
import { buildWallpaperSvg, getDailyWallpaper } from '@/config/wallpapers';

type Props = {
  bandId: string;
};

export const WallpaperOfTheDayCard = ({ bandId }: Props) => {
  const wallpaper = useMemo(() => getDailyWallpaper(), []);
  const svgData = useMemo(
    () =>
      `data:image/svg+xml;utf8,${encodeURIComponent(
        buildWallpaperSvg(wallpaper, { width: 600, height: 1300 })
      )}`,
    [wallpaper]
  );

  return (
    <Link
      to={`/g/${bandId}/wallpaper`}
      className="block bg-white/5 border border-white/10 hover:border-accent-moxie/40 rounded-xl p-4 transition active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-24 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-black"
          style={{
            backgroundImage: `url("${svgData}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 text-accent-moxie mb-1">
            <WallpaperIcon className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-[0.25em]">
              Today's Wallpaper
            </span>
          </div>
          <div className="font-display text-lg tracking-wide text-white truncate">
            {wallpaper.mantra}
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-white/55 mt-1">
            <Download className="w-3 h-3" />
            Save to Photos
          </div>
        </div>
      </div>
    </Link>
  );
};
