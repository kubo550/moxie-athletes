import { QuoteType } from '@/types/QuoteType';

export type Challenge = {
  id: string;
  title: string;
  description: string;
  coachTypes: QuoteType[];
};

export const CHALLENGES: Challenge[] = [
  {
    id: 'ignore-negative',
    title: 'Ignore One Negative Thought',
    description:
      'During practice, catch one negative thought and refuse to give it the next play.',
    coachTypes: [QuoteType.mental_toughness, QuoteType.bounce_back],
  },
  {
    id: 'encourage-teammate',
    title: 'Encourage A Teammate',
    description:
      'One genuine "let\'s go" or pickup line for a teammate today. Be the energy.',
    coachTypes: [QuoteType.athlete_confidence, QuoteType.mental_toughness],
  },
  {
    id: 'visualize-play',
    title: 'Visualize One Play',
    description:
      'Before practice, close your eyes for 30 seconds and see yourself making one successful play.',
    coachTypes: [QuoteType.game_day_focus, QuoteType.athlete_confidence],
  },
  {
    id: 'next-play-mentality',
    title: 'Next Play Mentality',
    description:
      'After one bad rep, reset in 3 seconds. Breath in. Breath out. Next play.',
    coachTypes: [QuoteType.bounce_back, QuoteType.mental_toughness],
  },
  {
    id: 'lock-in-warmup',
    title: 'First 5 Lock-In',
    description:
      'Lock in for the first 5 minutes of warm-up. No phone, no jokes — just you and the work.',
    coachTypes: [QuoteType.focus, QuoteType.discipline],
  },
  {
    id: 'pre-practice-mantra',
    title: 'Repeat Your Mantra',
    description:
      'Say your mantra out loud 3 times before stepping on the field, court, or mat.',
    coachTypes: [QuoteType.athlete_confidence, QuoteType.pre_workout_motivation],
  },
  {
    id: 'one-extra-rep',
    title: 'One Extra Rep',
    description:
      'When the rep count is over, do one more. Discipline lives in the extra one.',
    coachTypes: [QuoteType.discipline, QuoteType.mental_toughness],
  },
  {
    id: 'breath-before-shot',
    title: 'Breathe Before The Shot',
    description:
      'One slow exhale before any free throw, serve, snap, or play start.',
    coachTypes: [QuoteType.pressure_performance, QuoteType.focus],
  },
  {
    id: 'no-excuses-rep',
    title: 'No Excuses Rep',
    description:
      'No "but coach", no "the ref", no "my legs". Own one rep completely today.',
    coachTypes: [QuoteType.discipline, QuoteType.mental_toughness],
  },
  {
    id: 'eyes-up-walk-in',
    title: 'Walk In With Your Eyes Up',
    description:
      'Walk into the gym, locker room, or field with your shoulders back, eyes up, no phone.',
    coachTypes: [QuoteType.athlete_confidence, QuoteType.build_confidence],
  },
  {
    id: 'study-film-10',
    title: '10 Minutes of Film',
    description:
      'Watch 10 minutes of film today. Yours or pros. Mental reps count.',
    coachTypes: [QuoteType.focus, QuoteType.discipline],
  },
  {
    id: 'sleep-9',
    title: 'In Bed by 9:30',
    description:
      'Recovery is performance. No screens, in bed by 9:30 tonight.',
    coachTypes: [QuoteType.discipline, QuoteType.mental_toughness],
  },
  {
    id: 'hydrate-now',
    title: 'Hydrate Before Practice',
    description:
      'Drink 16oz of water within an hour of practice. Don\'t coast through the warm-up dehydrated.',
    coachTypes: [QuoteType.discipline],
  },
  {
    id: 'thank-coach',
    title: 'Thank Your Coach',
    description:
      'Tell your coach one specific thing you appreciate today. Not generic — be real.',
    coachTypes: [QuoteType.athlete_confidence],
  },
  {
    id: 'name-the-fear',
    title: 'Name The Pressure',
    description:
      'Write down what specifically you\'re nervous about. Naming it shrinks it.',
    coachTypes: [QuoteType.pressure_performance, QuoteType.anxiety_relief],
  },
  {
    id: 'mistake-journal',
    title: 'One Lesson From Today',
    description:
      'After practice, write one sentence: what did today\'s reps teach you?',
    coachTypes: [QuoteType.bounce_back, QuoteType.discipline],
  },
  {
    id: 'pump-up-song',
    title: 'Lock-In Song',
    description:
      'Pick one song that becomes your lock-in song this week. Play it once before competing.',
    coachTypes: [QuoteType.pre_workout_motivation, QuoteType.game_day_focus],
  },
  {
    id: 'no-phone-pregame',
    title: 'No Phone Pre-Game',
    description:
      'No phone in the 30 minutes before kickoff/tipoff/start. Be where your feet are.',
    coachTypes: [QuoteType.focus, QuoteType.game_day_focus],
  },
  {
    id: 'compliment-self',
    title: 'Catch Yourself Doing Something Right',
    description:
      'Find one thing you did well in practice today. Most athletes only catch what went wrong.',
    coachTypes: [QuoteType.build_confidence, QuoteType.athlete_confidence],
  },
  {
    id: 'eye-contact-coach',
    title: 'Eye Contact When Coached',
    description:
      'When your coach gives feedback today — eyes up, head up, listen. No nodding to the ground.',
    coachTypes: [QuoteType.discipline, QuoteType.focus],
  },
];

const todayKey = () => new Date().toISOString().slice(0, 10);

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

export const getDailyChallenges = (count = 3): Challenge[] => {
  const seed = hashString(todayKey());
  const shuffled = [...CHALLENGES]
    .map((c, i) => ({ c, k: ((seed + i * 9301) % 233280) / 233280 }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.c);
  return shuffled.slice(0, count);
};
