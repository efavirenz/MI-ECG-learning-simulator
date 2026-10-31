import { useState } from 'react';
import { STANDARD_ELECTRODES, SUPPLEMENTAL_ELECTRODES, Electrode } from '../data/electrodes';
import { Eye, CheckCircle2, AlertTriangle, HelpCircle, RotateCcw, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AnteriorTorsoProps {
  selectedElectrodeId: string | null;
  onSelectElectrode: (electrode: Electrode | null) => void;
  showSupplementalRight?: boolean;
}

export default function AnteriorTorso({
  selectedElectrodeId,
  onSelectElectrode,
  showSupplementalRight = true
}: AnteriorTorsoProps) {
  const { theme, isBright } = useTheme();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [showAngleOfLouis, setShowAngleOfLouis] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);
  const [targetPracticeElectrode, setTargetPracticeElectrode] = useState<Electrode | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const activeElectrodeList = [
    ...STANDARD_ELECTRODES.filter(e => e.torsoView === 'anterior'),
    ...(showSupplementalRight ? SUPPLEMENTAL_ELECTRODES.filter(e => e.type === 'right-sided') : [])
  ];

  const selectedElectrode = activeElectrodeList.find(e => e.id === selectedElectrodeId) || null;

  const pickRandomTarget = () => {
    // Include both limb leads and precordial / right-sided leads in practice targets
    const candidates = activeElectrodeList.filter(e => e.type === 'precordial' || e.type === 'limb' || e.type === 'right-sided');
    const random = candidates[Math.floor(Math.random() * candidates.length)];
    setTargetPracticeElectrode(random);
    setPracticeFeedback(null);
  };

  const startPractice = () => {
    setPracticeMode(true);
    setScore({ correct: 0, total: 0 });
    setPracticeFeedback(null);
    pickRandomTarget();
  };

  const handleElectrodeClick = (e: Electrode) => {
    if (practiceMode && targetPracticeElectrode) {
      if (e.id === targetPracticeElectrode.id) {
        setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setPracticeFeedback({
          isCorrect: true,
          message: `Correct! ${e.name} (${e.code}) is placed at: ${e.anatomicalLocation}.`
        });
        setTimeout(() => {
          pickRandomTarget();
        }, 1800);
      } else {
        setScore(prev => ({ ...prev, total: prev.total + 1 }));
        setPracticeFeedback({
          isCorrect: false,
          message: `Incorrect! You clicked a different position. For ${targetPracticeElectrode.name} (${targetPracticeElectrode.code}), look for: ${targetPracticeElectrode.anatomicalLocation}`
        });
      }
    } else {
      onSelectElectrode(e.id === selectedElectrodeId ? null : e);
    }
  };

  return (
    <div className={`border rounded-xl p-4 shadow-xl flex flex-col xl:flex-row gap-6 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Left / Top: SVG Torso Diagram */}
      <div className="flex-1 flex flex-col items-center">
        {/* Controls Toolbar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              <Eye className={`w-3.5 h-3.5 ${theme.accentText}`} />
              Torso Overlays:
            </span>
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`px-2.5 py-1 rounded border transition font-medium ${
                showSkeleton 
                  ? `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}` 
                  : isBright ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Ribs & Sternum
            </button>
            <button
              onClick={() => setShowLines(!showLines)}
              className={`px-2.5 py-1 rounded border transition font-medium ${
                showLines 
                  ? `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}` 
                  : isBright ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Reference Lines
            </button>
            <button
              onClick={() => setShowAngleOfLouis(!showAngleOfLouis)}
              className={`px-2.5 py-1 rounded border transition font-medium ${
                showAngleOfLouis 
                  ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/80 dark:border-amber-500/50 dark:text-amber-300' 
                  : isBright ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Angle of Louis
            </button>
          </div>

          <div className="flex items-center gap-2">
            {practiceMode ? (
              <div className={`flex items-center gap-2 px-3 py-1 rounded border ${
                isBright ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-800 border-slate-700 text-slate-200'
              }`}>
                <span className="text-amber-500 font-bold">
                  Score: {score.correct}/{score.total}
                </span>
                <button
                  onClick={() => setPracticeMode(false)}
                  className="text-slate-400 hover:text-rose-500 flex items-center gap-1 text-xs ml-2 font-medium"
                >
                  <RotateCcw className="w-3 h-3" /> Exit
                </button>
              </div>
            ) : (
              <button
                onClick={startPractice}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-lg shadow transition flex items-center gap-1.5 text-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Practice Mode
              </button>
            )}
          </div>
        </div>

        {/* Practice Mode Prompt Banner */}
        {practiceMode && targetPracticeElectrode && (
          <div className={`w-full mb-3 p-3 rounded-xl border text-center animate-fade-in ${
            isBright ? 'bg-indigo-50 border-indigo-200 text-slate-900' : 'bg-indigo-950/60 border-indigo-500/40 text-slate-100'
          }`}>
            <span className={`text-[11px] uppercase tracking-wide font-bold block ${isBright ? 'text-indigo-700' : 'text-indigo-300'}`}>
              Target Objective (Tap the Unknown Lead Dot on Chest/Limbs):
            </span>
            <div className="text-sm sm:text-base font-bold mt-0.5">
              Locate & Tap: <span className={`${theme.accentText} underline`}>{targetPracticeElectrode.name} ({targetPracticeElectrode.code})</span>
            </div>
            {practiceFeedback && (
              <div className={`mt-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 ${
                practiceFeedback.isCorrect 
                  ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40'
              }`}>
                {practiceFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                {practiceFeedback.message}
              </div>
            )}
          </div>
        )}

        {/* Anatomical 2D Vector SVG */}
        <div className={`relative w-full max-w-[500px] aspect-[4/5] rounded-xl border p-2 flex items-center justify-center select-none overflow-hidden transition-colors ${
          isBright ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="bodySkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isBright ? "#cbd5e1" : "#334155"} />
                <stop offset="50%" stopColor={isBright ? "#94a3b8" : "#1e293b"} />
                <stop offset="100%" stopColor={isBright ? "#64748b" : "#0f172a"} />
              </linearGradient>
              <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Torso Silhouette Outline */}
            <path
              d="M 150 25 C 160 40, 160 65, 160 75
                 C 120 78, 75 90, 48 120
                 C 35 135, 25 180, 20 220
                 C 18 240, 16 320, 15 360
                 C 45 350, 75 340, 75 320
                 C 75 370, 80 430, 85 490
                 L 315 490
                 C 320 430, 325 370, 325 320
                 C 325 340, 355 350, 385 360
                 C 384 320, 382 240, 380 220
                 C 375 180, 365 135, 352 120
                 C 325 90, 280 78, 240 75
                 C 240 65, 240 40, 250 25 Z"
              fill="url(#bodySkinGrad)"
              stroke={isBright ? "#475569" : "#475569"}
              strokeWidth="2.5"
            />

            {/* Clavicles */}
            <path d="M 165 75 Q 120 70 60 90" fill="none" stroke="#64748b" strokeWidth="3" />
            <path d="M 235 75 Q 280 70 340 90" fill="none" stroke="#64748b" strokeWidth="3" />

            {/* Reference Vertical Lines */}
            {showLines && (
              <g opacity="0.6">
                {/* Midsternal Line */}
                <line x1="200" y1="80" x2="200" y2="460" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,4" />
                <text x="203" y="95" fill="#38bdf8" fontSize="6.5">Midsternal Line</text>

                {/* Left Midclavicular Line (Patient Left = diagram right) */}
                <line x1="280" y1="90" x2="280" y2="460" stroke="#818cf8" strokeWidth="1" strokeDasharray="3,3" />
                <text x="283" y="105" fill="#818cf8" fontSize="6.5">Left Midclavicular (MCL)</text>

                {/* Left Anterior Axillary Line */}
                <line x1="315" y1="120" x2="315" y2="460" stroke="#a78bfa" strokeWidth="1" strokeDasharray="2,2" />
                <text x="318" y="130" fill="#a78bfa" fontSize="6.5">Ant. Axillary (AAL)</text>

                {/* Left Midaxillary Line */}
                <line x1="345" y1="140" x2="345" y2="460" stroke="#c084fc" strokeWidth="1" strokeDasharray="2,2" />
                <text x="348" y="150" fill="#c084fc" fontSize="6.5">Midaxillary (MAL)</text>

                {/* Right Midclavicular Line (for V4R) */}
                {showSupplementalRight && (
                  <>
                    <line x1="120" y1="90" x2="120" y2="460" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3" />
                    <text x="65" y="105" fill="#fbbf24" fontSize="6.5">Right MCL (V4R)</text>
                  </>
                )}
              </g>
            )}

            {/* Ribcage and Sternum Overlay */}
            {showSkeleton && (
              <g opacity="0.75">
                {/* Manubrium & Sternum Body */}
                <path d="M 185 85 L 215 85 L 212 120 L 188 120 Z" fill="#64748b" opacity="0.4" />
                <line x1="185" y1="120" x2="215" y2="120" stroke="#f59e0b" strokeWidth="3" />
                <path d="M 188 123 L 212 123 L 208 240 L 192 240 Z" fill="#64748b" opacity="0.35" />
                <polygon points="194,240 206,240 200,258" fill="#475569" />

                {/* Rib 1 */}
                <path d="M 185 92 C 160 95, 120 110, 85 140" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 215 92 C 240 95, 280 110, 315 140" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 2 (At Angle of Louis) */}
                <path d="M 186 123 C 150 128, 110 145, 75 180" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                <path d="M 214 123 C 250 128, 290 145, 325 180" fill="none" stroke="#cbd5e1" strokeWidth="2.5" />
                <text x="140" y="132" fill="#94a3b8" fontSize="7">Rib 2</text>
                <text x="260" y="132" fill="#94a3b8" fontSize="7">Rib 2</text>

                {/* Rib 3 */}
                <path d="M 187 155 C 145 160, 105 180, 72 215" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 213 155 C 255 160, 295 180, 328 215" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 4 */}
                <path d="M 188 185 C 145 192, 105 215, 70 250" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 212 185 C 255 192, 295 215, 330 250" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 5 */}
                <path d="M 189 215 C 145 224, 105 248, 70 285" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 211 215 C 255 224, 295 248, 330 285" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Intercostal Space Indicators */}
                <text x="170" y="145" fill="#64748b" fontSize="6.5" textAnchor="end">2nd ICS</text>
                <text x="230" y="145" fill="#64748b" fontSize="6.5">2nd ICS</text>
                <text x="170" y="175" fill="#64748b" fontSize="6.5" textAnchor="end">3rd ICS</text>
                <text x="230" y="175" fill="#64748b" fontSize="6.5">3rd ICS</text>
                <text x="170" y="205" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="end">4th ICS ★</text>
                <text x="230" y="205" fill="#38bdf8" fontSize="7" fontWeight="bold">4th ICS ★</text>
                <text x="230" y="240" fill="#38bdf8" fontSize="7" fontWeight="bold">5th ICS ★</text>
              </g>
            )}

            {/* Angle of Louis Highlight Banner */}
            {showAngleOfLouis && (
              <g>
                <rect x="182" y="121" width="36" height="5" fill="#f59e0b" rx="2.5" filter="url(#glowEffect)" />
                <line x1="218" y1="123" x2="270" y2="115" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="270" cy="115" r="2.5" fill="#f59e0b" />
                <rect x="272" y="104" width="112" height="22" rx="3" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                <text x="276" y="115" fill="#fbbf24" fontSize="7.5" fontWeight="bold">Angle of Louis (2nd Rib)</text>
                <text x="276" y="123" fill="#cbd5e1" fontSize="6.5">Locate 2nd rib → count down to 4th ICS</text>
              </g>
            )}

            {/* Faint Nipple Indicators */}
            <circle cx="120" cy="235" r="5" fill="#475569" opacity="0.35" />
            <circle cx="280" cy="235" r="5" fill="#475569" opacity="0.35" />

            {/* Interactive Electrode Markers - Enlarged Hit Target for Touch & Mouse */}
            {activeElectrodeList.map(elec => {
              // Convert percentage to svg coordinates (400 x 500)
              const cx = (elec.coords.x / 100) * 400;
              const cy = (elec.coords.y / 100) * 500;
              const isSelected = elec.id === selectedElectrodeId;

              // In Practice Mode: labels are hidden, neutral appearance
              const dotFill = practiceMode ? '#475569' : elec.color;
              const dotStroke = practiceMode ? '#94a3b8' : '#ffffff';

              return (
                <g
                  key={elec.id}
                  onClick={() => handleElectrodeClick(elec)}
                  className="cursor-pointer group"
                >
                  {/* Invisible Massive Touch/Click Target Zone (56x56 px hit target) */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="28"
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {/* Outer pulse/selection ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="20"
                      fill="none"
                      stroke={practiceMode ? '#38bdf8' : elec.color}
                      strokeWidth="3.5"
                      className="animate-pulse"
                      opacity="0.85"
                    />
                  )}

                  {/* Marker Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 15 : 12}
                    fill={dotFill}
                    stroke={dotStroke}
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-125 origin-center shadow-lg"
                  />

                  {/* Electrode Code Text (HIDDEN in practice mode for unknown test) */}
                  {!practiceMode ? (
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize={elec.code.length > 2 ? '8' : '9.5'}
                      fontWeight="bold"
                      className="pointer-events-none select-none drop-shadow"
                    >
                      {elec.code}
                    </text>
                  ) : (
                    <text
                      x={cx}
                      y={cy + 3.5}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      ?
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend beneath torso - HIDDEN during Practice Mode to prevent test guidance */}
        {!practiceMode && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className={theme.subtextColor}>Precordial:</span>
            {STANDARD_ELECTRODES.filter(e => e.type === 'precordial').map(e => (
              <button
                key={e.id}
                onClick={() => handleElectrodeClick(e)}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition border ${
                  selectedElectrodeId === e.id
                    ? 'border-white text-white shadow ring-2 ring-white/50'
                    : isBright
                    ? 'border-slate-300 text-slate-700 hover:border-slate-500'
                    : 'border-transparent text-slate-300 hover:border-slate-600'
                }`}
                style={{ backgroundColor: e.color + '26', color: isBright ? undefined : e.color }}
              >
                {e.code}
              </button>
            ))}
            {showSupplementalRight && (
              <>
                <span className={`${theme.subtextColor} ml-2`}>Right-Sided:</span>
                {SUPPLEMENTAL_ELECTRODES.filter(e => e.type === 'right-sided').map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleElectrodeClick(e)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition border ${
                      selectedElectrodeId === e.id
                        ? 'border-white text-white shadow ring-2 ring-white/50'
                        : isBright
                        ? 'border-slate-300 text-slate-700 hover:border-slate-500'
                        : 'border-transparent text-slate-300 hover:border-slate-600'
                    }`}
                    style={{ backgroundColor: e.color + '26', color: isBright ? undefined : e.color }}
                  >
                    {e.code}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right / Bottom: Detailed Clinical Placement Info Panel */}
      <div className={`w-full xl:w-96 flex flex-col justify-between border rounded-xl p-4 transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
        {selectedElectrode ? (
          <div className="space-y-3.5 text-xs">
            <div className={`flex items-center justify-between border-b pb-2 ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0 shadow"
                  style={{ backgroundColor: selectedElectrode.color }}
                />
                <h3 className={`text-base font-bold ${theme.headingColor}`}>
                  {selectedElectrode.name} ({selectedElectrode.code})
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                isBright ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
              }`}>
                {selectedElectrode.type}
              </span>
            </div>

            {/* Anatomical Location */}
            <div>
              <span className={`font-semibold uppercase tracking-wide text-[11px] block mb-0.5 ${theme.accentText}`}>
                Precise Anatomical Placement:
              </span>
              <p className={`p-2.5 rounded-lg border font-medium ${
                isBright ? 'bg-white text-slate-800 border-slate-200' : 'bg-slate-900/90 text-slate-200 border-slate-800'
              }`}>
                {selectedElectrode.anatomicalLocation}
              </p>
            </div>

            {/* Instructions */}
            <div>
              <span className="font-semibold text-indigo-500 uppercase tracking-wide text-[11px] block mb-0.5">
                Step-by-Step Procedure:
              </span>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                {selectedElectrode.instructions}
              </p>
            </div>

            {/* Clinical Purpose */}
            <div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Clinical Significance & View:
              </span>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                {selectedElectrode.clinicalPurpose}
              </p>
            </div>

            {/* Common Mistakes */}
            <div>
              <span className="font-semibold text-rose-500 uppercase tracking-wide text-[11px] block mb-0.5">
                Common Placement Pitfalls:
              </span>
              <ul className={`list-disc list-inside space-y-1 ${theme.subtextColor}`}>
                {selectedElectrode.commonMistakes.map((m, idx) => (
                  <li key={idx} className="leading-snug">{m}</li>
                ))}
              </ul>
            </div>

            {/* Adult Female Patient Considerations */}
            {selectedElectrode.femaleLandmarkNotes && (
              <div className={`p-2.5 rounded-lg border ${
                isBright ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-600/30 text-amber-200/90'
              }`}>
                <span className="font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1 mb-1 text-[11px]">
                  <Info className="w-3.5 h-3.5" /> Adult Female Patient Technique:
                </span>
                <p className="leading-tight">
                  {selectedElectrode.femaleLandmarkNotes}
                </p>
              </div>
            )}

            {/* Modified Torso Warning */}
            {selectedElectrode.modifiedTorsoNotes && (
              <div className={`p-2.5 rounded-lg border ${
                isBright ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-950/40 border-rose-600/30 text-rose-200/90'
              }`}>
                <span className="font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1 mb-1 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Torso Modification Warning:
                </span>
                <p className="leading-tight">
                  {selectedElectrode.modifiedTorsoNotes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <Info className={`w-10 h-10 ${theme.accentText} opacity-70`} />
            <h4 className={`text-sm font-semibold ${theme.headingColor}`}>Interactive Anatomical Guide</h4>
            <p className={`text-xs leading-relaxed max-w-xs ${theme.subtextColor}`}>
              Click any electrode marker on the chest or buttons below to inspect its precise anatomical location, landmarking steps (Angle of Louis), and common placement errors.
            </p>
            <div className={`pt-3 border-t w-full text-[11px] ${isBright ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-500'}`}>
              Tip: Switch on <span className="text-emerald-500 font-semibold">Practice Mode</span> to test your landmark identification skills!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
