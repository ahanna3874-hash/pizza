import React from 'react';
import { Fraction } from '../types';

interface FractionDisplayProps {
  fraction: Fraction;
  whole?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlightNumerator?: boolean;
  colorTheme?: 'default' | 'amber' | 'emerald' | 'blue' | 'rose';
  showMixedIfImproper?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  fraction,
  whole,
  size = 'md',
  highlightNumerator = false,
  colorTheme = 'default',
  showMixedIfImproper = false,
}) => {
  const sizeClasses = {
    sm: { text: 'text-sm', bar: 'h-[1.5px] my-0.5', px: 'px-1' },
    md: { text: 'text-xl', bar: 'h-[2px] my-0.5', px: 'px-1.5' },
    lg: { text: 'text-3xl', bar: 'h-[2.5px] my-1', px: 'px-2' },
    xl: { text: 'text-4xl', bar: 'h-[3px] my-1', px: 'px-2.5' },
  }[size];

  const themeClasses = {
    default: { text: 'text-stone-800', bar: 'bg-stone-800', num: highlightNumerator ? 'text-amber-600 font-extrabold' : 'text-stone-800' },
    amber: { text: 'text-amber-900', bar: 'bg-amber-800', num: 'text-amber-700 font-extrabold' },
    emerald: { text: 'text-emerald-900', bar: 'bg-emerald-800', num: 'text-emerald-700 font-extrabold' },
    blue: { text: 'text-blue-900', bar: 'bg-blue-800', num: 'text-blue-700 font-extrabold' },
    rose: { text: 'text-rose-900', bar: 'bg-rose-800', num: 'text-rose-700 font-extrabold' },
  }[colorTheme];

  // If improper and requested mixed conversion
  if (showMixedIfImproper && fraction.numerator >= fraction.denominator && fraction.denominator > 0) {
    const calcWhole = Math.floor(fraction.numerator / fraction.denominator);
    const remNumerator = fraction.numerator % fraction.denominator;

    if (remNumerator === 0) {
      return (
        <span className={`inline-flex items-center font-bold font-mono ${sizeClasses.text} ${themeClasses.text}`}>
          {calcWhole}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 align-middle">
        <span className={`font-bold font-mono ${sizeClasses.text} ${themeClasses.text}`}>
          {calcWhole}
        </span>
        <span className={`inline-flex flex-col items-center justify-center font-bold font-mono leading-none ${sizeClasses.px}`}>
          <span className={`${sizeClasses.text} ${themeClasses.num}`}>
            {remNumerator}
          </span>
          <span className={`w-full ${sizeClasses.bar} ${themeClasses.bar}`} />
          <span className={`${sizeClasses.text} ${themeClasses.text}`}>
            {fraction.denominator}
          </span>
        </span>
      </span>
    );
  }

  // Provided explicit whole number
  if (whole !== undefined && whole > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 align-middle">
        <span className={`font-bold font-mono ${sizeClasses.text} ${themeClasses.text}`}>
          {whole}
        </span>
        <span className={`inline-flex flex-col items-center justify-center font-bold font-mono leading-none ${sizeClasses.px}`}>
          <span className={`${sizeClasses.text} ${themeClasses.num}`}>
            {fraction.numerator}
          </span>
          <span className={`w-full ${sizeClasses.bar} ${themeClasses.bar}`} />
          <span className={`${sizeClasses.text} ${themeClasses.text}`}>
            {fraction.denominator}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-center justify-center font-bold font-mono leading-none align-middle ${sizeClasses.px}`}>
      <span className={`${sizeClasses.text} ${themeClasses.num}`}>
        {fraction.numerator}
      </span>
      <span className={`w-full ${sizeClasses.bar} ${themeClasses.bar}`} />
      <span className={`${sizeClasses.text} ${themeClasses.text}`}>
        {fraction.denominator}
      </span>
    </span>
  );
};
