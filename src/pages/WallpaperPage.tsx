import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, X } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import {
  buildWallpaperSvg,
  getDailyWallpaper,
} from '@/config/wallpapers';
import { usePageMeta } from '@/utils/usePageMeta';

const WIDTH = 1170;
const HEIGHT = 2532;

const svgToPngBlob = (svg: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = WIDTH;
      canvas.height = HEIGHT;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('no 2d ctx'));
      ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
        'image/png'
      );
    };
    img.onerror = () => reject(new Error('svg image load failed'));
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });

export const WallpaperPage = () => {
  const { bandId } = useParams<{ bandId: string }>();
  const wallpaper = useMemo(() => getDailyWallpaper(), []);
  const svg = useMemo(
    () => buildWallpaperSvg(wallpaper, { width: WIDTH, height: HEIGHT }),
    [wallpaper]
  );
  const previewUrl = useMemo(
    () => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
    [svg]
  );
  const [busy, setBusy] = useState(false);

  usePageMeta({
    title: 'Wallpaper of the Day · Moxie Athletes',
    noindex: true,
  });

  const download = async () => {
    setBusy(true);
    try {
      const blob = await svgToPngBlob(svg);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moxie-${wallpaper.id}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const back = bandId ? `/g/${bandId}/home` : '/';

  return (
    <AppShell bandId={bandId} hideNav>
      <div className="fixed inset-0 bg-black flex flex-col z-10">
        <header className="flex items-center justify-between px-4 h-14 border-b border-white/10">
          <Link to={back} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </Link>
          <div className="font-display text-base tracking-widest">
            WALLPAPER · TODAY
          </div>
          <div className="w-5" />
        </header>

        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <img
            src={previewUrl}
            alt={wallpaper.mantra}
            className="max-h-full max-w-full rounded-xl shadow-2xl"
            style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          />
        </div>

        <div className="px-6 pb-6 pt-2 max-w-md mx-auto w-full">
          <button
            onClick={download}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent-moxie text-black font-display tracking-widest text-base py-4 rounded-lg uppercase active:scale-[0.98] transition disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {busy ? 'Saving...' : 'Save to Photos'}
          </button>
          <p className="text-center text-[11px] text-white/45 mt-2">
            On iPhone: tap "Save to Photos", or long-press the image and pick "Add to Photos".
          </p>
        </div>
      </div>
    </AppShell>
  );
};
