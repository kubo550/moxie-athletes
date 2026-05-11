export type Wallpaper = {
  id: string;
  mantra: string;
  palette: {
    bg1: string;
    bg2: string;
    accent: string;
  };
};

// 30 wallpapers — one per day for the first month.
// Generative SVG posters. Real artwork from Jake will swap in here later.
export const WALLPAPERS: Wallpaper[] = [
  { id: 'w-01', mantra: 'I AM THE STORM', palette: { bg1: '#0a0a0a', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-02', mantra: 'TRUST THE REPS', palette: { bg1: '#0d1117', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-03', mantra: 'NEXT PLAY', palette: { bg1: '#0a0a0a', bg2: '#080808', accent: '#ffffff' } },
  { id: 'w-04', mantra: 'BUILT DIFFERENT', palette: { bg1: '#1a0f0f', bg2: '#000000', accent: '#ff2e2e' } },
  { id: 'w-05', mantra: 'NO FEAR', palette: { bg1: '#000000', bg2: '#0a0f1f', accent: '#47bfff' } },
  { id: 'w-06', mantra: 'EYES UP', palette: { bg1: '#0a1a0a', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-07', mantra: 'LOCK IN', palette: { bg1: '#000000', bg2: '#0a0a0a', accent: '#39ff14' } },
  { id: 'w-08', mantra: 'OWN THE MOMENT', palette: { bg1: '#1a0a0a', bg2: '#000000', accent: '#ffb020' } },
  { id: 'w-09', mantra: 'PRESSURE IS A PRIVILEGE', palette: { bg1: '#0a0a1f', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-10', mantra: 'STAY HUNGRY', palette: { bg1: '#0d0d0d', bg2: '#000000', accent: '#ff2e2e' } },
  { id: 'w-11', mantra: 'EARN IT', palette: { bg1: '#000000', bg2: '#1a0f1a', accent: '#ffffff' } },
  { id: 'w-12', mantra: 'BE WATER', palette: { bg1: '#0a1520', bg2: '#000000', accent: '#47bfff' } },
  { id: 'w-13', mantra: 'CHAMPIONS RECOVER', palette: { bg1: '#0a0a0a', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-14', mantra: 'WORK IN SILENCE', palette: { bg1: '#0a0a0a', bg2: '#000000', accent: '#ffb020' } },
  { id: 'w-15', mantra: 'I AM READY', palette: { bg1: '#0f1a0f', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-16', mantra: 'CALM. CLINICAL. COLD.', palette: { bg1: '#0a1520', bg2: '#000000', accent: '#47bfff' } },
  { id: 'w-17', mantra: 'ATTACK', palette: { bg1: '#1a0a0a', bg2: '#000000', accent: '#ff2e2e' } },
  { id: 'w-18', mantra: 'STAY DANGEROUS', palette: { bg1: '#000000', bg2: '#0a0a0a', accent: '#39ff14' } },
  { id: 'w-19', mantra: 'KEEP GOING', palette: { bg1: '#0a0a0a', bg2: '#0d0d0d', accent: '#ffffff' } },
  { id: 'w-20', mantra: 'ONE MORE REP', palette: { bg1: '#0d0d0d', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-21', mantra: 'THE GRIND IS THE GIFT', palette: { bg1: '#1a1a0a', bg2: '#000000', accent: '#ffb020' } },
  { id: 'w-22', mantra: 'BE UNGUARDABLE', palette: { bg1: '#0a0a0a', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-23', mantra: 'COMPOSED UNDER FIRE', palette: { bg1: '#0a0a1f', bg2: '#000000', accent: '#47bfff' } },
  { id: 'w-24', mantra: 'OUTWORK EVERYONE', palette: { bg1: '#000000', bg2: '#0d0d0d', accent: '#ff2e2e' } },
  { id: 'w-25', mantra: 'NEVER FLINCH', palette: { bg1: '#0a0a0a', bg2: '#000000', accent: '#ffffff' } },
  { id: 'w-26', mantra: 'I BELONG HERE', palette: { bg1: '#0a1a0a', bg2: '#000000', accent: '#39ff14' } },
  { id: 'w-27', mantra: 'HEART OVER HYPE', palette: { bg1: '#1a0a0a', bg2: '#000000', accent: '#ff2e2e' } },
  { id: 'w-28', mantra: 'BUILT FOR THIS', palette: { bg1: '#0a0a0a', bg2: '#0a0a1f', accent: '#39ff14' } },
  { id: 'w-29', mantra: 'EVERY REP COUNTS', palette: { bg1: '#0d0d0d', bg2: '#000000', accent: '#ffb020' } },
  { id: 'w-30', mantra: 'YOU VS YOU', palette: { bg1: '#000000', bg2: '#0a0a0a', accent: '#39ff14' } },
];

const epochStart = new Date('2026-01-01T00:00:00Z').getTime();

export const getDailyWallpaper = (): Wallpaper => {
  const now = Date.now();
  const dayIndex = Math.floor((now - epochStart) / (1000 * 60 * 60 * 24));
  const idx = ((dayIndex % WALLPAPERS.length) + WALLPAPERS.length) %
    WALLPAPERS.length;
  return WALLPAPERS[idx];
};

export const buildWallpaperSvg = (
  w: Wallpaper,
  { width = 1170, height = 2532 }: { width?: number; height?: number } = {}
) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${w.palette.bg1}"/>
      <stop offset="100%" stop-color="${w.palette.bg2}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="55%">
      <stop offset="0%" stop-color="${w.palette.accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${w.palette.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <g transform="translate(${width / 2}, ${height * 0.18})" text-anchor="middle" fill="#ffffff" font-family="'Bebas Neue', Anton, Inter, sans-serif">
    <text x="0" y="0" font-size="42" letter-spacing="14" opacity="0.55">MOXIE ATHLETES</text>
  </g>
  <g transform="translate(${width / 2}, ${height * 0.5})" text-anchor="middle" font-family="'Bebas Neue', Anton, Inter, sans-serif">
    <text x="0" y="0" font-size="${Math.min(180, (width / Math.max(w.mantra.length, 8)) * 1.7)}" fill="${w.palette.accent}" letter-spacing="8" font-weight="700">${w.mantra.split(' ').map((word, i) => `<tspan x="0" dy="${i === 0 ? 0 : '1.05em'}">${word}</tspan>`).join('')}</text>
  </g>
  <g transform="translate(${width / 2}, ${height * 0.92})" text-anchor="middle" fill="#ffffff" font-family="'Inter', sans-serif" opacity="0.4">
    <text x="0" y="0" font-size="32" letter-spacing="6">MENTAL PERFORMANCE SYSTEM</text>
  </g>
</svg>`;
