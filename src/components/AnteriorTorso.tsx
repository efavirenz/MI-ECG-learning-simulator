import { useEffect, useRef, useState } from 'react';
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
  const practiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const practiceSessionRef = useRef(0);

  const clearPracticeTimeout = () => {
    if (practiceTimeoutRef.current !== null) {
      clearTimeout(practiceTimeoutRef.current);
      practiceTimeoutRef.current = null;
    }
  };

  useEffect(() => () => {
    practiceSessionRef.current += 1;
    clearPracticeTimeout();
  }, []);

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
    clearPracticeTimeout();
    practiceSessionRef.current += 1;
    setPracticeMode(true);
    setScore({ correct: 0, total: 0 });
    setPracticeFeedback(null);
    pickRandomTarget();
  };

  const handleElectrodeClick = (e: Electrode) => {
    if (practiceMode && targetPracticeElectrode) {
      // Ignore duplicate taps after a correct answer until the next target is selected.
      if (practiceFeedback?.isCorrect) return;

      if (e.id === targetPracticeElectrode.id) {
        setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
        setPracticeFeedback({
          isCorrect: true,
          message: `Correct! ${e.name} (${e.code}) is placed at: ${e.anatomicalLocation}.`
        });
        clearPracticeTimeout();
        const sessionId = practiceSessionRef.current;
        practiceTimeoutRef.current = setTimeout(() => {
          practiceTimeoutRef.current = null;
          if (practiceSessionRef.current === sessionId) {
            pickRandomTarget();
          }
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
                  onClick={() => {
                    clearPracticeTimeout();
                    practiceSessionRef.current += 1;
                    setPracticeMode(false);
                  }}
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
              <div role="status" aria-live="polite" className={`mt-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1.5 ${
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
          <svg viewBox="0 0 400 500" className="w-full h-full" role="group" aria-label="Interactive anterior torso electrode placement diagram">
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

            {/* Clinical Training Mannequin Torso & Limbs Silhouette */}
            <path
              d="M 166 22
                 C 166 45, 168 62, 175 70
                 C 140 73, 90 85, 52 108
                 C 36 122, 22 170, 16 220
                 C 12 260, 10 320, 14 365
                 C 16 385, 18 400, 22 415
                 C 20 425, 19 440, 21 452
                 C 23 462, 31 464, 35 452
                 C 39 440, 37 428, 34 415
                 C 32 400, 31 380, 35 350
                 C 39 310, 52 265, 70 230
                 C 68 245, 72 280, 72 320
                 C 72 370, 78 430, 88 490
                 L 312 490
                 C 322 430, 328 370, 328 320
                 C 328 280, 332 245, 330 230
                 C 348 265, 361 310, 365 350
                 C 369 380, 368 400, 366 415
                 C 363 428, 361 440, 365 452
                 C 369 464, 377 462, 379 452
                 C 381 440, 380 425, 378 415
                 C 382 400, 384 385, 386 365
                 C 390 320, 388 260, 384 220
                 C 378 170, 364 122, 348 108
                 C 310 85, 260 73, 225 70
                 C 232 62, 234 45, 234 22 Z"
              fill="url(#bodySkinGrad)"
              stroke={isBright ? "#64748b" : "#475569"}
              strokeWidth="2.5"
            />

            {/* Suprasternal (Jugular) Notch Curve */}
            <path d="M 188 70 Q 200 78 212 70" fill="none" stroke={isBright ? "#64748b" : "#475569"} strokeWidth="2.2" />

            {/* Pectoralis Major Muscle Outlines */}
            <path d="M 186 165 C 160 178, 120 195, 74 215" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.6" opacity="0.6" />
            <path d="M 214 165 C 240 178, 280 195, 326 215" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.6" opacity="0.6" />

            {/* Mannequin Arm Contours (Elbow & Wrist Creases for RA/LA Orientation) */}
            <path d="M 18 290 Q 28 293 38 290" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.2" opacity="0.45" />
            <path d="M 362 290 Q 372 293 382 290" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.2" opacity="0.45" />
            <path d="M 22 415 Q 28 418 34 415" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.3" opacity="0.55" />
            <path d="M 366 415 Q 372 418 378 415" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.3" opacity="0.55" />
            {/* Subtle Thenar / Thumb Silhouette Line */}
            <path d="M 34 424 Q 31 433 34 442" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.0" opacity="0.4" />
            <path d="M 366 424 Q 369 433 366 442" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.0" opacity="0.4" />

            {/* Clavicles (Exact midpoints at x = 136 and x = 264) */}
            <path d="M 186 74 Q 136 71 86 86" fill="none" stroke={isBright ? "#475569" : "#94a3b8"} strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 214 74 Q 264 71 314 86" fill="none" stroke={isBright ? "#475569" : "#94a3b8"} strokeWidth="3.2" strokeLinecap="round" />
            <text x="136" y="65" fill={isBright ? "#475569" : "#94a3b8"} fontSize="7" fontWeight="bold" textAnchor="middle">Right Clavicle</text>
            <text x="264" y="65" fill={isBright ? "#475569" : "#94a3b8"} fontSize="7" fontWeight="bold" textAnchor="middle">Left Clavicle</text>

            {/* Reference Vertical Lines (High contrast in bright theme) */}
            {showLines && (
              <g opacity={isBright ? 0.95 : 0.75}>
                {/* Midsternal Line (MSL) */}
                <line
                  x1="200"
                  y1="68"
                  x2="200"
                  y2="465"
                  stroke={isBright ? "#0284c7" : "#38bdf8"}
                  strokeWidth={isBright ? 2.0 : 1.2}
                  strokeDasharray="4,4"
                />
                <text
                  x="200"
                  y="85"
                  fill={isBright ? "#0369a1" : "#38bdf8"}
                  fontSize={isBright ? "7.5" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Midsternal Line
                </text>
                <text
                  x="200"
                  y="475"
                  fill={isBright ? "#0369a1" : "#38bdf8"}
                  fontSize={isBright ? "7.5" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Midsternal Line
                </text>

                {/* Left Midclavicular Line (MCL) - Drops from exact midclavicle x=264 through V4 */}
                <line
                  x1="264"
                  y1="75"
                  x2="264"
                  y2="465"
                  stroke={isBright ? "#4338ca" : "#818cf8"}
                  strokeWidth={isBright ? 2.0 : 1.2}
                  strokeDasharray="3,3"
                />
                <text
                  x="264"
                  y="98"
                  fill={isBright ? "#312e81" : "#818cf8"}
                  fontSize={isBright ? "7.5" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Left Midclavicular (MCL)
                </text>
                <text
                  x="264"
                  y="465"
                  fill={isBright ? "#312e81" : "#818cf8"}
                  fontSize={isBright ? "7" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Left MCL (V4)
                </text>

                {/* Left Anterior Axillary Line (AAL) - Drops through V5 at x=296 */}
                <line
                  x1="296"
                  y1="110"
                  x2="296"
                  y2="465"
                  stroke={isBright ? "#6d28d9" : "#a78bfa"}
                  strokeWidth={isBright ? 2.0 : 1.2}
                  strokeDasharray="3,3"
                />
                <text
                  x="296"
                  y="132"
                  fill={isBright ? "#581c87" : "#a78bfa"}
                  fontSize={isBright ? "7.5" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Ant. Axillary (AAL)
                </text>
                <text
                  x="296"
                  y="478"
                  fill={isBright ? "#581c87" : "#a78bfa"}
                  fontSize={isBright ? "7" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Ant. Axillary (V5)
                </text>

                {/* Left Midaxillary Line (MAL) - Drops through V6 at x=328 */}
                <line
                  x1="328"
                  y1="130"
                  x2="328"
                  y2="465"
                  stroke={isBright ? "#7e22ce" : "#c084fc"}
                  strokeWidth={isBright ? 2.0 : 1.2}
                  strokeDasharray="3,3"
                />
                <text
                  x="328"
                  y="152"
                  fill={isBright ? "#6b21a8" : "#c084fc"}
                  fontSize={isBright ? "7.5" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Midaxillary (MAL)
                </text>
                <text
                  x="332"
                  y="465"
                  fill={isBright ? "#6b21a8" : "#c084fc"}
                  fontSize={isBright ? "7" : "6.5"}
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Midaxillary (V6)
                </text>

                {/* Right Midclavicular Line (Right MCL / V4R) - Drops from right midclavicle x=136 through V4R */}
                {showSupplementalRight && (
                  <>
                    <line
                      x1="136"
                      y1="75"
                      x2="136"
                      y2="465"
                      stroke={isBright ? "#b45309" : "#fbbf24"}
                      strokeWidth={isBright ? 2.0 : 1.2}
                      strokeDasharray="3,3"
                    />
                    <text
                      x="136"
                      y="98"
                      fill={isBright ? "#78350f" : "#fbbf24"}
                      fontSize={isBright ? "7.5" : "6.5"}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Right MCL (V4R)
                    </text>
                    <text
                      x="136"
                      y="475"
                      fill={isBright ? "#78350f" : "#fbbf24"}
                      fontSize={isBright ? "7.5" : "6.5"}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      Right MCL (V4R)
                    </text>
                  </>
                )}
              </g>
            )}

            {/* Ribcage and Sternum Overlay */}
            {showSkeleton && (
              <g opacity="0.8">
                {/* Manubrium (Jugular notch to Angle of Louis) */}
                <path d="M 186 74 L 214 74 L 216 118 L 184 118 Z" fill="#64748b" opacity="0.45" stroke="#94a3b8" strokeWidth="1" />
                
                {/* Angle of Louis Transverse Bony Ridge at 2nd Rib Attachment */}
                <line x1="182" y1="118" x2="218" y2="118" stroke="#f59e0b" strokeWidth="3.5" />
                
                {/* Sternal Body (Gladiolus) down to 5th Rib / Xiphoid */}
                <path d="M 186 120 L 214 120 L 210 238 L 190 238 Z" fill="#64748b" opacity="0.38" stroke="#94a3b8" strokeWidth="1" />
                
                {/* Xiphoid Process */}
                <polygon points="192,238 208,238 200,252" fill="#475569" stroke="#64748b" strokeWidth="1" />

                {/* Rib 1 (Manubrial attachment) */}
                <path d="M 186 86 C 158 90, 120 106, 86 132" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 214 86 C 242 90, 280 106, 314 132" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 2 (Attaches at Angle of Louis - Critical Landmark) */}
                <path d="M 184 118 C 148 124, 110 142, 75 174" fill="none" stroke="#cbd5e1" strokeWidth="2.8" />
                <path d="M 216 118 C 252 124, 290 142, 325 174" fill="none" stroke="#cbd5e1" strokeWidth="2.8" />
                <text x="140" y="128" fill="#94a3b8" fontSize="7">Rib 2</text>
                <text x="260" y="128" fill="#94a3b8" fontSize="7">Rib 2</text>

                {/* Rib 3 */}
                <path d="M 186 158 C 146 164, 106 182, 72 214" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 214 158 C 254 164, 294 182, 328 214" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 4 (Upper boundary of 4th ICS) */}
                <path d="M 188 198 C 146 204, 106 224, 70 252" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 212 198 C 254 204, 294 224, 330 252" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 5 (Lower boundary of 4th ICS / Upper boundary of 5th ICS) */}
                <path d="M 189 238 C 146 244, 106 264, 70 290" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 211 238 C 254 244, 294 264, 330 290" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Costal Margin Arch / Infrasternal Angle */}
                <path d="M 190 242 C 160 265, 120 300, 85 330" fill="none" stroke="#475569" strokeWidth="2.2" strokeDasharray="3,3" />
                <path d="M 210 242 C 240 265, 280 300, 315 330" fill="none" stroke="#475569" strokeWidth="2.2" strokeDasharray="3,3" />

                {/* Intercostal Space Indicators */}
                <text x="174" y="142" fill="#64748b" fontSize="6.5" textAnchor="end">2nd ICS</text>
                <text x="226" y="142" fill="#64748b" fontSize="6.5">2nd ICS</text>
                <text x="174" y="180" fill="#64748b" fontSize="6.5" textAnchor="end">3rd ICS</text>
                <text x="226" y="180" fill="#64748b" fontSize="6.5">3rd ICS</text>
                <text x="174" y="222" fill="#38bdf8" fontSize="7" fontWeight="bold" textAnchor="end">4th ICS ★</text>
                <text x="226" y="222" fill="#38bdf8" fontSize="7" fontWeight="bold">4th ICS ★</text>
                <text x="226" y="264" fill="#38bdf8" fontSize="7" fontWeight="bold">5th ICS ★</text>
              </g>
            )}

            {/* Angle of Louis Highlight Banner */}
            {showAngleOfLouis && (
              <g>
                <rect x="180" y="115" width="40" height="6" fill="#f59e0b" rx="3" filter="url(#glowEffect)" />
                <line x1="220" y1="118" x2="268" y2="114" stroke="#f59e0b" strokeWidth="1.5" />
                <circle cx="268" cy="114" r="2.5" fill="#f59e0b" />
                <rect x="270" y="102" width="118" height="24" rx="4" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1" />
                <text x="275" y="113" fill="#fbbf24" fontSize="7.5" fontWeight="bold">Angle of Louis (2nd Rib)</text>
                <text x="275" y="122" fill="#cbd5e1" fontSize="6.5">Locate 2nd rib → count down to 4th ICS</text>
              </g>
            )}

            {/* Faint Nipple Indicators */}
            <circle cx="136" cy="255" r="4.5" fill="#475569" opacity="0.3" />
            <circle cx="264" cy="255" r="4.5" fill="#475569" opacity="0.3" />

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
                  role="button"
                  tabIndex={0}
                  aria-label={`${practiceMode ? 'Practice target position' : 'Select'} ${elec.name} (${elec.code})`}
                  aria-pressed={practiceMode ? undefined : isSelected}
                  onClick={() => handleElectrodeClick(elec)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleElectrodeClick(elec);
                    }
                  }}
                  className="cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
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
                    strokeWidth={isSelected ? "3" : "2.5"}
                    className="transition-all duration-150 group-hover:brightness-110 drop-shadow-md"
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
            {STANDARD_ELECTRODES.filter(e => e.type === 'precordial').map(e => {
              const isSelected = selectedElectrodeId === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => handleElectrodeClick(e)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition border ${
                    isSelected
                      ? isBright
                        ? 'border-slate-800 shadow-md ring-2 ring-slate-400 font-black'
                        : 'border-white text-white shadow ring-2 ring-white/50'
                      : isBright
                      ? 'border-slate-300 text-slate-700 hover:border-slate-500'
                      : 'border-transparent text-slate-300 hover:border-slate-600'
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? isBright
                        ? e.color + '40'
                        : e.color + '33'
                      : e.color + '26',
                    color: isBright
                      ? (isSelected ? '#020617' : '#334155')
                      : (isSelected ? '#ffffff' : e.color)
                  }}
                >
                  {e.code}
                </button>
              );
            })}
            {showSupplementalRight && (
              <>
                <span className={`${theme.subtextColor} ml-2`}>Right-Sided:</span>
                {SUPPLEMENTAL_ELECTRODES.filter(e => e.type === 'right-sided').map(e => {
                  const isSelected = selectedElectrodeId === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => handleElectrodeClick(e)}
                      className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs transition border ${
                        isSelected
                          ? isBright
                            ? 'border-slate-800 shadow-md ring-2 ring-slate-400 font-black'
                            : 'border-white text-white shadow ring-2 ring-white/50'
                          : isBright
                          ? 'border-slate-300 text-slate-700 hover:border-slate-500'
                          : 'border-transparent text-slate-300 hover:border-slate-600'
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? isBright
                            ? e.color + '40'
                            : e.color + '33'
                          : e.color + '26',
                        color: isBright
                          ? (isSelected ? '#020617' : '#334155')
                          : (isSelected ? '#ffffff' : e.color)
                      }}
                    >
                      {e.code}
                    </button>
                  );
                })}
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
