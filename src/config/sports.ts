export type SportKey =
  | 'basketball'
  | 'football'
  | 'soccer'
  | 'baseball'
  | 'wrestling'
  | 'track'
  | 'volleyball'
  | 'lacrosse'
  | 'hockey'
  | 'tennis'
  | 'general';

export type SportConfig = {
  key: SportKey;
  label: string;
  emoji: string;
  mantraExamples: string[];
};

export const SPORTS: SportConfig[] = [
  {
    key: 'basketball',
    label: 'Basketball',
    emoji: '🏀',
    mantraExamples: [
      'Shoot like nobody is watching.',
      "I'm built for the moment.",
      'Wet. Always wet.',
    ],
  },
  {
    key: 'football',
    label: 'Football',
    emoji: '🏈',
    mantraExamples: [
      'Hit first. Hit hardest.',
      'I am the storm.',
      'Trust the reps.',
    ],
  },
  {
    key: 'soccer',
    label: 'Soccer',
    emoji: '⚽',
    mantraExamples: [
      'First touch. Every time.',
      'I see the field before it happens.',
      'Composed. Clinical. Cold.',
    ],
  },
  {
    key: 'baseball',
    label: 'Baseball / Softball',
    emoji: '⚾',
    mantraExamples: [
      'See it. Hit it.',
      'Slow heart. Fast hands.',
      'One pitch at a time.',
    ],
  },
  {
    key: 'wrestling',
    label: 'Wrestling',
    emoji: '🤼',
    mantraExamples: [
      'I never break.',
      'Six minutes of hell. I bring it.',
      'Pace, pressure, position.',
    ],
  },
  {
    key: 'track',
    label: 'Track / XC',
    emoji: '🏃',
    mantraExamples: [
      'Pain is information.',
      'Stay smooth. Stay fast.',
      'My next step is faster.',
    ],
  },
  {
    key: 'volleyball',
    label: 'Volleyball',
    emoji: '🏐',
    mantraExamples: [
      'Next ball is mine.',
      'Hands strong. Mind quiet.',
      'Float like nothing rattles me.',
    ],
  },
  {
    key: 'lacrosse',
    label: 'Lacrosse',
    emoji: '🥍',
    mantraExamples: [
      'Stick on stick. Heart over fear.',
      "I'm dangerous behind the cage.",
      'Possess every ground ball.',
    ],
  },
  {
    key: 'hockey',
    label: 'Hockey',
    emoji: '🏒',
    mantraExamples: [
      'Skate through the noise.',
      'First on every puck.',
      'Calm hands in tight space.',
    ],
  },
  {
    key: 'tennis',
    label: 'Tennis',
    emoji: '🎾',
    mantraExamples: [
      'Reset between every point.',
      'Heavy ball. Light feet.',
      'I own the next point.',
    ],
  },
  {
    key: 'general',
    label: 'Other',
    emoji: '⚡',
    mantraExamples: [
      'Trust the reps.',
      'I am the storm.',
      'Pressure is a privilege.',
    ],
  },
];

export const getSport = (key: string | null): SportConfig | undefined =>
  SPORTS.find((s) => s.key === key);
