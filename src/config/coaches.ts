export type AthleteCoach = {
  id: string;
  name: string;
  description: string;
  greeting: string;
  suggestions: string[];
  // Solid color tile background; replaced with sport photography later.
  // TODO(jake): replace with final coach imagery.
  accentClass: string;
};

export const ATHLETE_COACHES: AthleteCoach[] = [
  {
    id: 'pre-game-nerves',
    name: 'Pre-Game Nerves',
    description: 'Calm the butterflies before kickoff, tipoff, or first whistle.',
    greeting:
      "I got you. Tell me what's running through your head before this one. Be specific.",
    suggestions: [
      "I'm scared of letting my team down",
      "I can't stop overthinking",
      'My body feels tight',
    ],
    accentClass: 'from-zinc-700 to-zinc-900',
  },
  {
    id: 'slump-recovery',
    name: 'Slump Recovery',
    description: 'Climb out of a stretch where nothing has been clicking.',
    greeting:
      "Slumps end. Tell me what the slump looks like right now: practices, games, or in your head?",
    suggestions: [
      "I haven't played well in weeks",
      'My confidence is gone',
      "Coach is benching me",
    ],
    accentClass: 'from-stone-700 to-stone-900',
  },
  {
    id: 'confidence-builder',
    name: 'Confidence Builder',
    description: 'Build a competitor mindset that doesn\'t flinch.',
    greeting:
      "Confidence is a muscle, not a mood. What does showing up confident look like for you?",
    suggestions: [
      "I doubt myself before every game",
      'I play scared',
      "I want to compete like the best version of me",
    ],
    accentClass: 'from-neutral-700 to-neutral-900',
  },
  {
    id: 'dealing-with-mistakes',
    name: 'Dealing With Mistakes',
    description: 'Reset after a bad rep, missed shot, or blown play.',
    greeting:
      'A mistake is information, not identity. What happened, and what do you keep replaying?',
    suggestions: [
      "I missed a huge shot today",
      "I keep replaying my mistake",
      "I'm afraid to make another one",
    ],
    accentClass: 'from-slate-700 to-slate-900',
  },
  {
    id: 'coach-pressure',
    name: 'Coach Pressure',
    description: 'Handle yelling, tough love, and high expectations.',
    greeting:
      "Coaches push you because they see something. What's the situation with yours?",
    suggestions: [
      "My coach yells a lot",
      "I can't tell if coach believes in me",
      "I'm scared of getting cut",
    ],
    accentClass: 'from-zinc-800 to-black',
  },
  {
    id: 'injury-mindset',
    name: 'Injury Mindset',
    description: 'Stay sharp and patient while your body heals.',
    greeting:
      "Injured doesn't mean done. Where are you in the rehab: fresh, mid-grind, or coming back?",
    suggestions: [
      "I'm scared I won't come back the same",
      "I feel left out of the team",
      "I don't know how to stay mentally in it",
    ],
    accentClass: 'from-stone-800 to-black',
  },
];

export const getCoachById = (id: string) =>
  ATHLETE_COACHES.find((c) => c.id === id);
