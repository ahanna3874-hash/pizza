/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameMode, Problem } from './types';
import { GameScreen } from './components/GameScreen';
import { TeacherCustomizer } from './components/TeacherCustomizer';
import { PromptViewerModal, GENERATED_PROMPT_TEXT } from './components/PromptViewerModal';
import { 
  Gamepad2, 
  Presentation, 
  FileCode2, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  BookOpen, 
  HeartHandshake
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'game' | 'teacher' | 'prompt'>('game');
  const [gameMode, setGameMode] = useState<GameMode>('quest');
  const [customProblem, setCustomProblem] = useState<Problem | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [copiedQuick, setCopiedQuick] = useState<boolean>(false);

  const handleStartCustomProblem = (prob: Problem) => {
    setCustomProblem(prob);
    setGameMode('teacher_free');
    setActiveTab('game');
  };

  const handleQuickCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(GENERATED_PROMPT_TEXT);
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    } catch {
      setCopiedQuick(true);
      setTimeout(() => setCopiedQuick(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-stone-900 flex flex-col font-sans">
      
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Curriculum Tag */}
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-label="pizza">🍕</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900">
                  피자 분수 셰프
                </span>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  4학년 1학기 수학
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                초등 분수 덧셈 시각화 웹앱 &amp; AI Studio Build 요청문
              </p>
            </div>
          </div>

          {/* Navigation Segments */}
          <nav className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'game'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
              <span>수업 게임</span>
            </button>
            <button
              onClick={() => setActiveTab('teacher')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'teacher'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-orange-600" />
              <span>교사용 전자칠판</span>
            </button>
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'prompt'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Build 요청문</span>
            </button>
          </nav>

          {/* Quick Copy Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickCopyPrompt}
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs ${
                copiedQuick
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
              title="AI Studio Build에 바로 붙여넣을 수 있는 완성형 요청문 복사"
            >
              {copiedQuick ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuick ? '복사됨!' : '프롬프트 원클릭 복사'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Classroom Teacher Notice Banner */}
      <div className="bg-amber-500/10 border-b border-amber-200/60 px-4 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between text-xs text-amber-900 gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              선생님, 요청하신 <strong>역할·목표·맥락·화면구성·기능목록·디자인·완료기준·개인정보보호</strong>가 포함된 AI Studio Build 요청문이 완성되어 있으며, 지금 바로 수업에 쓸 수 있는 시연 게임도 구현되었습니다!
            </span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-emerald-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              학생 개인정보 저장 0% (무로그인 안심)
            </span>
          </div>
        </div>
      </div>

      {/* Main Body Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'game' && (
          <GameScreen
            mode={gameMode}
            customProblem={customProblem}
            onOpenPromptModal={() => setIsPromptModalOpen(true)}
            onOpenTeacherMode={() => setActiveTab('teacher')}
          />
        )}

        {activeTab === 'teacher' && (
          <TeacherCustomizer onStartCustomProblem={handleStartCustomProblem} />
        )}

        {activeTab === 'prompt' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-amber-600" />
                  AI Studio Build에 그대로 붙여넣는 수업용 웹앱 요청문
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  아래 요청문 내용을 복사하여 AI Studio Build 프롬프트 창에 입력하시면 됩니다.
                </p>
              </div>
              <button
                onClick={handleQuickCopyPrompt}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  copiedQuick
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {copiedQuick ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedQuick ? '복사 완료!' : '전체 프롬프트 복사하기'}</span>
              </button>
            </div>

            <div className="bg-stone-900 text-stone-100 p-6 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap selection:bg-amber-500 selection:text-stone-900 shadow-inner overflow-x-auto">
              {GENERATED_PROMPT_TEXT}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-stone-200 bg-white text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🍕 피자 분수 셰프</span>
            <span>·</span>
            <span>초등학교 4학년 1학기 수학 교육과정 준수</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              개인정보 보호 준수
            </span>
          </div>
          <div>
            AI Studio Build 프롬프트 생성기 &amp; 에듀테크 시연 도구
          </div>
        </div>
      </footer>

      {/* Dedicated Prompt Modal */}
      <PromptViewerModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

    </div>
  );
}
