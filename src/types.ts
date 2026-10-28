export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface Problem {
  id: string;
  level: number;
  title: string;
  description: string;
  fractionA: Fraction;
  fractionB: Fraction;
  pizzaType: 'pepperoni' | 'cheese' | 'veggie' | 'combination';
  allowImproper: boolean; // whether answer exceeds 1
  hint?: string;
}

export type GameMode = 'quest' | 'speed' | 'teacher_free';

export interface LevelProgress {
  level: number;
  stars: number; // 0 to 3
  completed: boolean;
}
