import { useState } from 'react';
import { CLINICAL_CASES, KNOWLEDGE_QUIZ } from '../data/clinicalCases';
import { CheckCircle2, AlertTriangle, HelpCircle, RotateCcw, ChevronRight, Activity, BookOpen } from 'lucide-react';

interface ClinicalScenariosModuleProps {
  onSelectTerritoryForCase?: (territoryId: string) => void;
}

export default function ClinicalScenariosModule({
  onSelectTerritoryForCase
}: ClinicalScenariosModuleProps) {
  const [activeTab, setActiveTab] = useState<'cases' | 'quiz'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CLINICAL_CASES[0].id);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, number>>({});

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const currentCase = CLINICAL_CASES.find(c => c.id === selectedCaseId) || CLINICAL_CASES[0];

  const handleSelectCaseAnswer = (questionId: string, optionIdx: number) => {
    setCaseAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSelectQuizAnswer = (optionIdx: number) => {
    if (quizAnswers[currentQuizIndex] !== undefined) return; // already answered
    setQuizAnswers(prev => ({ ...prev, [currentQuizIndex]: optionIdx }));
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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Clinical Scenarios & Knowledge Checks
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Real-World Interactive Clinical Cases & Knowledge Quiz
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Apply 12-lead acquisition skills, reciprocal change recognition, and supplemental lead decision-making to clinical patient presentations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'cases'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Clinical Scenarios (5 Cases)
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'quiz'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
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
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
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
                    ? 'bg-rose-600 text-white border-rose-400 shadow-md font-bold'
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
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs h-fit">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                  {currentCase.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {currentCase.title}
                </h3>
              </div>

              {/* Patient Profile */}
              <div className="space-y-2">
                <span className="font-semibold text-slate-400 uppercase tracking-wide text-[11px] block">
                  Patient History & Presentation:
                </span>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 leading-relaxed font-medium">
                  {currentCase.patientHistory.presentation}
                </div>
                <div className="text-slate-400 flex items-center gap-3">
                  <span>Age: <strong className="text-slate-200">{currentCase.patientHistory.age}</strong></span>
                  <span>Sex: <strong className="text-slate-200">{currentCase.patientHistory.sex}</strong></span>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <span className="font-semibold text-cyan-400 uppercase tracking-wide text-[11px] block mb-1">
                  Admission Vital Signs:
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Blood Pressure:</span>
                    <strong className="text-white text-xs">{currentCase.patientHistory.vitals.bp}</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Heart Rate:</span>
                    <strong className="text-white text-xs">{currentCase.patientHistory.vitals.hr}</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Resp. Rate:</span>
                    <strong className="text-white text-xs">{currentCase.patientHistory.vitals.rr}</strong>
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">SpO2:</span>
                    <strong className="text-white text-xs">{currentCase.patientHistory.vitals.spo2}</strong>
                  </div>
                </div>
              </div>

              {/* ECG Summary */}
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-lg p-3 space-y-1">
                <span className="font-bold text-rose-300 text-[11px] block">
                  12-Lead ECG Findings:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {currentCase.patientHistory.ecgSummary}
                </p>
              </div>

              {/* Key Takeaways Box */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <span className="font-bold text-emerald-400 text-[11px] block">
                  Clinical Summary & Guidelines:
                </span>
                <ul className="space-y-1 text-slate-300">
                  {currentCase.managementTakeaways.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right 2 Cols: Interactive Questions */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
                <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" /> Clinical Assessment Questions
                  </h4>
                  <span className="text-xs text-slate-400">
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
                      className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-900 text-cyan-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <h5 className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                          {q.question}
                        </h5>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pl-7">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = selectedIdx === optIdx;
                          const isThisCorrect = optIdx === q.correctIndex;

                          let btnClasses = 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800';

                          if (hasAnswered) {
                            if (isThisCorrect) {
                              btnClasses = 'border-emerald-500 bg-emerald-950/70 text-emerald-200 font-medium';
                            } else if (isOptionSelected) {
                              btnClasses = 'border-rose-500 bg-rose-950/70 text-rose-200 font-medium';
                            } else {
                              btnClasses = 'border-slate-800 bg-slate-900/40 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={hasAnswered}
                              onClick={() => handleSelectCaseAnswer(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-start gap-2.5 ${btnClasses}`}
                            >
                              <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5 font-bold font-mono">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Immediate Explanation Banner */}
                      {hasAnswered && (
                        <div
                          className={`ml-7 p-3 rounded-lg border text-xs space-y-1.5 animate-fade-in ${
                            isCorrect
                              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                              : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-400" />
                            )}
                            <span>{isCorrect ? 'Correct!' : 'Incorrect.'}</span>
                          </div>
                          <p className="leading-relaxed text-slate-300">
                            {q.explanation}
                          </p>
                          {q.pearl && (
                            <div className="p-2 bg-slate-900/80 rounded border border-slate-800 text-amber-300 font-medium text-[11px]">
                              💡 Clinical Pearl: {q.pearl}
                            </div>
                          )}
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

      {/* TAB 2: KNOWLEDGE CHECK QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-3xl mx-auto space-y-6 animate-fade-in text-xs">
          {!quizFinished ? (
            <>
              {/* Quiz Header & Progress */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                    Comprehensive Knowledge Check
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Question {currentQuizIndex + 1} of {KNOWLEDGE_QUIZ.length}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-slate-400">
                    Category: <strong className="text-cyan-400">{KNOWLEDGE_QUIZ[currentQuizIndex].category}</strong>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${((currentQuizIndex + 1) / KNOWLEDGE_QUIZ.length) * 100}%` }}
                />
              </div>

              {/* Active Quiz Question */}
              <div className="space-y-4">
                <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {KNOWLEDGE_QUIZ[currentQuizIndex].question}
                </h4>

                {/* Options */}
                <div className="space-y-2.5">
                  {KNOWLEDGE_QUIZ[currentQuizIndex].options.map((opt, optIdx) => {
                    const selectedIdx = quizAnswers[currentQuizIndex];
                    const hasAnswered = selectedIdx !== undefined;
                    const isThisCorrect = optIdx === KNOWLEDGE_QUIZ[currentQuizIndex].correctIndex;
                    const isOptionSelected = selectedIdx === optIdx;

                    let btnClasses = 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800';

                    if (hasAnswered) {
                      if (isThisCorrect) {
                        btnClasses = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 font-medium';
                      } else if (isOptionSelected) {
                        btnClasses = 'border-rose-500 bg-rose-950/80 text-rose-200 font-medium';
                      } else {
                        btnClasses = 'border-slate-800 bg-slate-950/40 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectQuizAnswer(optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${btnClasses}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug text-xs sm:text-sm">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Explanation if answered */}
                {quizAnswers[currentQuizIndex] !== undefined && (
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 animate-fade-in">
                    <div className="font-bold text-xs flex items-center gap-1.5">
                      {quizAnswers[currentQuizIndex] === KNOWLEDGE_QUIZ[currentQuizIndex].correctIndex ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" /> Incorrect.
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {KNOWLEDGE_QUIZ[currentQuizIndex].explanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation button */}
              <div className="flex justify-end pt-3 border-t border-slate-800">
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
              <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-500 flex items-center justify-center mx-auto text-indigo-300">
                <BookOpen className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
                <p className="text-slate-400 mt-1">Here is your clinical knowledge assessment summary:</p>
              </div>

              <div className="inline-block bg-slate-950 px-8 py-4 rounded-2xl border border-slate-800">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {quizScore} / {KNOWLEDGE_QUIZ.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Score: {Math.round((quizScore / KNOWLEDGE_QUIZ.length) * 100)}%
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                {quizScore >= 8
                  ? 'Outstanding clinical proficiency! You demonstrate strong mastery of 10-electrode positioning, Angle of Louis identification, supplemental leads (V3R/V4R and V7–V9), and STEMI criteria.'
                  : 'Good effort! Review the electrode placement landmarks, J-point measurement rules, and reciprocal changes to solidify clinical diagnostic confidence.'}
              </p>

              <div className="pt-4">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition inline-flex items-center gap-2 border border-slate-700"
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
