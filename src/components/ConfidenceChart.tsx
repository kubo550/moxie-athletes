import { type ConfidenceEntry } from '@/infrastructure/athleteBands';

type Props = {
  entries: ConfidenceEntry[];
  days?: number;
};

const W = 320;
const H = 160;
const PAD_X = 24;
const PAD_Y = 14;

const SERIES: {
  key: keyof Pick<ConfidenceEntry, 'confidence' | 'focus' | 'energy'>;
  label: string;
  color: string;
}[] = [
  { key: 'confidence', label: 'Confidence', color: '#39ff14' },
  { key: 'focus', label: 'Focus', color: '#ffffff' },
  { key: 'energy', label: 'Energy', color: '#ffb020' },
];

export const ConfidenceChart = ({ entries, days = 7 }: Props) => {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const recent = sorted.slice(-days);

  if (recent.length === 0) {
    return (
      <div className="text-white/50 text-sm text-center py-8">
        No check-ins yet. Log one today to start your trend.
      </div>
    );
  }

  const xStep =
    recent.length > 1 ? (W - PAD_X * 2) / (recent.length - 1) : 0;
  const yScale = (v: number) =>
    H - PAD_Y - ((v - 1) / 9) * (H - PAD_Y * 2);

  const lineFor = (key: keyof ConfidenceEntry) =>
    recent
      .map((e, i) => {
        const x = PAD_X + i * xStep;
        const y = yScale(Number(e[key]));
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Confidence, focus, and energy over time"
      >
        {/* Y gridlines at 1, 5, 10 */}
        {[1, 5, 10].map((v) => (
          <g key={v}>
            <line
              x1={PAD_X}
              x2={W - PAD_X}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <text
              x={4}
              y={yScale(v) + 3}
              fontSize={9}
              fill="rgba(255,255,255,0.4)"
            >
              {v}
            </text>
          </g>
        ))}

        {SERIES.map((s) => (
          <g key={s.key}>
            <path
              d={lineFor(s.key)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {recent.map((e, i) => (
              <circle
                key={`${s.key}-${i}`}
                cx={PAD_X + i * xStep}
                cy={yScale(Number(e[s.key]))}
                r={2.5}
                fill={s.color}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 justify-center">
        {SERIES.map((s) => (
          <div
            key={s.key}
            className="flex items-center gap-1.5 text-xs text-white/70"
          >
            <span
              className="w-3 h-0.5 rounded"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
};
