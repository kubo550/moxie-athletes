export type AthleteQuote = {
  id: string;
  quote: string;
  author: string;
  sport?: string;
};

export const ATHLETE_QUOTES: AthleteQuote[] = [
  {
    id: 'kobe-1',
    quote:
      'Everything negative, pressure, challenges, is all an opportunity for me to rise.',
    author: 'Kobe Bryant',
    sport: 'Basketball',
  },
  {
    id: 'jordan-1',
    quote:
      "I've missed more than 9,000 shots. I've lost almost 300 games. That is why I succeed.",
    author: 'Michael Jordan',
    sport: 'Basketball',
  },
  {
    id: 'jordan-2',
    quote: 'Talent wins games, but teamwork and intelligence win championships.',
    author: 'Michael Jordan',
    sport: 'Basketball',
  },
  {
    id: 'brady-1',
    quote: "You have to believe in yourself when no one else does.",
    author: 'Tom Brady',
    sport: 'Football',
  },
  {
    id: 'serena-1',
    quote: "I'm not going to let the negative people on the outside tell me who I am.",
    author: 'Serena Williams',
    sport: 'Tennis',
  },
  {
    id: 'ali-1',
    quote: "Don't count the days. Make the days count.",
    author: 'Muhammad Ali',
    sport: 'Boxing',
  },
  {
    id: 'ali-2',
    quote: 'I hated every minute of training, but I said: don\'t quit. Suffer now and live the rest of your life as a champion.',
    author: 'Muhammad Ali',
    sport: 'Boxing',
  },
  {
    id: 'wooden-1',
    quote: 'Be quick, but don\'t hurry.',
    author: 'John Wooden',
    sport: 'Basketball',
  },
  {
    id: 'wooden-2',
    quote: 'Things turn out best for the people who make the best of the way things turn out.',
    author: 'John Wooden',
    sport: 'Basketball',
  },
  {
    id: 'lebron-1',
    quote: "I'm built for this. Pressure is what we live for.",
    author: 'LeBron James',
    sport: 'Basketball',
  },
  {
    id: 'curry-1',
    quote: 'Success is not an accident. Success is a choice.',
    author: 'Stephen Curry',
    sport: 'Basketball',
  },
  {
    id: 'mahomes-1',
    quote: "I don't get tired of winning. I will not be satisfied until I'm done.",
    author: 'Patrick Mahomes',
    sport: 'Football',
  },
  {
    id: 'tyson-1',
    quote: 'Everybody has a plan until they get punched in the mouth.',
    author: 'Mike Tyson',
    sport: 'Boxing',
  },
  {
    id: 'lombardi-1',
    quote: "Winners never quit, and quitters never win.",
    author: 'Vince Lombardi',
    sport: 'Football',
  },
  {
    id: 'lombardi-2',
    quote: "The man on top of the mountain didn't fall there.",
    author: 'Vince Lombardi',
    sport: 'Football',
  },
  {
    id: 'jeter-1',
    quote: 'There may be people that have more talent than you, but there\'s no excuse for anyone to work harder than you do.',
    author: 'Derek Jeter',
    sport: 'Baseball',
  },
  {
    id: 'gretzky-1',
    quote: 'You miss 100% of the shots you don\'t take.',
    author: 'Wayne Gretzky',
    sport: 'Hockey',
  },
  {
    id: 'sue-bird-1',
    quote: "I'm not afraid to fail. I'm afraid to not try.",
    author: 'Sue Bird',
    sport: 'Basketball',
  },
  {
    id: 'megan-rapinoe-1',
    quote: "Be more. Be better. Be bigger than you've ever been before.",
    author: 'Megan Rapinoe',
    sport: 'Soccer',
  },
  {
    id: 'phelps-1',
    quote: 'You can\'t put a limit on anything. The more you dream, the farther you get.',
    author: 'Michael Phelps',
    sport: 'Swimming',
  },
  {
    id: 'pele-1',
    quote: 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and love of what you are doing.',
    author: 'Pelé',
    sport: 'Soccer',
  },
  {
    id: 'navratilova-1',
    quote: 'The difference between involvement and commitment is like ham and eggs. The chicken is involved; the pig is committed.',
    author: 'Martina Navratilova',
    sport: 'Tennis',
  },
  {
    id: 'iverson-1',
    quote: "I'd rather work hard and lose than do nothing and win.",
    author: 'Allen Iverson',
    sport: 'Basketball',
  },
  {
    id: 'simone-biles-1',
    quote: "I'd rather regret the risks that didn't work out than the chances I didn't take at all.",
    author: 'Simone Biles',
    sport: 'Gymnastics',
  },
  {
    id: 'bolt-1',
    quote: 'I trained 4 years to run 9 seconds. People give up when they don\'t see results in 2 months.',
    author: 'Usain Bolt',
    sport: 'Track',
  },
  {
    id: 'ronaldo-1',
    quote: 'Your love makes me strong. Your hate makes me unstoppable.',
    author: 'Cristiano Ronaldo',
    sport: 'Soccer',
  },
  {
    id: 'messi-1',
    quote: 'You have to fight to reach your dream. You have to sacrifice and work hard for it.',
    author: 'Lionel Messi',
    sport: 'Soccer',
  },
  {
    id: 'shaq-1',
    quote: 'Excellence is not a singular act, but a habit. You are what you repeatedly do.',
    author: 'Shaquille O\'Neal',
    sport: 'Basketball',
  },
  {
    id: 'magic-1',
    quote: "Ask not what your teammates can do for you. Ask what you can do for your teammates.",
    author: 'Magic Johnson',
    sport: 'Basketball',
  },
  {
    id: 'goggins-1',
    quote: 'The only person you have to be better than is who you were yesterday.',
    author: 'David Goggins',
    sport: 'Endurance',
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

export const getDailyQuote = (): AthleteQuote => {
  const seed = hashString(todayKey());
  return ATHLETE_QUOTES[seed % ATHLETE_QUOTES.length];
};
