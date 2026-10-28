import { Fraction } from '../types';

export function addFractions(a: Fraction, b: Fraction): Fraction {
  if (a.denominator !== b.denominator) {
    // 4th grade strictly focuses on same denominators (동분모)
    const commonDenom = a.denominator * b.denominator;
    const numerator = a.numerator * b.denominator + b.numerator * a.denominator;
    return { numerator, denominator: commonDenom };
  }
  return {
    numerator: a.numerator + b.numerator,
    denominator: a.denominator,
  };
}

export function toMixedFraction(fraction: Fraction): { whole: number; remainder: number; denominator: number } {
  const whole = Math.floor(fraction.numerator / fraction.denominator);
  const remainder = fraction.numerator % fraction.denominator;
  return { whole, remainder, denominator: fraction.denominator };
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
}

export function generateRandomProblem(level: number): {
  fractionA: Fraction;
  fractionB: Fraction;
  pizzaType: 'pepperoni' | 'cheese' | 'veggie' | 'combination';
  title: string;
} {
  // Elementary grade 4 denominators typically used in Korean textbooks: 4, 5, 6, 8, 10
  const possibleDenoms = [4, 6, 8, 10];
  const denom = possibleDenoms[Math.floor(Math.random() * possibleDenoms.length)];

  const pizzaTypes: Array<'pepperoni' | 'cheese' | 'veggie' | 'combination'> = [
    'pepperoni',
    'cheese',
    'veggie',
    'combination',
  ];
  const pizzaType = pizzaTypes[Math.floor(Math.random() * pizzaTypes.length)];

  if (level <= 3) {
    // Sum is less than or equal to 1
    const totalNum = Math.floor(Math.random() * (denom - 1)) + 2; // e.g. 2 to denom
    const numA = Math.floor(Math.random() * (totalNum - 1)) + 1;
    const numB = totalNum - numA;
    return {
      fractionA: { numerator: numA, denominator: denom },
      fractionB: { numerator: numB, denominator: denom },
      pizzaType,
      title: `신선한 ${getPizzaName(pizzaType)} 주문`,
    };
  } else {
    // Sum can exceed 1 (resulting in mixed fraction / improper fraction)
    const numA = Math.floor(Math.random() * (denom - 1)) + 1;
    const numB = Math.floor(Math.random() * (denom - 1)) + 1;
    return {
      fractionA: { numerator: numA, denominator: denom },
      fractionB: { numerator: numB, denominator: denom },
      pizzaType,
      title: `대형 단체 ${getPizzaName(pizzaType)} 주문`,
    };
  }
}

export function getPizzaName(type: 'pepperoni' | 'cheese' | 'veggie' | 'combination'): string {
  switch (type) {
    case 'pepperoni':
      return '페퍼로니 피자';
    case 'cheese':
      return '고소한 콰트로 치즈 피자';
    case 'veggie':
      return '싱싱한 바질 베지 피자';
    case 'combination':
      return '스페셜 콤비네이션 피자';
  }
}
