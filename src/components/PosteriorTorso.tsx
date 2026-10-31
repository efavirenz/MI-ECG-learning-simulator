import { useState } from 'react';
import { SUPPLEMENTAL_ELECTRODES, Electrode } from '../data/electrodes';
import { Eye, AlertCircle, Info, Sparkles } from 'lucide-react';

interface PosteriorTorsoProps {
  selectedElectrodeId: string | null;
  onSelectElectrode: (electrode: Electrode | null) => void;
}

export default function PosteriorTorso({
  selectedElectrodeId,
  onSelectElectrode
}: PosteriorTorsoProps) {
  const [showBones, setShowBones] = useState(true);
  const [showVerticalLines, setShowVerticalLines] = useState(true);

  const posteriorElectrodes = SUPPLEMENTAL_ELECTRODES.filter(e => e.type === 'posterior');
  const selectedElectrode = posteriorElectrodes.find(e => e.id === selectedElectrodeId) || null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col xl:flex-row gap-6">
      {/* Left: SVG Posterior View */}
      <div className="flex-1 flex flex-col items-center">
        {/* Controls */}
        <div className="w-full flex items-center justify-between gap-2 mb-3 px-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> Overlays:
            </span>
            <button
              onClick={() => setShowBones(!showBones)}
              className={`px-2.5 py-1 rounded border transition ${
                showBones ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Spine & Scapula
            </button>
            <button
              onClick={() => setShowVerticalLines(!showVerticalLines)}
              className={`px-2.5 py-1 rounded border transition ${
                showVerticalLines ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Reference Lines
            </button>
          </div>

          <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1 bg-amber-950/30 px-2.5 py-1 rounded border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Posterior Leads (V7 – V9)
          </div>
        </div>

        {/* Anatomical Posterior Vector SVG */}
        <div className="relative w-full max-w-[500px] aspect-[4/5] bg-slate-950/60 rounded-xl border border-slate-800/80 p-2 flex items-center justify-center select-none overflow-hidden">
          <svg viewBox="0 0 400 500" className="w-full h-full">
            <defs>
              <linearGradient id="backSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Posterior Torso Silhouette */}
            {/* Note: Facing patient's back: left side on diagram is patient's LEFT side */}
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
              fill="url(#backSkinGrad)"
              stroke="#475569"
              strokeWidth="2.5"
            />

            {/* Patient Back Orientation Labels */}
            <text x="50" y="55" fill="#38bdf8" fontSize="10" fontWeight="bold">PATIENT LEFT</text>
            <text x="350" y="55" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="end">PATIENT RIGHT</text>

            {/* Vertebral Column / Spine */}
            {showBones && (
              <g opacity="0.8">
                {/* Cervical to Lumbar Spine Line */}
                <line x1="200" y1="70" x2="200" y2="460" stroke="#94a3b8" strokeWidth="6" strokeDasharray="8,4" />
                <text x="206" y="90" fill="#cbd5e1" fontSize="8">Vertebra C7 (Prominens)</text>
                <text x="206" y="275" fill="#cbd5e1" fontSize="8">Thoracic Spine (T7-T8)</text>

                {/* Left Scapula (Patient Left = diagram left) */}
                <polygon
                  points="90,120 155,130 148,225 105,175"
                  fill="#1e293b"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  opacity="0.8"
                />
                <circle cx="148" cy="225" r="3.5" fill="#f59e0b" />
                <text x="146" y="240" fill="#f59e0b" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  Inferior Angle (Scapula)
                </text>
                <text x="110" y="150" fill="#94a3b8" fontSize="8">Left Scapula</text>

                {/* Right Scapula (Patient Right = diagram right) */}
                <polygon
                  points="310,120 245,130 252,225 295,175"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  opacity="0.4"
                />
                <text x="290" y="150" fill="#64748b" fontSize="8" textAnchor="end">Right Scapula</text>
              </g>
            )}

            {/* Vertical Reference Lines */}
            {showVerticalLines && (
              <g opacity="0.7">
                {/* Horizontal V6 Level Line (around from front to back at y=275) */}
                <line x1="20" y1="275" x2="380" y2="275" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4,4" />
                <text x="375" y="270" fill="#f43f5e" fontSize="7.5" fontWeight="bold" textAnchor="end">
                  Horizontal Plane of V6 (Crucial Reference)
                </text>

                {/* Left Posterior Axillary Line (PAL) for V7 (~x=112) */}
                <line x1="112" y1="130" x2="112" y2="380" stroke="#f97316" strokeWidth="1.2" strokeDasharray="3,3" />
                <text x="110" y="375" fill="#f97316" fontSize="7" fontWeight="bold" textAnchor="end">
                  Left Posterior Axillary (V7)
                </text>

                {/* Left Midscapular Line for V8 (~x=148) */}
                <line x1="148" y1="140" x2="148" y2="395" stroke="#ec4899" strokeWidth="1.2" strokeDasharray="3,3" />
                <text x="148" y="390" fill="#ec4899" fontSize="7" fontWeight="bold" textAnchor="middle">
                  Left Midscapular Line (V8)
                </text>

                {/* Left Paraspinal Line for V9 (~x=180) */}
                <line x1="180" y1="100" x2="180" y2="410" stroke="#8b5cf6" strokeWidth="1.2" strokeDasharray="3,3" />
                <text x="180" y="405" fill="#8b5cf6" fontSize="7" fontWeight="bold" textAnchor="middle">
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
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="18"
                      fill="none"
                      stroke={elec.color}
                      strokeWidth="3"
                      className="animate-pulse"
                      opacity="0.8"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 13 : 10}
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
                    fontSize="8.5"
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
          <span className="text-slate-400">Select Lead:</span>
          {posteriorElectrodes.map(e => (
            <button
              key={e.id}
              onClick={() => onSelectElectrode(e.id === selectedElectrodeId ? null : e)}
              className={`px-3 py-1 rounded font-mono font-bold text-xs transition border ${
                selectedElectrodeId === e.id
                  ? 'border-white text-white shadow'
                  : 'border-transparent text-slate-300 hover:border-slate-600'
              }`}
              style={{ backgroundColor: e.color + '33', color: e.color }}
            >
              {e.code}
            </button>
          ))}
        </div>
      </div>

      {/* Right: Explanatory & Clinical Guidance Panel */}
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
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/40">
                Posterior Lead
              </span>
            </div>

            <div>
              <span className="font-semibold text-cyan-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Exact Anatomical Placement:
              </span>
              <p className="text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 font-medium">
                {selectedElectrode.anatomicalLocation}
              </p>
            </div>

            <div>
              <span className="font-semibold text-indigo-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Technique & Landmarking:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedElectrode.instructions}
              </p>
            </div>

            <div>
              <span className="font-semibold text-emerald-400 uppercase tracking-wide text-[11px] block mb-0.5">
                Diagnostic Role & Threshold:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedElectrode.clinicalPurpose}
              </p>
            </div>

            <div className="p-2.5 bg-rose-950/40 border border-rose-600/30 rounded-lg">
              <span className="font-semibold text-rose-300 flex items-center gap-1 mb-1 text-[11px]">
                <AlertCircle className="w-3.5 h-3.5" /> Pitfalls to Avoid:
              </span>
              <ul className="list-disc list-inside space-y-1 text-rose-200/90">
                {selectedElectrode.commonMistakes.map((m, idx) => (
                  <li key={idx} className="leading-tight">{m}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-2">
              <Info className="w-5 h-5 flex-shrink-0" />
              <h4 className="text-sm font-semibold text-white">Why Record Posterior Leads?</h4>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Standard 12-lead ECG electrodes face the anterior and lateral chest wall. The <strong className="text-cyan-300">posterior wall of the left ventricle</strong> is directly opposite leads V1–V3.
            </p>

            <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-lg space-y-1.5">
              <span className="font-bold text-indigo-300 block">Reciprocal Signature in V1–V3:</span>
              <p className="text-slate-300">
                Transmural posterior STEMI produces <span className="text-amber-300 font-semibold">horizontal ST depression</span>, <span className="text-amber-300 font-semibold">tall R waves (R/S &gt; 1)</span>, and <span className="text-amber-300 font-semibold">upright T waves</span> in standard anterior leads V1–V3.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg space-y-1.5">
              <span className="font-bold text-emerald-300 block">Guideline STEMI Threshold:</span>
              <p className="text-slate-300">
                Because back musculature attenuates voltage, ST elevation <strong className="text-white">≥ 0.5 mm (0.05 mV)</strong> in leads V7–V9 is diagnostic of acute posterior STEMI!
              </p>
            </div>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              Click <span className="text-orange-400 font-bold">V7</span>, <span className="text-pink-400 font-bold">V8</span>, or <span className="text-purple-400 font-bold">V9</span> to view anatomical instructions and acquisition tips.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
