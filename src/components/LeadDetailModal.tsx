import { useState, useEffect, useRef } from 'react';
import { MI_TERRITORIES } from '../data/miTerritories';
import { getCycleLandmarks, getEcgVoltage } from '../utils/ecgGenerator';
import { X, ZoomIn, Info, CheckCircle2, Sliders, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, isBright } = useTheme();
  const [showNormalComparison, setShowNormalComparison] = useState(true);
  const [activeLandmarkCode, setActiveLandmarkCode] = useState<string | null>('J-Pt');
  const [caliperMm, setCaliperMm] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sweepTime, setSweepTime] = useState(0);

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];
  const landmarks = getCycleLandmarks(lead, territoryId, 75);
  const activeLandmark = landmarks.find(l => l.code === activeLandmarkCode) || landmarks[0];

  // Calibrated SVG Coordinate System:
  // ViewBox: 0 0 600 320
  // Standard calibration: 10 mm/mV (1 mm = 0.1 mV = 8 px; 10 mm = 1.0 mV = 80 px)
  // Baseline (0 mV) placed at Y = 180 (centered on a major grid line with clearance above & below)
  // Calibration pulse placed at X = 25 to 65 (width 40 px = 0.20s; height 80 px = 1.0 mV)
  // Isoelectric lead-in connects X = 65 to X = 80
  // Waveform mapped from X = 80 to 570 (0.8s cardiac cycle = 490 px)
  // Isoelectric run-out connects X = 570 to X = 590
  const timeToX = (t: number) => 80 + (t / 0.8) * 490;
  const voltToY = (v: number) => 180 - v * 80;

  // Live animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaSec = Math.min(0.1, (timestamp - lastTimeRef.current) / 1000);
      lastTimeRef.current = timestamp;

      setSweepTime(prev => (prev + deltaSec) % 0.8);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Generate SVG path points with high sampling density for smooth curves
  const abnormalPoints: string[] = ['25,180', '25,100', '65,100', '65,180', '80,180'];
  const normalPoints: string[] = ['25,180', '25,100', '65,100', '65,180', '80,180'];

  const sampleCount = 350;
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

  // Connect to end of strip
  abnormalPoints.push('590,180');
  normalPoints.push('590,180');

  const abnormalPathD = `M ${abnormalPoints.join(' L ')}`;
  const normalPathD = showNormalComparison ? `M ${normalPoints.join(' L ')}` : '';

  // Sweep cursor position
  const currentCursorX = timeToX(sweepTime);
  const currentCursorVoltage = getEcgVoltage(lead, sweepTime, territoryId, 75);
  const currentCursorY = voltToY(currentCursorVoltage);

  // Clinical guideline criteria evaluator for this lead
  const getClinicalThresholdEvaluation = (deviationMm: number) => {
    if (lead === 'V2' || lead === 'V3') {
      if (deviationMm >= 2.5) {
        return { meets: true, text: 'Meets STEMI criteria for Men < 40 (≥ 2.5 mm), Men ≥ 40 (≥ 2.0 mm), and Women (≥ 1.5 mm).' };
      } else if (deviationMm >= 2.0) {
        return { meets: true, text: 'Meets STEMI criteria for Men ≥ 40 (≥ 2.0 mm) and Women (≥ 1.5 mm).' };
      } else if (deviationMm >= 1.5) {
        return { meets: true, text: 'Meets STEMI criteria for Women of all ages (≥ 1.5 mm).' };
      } else {
        return { meets: false, text: 'Below precordial V2-V3 STEMI cutoffs (≥1.5 mm Women, ≥2.0 mm Men ≥40, ≥2.5 mm Men <40).' };
      }
    } else if (['V3R', 'V4R', 'V7', 'V8', 'V9'].includes(lead)) {
      if (deviationMm >= 0.5) {
        return { meets: true, text: 'Meets Supplemental Lead criteria (≥ 0.5 mm ST elevation).' };
      }
      return { meets: false, text: 'Below supplemental lead cutoff (≥ 0.5 mm).' };
    } else {
      if (deviationMm >= 1.0) {
        return { meets: true, text: 'Meets standard STEMI criteria (≥ 1.0 mm in ≥ 2 contiguous leads).' };
      } else if (deviationMm <= -1.0) {
        return { meets: true, text: 'Significant reciprocal ST depression (≥ 1.0 mm mirror image).' };
      }
      return { meets: false, text: 'Within normal limits (< 1.0 mm standard threshold).' };
    }
  };

  const currentDev = delta?.stElevationMm || 0;
  const evalResult = getClinicalThresholdEvaluation(currentDev);

  // SVG grid lines definition
  const minorYLines: number[] = [];
  for (let y = 12; y <= 308; y += 8) {
    minorYLines.push(y);
  }
  const majorYLines = [20, 60, 100, 140, 180, 220, 260, 300];

  const minorXLines: number[] = [];
  for (let x = 18; x <= 590; x += 24.5) {
    minorXLines.push(x);
  }
  const majorXLines: number[] = [];
  for (let x = 18; x <= 590; x += 122.5) {
    majorXLines.push(x);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
        isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Modal Header */}
        <div className={`flex flex-wrap items-center justify-between px-6 py-4 border-b gap-3 ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/50 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
              isBright ? 'bg-rose-100 border border-rose-300 text-rose-700' : 'bg-rose-600/30 border border-rose-500/50 text-rose-300'
            }`}>
              {lead}
            </span>
            <div>
              <h2 className={`text-lg font-bold ${isBright ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
                Lead {lead} Magnified Waveform Analysis
              </h2>
              <span className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                Pattern: <strong className={theme.accentText}>{territory.name}</strong> • Calibrated 25 mm/s • 10 mm/mV
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Animation Toggle Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
                isPlaying
                  ? `${theme.accentBg} ${theme.accentHoverBg} shadow`
                  : isBright ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Sweep' : 'Live Sweep'}
            </button>

            {isPlaying && (
              <button
                onClick={() => setSweepTime(0)}
                className={`p-1.5 rounded-lg border transition ${
                  isBright ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Reset sweep"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

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
          <div className={`relative rounded-xl border p-2 overflow-hidden select-none ${
            paperMode === 'paper'
              ? 'bg-[#fff9f5] border-rose-200'
              : 'bg-[#080d1a] border-slate-800'
          }`}>
            {/* Calibration Legend */}
            <div className="absolute top-2 left-4 z-10 flex items-center gap-4 text-[11px] font-mono pointer-events-none">
              <span className={paperMode === 'paper' ? 'text-rose-900 font-bold' : 'text-slate-300'}>
                Paper Speed: 25 mm/s (1 small box = 0.04s)
              </span>
              <span className={paperMode === 'paper' ? 'text-rose-900 font-bold' : 'text-slate-300'}>
                Voltage: 10 mm/mV (1 small box = 0.1 mV / 1 mm)
              </span>
            </div>

            {/* SVG High-Res Waveform */}
            <svg
              viewBox="0 0 600 320"
              className="w-full h-auto cursor-crosshair block"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const svgY = (clickY / rect.height) * 320;
                // Baseline 0 mV is at Y = 180. 1 mV = 80px => 0.1 mV (1 mm) = 8px
                const deviationMv = (180 - svgY) / 80;
                setCaliperMm(parseFloat((deviationMv * 10).toFixed(1)));
              }}
            >
              {/* Minor Grid Lines (1 mm) */}
              {minorYLines.map(y => (
                <line
                  key={`min-y-${y}`}
                  x1="0"
                  y1={y}
                  x2="600"
                  y2={y}
                  stroke={paperMode === 'paper' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 58, 138, 0.30)'}
                  strokeWidth="0.5"
                />
              ))}
              {minorXLines.map(x => (
                <line
                  key={`min-x-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="320"
                  stroke={paperMode === 'paper' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 58, 138, 0.30)'}
                  strokeWidth="0.5"
                />
              ))}

              {/* Major Grid Lines (5 mm = 1 large box) */}
              {majorYLines.map(y => (
                <line
                  key={`maj-y-${y}`}
                  x1="0"
                  y1={y}
                  x2="600"
                  y2={y}
                  stroke={paperMode === 'paper' ? 'rgba(225, 29, 72, 0.40)' : 'rgba(37, 99, 235, 0.50)'}
                  strokeWidth="0.9"
                />
              ))}
              {majorXLines.map(x => (
                <line
                  key={`maj-x-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="320"
                  stroke={paperMode === 'paper' ? 'rgba(225, 29, 72, 0.40)' : 'rgba(37, 99, 235, 0.50)'}
                  strokeWidth="0.9"
                />
              ))}

              {/* Isoelectric PR/TP Baseline Line (0.0 mV) */}
              <line
                x1="10"
                y1="180"
                x2="590"
                y2="180"
                stroke={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                strokeWidth="1.2"
                strokeDasharray="4,3"
                opacity="0.8"
              />
              <text
                x="85"
                y="175"
                fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                fontSize="9"
                fontWeight="700"
                opacity="0.9"
              >
                Isoelectric Baseline (0 mV / PR Segment)
              </text>

              {/* Standard Calibration Pulse (10 mm = 1.0 mV high = 80px, 0.20s = 5 mm wide = 40px) */}
              <path
                d="M 25 180 L 25 100 L 65 100 L 65 180"
                fill="none"
                stroke={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                strokeWidth="2"
              />
              <text x="45" y="95" textAnchor="middle" fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'} fontSize="8" fontWeight="bold">
                1.0 mV
              </text>

              {/* Normal Baseline Comparison Waveform (Dashed gray/slate) */}
              {showNormalComparison && (
                <path
                  d={normalPathD}
                  fill="none"
                  stroke={paperMode === 'paper' ? '#94a3b8' : '#64748b'}
                  strokeWidth="2"
                  strokeDasharray="4,3"
                  opacity="0.85"
                />
              )}

              {/* Active Abnormal Waveform */}
              <path
                d={abnormalPathD}
                fill="none"
                stroke={
                  delta?.stElevationMm && delta.stElevationMm > 0
                    ? (paperMode === 'paper' ? '#dc2626' : '#f87171')
                    : delta?.stElevationMm && delta.stElevationMm < 0
                    ? (paperMode === 'paper' ? '#0284c7' : '#38bdf8')
                    : (paperMode === 'paper' ? '#0f172a' : '#38bdf8')
                }
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Live Sweep Beam & Cursor Point */}
              {isPlaying && (
                <g>
                  <line
                    x1={currentCursorX}
                    y1={0}
                    x2={currentCursorX}
                    y2={320}
                    stroke={paperMode === 'paper' ? '#ea580c' : '#22d3ee'}
                    strokeWidth="1.6"
                    opacity="0.9"
                  />
                  <circle
                    cx={currentCursorX}
                    cy={currentCursorY}
                    r="4"
                    fill={paperMode === 'paper' ? '#ea580c' : '#ffffff'}
                  />
                  <circle
                    cx={currentCursorX}
                    cy={currentCursorY}
                    r="7"
                    fill="none"
                    stroke={paperMode === 'paper' ? 'rgba(234, 88, 12, 0.4)' : 'rgba(34, 211, 238, 0.6)'}
                    strokeWidth="1.8"
                    className="animate-pulse"
                  />
                </g>
              )}

              {/* Landmark Clickable Circles & Badges */}
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
                        r="9"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                    <circle
                      cx={lx}
                      cy={ly}
                      r={isActive ? 5.5 : 3.8}
                      fill={isActive ? '#fbbf24' : '#ffffff'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                    <text
                      x={lx}
                      y={ly - 8}
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
                  {/* Caliper level dashed line */}
                  <line
                    x1="20"
                    y1={voltToY(caliperMm * 0.1)}
                    x2="580"
                    y2={voltToY(caliperMm * 0.1)}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  {/* Caliper measurement bracket */}
                  <line
                    x1="320"
                    y1="180"
                    x2="320"
                    y2={voltToY(caliperMm * 0.1)}
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <rect
                    x="325"
                    y={Math.min(180, voltToY(caliperMm * 0.1)) - 10}
                    width="148"
                    height="26"
                    rx="5"
                    fill={paperMode === 'paper' ? '#ecfdf5' : '#064e3b'}
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <text
                    x="332"
                    y={Math.min(180, voltToY(caliperMm * 0.1)) + 7}
                    fill={paperMode === 'paper' ? '#065f46' : '#a7f3d0'}
                    fontSize="9.5"
                    fontWeight="bold"
                  >
                    Measured: {caliperMm > 0 ? '+' : ''}{caliperMm} mm ({(caliperMm * 0.1).toFixed(2)} mV)
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Caliper & Diagnosis Info Pill */}
          <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl text-xs border ${
            isBright ? 'bg-slate-100/90 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isBright ? 'text-slate-800' : 'text-slate-300'}`}>Measured J-Point Status:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  currentDev > 0
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : currentDev < 0
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : isBright ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {currentDev > 0 ? '+' : ''}{currentDev.toFixed(1)} mm ({(currentDev * 0.1).toFixed(2)} mV)
              </span>
            </div>

            <div className={`flex items-center gap-2 text-[11px] ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              {evalResult.meets ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {evalResult.text}
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> {evalResult.text}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Landmark Inspection Bar */}
          <div className={`flex flex-wrap items-center gap-1.5 border-b pb-3 ${
            isBright ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <span className={`text-xs font-medium mr-1 flex items-center gap-1 ${
              isBright ? 'text-slate-700' : 'text-slate-400'
            }`}>
              <ZoomIn className="w-3.5 h-3.5 text-cyan-500" /> Inspect Landmark:
            </span>
            {landmarks.map(lm => (
              <button
                key={lm.code}
                onClick={() => setActiveLandmarkCode(lm.code)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition border ${
                  activeLandmarkCode === lm.code
                    ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/60 shadow'
                    : isBright
                    ? 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {lm.name} ({lm.code})
              </button>
            ))}
          </div>

          {/* Active Landmark Information Box */}
          <div className={`border rounded-xl p-4 space-y-2 ${
            isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-600 dark:text-amber-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" />
                {activeLandmark.name} ({activeLandmark.code})
              </h4>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isBright ? 'bg-white text-slate-700 border-slate-300' : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}>
                Landmark Voltage: {(activeLandmark.voltageMv).toFixed(2)} mV ({(activeLandmark.voltageMv * 10).toFixed(1)} mm)
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
              {activeLandmark.description}
            </p>
          </div>

          {/* Lead Specific Clinical Status in Active MI Territory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800 text-slate-200'
            }`}>
              <span className="font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide text-[11px] block">
                Lead Role in {territory.name}:
              </span>
              <p className={isBright ? 'text-slate-700' : 'text-slate-300'}>
                {territory.primaryLeads.includes(lead) ? (
                  <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PRIMARY contiguous injury lead (ST elevation).
                  </span>
                ) : territory.reciprocalLeads.includes(lead) ? (
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> RECIPROCAL mirror injury lead (ST depression / reciprocal changes).
                  </span>
                ) : (
                  <span className={isBright ? 'text-slate-500' : 'text-slate-400'}>
                    Non-infarct baseline reference lead in this selected territory.
                  </span>
                )}
              </p>
              {delta?.stElevationMm !== undefined && delta.stElevationMm !== 0 && (
                <div className={`mt-1 font-medium ${isBright ? 'text-slate-900' : 'text-slate-200'}`}>
                  Target ST Deviation: <strong className={isBright ? 'text-slate-900' : 'text-white'}>{delta.stElevationMm > 0 ? '+' : ''}{delta.stElevationMm} mm ({(delta.stElevationMm * 0.1).toFixed(2)} mV)</strong> ({delta.stSlope || (delta.stElevationMm > 0 ? 'convex' : 'horizontal')}).
                </div>
              )}
            </div>

            <div className={`p-3 rounded-xl border space-y-1.5 ${
              isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800 text-slate-200'
            }`}>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide text-[11px] block">
                Caliper & J-Point Measurement Guide:
              </span>
              <p className={`leading-snug ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
                Click anywhere on the ECG grid above to position the electronic caliper and measure elevation/depression relative to the isoelectric PR segment baseline.
              </p>
              <div className={`text-[11px] pt-1 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                Per 2025 ACC/AHA & 2023 ESC guidelines, STEMI criteria strictly require measurement at the <strong className="text-amber-600 dark:text-amber-300">J point</strong> relative to the preceding <strong className="text-cyan-600 dark:text-cyan-300">PR segment</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
