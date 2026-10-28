import React, { useState, useEffect } from 'react';
import { Problem, GameMode } from '../types';
import { CURRICULUM_LEVELS } from '../data/levels';
import { PizzaCanvas } from './PizzaCanvas';
import { FractionDisplay } from './FractionDisplay';
import { addFractions, generateRandomProblem, getPizzaName } from '../utils/fractions';
import { sound } from '../utils/sound';
import { 
  Trophy, 
  Flame, 
  HelpCircle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Star, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clock,
  ChefHat
} from 'lucide-react';

interface GameScreenProps {
  mode: GameMode;
  customProblem?: Problem | null;
  onOpenPromptModal: () => void;
  onOpenTeacherMode: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  mode,
  customProblem,
  onOpenPromptModal,
  onOpenTeacherMode,
}) => {
  // Current level index for quest mode
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(0);
  const [currentProblem, setCurrentProblem] = useState<Problem>(
    customProblem || CURRICULUM_LEVELS[0]
  );

  // Pizza Pan 1 & 2 state
  const [pan1Slices, setPan1Slices] = useState<number>(0);
  const [pan2Slices, setPan2Slices] = useState<number>(0);

  // Status & modal states
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showFailFeedback, setShowFailFeedback] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Speed Challenge State
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [speedScore, setSpeedScore] = useState<number>(0);
  const [speedActive, setSpeedActive] = useState<boolean>(false);

  // Privacy-friendly Chef Nickname
  const [chefNickname, setChefNickname] = useState<string>('피자 셰프 1호');
  const nicknames = ['치즈 마스터', '황금빛 셰프', '바삭한 크러스트', '토마토 장인', '도우 챔피언'];

  // Initialize problem when mode or level changes
  useEffect(() => {
    if (customProblem && mode === 'teacher_free') {
      setCurrentProblem(customProblem);
      resetPans();
    } else if (mode === 'quest') {
      setCurrentProblem(CURRICULUM_LEVELS[currentLevelIdx]);
      resetPans();
    } else if (mode === 'speed') {
      setSpeedScore(0);
      setTimeLeft(60);
      setSpeedActive(true);
      generateNewSpeedProblem();
    }
  }, [mode, currentLevelIdx, customProblem]);

  // Speed timer countdown
  useEffect(() => {
    let timer: any;
    if (mode === 'speed' && speedActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setSpeedActive(false);
            sound.playFanfare();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, speedActive, timeLeft]);

  const generateNewSpeedProblem = () => {
    const probData = generateRandomProblem(4);
    const prob: Problem = {
      id: `speed-${Date.now()}`,
      level: 1,
      title: probData.title,
      description: '손님이 기다리고 있어요! 분수를 빠르게 계산해 피자를 구워주세요.',
      fractionA: probData.fractionA,
      fractionB: probData.fractionB,
      pizzaType: probData.pizzaType,
      allowImproper: true,
    };
    setCurrentProblem(prob);
    resetPans();
  };

  const resetPans = () => {
    setPan1Slices(0);
    setPan2Slices(0);
    setShowSuccessModal(false);
    setShowFailFeedback(false);
    setShowHint(false);
  };

  const totalTargetNumerator = currentProblem.fractionA.numerator + currentProblem.fractionB.numerator;
  const currentTotalSlices = pan1Slices + pan2Slices;
  const denominator = currentProblem.fractionA.denominator;
  const targetSum = addFractions(currentProblem.fractionA, currentProblem.fractionB);
  const exceedsOne = targetSum.numerator > denominator;

  // Toggle sound
  const handleToggleSound = () => {
    sound.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Submit Answer
  const handleBakePizza = () => {
    if (currentTotalSlices === totalTargetNumerator) {
      // Correct!
      sound.playCorrectOvenBell();
      if (mode === 'speed') {
        setSpeedScore((prev) => prev + 1);
        generateNewSpeedProblem();
      } else {
        sound.playFanfare();
        setShowSuccessModal(true);
      }
    } else {
      // Incorrect feedback
      sound.playWrong();
      setShowFailFeedback(true);
      if (currentTotalSlices < totalTargetNumerator) {
        const diff = totalTargetNumerator - currentTotalSlices;
        setFeedbackMsg(`조각이 ${diff}개 더 필요해요! 오븐에 넣기 전에 더 얹어볼까요?`);
      } else {
        const diff = currentTotalSlices - totalTargetNumerator;
        setFeedbackMsg(`조각이 ${diff}개 너무 많아요! 팬에서 몇 조각을 빼주세요.`);
      }
      setTimeout(() => setShowFailFeedback(false), 3500);
    }
  };

  const handleNextLevel = () => {
    setShowSuccessModal(false);
    if (currentLevelIdx < CURRICULUM_LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      // Completed all
      setCurrentLevelIdx(0);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Bar with Mode, Level, and Classroom Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Chef Badge & Nickname */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                초등 4학년 분수 키친
              </span>
              <select
                value={chefNickname}
                onChange={(e) => setChefNickname(e.target.value)}
                className="text-xs font-medium text-stone-600 bg-transparent hover:bg-stone-100 rounded px-1.5 py-0.5 border-b border-dashed border-stone-300 focus:outline-none"
                title="학생 닉네임 (개인정보 무저장)"
              >
                {nicknames.map((n) => (
                  <option key={n} value={n}>
                    셰프: {n}
                  </option>
                ))}
              </select>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-stone-900 mt-0.5">
              {currentProblem.title}
            </h1>
          </div>
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2.5 ml-auto">
          {mode === 'speed' && (
            <div className="flex items-center gap-3 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-800">
                <Clock className="w-4 h-4 text-amber-600" />
                {timeLeft}초
              </span>
              <span className="text-xs font-bold text-amber-900">
                ⭐ {speedScore}판 완성
              </span>
            </div>
          )}

          {mode === 'quest' && (
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl text-xs font-bold text-stone-700">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>
                {currentLevelIdx + 1} / {CURRICULUM_LEVELS.length} 단계
              </span>
            </div>
          )}

          <button
            onClick={handleToggleSound}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          <button
            onClick={resetPans}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors border border-stone-200"
            title="피자 다시 담기"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Kitchen Table Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Order Ticket & Fraction Formula */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Order Ticket Card */}
          <div className="bg-[#fffdfa] border-2 border-stone-200 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
            
            <div className="flex items-center justify-between mb-3 pt-1">
              <span className="text-[11px] font-bold tracking-wider text-stone-500 uppercase">
                📋 오늘의 피자 주문서
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {getPizzaName(currentProblem.pizzaType)}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-4">
              {currentProblem.description}
            </p>

            {/* Authentic Textbook Equation */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col items-center justify-center">
              <div className="text-[11px] font-bold text-amber-800 mb-2">
                계산할 분수 덧셈식:
              </div>
              <div className="flex items-center gap-3 text-2xl font-bold">
                <span className="bg-white px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 shadow-2xs">
                  <FractionDisplay fraction={currentProblem.fractionA} size="lg" colorTheme="amber" />
                </span>
                <span className="text-amber-800 text-2xl font-black">+</span>
                <span className="bg-white px-3 py-1.5 rounded-lg border border-red-300 text-red-900 shadow-2xs">
                  <FractionDisplay fraction={currentProblem.fractionB} size="lg" colorTheme="rose" />
                </span>
                <span className="text-amber-800 text-2xl font-black">=</span>
                <span className="bg-stone-800 text-white px-4 py-2 rounded-lg font-mono text-xl shadow-xs">
                  ?
                </span>
              </div>
            </div>

            {/* Quick Math Guide for 4th Graders */}
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  피자 1판은 <strong>{denominator}조각</strong>으로 똑같이 나누어져 있어요 (분모 = {denominator}).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  {currentProblem.fractionA.numerator}조각과 {currentProblem.fractionB.numerator}조각을 모아 총 몇 조각인지 팬에 올려보세요!
                </span>
              </div>
            </div>

            {/* Hint Toggle */}
            {currentProblem.hint && (
              <div className="mt-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-amber-800 hover:bg-amber-100/60 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    선생님의 친절한 힌트 보기
                  </span>
                  <span>{showHint ? '▲ 닫기' : '▼ 열기'}</span>
                </button>
                {showHint && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-amber-200 text-xs text-amber-900 animate-fade-in shadow-2xs">
                    💡 {currentProblem.hint}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Quick Buttons for Teacher */}
          <div className="flex gap-2">
            <button
              onClick={onOpenTeacherMode}
              className="flex-1 py-2.5 px-3 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              👩‍🏫 교사 전자칠판 모드
            </button>
            <button
              onClick={onOpenPromptModal}
              className="flex-1 py-2.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 shadow-2xs transition-colors flex items-center justify-center gap-1.5"
            >
              📋 AI 프롬프트 보기
            </button>
          </div>

        </div>

        {/* Center / Right Column: Interactive Pizza Pans & Oven Controls */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Pizza Work Area */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wide">
                  피자 베이킹 팬 (직접 조각을 터치하여 올리세요)
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  조각을 누르면 피자가 채워지고, 다시 누르면 빠집니다.
                </p>
              </div>

              {/* Placed Slice Counter */}
              <div className="flex items-center gap-2 bg-stone-100 px-3.5 py-1.5 rounded-xl border border-stone-200">
                <span className="text-xs text-stone-600">내가 올린 피자:</span>
                <span className="font-extrabold text-sm text-amber-800">
                  {currentTotalSlices}/{denominator}판
                </span>
                {currentTotalSlices >= denominator && (
                  <span className="text-xs font-bold text-emerald-700">
                    ({Math.floor(currentTotalSlices / denominator)}판 {currentTotalSlices % denominator > 0 ? `과 ${currentTotalSlices % denominator}/${denominator}조각` : ''})
                  </span>
                )}
              </div>
            </div>

            {/* Interactive Pizza Plates Area */}
            <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-10 py-4 min-h-[300px]">
              
              {/* Pan 1 */}
              <div className="flex flex-col items-center">
                <PizzaCanvas
                  denominator={denominator}
                  activeCount={pan1Slices}
                  panNumber={1}
                  pizzaType={currentProblem.pizzaType}
                  countA={Math.min(pan1Slices, currentProblem.fractionA.numerator)}
                  onToggleSlice={(idx) => {
                    if (idx < pan1Slices) {
                      setPan1Slices(idx);
                    } else {
                      setPan1Slices(idx + 1);
                    }
                  }}
                  label="피자 팬 1"
                />
              </div>

              {/* Pan 2: Appears when target exceeds 1 or when Pan 1 is full */}
              {(exceedsOne || pan1Slices >= denominator) && (
                <div className="flex flex-col items-center animate-fade-in">
                  <PizzaCanvas
                    denominator={denominator}
                    activeCount={pan2Slices}
                    panNumber={2}
                    pizzaType={currentProblem.pizzaType}
                    onToggleSlice={(idx) => {
                      if (pan1Slices < denominator) {
                        // Encourage filling Pan 1 first
                        setPan1Slices(denominator);
                      }
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

            {/* Real-time Visualized Sum Feedback Box */}
            <div className="w-full mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-600">
                  현재 조각 합산:
                </span>
                <span className="text-base font-bold text-stone-900 bg-white px-3 py-1 rounded-lg border border-stone-200">
                  <FractionDisplay
                    fraction={{ numerator: currentTotalSlices, denominator }}
                    size="md"
                    colorTheme="amber"
                  />
                </span>
                {currentTotalSlices >= denominator && (
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    대분수: {Math.floor(currentTotalSlices / denominator)}과 {currentTotalSlices % denominator}/{denominator}
                  </span>
                )}
              </div>

              {/* Bake Button */}
              <button
                onClick={handleBakePizza}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-200" />
                피자 굽기 (정답 확인)
              </button>
            </div>

            {/* Error / Too Many / Too Few Feedback Alert */}
            {showFailFeedback && (
              <div className="w-full mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold text-center animate-bounce">
                ⚠️ {feedbackMsg}
              </div>
            )}

          </div>

          {/* Privacy Guarantee Note */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-800">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>100% 무로그인 안전 교실:</strong> 학생 개인정보 수집 및 서버 저장을 전혀 하지 않으며, 누구나 브라우저에서 바로 사용할 수 있습니다.
              </span>
            </span>
          </div>

        </div>

      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-200 text-center space-y-5 animate-scale-up">
            
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🍕
            </div>

            <div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-amber-400 text-amber-400 animate-pulse" />
                ))}
              </div>
              <h3 className="text-xl font-extrabold text-stone-900">
                피자 완성! 대성공!
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                맛있는 피자가 완벽하게 구워졌습니다. 손님이 매우 만족해하셨어요!
              </p>
            </div>

            {/* Math Review Box */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-stone-800 space-y-2">
              <span className="text-xs font-bold text-amber-900 block">
                오늘의 분수 공식 복습
              </span>
              <div className="flex items-center justify-center gap-2 text-xl font-bold">
                <FractionDisplay fraction={currentProblem.fractionA} size="md" colorTheme="amber" />
                <span>+</span>
                <FractionDisplay fraction={currentProblem.fractionB} size="md" colorTheme="rose" />
                <span>=</span>
                <FractionDisplay fraction={targetSum} size="md" colorTheme="emerald" />
              </div>
              {exceedsOne && (
                <div className="text-xs text-stone-600 font-medium">
                  = <strong className="text-amber-800">{Math.floor(targetSum.numerator / denominator)}판</strong>과{' '}
                  <strong className="text-amber-800">{targetSum.numerator % denominator}/{denominator}조각</strong> (대분수: {Math.floor(targetSum.numerator / denominator)}과 {targetSum.numerator % denominator}/{denominator})
                </div>
              )}
            </div>

            <button
              onClick={handleNextLevel}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>다음 단계 도전하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
