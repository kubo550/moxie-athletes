export enum QuoteType {
  athlete_confidence = 'athlete_confidence',
  game_day_focus = 'game_day_focus',
  pre_workout_motivation = 'pre_workout_motivation',
  mental_toughness = 'mental_toughness',
  bounce_back = 'bounce_back',
  pressure_performance = 'pressure_performance',
  focus = 'focus',
  build_confidence = 'build_confidence',
  discipline = 'discipline',
  mental_health = 'mental_health',
  anxiety_relief = 'anxiety_relief',
}

export enum Role {
  user = 'user',
  assistant = 'assistant',
}

export interface Message {
  id: number;
  content: string;
  role: Role;
}
