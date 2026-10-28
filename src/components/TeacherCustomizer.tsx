import React, { useState } from 'react';
import { Problem, Fraction } from '../types';
import { FractionDisplay } from './FractionDisplay';
import { PizzaCanvas } from './PizzaCanvas';
import { Sparkles, RefreshCw, Eye, EyeOff, Presentation } from 'lucide-react';
import { addFractions } from '../utils/fractions';

interface TeacherCustomizerProps {
  onStartCustomProblem: (problem: Problem) => void;
}

export const TeacherCustomizer: React.FC<TeacherCustomizerProps> = ({ onStartCustomProblem }) => {
  const [denominator, setDenominator] = useState<number>(6);
  const [numA, setNumA] = useState<number>(2);
  const [numB, setNumB] = useState<number>(3);
  const [pizzaType, setPizzaType] = useState<'pepperoni' | 'cheese' | 'veggie' | 'combination'>('pepperoni');
  const [showAnswerPreview, setShowAnswerPreview] = useState<boolean>(true);

  // Slices placed on whiteboard preview
  const [pan1Slices, setPan1Slices] = useState<number>(0);
  const [pan2Slices, setPan2Slices] = useState<number>(0);

  const fracA: Fraction = { numerator: numA, denominator };
  const fracB: Fraction = { numerator: numB, denominator };
  const totalSum = addFractions(fracA, fracB);
  const exceedsOne = totalSum.numerator > denominator;

  const totalPlaced = pan1Slices + pan2Slices;

  const handleApplyToGame = () => {
    const customProb: Problem = {
      id: `teacher-${Date.now()}`,
      level: 99,
      title: `선생님의 맞춤 주문: ${numA}/${denominator} + ${numB}/${denominator}`,
      description: `선생님이 출제하신 분수 덧셈 문제입니다. 피자 팬에 알맞게 조각을 올려보세요!`,
      fractionA: fracA,
      fractionB: fracB,
      pizzaType,
      allowImproper: exceedsOne,
      hint: `분모 ${denominator}는 피자 1판의 총 조각 수예요. 분자 ${numA}와 ${numB}를 더하면 총 ${totalSum.numerator}조각입니다.`,
    };
    onStartCustomProblem(customProb);
  };

  const handleRandomize = () => {
    const denoms = [4, 6, 8, 10];
    const newDenom = denoms[Math.floor(Math.random() * denoms.length)];
    const newA = Math.floor(Math.random() * (newDenom - 1)) + 1;
    const newB = Math.floor(Math.random() * (newDenom - 1)) + 1;
    setDenominator(newDenom);
    setNumA(newA);
    setNumB(newB);
    setPan1Slices(0);
    setPan2Slices(0);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              교사용 전자칠판 &amp; 자유 출제 모드
            </h2>
            <p className="text-xs text-stone-600">
              분모와 분자를 선생님이 직접 지정하여 수업 시간에 학생들과 실시간으로 피자 조각을 움직이며 시연할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRandomize}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            랜덤 문제 생성
          </button>
          <button
            onClick={handleApplyToGame}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            이 문제로 게임 시작
          </button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        
        {/* Step 1: Denominator Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
            1. 피자 등분 수 (분모 선택)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[4, 6, 8, 10].map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDenominator(d);
                  if (numA >= d) setNumA(d - 1);
                  if (numB >= d) setNumB(d - 1);
                  setPan1Slices(0);
                  setPan2Slices(0);
                }}
                className={`py-2 text-sm font-bold rounded-lg border transition-all ${
                  denominator === d
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-105'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {d}등분
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-500">
            * 4학년 1학기 표준: 4, 6, 8, 10등분이 교과서 주요 예시입니다.
          </p>
        </div>

        {/* Step 2: Numerators Sliders */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
            2. 첫 번째 &amp; 두 번째 조각 수
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
                첫 번째 분수 (A):
              </span>
              <span className="font-bold text-orange-600">{numA}/{denominator}</span>
            </div>
            <input
              type="range"
              min="1"
              max={denominator}
              value={numA}
              onChange={(e) => setNumA(Number(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-stone-700">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                두 번째 분수 (B):
              </span>
              <span className="font-bold text-red-600">{numB}/{denominator}</span>
            </div>
            <input
              type="range"
              min="1"
              max={denominator}
              value={numB}
              onChange={(e) => setNumB(Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Step 3: Pizza Type & Answer Toggle */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wide block">
            3. 피자 토핑 및 보기 설정
          </label>

          <select
            value={pizzaType}
            onChange={(e) => setPizzaType(e.target.value as any)}
            className="w-full py-2 px-3 text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="pepperoni">🍕 페퍼로니 피자</option>
            <option value="cheese">🧀 콰트로 치즈 피자</option>
            <option value="veggie">🌿 싱싱 바질 피자</option>
            <option value="combination">🍖 스페셜 콤비네이션</option>
          </select>

          <button
            onClick={() => setShowAnswerPreview(!showAnswerPreview)}
            className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-medium text-stone-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            {showAnswerPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showAnswerPreview ? '수학 정답 가리기' : '수학 정답 미리보기'}
          </button>
        </div>

      </div>

      {/* Live Equation Banner */}
      <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-stone-400 text-xs font-mono">교과서 수식:</span>
          <div className="flex items-center gap-3 text-2xl font-bold">
            <span className="bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-500/40 text-orange-300">
              <FractionDisplay fraction={fracA} size="lg" colorTheme="amber" />
            </span>
            <span className="text-stone-400">+</span>
            <span className="bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300">
              <FractionDisplay fraction={fracB} size="lg" colorTheme="rose" />
            </span>
            <span className="text-stone-400">=</span>
            
            {showAnswerPreview ? (
              <div className="flex items-center gap-3">
                <span className="bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-300">
                  <FractionDisplay fraction={totalSum} size="lg" colorTheme="emerald" />
                </span>
                {exceedsOne && (
                  <>
                    <span className="text-stone-400 text-lg">또는</span>
                    <span className="bg-emerald-600/30 px-3 py-1.5 rounded-lg border border-emerald-400 text-emerald-200">
                      <FractionDisplay fraction={totalSum} size="lg" colorTheme="emerald" showMixedIfImproper={true} />
                    </span>
                  </>
                )}
              </div>
            ) : (
              <span className="px-4 py-2 bg-stone-800 rounded-lg text-stone-500 border border-dashed border-stone-700">
                ? (학생 발표용)
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-stone-300 bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700">
          💡 <span className="font-semibold text-amber-400">지도 포인트:</span> 분모인 {denominator}는 피자 1판 전체를 나눈 조각 수이므로 바뀌지 않고, 분자인 {numA}와 {numB}만 더해집니다!
        </div>
      </div>

      {/* Interactive Electronic Board Pizza Demonstration Area */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4">
          <div className="text-xs font-bold text-stone-700">
            📍 전자칠판 터치 조작 시연대 (조각을 클릭/터치하여 채워보세요)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600">
              현재 올린 조각: <strong className="text-amber-800">{totalPlaced}</strong> / 목표: <strong>{totalSum.numerator}</strong>조각
            </span>
            <button
              onClick={() => {
                setPan1Slices(0);
                setPan2Slices(0);
              }}
              className="text-xs text-stone-500 hover:text-stone-800 underline ml-2"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 py-2">
          {/* Pan 1 */}
          <div className="flex flex-col items-center">
            <PizzaCanvas
              denominator={denominator}
              activeCount={pan1Slices}
              panNumber={1}
              pizzaType={pizzaType}
              countA={Math.min(pan1Slices, numA)}
              onToggleSlice={(idx) => {
                if (idx < pan1Slices) {
                  setPan1Slices(idx);
                } else {
                  setPan1Slices(idx + 1);
                }
              }}
              label="피자 팬 1 (첫 번째 판)"
            />
          </div>

          {/* Pan 2 (If exceeds 1 or if Pan 1 is full) */}
          {(exceedsOne || pan1Slices >= denominator) && (
            <div className="flex flex-col items-center animate-fade-in">
              <PizzaCanvas
                denominator={denominator}
                activeCount={pan2Slices}
                panNumber={2}
                pizzaType={pizzaType}
                onToggleSlice={(idx) => {
                  if (idx < pan2Slices) {
                    setPan2Slices(idx);
                  } else {
                    setPan2Slices(idx + 1);
                  }
                }}
                label="피자 팬 2 (새 피자 판)"
              />
            </div>
          )}
        </div>

        {/* Real-time Math Feedback */}
        <div className="mt-4 p-3 bg-white border border-stone-200 rounded-xl flex items-center gap-3 text-xs text-stone-700 shadow-2xs">
          <span>학생들이 올린 총 분수:</span>
          <span className="font-bold text-amber-700 text-sm">
            {totalPlaced}/{denominator}판
          </span>
          {totalPlaced >= denominator && (
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              = {Math.floor(totalPlaced / denominator)}판 {totalPlaced % denominator > 0 ? `과 ${totalPlaced % denominator}/${denominator}조각` : '완성!'}
            </span>
          )}
          {totalPlaced === totalSum.numerator && (
            <span className="text-emerald-600 font-bold ml-auto flex items-center gap-1">
              🎉 목표 수량과 정확히 일치합니다!
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
