import { useState } from 'react';
import { STANDARD_ELECTRODES, SUPPLEMENTAL_ELECTRODES, Electrode } from '../data/electrodes';
import { Eye, CheckCircle2, AlertTriangle, HelpCircle, RotateCcw, Info } from 'lucide-react';

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

  const startPractice = () => {
    setPracticeMode(true);
    setScore({ correct: 0, total: 0 });
    setPracticeFeedback(null);
    pickRandomTarget();
  };

  const pickRandomTarget = () => {
    const precordialAndLimb = activeElectrodeList.filter(e => e.type === 'precordial' || e.type === 'right-sided');
    const random = precordialAndLimb[Math.floor(Math.random() * precordialAndLimb.length)];
    setTargetPracticeElectrode(random);
    setPracticeFeedback(null);
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
          message: `Incorrect! You clicked ${e.code}. For ${targetPracticeElectrode.name} (${targetPracticeElectrode.code}), look for: ${targetPracticeElectrode.anatomicalLocation}`
        });
      }
    } else {
      onSelectElectrode(e.id === selectedElectrodeId ? null : e);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col xl:flex-row gap-6">
      {/* Left / Top: SVG Torso Diagram */}
      <div className="flex-1 flex flex-col items-center">
        {/* Controls Toolbar */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-3 px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Torso Overlays:
            </span>
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`px-2.5 py-1 rounded border transition ${
                showSkeleton ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Ribs & Sternum
            </button>
            <button
              onClick={() => setShowLines(!showLines)}
              className={`px-2.5 py-1 rounded border transition ${
                showLines ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Reference Lines
            </button>
            <button
              onClick={() => setShowAngleOfLouis(!showAngleOfLouis)}
              className={`px-2.5 py-1 rounded border transition ${
                showAngleOfLouis ? 'bg-amber-950/80 border-amber-500/50 text-amber-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Angle of Louis
            </button>
          </div>

          <div className="flex items-center gap-2">
            {practiceMode ? (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded border border-slate-700">
                <span className="text-amber-400 font-bold">
                  Score: {score.correct}/{score.total}
                </span>
                <button
                  onClick={() => setPracticeMode(false)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-xs ml-2"
                >
                  <RotateCcw className="w-3 h-3" /> Exit
                </button>
              </div>
            ) : (
              <button
                onClick={startPractice}
                className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded shadow transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Practice Mode
              </button>
            )}
          </div>
        </div>

        {/* Practice Mode Prompt Banner */}
        {practiceMode && targetPracticeElectrode && (
          <div className="w-full mb-3 p-2.5 bg-indigo-950/60 border border-indigo-500/40 rounded-lg text-center animate-fade-in">
            <span className="text-slate-300 text-xs uppercase tracking-wide">Target Objective:</span>
            <div className="text-base font-bold text-cyan-300">
              Click the correct location for: <span className="text-white underline">{targetPracticeElectrode.name} ({targetPracticeElectrode.code})</span>
            </div>
            {practiceFeedback && (
              <div className={`mt-1.5 text-xs font-semibold px-2 py-1 rounded flex items-center justify-center gap-1.5 ${
                practiceFeedback.isCorrect ? 'bg-emerald-900/70 text-emerald-300 border border-emerald-500/40' : 'bg-rose-900/70 text-rose-300 border border-rose-500/40'
              }`}>
                {practiceFeedback.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                {practiceFeedback.message}
              </div>
            )}
          </div>
        )}

        {/* Anatomical 2D Vector SVG */}
        <div className="relative w-full max-w-[500px] aspect-[4/5] bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center select-none overflow-hidden">
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="bodySkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
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
              stroke="#475569"
              strokeWidth="2.5"
            />

            {/* Neck & Clavicle Anatomical Base */}
            <path d="M 160 75 Q 200 95 240 75" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3,3" />

            {/* Sternal Notch */}
            <ellipse cx="200" cy="85" rx="10" ry="4" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <text x="200" y="78" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600">Suprasternal Notch</text>

            {/* Clavicles */}
            <path d="M 195 86 C 160 82, 110 92, 60 115" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <path d="M 205 86 C 240 82, 290 92, 340 115" fill="none" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <text x="95" y="100" fill="#64748b" fontSize="8">Right Clavicle</text>
            <text x="305" y="100" fill="#64748b" fontSize="8" textAnchor="end">Left Clavicle</text>

            {/* Midclavicular, Anterior Axillary, Midaxillary Reference Lines */}
            {showLines && (
              <g opacity="0.65">
                {/* Left Midclavicular Line (vertical through midclavicle ~x=255) */}
                <line x1="255" y1="95" x2="255" y2="400" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,4" />
                <text x="257" y="395" fill="#38bdf8" fontSize="7.5" fontWeight="600">Left Midclavicular (MCL)</text>

                {/* Right Midclavicular Line (for V4R ~x=145) */}
                <line x1="145" y1="95" x2="145" y2="400" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4,4" />
                <text x="143" y="395" fill="#38bdf8" fontSize="7.5" fontWeight="600" textAnchor="end">Right MCL (V4R)</text>

                {/* Left Anterior Axillary Line (~x=295) */}
                <line x1="295" y1="130" x2="295" y2="380" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="4,4" />
                <text x="297" y="375" fill="#818cf8" fontSize="7.5" fontWeight="600">Left Ant. Axillary (AAL)</text>

                {/* Left Midaxillary Line (~x=325) */}
                <line x1="325" y1="150" x2="325" y2="360" stroke="#c084fc" strokeWidth="1.2" strokeDasharray="4,4" />
                <text x="327" y="355" fill="#c084fc" fontSize="7.5" fontWeight="600">Left Midaxillary (MAL)</text>

                {/* Horizontal V4 plane reference line */}
                <line x1="100" y1="265" x2="335" y2="265" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,3" />
                <text x="337" y="268" fill="#f43f5e" fontSize="7">Horizontal Plane (V4-V5-V6)</text>
              </g>
            )}

            {/* Skeletal Anatomy: Sternum & Ribs */}
            {showSkeleton && (
              <g opacity="0.85">
                {/* Manubrium */}
                <polygon points="190,88 210,88 214,120 186,120" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="200" y="108" textAnchor="middle" fill="#cbd5e1" fontSize="7.5">Manubrium</text>

                {/* Sternum Body */}
                <polygon points="186,126 214,126 210,240 190,240" fill="#1e293b" stroke="#94a3b8" strokeWidth="1.5" />
                <text x="200" y="175" textAnchor="middle" fill="#94a3b8" fontSize="8" transform="rotate(-90 200 175)">Sternum Body</text>

                {/* Xiphoid Process */}
                <polygon points="194,242 206,242 200,260" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                <text x="200" y="272" textAnchor="middle" fill="#94a3b8" fontSize="7.5">Xiphoid</text>

                {/* Rib 1 */}
                <path d="M 188 92 C 160 96, 120 115, 80 145" fill="none" stroke="#475569" strokeWidth="2.5" />
                <path d="M 212 92 C 240 96, 280 115, 320 145" fill="none" stroke="#475569" strokeWidth="2.5" />

                {/* Rib 2 (attaches directly at Angle of Louis!) */}
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

            {/* Faint Nipple Indicators with Clinical Caution */}
            <circle cx="120" cy="235" r="5" fill="#475569" opacity="0.35" />
            <circle cx="280" cy="235" r="5" fill="#475569" opacity="0.35" />

            {/* Interactive Electrode Markers */}
            {activeElectrodeList.map(elec => {
              // Convert percentage to svg coordinates (400 x 500)
              const cx = (elec.coords.x / 100) * 400;
              const cy = (elec.coords.y / 100) * 500;
              const isSelected = elec.id === selectedElectrodeId;

              return (
                <g
                  key={elec.id}
                  onClick={() => handleElectrodeClick(elec)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse/selection ring */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="none"
                      stroke={elec.color}
                      strokeWidth="3"
                      className="animate-pulse"
                      opacity="0.8"
                    />
                  )}

                  {/* Marker Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 11 : 9}
                    fill={elec.color}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="transition-all duration-200 group-hover:scale-125 origin-center shadow-lg"
                  />

                  {/* Electrode Code Text */}
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={elec.code.length > 2 ? '7' : '8'}
                    fontWeight="bold"
                    className="pointer-events-none select-none drop-shadow"
                  >
                    {elec.code}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend beneath torso */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
          <span className="text-slate-400">Standard Precordial:</span>
          {STANDARD_ELECTRODES.filter(e => e.type === 'precordial').map(e => (
            <button
              key={e.id}
              onClick={() => handleElectrodeClick(e)}
              className={`px-2 py-0.5 rounded font-mono font-bold text-xs transition border ${
                selectedElectrodeId === e.id
                  ? 'border-white text-white shadow'
                  : 'border-transparent text-slate-300 hover:border-slate-600'
              }`}
              style={{ backgroundColor: e.color + '33', color: e.color }}
            >
              {e.code}
            </button>
          ))}
          {showSupplementalRight && (
            <>
              <span className="text-slate-400 ml-2">Right-Sided:</span>
              {SUPPLEMENTAL_ELECTRODES.filter(e => e.type === 'right-sided').map(e => (
                <button
                  key={e.id}
                  onClick={() => handleElectrodeClick(e)}
                  className={`px-2 py-0.5 rounded font-mono font-bold text-xs transition border ${
                    selectedElectrodeId === e.id
                      ? 'border-white text-white shadow'
                      : 'border-transparent text-slate-300 hover:border-slate-600'
                  }`}
                  style={{ backgroundColor: e.color + '33', color: e.color }}
                >
                  {e.code}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right / Bottom: Detailed Clinical Placement Info Panel */}
      <div className="w-full xl:w-96 flex flex-col justify-between bg-slate-950/70 border border-slate-800 rounded-xl p-4">
        {selectedElectrode ? (
          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: selectedElectrode.color }}
                />
                <h3 className="text-base font-bold text-white">
                  {selectedElectrode.name} ({selectedElectrode.code})
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-slate-800 text-slate-300">
                {selectedElectrode.type}
              </span>
            </div>

            {/* Anatomical Location */}
            <div>
              <span className="font-semibold text-cyan-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Precise Anatomical Placement:
              </span>
              <p className="text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 font-medium">
                {selectedElectrode.anatomicalLocation}
              </p>
            </div>

            {/* Instructions */}
            <div>
              <span className="font-semibold text-indigo-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Step-by-Step Procedure:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedElectrode.instructions}
              </p>
            </div>

            {/* Clinical Purpose */}
            <div>
              <span className="font-semibold text-emerald-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Clinical Significance & View:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedElectrode.clinicalPurpose}
              </p>
            </div>

            {/* Common Mistakes */}
            <div>
              <span className="font-semibold text-rose-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Common Placement Pitfalls:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {selectedElectrode.commonMistakes.map((m, idx) => (
                  <li key={idx} className="leading-snug">{m}</li>
                ))}
              </ul>
            </div>

            {/* Adult Female Patient Considerations */}
            {selectedElectrode.femaleLandmarkNotes && (
              <div className="p-2.5 bg-amber-950/40 border border-amber-600/30 rounded-lg">
                <span className="font-semibold text-amber-300 flex items-center gap-1 mb-1 text-[11px]">
                  <Info className="w-3.5 h-3.5" /> Adult Female Patient Technique:
                </span>
                <p className="text-amber-200/90 leading-tight">
                  {selectedElectrode.femaleLandmarkNotes}
                </p>
              </div>
            )}

            {/* Modified Torso Warning */}
            {selectedElectrode.modifiedTorsoNotes && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-600/30 rounded-lg">
                <span className="font-semibold text-rose-300 flex items-center gap-1 mb-1 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5" /> Torso Modification Warning:
                </span>
                <p className="text-rose-200/90 leading-tight">
                  {selectedElectrode.modifiedTorsoNotes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
            <Info className="w-10 h-10 text-cyan-500/60" />
            <h4 className="text-sm font-semibold text-slate-200">Interactive Anatomical Guide</h4>
            <p className="text-xs leading-relaxed max-w-xs">
              Click any electrode marker on the chest or buttons below to inspect its precise anatomical location, landmarking steps (Angle of Louis), and common placement errors.
            </p>
            <div className="pt-3 border-t border-slate-800 w-full text-[11px] text-slate-500">
              Tip: Switch on <span className="text-emerald-400 font-semibold">Practice Mode</span> to test your landmark identification skills!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
