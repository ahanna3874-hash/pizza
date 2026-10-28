import React, { useState } from 'react';
import { Copy, Check, FileDown, Sparkles, BookOpen, ShieldCheck, Layers, Layout, SlidersHorizontal } from 'lucide-react';

interface PromptViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GENERATED_PROMPT_TEXT = `당신은 초등 수학 교육 전문 에듀테크 소프트웨어 엔지니어입니다.
대한민국 2022 개정 교육과정 4학년 1학기 수학 4단원 '분수의 덧셈과 뺄셈' 단원에서 다루는 [분모가 같은 분수의 덧셈]을 학생들이 피자 조각을 직접 만지고 조작하며 직관적으로 이해할 수 있는 인터랙티브 웹 학습 게임을 제작해 주세요.

---

### 1. 역할 (Role)
- 초등학교 교실(Chromebook, 태블릿, 전자칠판) 환경을 깊이 이해하는 초등 수학교육 공학자 및 프론트엔드 엔지니어.

### 2. 목표 (Goal)
- 구체적 조작기(Concrete Operational Stage)에 있는 4학년 학생들이 분수의 덧셈 원리("분모는 전체 등분 수이므로 변하지 않고, 분자끼리만 더한다")를 피자 조각 조작을 통해 시각적·공간적으로 자연스럽게 터득하도록 돕는다.
- 합이 1보다 큰 경우(가분수), 새로운 피자 판으로 조각이 넘쳐 자연스럽게 대분수(예: 1과 1/6) 개념으로 연결되도록 시각화한다.

### 3. 맥락 및 학생 개인정보 보호 (Context & Privacy)
- [학교 교육과정 연계]: 초등학교 4학년 1학기 4단원 '분수의 덧셈과 뺄셈' (동분모 진분수의 덧셈, 결과가 진분수 또는 대분수).
- [교실 디바이스 호환]: 태블릿(아이패드, 갤럭시탭), 크롬북(Chromebook), 교실 전자칠판(Interactive Whiteboard) 모두에서 원활하게 마우스 클릭 및 손가락 터치 조작 지원.
- [★ 100% 학생 개인정보 보호 (Strict Zero-Data Privacy)]:
  - 학생 회원가입, 로그인, 이름, 학번, 이메일, 위치 등 일체의 개인정보를 수집하거나 서버로 전송하지 마세요.
  - 학생 식별이 필요한 경우 '용감한 피자 셰프', '치즈 마스터' 같은 재미있는 임의의 캐릭터 닉네임만 선택하게 하세요.
  - 별도의 백엔드 데이터베이스 없이 100% 브라우저 클라이언트 사이드에서만 안전하게 동작해야 합니다. (원할 경우 로컬 세션 동안만 진행 상태 유지)

### 4. 화면 구성 (Screen Layout)
- **상단 내비게이션 바**:
  - 게임 타이틀: "🍕 피자 분수 셰프 - 4학년 분수 덧셈 교실"
  - 모드 선택: [단계별 퀘스트 모드] / [스피드 주문 챌린지] / [교사용 전자칠판 자유 모드]
  - 효과음 ON/OFF 토글 버튼 및 리셋 버튼
  - "개인정보 안심 (무로그인)" 뱃지
- **중앙 게임 작업대 (키친 테이블)**:
  - [좌측 - 주문서 / 수식 영역]: 
    - 교과서 정통 분수 표기법(가로선 분수)으로 식 제시: 예) 3/8 + 4/8 = ?
    - 오늘 만들어야 할 피자 종류 안내 (페퍼로니, 콰트로 치즈, 싱싱 바질 등)
  - [중앙 - 피자 베이킹 팬 (인터랙티브 SVG)]:
    - 원형 피자 판: 분모(4, 6, 8, 10등분)에 맞게 정밀 분할선 표시 (각 칸에 1/n 단위분수 가이드)
    - 클릭/터치할 때마다 노릇노릇한 치즈와 토핑 조각이 채워지거나 제거됨
    - 첫 번째 분수의 조각과 두 번째 분수의 조각 색상을 은은하게 구분하여 합성 과정 시각화
    - 합이 1판을 넘길 때 자동으로 [2번째 피자 판]이 옆에 등장하여 "1판 + 남은 조각" 대분수 형성 과정 직관화
  - [우측 - 셰프 피드백 & 오븐 굽기(제출) 영역]:
    - 현재 내가 팬에 올린 조각 수 실시간 수식 표기
    - "피자 굽기 (정답 확인)" 큰 버튼
    - 힌트 보기 토글 버튼 (교과서 개념 친절한 설명)
- **결과 모달 (성공/도전)**:
  - 정답 시: 오븐 땡 소리, 별점 획득, 치즈가 늘어나는 축하 애니메이션
  - 오답 시: 부족하거나 넘치는 조각 수를 부드럽게 짚어주는 비판 없는 친절 피드백

### 5. 기능 목록 (Feature List)
1. **정밀 동분모 분수 덧셈 시각화**:
   - 4, 6, 8, 10등분 원형 피자 인터랙티브 SVG 조각 조작
   - 분수 덧셈 시 분모는 고정되고 분자만 더해지는 원리를 조각 개수로 직관적 확인
2. **가분수와 대분수 자연스러운 변환 (1판 초과 시)**:
   - 예: 5/6 + 4/6 = 9/6 = 1과 3/6판
   - 1판(6/6)이 꽉 차면 자동으로 "1판 완성!" 시각 효과 후 두 번째 판에 3조각 배치
3. **3가지 교실 맞춤 플레이 모드**:
   - **모드 A. 단계별 퀘스트 (1~8단계)**: 난이도 점진적 상승 (진분수 합 < 1 -> 딱 1판 완성 -> 1판 초과 대분수)
   - **모드 B. 60초 스피드 주문**: 손님들이 주문하는 분수를 빠르게 해결하는 집중 훈련 모드
   - **모드 C. 교사용 전자칠판 & 맞춤 문제 모드**: 교사가 분모와 분자를 마음대로 슬라이더로 조절하여 반 전체와 시연
4. **자체 Web Audio API 음향 효과**:
   - 외부 오디오 파일 다운로드 없이 브라우저 자체 오실레이터로 제작하여 학교 방화벽 차단 방지
   - 조각 놓을 때 찰칵음, 피자 완성 오븐 벨소리, 축하 팡파레
5. **교과서 맞춤 수식 렌더러**:
   - 대분수(자연수 + 진분수) 및 가분수를 초등학교 교과서 형태와 100% 동일하게 렌더링

### 6. 디자인 가이드 (UI/UX)
- 따뜻하고 먹음직스러운 이탈리안 피자리아 키친 테마:
  - 기본 배경: 따뜻한 우드 테이블 톤 (#fafaf9 / #f5f5f4)
  - 악센트 색상: 오븐 크러스트 골드 (#f59e0b), 토마토 레드 (#ef4444), 모차렐라 치즈 (#fde047), 바질 그린 (#22c55e)
- 버튼 및 터치 타깃: 최소 48px 이상 크기로 초등학생 터치 조작 시 오클릭 방지
- 가독성 높은 둥근 폰트 스타일과 고대비 텍스트 (명도 대비 WCAG AA 충족)
- 복잡한 메뉴나 광고 요소 배제, 학습에 온전히 몰입할 수 있는 미니멀·클린 레이아웃

### 7. 완료 기준 (Acceptance Criteria / Definition of Done)
- [ ] 로그인 절차 없이 접속 즉시 바로 게임을 시작할 수 있는가?
- [ ] 학생 개인정보(이름, IP, 쿠키, 계정 등)를 수집하거나 서버에 저장하지 않는가?
- [ ] 4학년 1학기 분수 덧셈 교육과정(동분모 진분수의 합, 대분수 변환)이 정확하게 반영되었는가?
- [ ] 피자 조각을 클릭/터치하면 팬에 채워지고, 실시간 분수 수식과 정확히 동기화되는가?
- [ ] 합이 1을 넘는 경우 두 번째 피자 판이 나타나 대분수(1과 몇 분의 몇)를 눈으로 확인할 수 있는가?
- [ ] 크롬북, 태블릿, PC 전자칠판 브라우저에서 반응형으로 정상 작동하는가?
- [ ] 모든 조작에 정답/오답 사운드와 시각 피드백이 제공되는가?`;

export const PromptViewerModal: React.FC<PromptViewerModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'breakdown' | 'customize'>('prompt');

  // Customization options for the prompt
  const [targetDenominator, setTargetDenominator] = useState<'basic' | 'all'>('all');
  const [includeMixed, setIncludeMixed] = useState<boolean>(true);
  const [includeTimer, setIncludeTimer] = useState<boolean>(true);
  const [themeStyle, setThemeStyle] = useState<'pizzeria' | 'bakery'>('pizzeria');

  const getCustomizedPrompt = () => {
    let prompt = GENERATED_PROMPT_TEXT;
    if (themeStyle === 'bakery') {
      prompt = prompt.replace(/피자/g, '케이크').replace(/피자리아/g, '베이커리');
    }
    if (!includeMixed) {
      prompt = prompt.replace(
        /- 2\. \*\*가분수와 대분수 자연스러운 변환 \(1판 초과 시\)\*\*:[^]*?(?=3\. \*\*3가지)/,
        '- 2. **합이 1 이하인 진분수 집중 훈련**: 합이 1을 넘지 않는 기초 진분수 덧셈에만 집중하도록 난이도 조절 가능\n'
      );
    }
    return prompt;
  };

  const handleCopy = async () => {
    try {
      const text = getCustomizedPrompt();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const text = getCustomizedPrompt();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AI_스튜디오_Build_4학년_분수덧셈_요청문.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                AI 스튜디오 Build 전용 한국어 요청문 (프롬프트)
              </h2>
              <p className="text-xs text-stone-500">
                AI Studio Build에 그대로 복사·붙여넣기하여 바로 앱을 생성할 수 있는 완전체 프롬프트입니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? '복사 완료!' : '요청문 전체 복사'}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
              title="마크다운 파일 다운로드"
            >
              <FileDown className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 bg-stone-100/60">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            전체 요청문 텍스트
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            항목별 구조 분석 (역할·목표·맥락·완료기준)
          </button>
          <button
            onClick={() => setActiveTab('customize')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'customize'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            내 수업 맞춤 옵션 조절
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50/50">
          {activeTab === 'prompt' && (
            <div className="relative">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs text-emerald-800">
                  <span className="font-bold">학생 개인정보 안전 보장 가이드 탑재:</span> 본 요청문에는
                  초등학생의 이름, 학번, 로그인, 서버 저장을 일절 요구하지 않고 100% 브라우저 내에서만 안전하게 동작하도록
                  엄격한 개인정보 보호 조항이 명시되어 있습니다.
                </div>
              </div>

              <div className="bg-stone-900 text-stone-100 p-5 rounded-xl font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap selection:bg-amber-500 selection:text-stone-900 overflow-x-auto shadow-inner">
                {getCustomizedPrompt()}
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wide block mb-1">
                  1. 역할 (Role) & 목표 (Goal)
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">
                  초등 수학 교육 공학자로서 4학년 1학기 4단원 '분모가 같은 분수의 덧셈'을 피자 조각 구체물 조작으로
                  완벽하게 이해시키는 교육용 웹앱 설계.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide block mb-1">
                  2. 학생 개인정보 보호 (Privacy First)
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">
                  학교 현장의 까다로운 정보보호 규정을 준수하기 위해 회원가입/로그인 없음, DB 연동 없음, 닉네임 선택형,
                  100% 클라이언트 로컬 구동 원칙 명시.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wide block mb-1">
                  3. 화면 구성 (Screen Layout)
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">
                  상단 단원 타이틀/모드 바 → 중앙 분수 문제 카드 → 원형 피자 베이킹 팬
                  (1판~2판 자동 확장) → 실시간 수식 피드백 및 큰 굽기(제출) 버튼.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-purple-800 uppercase tracking-wide block mb-1">
                  4. 핵심 기능 목록 (Features)
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">
                  동분모 조작(4·6·8·10등분), 합이 1 초과 시 가분수 및 대분수(1과 몇 분의 몇) 자동 시각화, 교사용 전자칠판 자유 출제기,
                  Web Audio 무설치 사운드.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wide block mb-1">
                  5. 디자인 및 터치 가이드 (Design)
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">
                  아이패드·크롬북·전자칠판용 최소 48px 터치 타깃, 따뜻한 피자리아 색채, 교과서형 가로선 분수 타이포그래피.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-800 uppercase tracking-wide block mb-1">
                  6. 완료 기준 (Definition of Done)
                </span>
                <p className="text-sm text-stone-700 leading-relaxed">
                  즉시 실행 가능 여부, 개인정보 무수집 확인, 수학적 정확성(동분모 덧셈 및 대분수 변환), 반응형 디바이스 지원 체크리스트.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'customize' && (
            <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Layout className="w-4 h-4 text-amber-600" />
                선생님의 수업 계획에 맞게 프롬프트 옵션을 수정해 보세요:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    1판 초과 대분수(가분수) 포함 여부
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIncludeMixed(true)}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                        includeMixed ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      포함 (진분수 + 대분수)
                    </button>
                    <button
                      onClick={() => setIncludeMixed(false)}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                        !includeMixed ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      제외 (진분수만)
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    주제 테마
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setThemeStyle('pizzeria')}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                        themeStyle === 'pizzeria' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      🍕 피자 파티
                    </button>
                    <button
                      onClick={() => setThemeStyle('bakery')}
                      className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${
                        themeStyle === 'bakery' ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      🎂 조각 케이크
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                💡 옵션을 변경한 후 상단의 <strong>[요청문 전체 복사]</strong> 버튼을 누르면 변경된 내용이 즉시 클립보드에 복사됩니다!
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            팁: AI Studio Build 대화창에 바로 붙여넣기(`Ctrl + V` 또는 `Cmd + V`)하시면 됩니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
          >
            닫고 게임 체험하기
          </button>
        </div>

      </div>
    </div>
  );
};
