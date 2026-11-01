import { useState } from 'react';
import { SUPPLEMENTAL_ELECTRODES, Electrode } from '../data/electrodes';
import { Eye, AlertCircle, Info, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PosteriorTorsoProps {
  selectedElectrodeId: string | null;
  onSelectElectrode: (electrode: Electrode | null) => void;
}

export default function PosteriorTorso({
  selectedElectrodeId,
  onSelectElectrode
}: PosteriorTorsoProps) {
  const { theme, isBright } = useTheme();
  const [showBones, setShowBones] = useState(true);
  const [showVerticalLines, setShowVerticalLines] = useState(true);

  const posteriorElectrodes = SUPPLEMENTAL_ELECTRODES.filter(e => e.type === 'posterior');
  const selectedElectrode = posteriorElectrodes.find(e => e.id === selectedElectrodeId) || null;

  return (
    <div className={`border rounded-xl p-4 shadow-xl flex flex-col xl:flex-row gap-6 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Left: SVG Posterior View */}
      <div className="flex-1 flex flex-col items-center">
        {/* Controls */}
        <div className="w-full flex items-center justify-between gap-2 mb-3 px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={`font-semibold uppercase tracking-wider flex items-center gap-1.5 ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              <Eye className={`w-3.5 h-3.5 ${theme.accentText}`} /> Overlays:
            </span>
            <button
              onClick={() => setShowBones(!showBones)}
              className={`px-2.5 py-1 rounded border transition font-medium ${
                showBones 
                  ? `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}` 
                  : isBright ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Spine & Scapula
            </button>
            <button
              onClick={() => setShowVerticalLines(!showVerticalLines)}
              className={`px-2.5 py-1 rounded border transition font-medium ${
                showVerticalLines 
                  ? `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}` 
                  : isBright ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Reference Lines
            </button>
          </div>

          <div className={`text-[11px] font-medium flex items-center gap-1 px-2.5 py-1 rounded border ${
            isBright ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Posterior Leads (V7 – V9)
          </div>
        </div>

        {/* Anatomical Posterior Vector SVG */}
        <div className={`relative w-full max-w-[500px] aspect-[4/5] rounded-xl border p-2 flex items-center justify-center select-none overflow-hidden transition-colors ${
          isBright ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/60 border-slate-800/80'
        }`}>
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="backSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isBright ? "#cbd5e1" : "#334155"} />
                <stop offset="50%" stopColor={isBright ? "#94a3b8" : "#1e293b"} />
                <stop offset="100%" stopColor={isBright ? "#64748b" : "#0f172a"} />
              </linearGradient>
            </defs>

            {/* Clinical Training Mannequin Posterior Torso & Limbs Silhouette */}
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
              fill="url(#backSkinGrad)"
              stroke="#475569"
              strokeWidth="2.5"
            />

            {/* Dorsal Mannequin Arm Contours (Olecranon / Elbow & Wrist Creases) */}
            <path d="M 16 295 Q 26 298 36 295" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.2" opacity="0.35" />
            <path d="M 364 295 Q 374 298 384 295" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.2" opacity="0.35" />
            <path d="M 22 415 Q 28 418 34 415" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.2" opacity="0.45" />
            <path d="M 366 415 Q 372 418 378 415" fill="none" stroke={isBright ? "#94a3b8" : "#475569"} strokeWidth="1.2" opacity="0.45" />

            {/* Patient Back Orientation Labels */}
            <text x="50" y="55" fill="#0284c7" fontSize="10" fontWeight="bold">PATIENT LEFT</text>
            <text x="350" y="55" fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="end">PATIENT RIGHT</text>

            {/* Vertebral Column / Spine */}
            {showBones && (
              <g opacity="0.8">
                {/* Cervical to Lumbar Spine Line */}
                <line x1="200" y1="70" x2="200" y2="460" stroke="#94a3b8" strokeWidth="6" strokeDasharray="8,4" />
                <text x="206" y="90" fill={isBright ? "#334155" : "#cbd5e1"} fontSize="8">Vertebra C7 (Prominens)</text>
                <text x="206" y="262" fill={isBright ? "#334155" : "#cbd5e1"} fontSize="8">Thoracic Spine (T7-T8)</text>

                {/* Left Scapula */}
                <polygon
                  points="90,120 155,130 148,225 105,175"
                  fill="#1e293b"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <circle cx="148" cy="225" r="3.5" fill="#f59e0b" />
                <text x="146" y="240" fill="#d97706" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  Inferior Angle (Scapula)
                </text>
                <text x="110" y="150" fill={isBright ? "#334155" : "#94a3b8"} fontSize="8">Left Scapula</text>

                {/* Right Scapula */}
                <polygon
                  points="310,120 245,130 252,225 295,175"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <text x="290" y="150" fill={isBright ? "#475569" : "#64748b"} fontSize="8" textAnchor="end">Right Scapula</text>
              </g>
            )}

            {/* Vertical Reference Lines */}
            {showVerticalLines && (
              <g opacity={isBright ? 0.95 : 0.75}>
                {/* Horizontal V6 Level Line */}
                <line
                  x1="20"
                  y1="275"
                  x2="380"
                  y2="275"
                  stroke={isBright ? "#be123c" : "#f43f5e"}
                  strokeWidth={isBright ? 2.0 : 1.5}
                  strokeDasharray="4,4"
                />
                <text
                  x="375"
                  y="288"
                  fill={isBright ? "#9f1239" : "#e11d48"}
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  Horizontal Plane of V6 (Crucial Reference)
                </text>

                {/* Left Posterior Axillary Line (PAL) for V7 */}
                <line
                  x1="112"
                  y1="130"
                  x2="112"
                  y2="380"
                  stroke={isBright ? "#c2410c" : "#f97316"}
                  strokeWidth={isBright ? 1.8 : 1.2}
                  strokeDasharray="3,3"
                />
                <text
                  x="110"
                  y="375"
                  fill={isBright ? "#9a3412" : "#ea580c"}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="end"
                >
                  Left Posterior Axillary (V7)
                </text>

                {/* Left Midscapular Line for V8 */}
                <line
                  x1="148"
                  y1="140"
                  x2="148"
                  y2="395"
                  stroke={isBright ? "#be185d" : "#ec4899"}
                  strokeWidth={isBright ? 1.8 : 1.2}
                  strokeDasharray="3,3"
                />
                <text
                  x="148"
                  y="390"
                  fill={isBright ? "#9d174d" : "#db2777"}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Left Midscapular Line (V8)
                </text>

                {/* Left Paraspinal Line for V9 */}
                <line
                  x1="180"
                  y1="100"
                  x2="180"
                  y2="410"
                  stroke={isBright ? "#6d28d9" : "#8b5cf6"}
                  strokeWidth={isBright ? 1.8 : 1.2}
                  strokeDasharray="3,3"
                />
                <text
                  x="180"
                  y="405"
                  fill={isBright ? "#581c87" : "#7c3aed"}
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Left Paraspinal (V9)
                </text>
              </g>
            )}

            {/* Interactive Posterior Electrodes */}
            {posteriorElectrodes.map(elec => {
              const cx = (elec.coords.x / 100) * 400;
              const cy = (elec.coords.y / 100) * 500;
              const isSelected = elec.id === selectedElectrodeId;

              return (
                <g
                  key={elec.id}
                  onClick={() => onSelectElectrode(elec.id === selectedElectrodeId ? null : elec)}
                  className="cursor-pointer group"
                >
                  {/* Invisible Massive Touch/Click Target Zone */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="28"
                    fill="transparent"
                    className="cursor-pointer"
                  />

                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="20"
                      fill="none"
                      stroke={elec.color}
                      strokeWidth="3.5"
                      className="animate-pulse"
                      opacity="0.85"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 15 : 12}
                    fill={elec.color}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="transition-all duration-200 group-hover:scale-125 origin-center shadow-lg"
                  />

                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
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

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-3 text-xs">
          <span className={theme.subtextColor}>Select Lead:</span>
          {posteriorElectrodes.map(e => {
            const isSelected = selectedElectrodeId === e.id;
            return (
              <button
                key={e.id}
                onClick={() => onSelectElectrode(isSelected ? null : e)}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs transition border ${
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
        </div>
      </div>

      {/* Right: Explanatory & Clinical Guidance Panel */}
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
                isBright ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
              }`}>
                Posterior Lead
              </span>
            </div>

            <div>
              <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Precise Anatomical Landmark:
              </span>
              <p className={`p-2.5 rounded-lg border font-medium ${
                isBright ? 'bg-white text-slate-800 border-slate-200' : 'bg-slate-900/90 text-slate-200 border-slate-800'
              }`}>
                {selectedElectrode.anatomicalLocation}
              </p>
            </div>

            <div>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Horizontal Alignment Rule:
              </span>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                Must be positioned in the <strong className={theme.headingColor}>exact same horizontal plane as lead V6</strong> (5th intercostal space at midaxillary line). Do not angle downward.
              </p>
            </div>

            <div>
              <span className="font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Diagnostic Threshold:
              </span>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                ST-segment elevation <strong className={theme.headingColor}>≥ 0.5 mm (0.05 mV)</strong> in any posterior lead (V7, V8, or V9) confirms true acute posterior STEMI.
              </p>
            </div>

            <div className={`p-2.5 rounded-lg border text-[11px] ${
              isBright ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}>
              <div className="font-bold flex items-center gap-1 mb-1">
                <Info className="w-3.5 h-3.5 text-cyan-500" />
                Physical Cable Reassignment Note:
              </div>
              Repurpose V4, V5, V6 leads on your 10-electrode device and manually hand-annotate tracing with "V7", "V8", "V9".
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <AlertCircle className={`w-10 h-10 ${theme.accentText} opacity-70`} />
            <h4 className={`text-sm font-semibold ${theme.headingColor}`}>Posterior Chest Guidance</h4>
            <p className={`text-xs leading-relaxed max-w-xs ${theme.subtextColor}`}>
              Click on leads V7, V8, or V9 on the patient's left back to inspect anatomical landmarks, muscle attenuation, and diagnostic criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
