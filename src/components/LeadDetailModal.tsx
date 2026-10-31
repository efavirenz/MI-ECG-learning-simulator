import { useState } from 'react';
import { MI_TERRITORIES } from '../data/miTerritories';
import { getCycleLandmarks, getEcgVoltage } from '../utils/ecgGenerator';
import { X, ZoomIn, Info, CheckCircle2, Sliders } from 'lucide-react';

interface LeadDetailModalProps {
  lead: string;
  territoryId: string;
  paperMode: 'dark' | 'paper';
  onClose: () => void;
}

export default function LeadDetailModal({
  lead,
  territoryId,
  paperMode,
  onClose
}: LeadDetailModalProps) {
  const [showNormalComparison, setShowNormalComparison] = useState(true);
  const [activeLandmarkCode, setActiveLandmarkCode] = useState<string | null>('J-Pt');
  const [caliperMm, setCaliperMm] = useState<number | null>(null);

  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];
  const landmarks = getCycleLandmarks(lead, territoryId, 75);
  const activeLandmark = landmarks.find(l => l.code === activeLandmarkCode) || landmarks[0];

  // SVG dimensions for magnified single cycle
  // Cycle duration: 0.8 s. Standard 25 mm/s -> 20 mm width
  // Voltage range: -1.8 mV to +2.0 mV (3.8 mV -> 38 mm height)
  // Let's use viewBox 0 0 500 300
  // Time 0 to 0.8s mapped to X 30 to 470
  // Voltage -1.5 to 2.0 mV mapped to Y 270 to 30 (Baseline 0 mV at Y 190)
  const timeToX = (t: number) => 30 + (t / 0.8) * 440;
  const voltToY = (v: number) => 190 - v * 80; // 1 mV = 80 px (so 0.1 mV = 8 px = 1 mm)

  // Generate SVG path points
  const abnormalPoints: string[] = [];
  const normalPoints: string[] = [];

  const sampleCount = 300;
  for (let i = 0; i <= sampleCount; i++) {
    const t = (i / sampleCount) * 0.8;
    const x = timeToX(t);

    const vAbnormal = getEcgVoltage(lead, t, territoryId, 75);
    const yAbnormal = voltToY(vAbnormal);
    abnormalPoints.push(`${x.toFixed(1)},${yAbnormal.toFixed(1)}`);

    if (showNormalComparison) {
      const vNormal = getEcgVoltage(lead, t, 'normal', 75);
      const yNormal = voltToY(vNormal);
      normalPoints.push(`${x.toFixed(1)},${yNormal.toFixed(1)}`);
    }
  }

  const abnormalPathD = `M ${abnormalPoints.join(' L ')}`;
  const normalPathD = showNormalComparison ? `M ${normalPoints.join(' L ')}` : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/50 flex items-center justify-center font-mono font-bold text-rose-300 text-sm">
              {lead}
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Lead {lead} Magnified Waveform Analysis
              </h2>
              <span className="text-xs text-slate-400">
                Pattern: <strong className="text-rose-400">{territory.name}</strong> • 25 mm/s • 10 mm/mV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNormalComparison(!showNormalComparison)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                showNormalComparison
                  ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Compare Normal
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Calibrated Magnified ECG Canvas / SVG */}
          <div className={`relative rounded-xl border p-4 overflow-hidden select-none ${
            paperMode === 'paper'
              ? 'bg-[#fff9f5] border-rose-200 ecg-grid-paper'
              : 'bg-[#0a0f1d] border-slate-800 ecg-grid-background'
          }`}>
            {/* Calibration Legend */}
            <div className="absolute top-2 left-4 z-10 flex items-center gap-4 text-[11px] font-mono opacity-80 pointer-events-none">
              <span className={paperMode === 'paper' ? 'text-rose-900 font-bold' : 'text-slate-300'}>
                Paper Speed: 25 mm/s (1 small box = 0.04s)
              </span>
              <span className={paperMode === 'paper' ? 'text-rose-900 font-bold' : 'text-slate-300'}>
                Voltage: 10 mm/mV (1 small box = 0.1 mV / 1 mm)
              </span>
            </div>

            {/* SVG High-Res Waveform */}
            <svg
              viewBox="0 0 500 300"
              className="w-full h-auto cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const svgY = (clickY / rect.height) * 300;
                // baseline 0 mV is at Y=190. 1 mV = 80px => 0.1 mV (1 mm) = 8px
                const deviationMv = (190 - svgY) / 80;
                setCaliperMm(parseFloat((deviationMv * 10).toFixed(1)));
              }}
            >
              {/* Isoelectric PR/TP Baseline Line */}
              <line
                x1="20"
                y1="190"
                x2="480"
                y2="190"
                stroke={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              <text
                x="25"
                y="186"
                fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                fontSize="9"
                fontWeight="600"
                opacity="0.8"
              >
                Isoelectric Baseline (0 mV / PR Segment)
              </text>

              {/* Standard Calibration Pulse (10 mm = 1.0 mV high, 0.20s = 5 mm wide) */}
              <path
                d="M 35 190 L 35 110 L 55 110 L 55 190"
                fill="none"
                stroke={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                strokeWidth="2"
              />
              <text x="45" y="105" textAnchor="middle" fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'} fontSize="8" fontWeight="bold">
                1.0 mV (10 mm)
              </text>

              {/* Normal Baseline Comparison Waveform (Dashed gray/blue) */}
              {showNormalComparison && (
                <path
                  d={normalPathD}
                  fill="none"
                  stroke={paperMode === 'paper' ? '#94a3b8' : '#64748b'}
                  strokeWidth="2"
                  strokeDasharray="3,3"
                  opacity="0.85"
                />
              )}

              {/* Active Abnormal Waveform (Vivid Red or Blue Trace) */}
              <path
                d={abnormalPathD}
                fill="none"
                stroke={
                  delta?.stElevationMm
                    ? (paperMode === 'paper' ? '#dc2626' : '#f87171')
                    : (paperMode === 'paper' ? '#0369a1' : '#38bdf8')
                }
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Landmark Clickable / Hoverable Circles */}
              {landmarks.map(lm => {
                const lx = timeToX(lm.timeSec);
                const ly = voltToY(lm.voltageMv);
                const isActive = activeLandmarkCode === lm.code;

                return (
                  <g
                    key={lm.code}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLandmarkCode(lm.code);
                    }}
                    className="cursor-pointer group"
                  >
                    {isActive && (
                      <circle
                        cx={lx}
                        cy={ly}
                        r="10"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={lx}
                      cy={ly}
                      r={isActive ? 6 : 4}
                      fill={isActive ? '#fbbf24' : '#ffffff'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                      className="group-hover:scale-150 transition origin-center"
                    />
                    <text
                      x={lx}
                      y={ly - 9}
                      textAnchor="middle"
                      fill={isActive ? '#fbbf24' : (paperMode === 'paper' ? '#0f172a' : '#cbd5e1')}
                      fontSize={isActive ? '10' : '8.5'}
                      fontWeight="bold"
                    >
                      {lm.code}
                    </text>
                  </g>
                );
              })}

              {/* Caliper measuring indicator if set by user click */}
              {caliperMm !== null && (
                <g>
                  <line
                    x1="250"
                    y1="190"
                    x2="250"
                    y2={voltToY(caliperMm * 0.1)}
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="2,2"
                  />
                  <rect x="255" y="150" width="105" height="24" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
                  <text x="260" y="166" fill="#a7f3d0" fontSize="9" fontWeight="bold">
                    Caliper: {caliperMm > 0 ? '+' : ''}{caliperMm} mm ({((caliperMm * 0.1)).toFixed(2)} mV)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Landmark Inspection Bar */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-3">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-cyan-400" /> Inspect Interval/Segment:
            </span>
            {landmarks.map(lm => (
              <button
                key={lm.code}
                onClick={() => setActiveLandmarkCode(lm.code)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition border ${
                  activeLandmarkCode === lm.code
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {lm.name} ({lm.code})
              </button>
            ))}
          </div>

          {/* Active Landmark Information Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                {activeLandmark.name} ({activeLandmark.code})
              </h4>
              <span className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800">
                Voltage: {(activeLandmark.voltageMv).toFixed(2)} mV ({(activeLandmark.voltageMv * 10).toFixed(1)} mm)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeLandmark.description}
            </p>
          </div>

          {/* Lead Specific Clinical Status in Active MI Territory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <span className="font-semibold text-rose-400 uppercase tracking-wide text-[11px] block">
                Current Lead Role in {territory.name}:
              </span>
              <p className="text-slate-300">
                {territory.primaryLeads.includes(lead) ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PRIMARY contiguous injury lead (ST elevation).
                  </span>
                ) : territory.reciprocalLeads.includes(lead) ? (
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> RECIPROCAL mirror injury lead (ST depression / inverted T).
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Non-infarct reference lead in this selected territory.
                  </span>
                )}
              </p>
              {delta?.stElevationMm && (
                <div className="mt-1 text-slate-200">
                  Calculated ST Deviation: <strong className="text-white">{delta.stElevationMm > 0 ? '+' : ''}{delta.stElevationMm} mm ({((delta.stElevationMm * 0.1)).toFixed(2)} mV)</strong> ({delta.stSlope || 'convex'}).
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <span className="font-semibold text-indigo-400 uppercase tracking-wide text-[11px] block">
                Caliper & Measurement Guide:
              </span>
              <p className="text-slate-300 leading-snug">
                Click anywhere on the ECG grid above to measure vertical deviation relative to the isoelectric PR baseline (PR segment). 
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                Standard STEMI criteria require measurement exactly at the <strong className="text-amber-300">J point</strong> relative to the preceding <strong className="text-cyan-300">PR segment</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
