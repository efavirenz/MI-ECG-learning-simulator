import { useState } from 'react';
import { CLINICAL_CASES, KNOWLEDGE_QUIZ } from '../data/clinicalCases';
import { Activity, BookOpen, CheckCircle2, AlertTriangle, ChevronRight, HelpCircle, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ClinicalScenariosModuleProps {
  onSelectTerritoryForCase?: (territoryId: string) => void;
}

export default function ClinicalScenariosModule({
  onSelectTerritoryForCase
}: ClinicalScenariosModuleProps) {
  const { theme, isBright } = useTheme();
  const [activeTab, setActiveTab] = useState<'cases' | 'quiz'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1');
  
  // Case question state: { [questionId: string]: selectedAnswerIndex }
  const [caseAnswers, setCaseAnswers] = useState<Record<string, number>>({});
  
  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const currentCase = CLINICAL_CASES.find(c => c.id === selectedCaseId) || CLINICAL_CASES[0];

  const handleSelectCaseAnswer = (questionId: string, answerIndex: number) => {
    setCaseAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSelectQuizAnswer = (answerIndex: number) => {
    if (quizAnswers[currentQuizIndex] !== undefined) return;
    setQuizAnswers(prev => ({ ...prev, [currentQuizIndex]: answerIndex }));
  };

  const handleNextQuizQuestion = () => {
    if (currentQuizIndex < KNOWLEDGE_QUIZ.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizAnswers({});
    setCurrentQuizIndex(0);
    setQuizFinished(false);
  };

  const quizScore = Object.entries(quizAnswers).reduce((acc, [idxStr, ansIdx]) => {
    const qIdx = parseInt(idxStr);
    return acc + (KNOWLEDGE_QUIZ[qIdx].correctIndex === ansIdx ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Module Navigation Header */}
      <div className={`border rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
        <div>
          <div className={`flex items-center gap-2 text-xs font-mono font-bold ${theme.accentText} uppercase tracking-wider`}>
            <Activity className="w-4 h-4" /> Clinical Scenarios & Knowledge Checks
          </div>
          <h2 className={`text-xl font-bold mt-1 ${theme.headingColor}`}>
            Real-World Interactive Clinical Cases & Knowledge Quiz
          </h2>
          <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${theme.subtextColor}`}>
            Apply 12-lead acquisition skills, reciprocal change recognition, and supplemental lead decision-making to clinical patient presentations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-xs transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'cases'
                ? `${theme.accentBg} shadow`
                : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Clinical Scenarios (5 Cases)
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow'
                : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Knowledge Check Quiz (10 Qs)
          </button>
        </div>
      </div>

      {/* TAB 1: CLINICAL CASES */}
      {activeTab === 'cases' && (
        <div className="space-y-6 animate-fade-in">
          {/* Case Selection Pills */}
          <div className={`flex flex-wrap items-center gap-2 p-2 rounded-xl border transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
            {CLINICAL_CASES.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCaseId(c.id);
                  if (onSelectTerritoryForCase) {
                    onSelectTerritoryForCase(c.territoryId);
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border flex items-center gap-1.5 ${
                  selectedCaseId === c.id
                    ? `${theme.accentBg} ${theme.accentBorder} shadow-md font-bold`
                    : isBright
                    ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {c.title.split(':')[0]}
                <span className="text-[10px] opacity-75 hidden sm:inline">({c.category})</span>
              </button>
            ))}
          </div>

          {/* Active Case Container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 1 Col: Patient Vignette & Vitals Card */}
            <div className={`border rounded-xl p-5 space-y-4 text-xs h-fit transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
              <div className={`border-b pb-3 ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme.accentText}`}>
                  {currentCase.category}
                </span>
                <h3 className={`text-base font-bold mt-1 ${theme.headingColor}`}>
                  {currentCase.title}
                </h3>
              </div>

              {/* Patient Profile */}
              <div className="space-y-2">
                <span className={`font-semibold uppercase tracking-wide text-[11px] block ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                  Patient History & Presentation:
                </span>
                <div className={`p-3 rounded-lg border leading-relaxed font-medium ${
                  isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}>
                  {currentCase.patientHistory.presentation}
                </div>
                <div className={`flex items-center gap-3 ${theme.subtextColor}`}>
                  <span>Age: <strong className={theme.headingColor}>{currentCase.patientHistory.age}</strong></span>
                  <span>Sex: <strong className={theme.headingColor}>{currentCase.patientHistory.sex}</strong></span>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide text-[11px] block mb-1">
                  Admission Vital Signs:
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className={`p-2 rounded border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">Blood Pressure:</span>
                    <strong className={`text-xs ${theme.headingColor}`}>{currentCase.patientHistory.vitals.bp}</strong>
                  </div>
                  <div className={`p-2 rounded border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">Heart Rate:</span>
                    <strong className={`text-xs ${theme.headingColor}`}>{currentCase.patientHistory.vitals.hr}</strong>
                  </div>
                  <div className={`p-2 rounded border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">Resp. Rate:</span>
                    <strong className={`text-xs ${theme.headingColor}`}>{currentCase.patientHistory.vitals.rr}</strong>
                  </div>
                  <div className={`p-2 rounded border ${isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                    <span className="text-slate-400 text-[10px] block">SpO2:</span>
                    <strong className={`text-xs ${theme.headingColor}`}>{currentCase.patientHistory.vitals.spo2}</strong>
                  </div>
                </div>
              </div>

              {/* ECG Summary */}
              <div className={`p-3 rounded-lg border space-y-1 ${
                isBright ? 'bg-rose-50 border-rose-200 text-slate-800' : 'bg-rose-950/30 border border-rose-500/30 text-slate-300'
              }`}>
                <span className="font-bold text-rose-600 dark:text-rose-300 text-[11px] block">
                  12-Lead ECG Findings:
                </span>
                <p className="leading-relaxed">
                  {currentCase.patientHistory.ecgSummary}
                </p>
              </div>

              {/* Key Takeaways Box */}
              <div className={`p-3 rounded-lg border space-y-1.5 ${
                isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] block">
                  Clinical Summary & Guidelines:
                </span>
                <ul className={`space-y-1 ${theme.subtextColor}`}>
                  {currentCase.managementTakeaways.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right 2 Cols: Interactive Questions */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`border rounded-xl p-5 space-y-6 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
                <div className={`border-b pb-2 flex items-center justify-between ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
                  <h4 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${theme.headingColor}`}>
                    <HelpCircle className="w-4 h-4 text-cyan-500" /> Clinical Assessment Questions
                  </h4>
                  <span className={`text-xs ${theme.subtextColor}`}>
                    {currentCase.questions.length} Questions for this scenario
                  </span>
                </div>

                {currentCase.questions.map((q, qIndex) => {
                  const selectedIdx = caseAnswers[q.id];
                  const hasAnswered = selectedIdx !== undefined;
                  const isCorrect = selectedIdx === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`border rounded-xl p-4 space-y-3 transition-colors ${
                        isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <div className="space-y-1">
                          <p className={`font-semibold text-xs sm:text-sm ${theme.headingColor}`}>
                            {q.question}
                          </p>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedIdx === optIdx;
                          let btnClasses = isBright 
                            ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100' 
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800';

                          if (hasAnswered) {
                            if (optIdx === q.correctIndex) {
                              btnClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold';
                            } else if (isOptionSelected) {
                              btnClasses = 'border-rose-500 bg-rose-500/20 text-rose-800 dark:text-rose-200 font-bold';
                            } else {
                              btnClasses = isBright ? 'opacity-50 border-slate-200 bg-white' : 'opacity-40 border-slate-900 bg-slate-950';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleSelectCaseAnswer(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-lg border transition text-xs flex items-start gap-2.5 ${btnClasses}`}
                            >
                              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Reveal */}
                      {hasAnswered && (
                        <div className={`mt-2 p-3 rounded-lg border text-xs animate-fade-in ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                            : 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200'
                        }`}>
                          <div className="font-bold flex items-center gap-1.5 mb-1">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                <span>Correct!</span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4 text-rose-500" />
                                <span>Incorrect.</span>
                              </>
                            )}
                          </div>
                          <p className="leading-relaxed opacity-90">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KNOWLEDGE QUIZ */}
      {activeTab === 'quiz' && (
        <div className={`border rounded-xl p-6 space-y-6 animate-fade-in max-w-3xl mx-auto transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
          {!quizFinished ? (
            <>
              {/* Quiz Header & Progress */}
              <div className={`border-b pb-4 flex items-center justify-between ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-500 uppercase tracking-wider block">
                    10-Question Comprehensive Assessment
                  </span>
                  <h3 className={`text-base font-bold mt-0.5 ${theme.headingColor}`}>
                    Question {currentQuizIndex + 1} of {KNOWLEDGE_QUIZ.length}
                  </h3>
                </div>

                <div className={`px-3 py-1 rounded-full border font-mono font-bold text-xs ${
                  isBright ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300'
                }`}>
                  Progress: {Math.round(((currentQuizIndex) / KNOWLEDGE_QUIZ.length) * 100)}%
                </div>
              </div>

              {/* Question Card */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${
                    isBright ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {KNOWLEDGE_QUIZ[currentQuizIndex].category}
                  </span>
                  <p className={`text-sm sm:text-base font-bold leading-relaxed ${theme.headingColor}`}>
                    {KNOWLEDGE_QUIZ[currentQuizIndex].question}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2.5 pt-2">
                  {KNOWLEDGE_QUIZ[currentQuizIndex].options.map((opt, optIdx) => {
                    const selectedAns = quizAnswers[currentQuizIndex];
                    const hasAnswered = selectedAns !== undefined;
                    let btnClasses = isBright 
                      ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800' 
                      : 'border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-slate-200';

                    if (hasAnswered) {
                      if (optIdx === KNOWLEDGE_QUIZ[currentQuizIndex].correctIndex) {
                        btnClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (optIdx === selectedAns) {
                        btnClasses = 'border-rose-500 bg-rose-500/20 text-rose-800 dark:text-rose-200 font-bold';
                      } else {
                        btnClasses = isBright ? 'opacity-50 border-slate-200 bg-white' : 'opacity-40 border-slate-900 bg-slate-950';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectQuizAnswer(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${btnClasses}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug text-xs sm:text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation if answered */}
                {quizAnswers[currentQuizIndex] !== undefined && (
                  <div className={`p-3.5 rounded-xl border space-y-1.5 animate-fade-in ${
                    isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}>
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      {quizAnswers[currentQuizIndex] === KNOWLEDGE_QUIZ[currentQuizIndex].correctIndex ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Incorrect.
                        </span>
                      )}
                    </div>
                    <p className="leading-relaxed text-xs">
                      {KNOWLEDGE_QUIZ[currentQuizIndex].explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation button */}
              <div className={`flex justify-end pt-3 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
                <button
                  disabled={quizAnswers[currentQuizIndex] === undefined}
                  onClick={handleNextQuizQuestion}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow"
                >
                  {currentQuizIndex < KNOWLEDGE_QUIZ.length - 1 ? 'Next Question' : 'View Final Score'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            /* Quiz Results Card */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center mx-auto text-indigo-400">
                <BookOpen className="w-8 h-8" />
              </div>

              <div>
                <h3 className={`text-2xl font-bold ${theme.headingColor}`}>Quiz Completed!</h3>
                <p className={`mt-1 text-xs ${theme.subtextColor}`}>Here is your clinical knowledge assessment summary:</p>
              </div>

              <div className={`inline-block px-8 py-4 rounded-2xl border ${
                isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                  {quizScore} / {KNOWLEDGE_QUIZ.length}
                </div>
                <div className={`text-xs mt-1 ${theme.subtextColor}`}>
                  Score: {Math.round((quizScore / KNOWLEDGE_QUIZ.length) * 100)}%
                </div>
              </div>

              <p className={`text-xs max-w-md mx-auto leading-relaxed ${theme.subtextColor}`}>
                {quizScore >= 8
                  ? 'Outstanding clinical proficiency! You demonstrate strong mastery of 10-electrode positioning, Angle of Louis identification, supplemental leads (V3R/V4R and V7–V9), and STEMI criteria.'
                  : 'Good effort! Review the electrode placement landmarks, J-point measurement rules, and reciprocal changes to solidify clinical diagnostic confidence.'}
              </p>

              <div className="pt-4">
                <button
                  onClick={handleRestartQuiz}
                  className={`px-5 py-2 rounded-xl transition inline-flex items-center gap-2 border font-bold ${
                    isBright 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" /> Restart Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
