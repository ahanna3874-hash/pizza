import React from 'react';
import { sound } from '../utils/sound';

interface PizzaCanvasProps {
  denominator: number;
  activeCount: number; // current slices placed in this pan (0 to denominator)
  maxCapacity?: number; // usually denominator
  panNumber?: number; // 1 or 2
  pizzaType: 'pepperoni' | 'cheese' | 'veggie' | 'combination';
  colorA?: string;
  countA?: number; // slices belonging to first fraction
  onToggleSlice?: (index: number) => void;
  interactive?: boolean;
  label?: string;
}

export const PizzaCanvas: React.FC<PizzaCanvasProps> = ({
  denominator,
  activeCount,
  maxCapacity = denominator,
  panNumber = 1,
  pizzaType,
  countA = 0,
  onToggleSlice,
  interactive = true,
  label,
}) => {
  const size = 260;
  const center = size / 2;
  const radius = 108;
  const crustRadius = 120;

  // Generate slice path for slice index `i` out of `denominator`
  const getSlicePath = (index: number) => {
    const anglePerSlice = (2 * Math.PI) / denominator;
    const startAngle = index * anglePerSlice - Math.PI / 2;
    const endAngle = (index + 1) * anglePerSlice - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    // Large arc flag is 0 because anglePerSlice <= PI (since denominator >= 3)
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
  };

  // Middle angle for placing toppings/text
  const getMidAngle = (index: number) => {
    const anglePerSlice = (2 * Math.PI) / denominator;
    return (index + 0.5) * anglePerSlice - Math.PI / 2;
  };

  const handleSliceClick = (index: number) => {
    if (!interactive || !onToggleSlice) return;
    if (index < activeCount) {
      sound.playSliceRemove();
    } else {
      sound.playSliceClick();
    }
    onToggleSlice(index);
  };

  const isFull = activeCount === denominator;

  return (
    <div className="flex flex-col items-center">
      {label && (
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            {label} {isFull && '✨ (1판 완성!)'}
          </span>
          <span className="text-xs font-semibold text-amber-700">
            {activeCount}/{denominator} 조각
          </span>
        </div>
      )}

      <div className="relative group">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="select-none filter drop-shadow-md transition-transform duration-200 hover:scale-[1.02]"
        >
          <defs>
            {/* Pizza pan texture */}
            <radialGradient id={`pan-grad-${panNumber}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d6d3d1" />
              <stop offset="85%" stopColor="#a8a29e" />
              <stop offset="100%" stopColor="#78716c" />
            </radialGradient>

            {/* Crust gradient */}
            <radialGradient id="crust-grad" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="90%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>

            {/* Cheese gradient */}
            <radialGradient id="cheese-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="80%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </radialGradient>

            {/* Pepperoni fill */}
            <radialGradient id="pepperoni-grad" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="70%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
          </defs>

          {/* Pizza Pan Rim (우드/메탈 베이킹 팬) */}
          <circle
            cx={center}
            cy={center}
            r={crustRadius + 8}
            fill={`url(#pan-grad-${panNumber})`}
            stroke="#57534e"
            strokeWidth="3"
          />

          {/* Empty Plate Bed with Division Guidelines (초등학생을 위한 분수 등분선) */}
          <circle cx={center} cy={center} r={radius} fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.5" />

          {/* Empty guideline sectors with 1/N hint */}
          {Array.from({ length: denominator }).map((_, i) => {
            const midAngle = getMidAngle(i);
            const textRadius = radius * 0.65;
            const tx = center + textRadius * Math.cos(midAngle);
            const ty = center + textRadius * Math.sin(midAngle);

            return (
              <g key={`guide-${i}`}>
                <path
                  d={getSlicePath(i)}
                  fill="transparent"
                  stroke="#e7e5e4"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-mono font-medium fill-stone-400 select-none pointer-events-none"
                >
                  1/{denominator}
                </text>
              </g>
            );
          })}

          {/* Active Slices */}
          {Array.from({ length: maxCapacity }).map((_, i) => {
            const isActive = i < activeCount;
            if (!isActive) return null;

            // Differentiate between Fraction A slices and Fraction B slices
            const isSliceA = i < countA;
            const slicePath = getSlicePath(i);
            const midAngle = getMidAngle(i);

            // Topping positioning
            const rPepperoni = radius * 0.58;
            const px = center + rPepperoni * Math.cos(midAngle);
            const py = center + rPepperoni * Math.sin(midAngle);

            // Additional toppings
            const rBasil = radius * 0.35;
            const bx = center + rBasil * Math.cos(midAngle + 0.1);
            const by = center + rBasil * Math.sin(midAngle + 0.1);

            const rOlive = radius * 0.78;
            const ox = center + rOlive * Math.cos(midAngle - 0.1);
            const oy = center + rOlive * Math.sin(midAngle - 0.1);

            return (
              <g
                key={`slice-${i}`}
                className="transition-all duration-150 cursor-pointer"
                onClick={() => handleSliceClick(i)}
              >
                {/* Crust edge */}
                <path
                  d={slicePath}
                  fill="url(#crust-grad)"
                  stroke="#9a3412"
                  strokeWidth="1"
                />

                {/* Cheese base (slightly inset) */}
                <path
                  d={slicePath}
                  fill="url(#cheese-grad)"
                  transform={`scale(0.94) translate(${center * 0.06}, ${center * 0.06})`}
                  transform-origin={`${center} ${center}`}
                  opacity="0.95"
                />

                {/* Sauce & Cheese marbling */}
                <circle
                  cx={center + radius * 0.45 * Math.cos(midAngle)}
                  cy={center + radius * 0.45 * Math.sin(midAngle)}
                  r={8}
                  fill="#f97316"
                  opacity="0.25"
                />

                {/* Slice color distinction ring or tint */}
                <path
                  d={slicePath}
                  fill={isSliceA ? '#fb923c' : '#f87171'}
                  opacity="0.18"
                />

                {/* Toppings based on pizzaType */}
                {(pizzaType === 'pepperoni' || pizzaType === 'combination') && (
                  <circle
                    cx={px}
                    cy={py}
                    r={radius * 0.13}
                    fill="url(#pepperoni-grad)"
                    stroke="#7f1d1d"
                    strokeWidth="1"
                  />
                )}

                {(pizzaType === 'veggie' || pizzaType === 'combination') && (
                  <g transform={`translate(${bx}, ${by}) rotate(${(midAngle * 180) / Math.PI})`}>
                    <path
                      d="M -5 -2 Q 0 -6 5 -2 Q 6 3 0 5 Q -6 3 -5 -2 Z"
                      fill="#22c55e"
                      stroke="#15803d"
                      strokeWidth="0.8"
                    />
                  </g>
                )}

                {/* Black Olive Slice */}
                {(pizzaType === 'cheese' || pizzaType === 'combination') && (
                  <g>
                    <circle cx={ox} cy={oy} r={radius * 0.07} fill="#1c1917" />
                    <circle cx={ox} cy={oy} r={radius * 0.03} fill="#fef08a" />
                  </g>
                )}

                {/* Slice Border dividing line */}
                <path
                  d={slicePath}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />

                {/* Fractional index tooltip on hover */}
                <circle
                  cx={center + radius * 0.5 * Math.cos(midAngle)}
                  cy={center + radius * 0.5 * Math.sin(midAngle)}
                  r="10"
                  fill="white"
                  stroke={isSliceA ? '#ea580c' : '#dc2626'}
                  strokeWidth="1.5"
                  className="opacity-0 group-hover:opacity-90 transition-opacity"
                />
                <text
                  x={center + radius * 0.5 * Math.cos(midAngle)}
                  y={center + radius * 0.5 * Math.sin(midAngle)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-[10px] font-bold fill-stone-800 opacity-0 group-hover:opacity-90 select-none pointer-events-none"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}

          {/* Interactive Clickable Hotspots for all slices */}
          {Array.from({ length: denominator }).map((_, i) => (
            <path
              key={`hotspot-${i}`}
              d={getSlicePath(i)}
              fill="transparent"
              className="cursor-pointer hover:fill-amber-400 hover:fill-opacity-15 active:fill-amber-500 active:fill-opacity-25"
              onClick={() => handleSliceClick(i)}
            />
          ))}

          {/* Center decorative hub / pizza center dot */}
          <circle cx={center} cy={center} r="6" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
        </svg>

        {/* Slice Quick Action Bar directly under pizza */}
        {interactive && onToggleSlice && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <button
              onClick={() => {
                if (activeCount > 0) {
                  sound.playSliceRemove();
                  onToggleSlice(activeCount - 1);
                }
              }}
              disabled={activeCount === 0}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              - 1조각
            </button>
            <button
              onClick={() => {
                if (activeCount < denominator) {
                  sound.playSliceClick();
                  onToggleSlice(activeCount);
                }
              }}
              disabled={activeCount >= denominator}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              + 1조각 올리기
            </button>
            <button
              onClick={() => {
                if (activeCount < denominator) {
                  sound.playSliceClick();
                  for (let i = activeCount; i < denominator; i++) {
                    onToggleSlice(i);
                  }
                }
              }}
              disabled={activeCount >= denominator}
              className="px-2 py-1 text-xs font-medium rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40"
            >
              전체 채우기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
