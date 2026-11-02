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

interface CaliperMeasurement {
  x: number;
  y: number;
  mm: number;
  mv: number;
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
  const [caliper, setCaliper] = useState<CaliperMeasurement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sweepTime, setSweepTime] = useState(0);

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const territory = MI_TERRITORIES[territoryId] || MI_TERRITORIES['normal'];
  const delta = territory.waveformDeltas[lead];
  const landmarks = getCycleLandmarks(lead, territoryId, 75);
  const activeLandmark = landmarks.find(l => l.code === activeLandmarkCode) || landmarks[0];

  // Calibrated Clinical Coordinate System:
  // ViewBox: 0 0 720 360
  // Standard calibration: 10 mm/mV -> 1 mm = 0.1 mV = 10 px; 10 mm = 1.0 mV = 100 px.
  // Standard paper speed: 25 mm/s -> 1 mm = 0.04 s = 10 px; 5 mm = 0.20 s = 50 px; 250 px/second.
  // Both X and Y axes have strictly 1:1 isometric square grid boxes (10px x 10px minor; 50px x 50px major).
  //
  // Layout along horizontal X axis:
  // - Calibration pulse: X = 20 to 70 (width 50 px = 0.20s = 1 large box; height 100 px = 1.0 mV = 2 large boxes).
  // - Isoelectric connector: X = 70 to 90 (20 px = 2 mm).
  // - Waveform recording: X = 90 to 690 (600 px = 60 mm = 12 large boxes = 2.40s = 3 complete cardiac cycles at 75 bpm).
  //   - Cycle 1: X = 90 to 290 (200 px = 0.80s = 4 large boxes). Annotated with interactive landmark pins.
  //   - Cycle 2: X = 290 to 490 (200 px = 0.80s).
  //   - Cycle 3: X = 490 to 690 (200 px = 0.80s).
  // - Isoelectric runout: X = 690 to 710.
  //
  // Layout along vertical Y axis:
  // - Height: 360 px (36 mm = 3.6 mV = 7.2 large boxes).
  // - Isoelectric PR segment baseline: strictly centered at Y = 200 (major grid line).
  // - Headroom above baseline: from Y = 200 to Y = 0 is 200 px = 2.0 mV (20 mm = 4 large boxes).
  //   Safely accommodates tall R waves (Lead II, V4, V5 up to 1.45 mV) + acute STEMI ST elevation (+0.6 mV) without clipping.
  // - Headroom below baseline: from Y = 200 to Y = 360 is 160 px = 1.6 mV (16 mm = 3.2 large boxes).
  //   Safely accommodates deep S waves (V1, V2 down to -1.45 mV) without clipping.
  const timeToX = (t: number) => 90 + t * 250;
  const voltToY = (v: number) => 200 - v * 100;

  const totalRecordingSec = 2.40; // 3 cardiac cycles at 75 bpm (0.8s each)

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

      setSweepTime(prev => (prev + deltaSec) % totalRecordingSec);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  // Generate SVG path points with high sampling density for smooth curves across all 3 cycles
  // ECG waveform begins at X = 90 (connecting cleanly to calibration pulse lead-in at baseline Y = 200)
  const abnormalPoints: string[] = ['90,200'];
  const normalPoints: string[] = ['90,200'];

  const sampleCount = 600; // 1 sample per pixel = 4.0 ms per sample (sub-millimeter precision)
  for (let i = 0; i <= sampleCount; i++) {
    const t = (i / sampleCount) * totalRecordingSec;
    const x = timeToX(t);

    const vAbnormal = getEcgVoltage(lead, t, territoryId, 75);
    const yAbnormal = voltToY(vAbnormal);
    abnormalPoints.push(`${x.toFixed(1)},${yAbnormal.toFixed(1)}`);

    if (showNormalComparison && territoryId !== 'normal') {
      const vNormal = getEcgVoltage(lead, t, 'normal', 75);
      const yNormal = voltToY(vNormal);
      normalPoints.push(`${x.toFixed(1)},${yNormal.toFixed(1)}`);
    }
  }

  // Connect to end of strip
  abnormalPoints.push('710,200');
  if (showNormalComparison && territoryId !== 'normal') {
    normalPoints.push('710,200');
  }

  const abnormalPathD = `M ${abnormalPoints.join(' L ')}`;
  const normalPathD = showNormalComparison && territoryId !== 'normal' ? `M ${normalPoints.join(' L ')}` : '';

  // Sweep cursor position
  const currentCursorX = timeToX(sweepTime);
  const currentCursorVoltage = getEcgVoltage(lead, sweepTime, territoryId, 75);
  const currentCursorY = voltToY(currentCursorVoltage);
  const normalCursorVoltage = getEcgVoltage(lead, sweepTime, 'normal', 75);
  const normalCursorY = voltToY(normalCursorVoltage);

  // When Live Sweep is active, partition the abnormal waveform:
  // - Swept trace (x <= currentCursorX): active clinical injury color (red / cyan)
  // - Unswept trace (x > currentCursorX): inactive gray ahead of the orange sweep cursor
  const isSweepActive = isPlaying || sweepTime > 0;

  const sweptPoints: string[] = ['90,200'];
  const unsweptPoints: string[] = [`${currentCursorX.toFixed(1)},${currentCursorY.toFixed(1)}`];

  for (let i = 0; i <= sampleCount; i++) {
    const t = (i / sampleCount) * totalRecordingSec;
    const x = timeToX(t);
    const vAbnormal = getEcgVoltage(lead, t, territoryId, 75);
    const yAbnormal = voltToY(vAbnormal);
    const pt = `${x.toFixed(1)},${yAbnormal.toFixed(1)}`;

    if (x < currentCursorX) {
      sweptPoints.push(pt);
    } else if (x > currentCursorX) {
      unsweptPoints.push(pt);
    }
  }

  sweptPoints.push(`${currentCursorX.toFixed(1)},${currentCursorY.toFixed(1)}`);
  if (currentCursorX >= 690) {
    sweptPoints.push('710,200');
  }
  unsweptPoints.push('710,200');

  const sweptPathD = `M ${sweptPoints.join(' L ')}`;
  const unsweptPathD = `M ${unsweptPoints.join(' L ')}`;

  const isPrimary = territory.primaryLeads.includes(lead);
  const isReciprocal = territory.reciprocalLeads.includes(lead);

  const activeColor =
    (delta?.stElevationMm && delta.stElevationMm > 0) || (isPrimary && territoryId !== 'normal')
      ? (paperMode === 'paper' ? '#dc2626' : '#f87171')
      : (delta?.stElevationMm && delta.stElevationMm < 0) || (isReciprocal && territoryId !== 'normal')
      ? (paperMode === 'paper' ? '#0284c7' : '#38bdf8')
      : (paperMode === 'paper' ? '#0f172a' : '#38bdf8');

  const unsweptColor = paperMode === 'paper' ? '#94a3b8' : '#64748b';

  // Clinical guideline criteria evaluator for this lead
  const getClinicalThresholdEvaluation = (deviationMm: number) => {
    // 1. STEMI Mimic: Acute Pericarditis
    if (territoryId === 'pericarditis') {
      if (lead === 'aVR') {
        if (deviationMm <= -0.5) {
          return { meets: true, text: 'Meets Acute Pericarditis criteria (reciprocal ST depression and PR elevation in aVR; hallmark of subepicardial atrial injury).' };
        }
        return { meets: true, text: 'Reciprocal lead aVR in Acute Pericarditis: typically displays PR elevation and ST depression.' };
      }
      if (deviationMm >= 0.5) {
        return { meets: true, text: 'Meets Acute Pericarditis criteria (widespread concave "saddleback" ST elevation with PR depression; distinguishes from localized convex STEMI).' };
      }
      return { meets: false, text: 'ST segment deviation below pericarditis threshold in this lead.' };
    }

    // 2. STEMI Mimic: Benign Early Repolarization (BER)
    if (territoryId === 'early_repolarization') {
      if (deviationMm >= 0.5) {
        return { meets: true, text: 'Benign Early Repolarization (normal variant): concave ST elevation with characteristic J-point notching / fishhook slur and absence of reciprocal ST depression.' };
      }
      return { meets: false, text: 'Within physiological baseline limits for Benign Early Repolarization.' };
    }

    // 3. Normal Baseline
    if (territoryId === 'normal') {
      if (Math.abs(deviationMm) < 0.5) {
        return { meets: true, text: 'Normal isoelectric baseline (< 0.5 mm physiological deviation relative to PR segment baseline).' };
      }
      return { meets: false, text: `Measured ${deviationMm > 0 ? '+' : ''}${deviationMm} mm deviation from normal isoelectric PR baseline.` };
    }

    // 4. Precordial leads V2 - V3
    if (lead === 'V2' || lead === 'V3') {
      if (deviationMm >= 2.5) {
        return { meets: true, text: 'Meets STEMI criteria for Men < 40 (≥ 2.5 mm), Men ≥ 40 (≥ 2.0 mm), and Women (≥ 1.5 mm).' };
      } else if (deviationMm >= 2.0) {
        return { meets: true, text: 'Meets STEMI criteria for Men ≥ 40 (≥ 2.0 mm) and Women (≥ 1.5 mm).' };
      } else if (deviationMm >= 1.5) {
        return { meets: true, text: 'Meets STEMI criteria for Women of all ages (≥ 1.5 mm).' };
      } else if (deviationMm <= -0.5) {
        return { meets: true, text: 'Meets Posterior STEMI reciprocal criteria (≥ 0.5 mm ST depression in V1–V3; verify in V7–V9!).' };
      } else {
        return { meets: false, text: 'Below precordial V2-V3 STEMI cutoffs (≥1.5 mm Women, ≥2.0 mm Men ≥40, ≥2.5 mm Men <40).' };
      }
    } else if (lead === 'V1') {
      if (deviationMm >= 1.0) {
        return { meets: true, text: 'Meets Septal / RV STEMI criteria (≥ 1.0 mm ST elevation in V1).' };
      } else if (deviationMm <= -0.5) {
        return { meets: true, text: 'Meets Posterior STEMI reciprocal criteria (≥ 0.5 mm ST depression in V1; verify in V7–V9!).' };
      }
      return { meets: false, text: 'Within normal limits (< 1.0 mm ST deviation in V1).' };
    } else if (['V3R', 'V4R'].includes(lead)) {
      if (deviationMm >= 0.5) {
        return { meets: true, text: 'Meets Right-Sided STEMI criteria (≥ 0.5 mm ST elevation; ≥ 1.0 mm in men < 30).' };
      }
      return { meets: false, text: 'Below right-sided lead cutoff (≥ 0.5 mm).' };
    } else if (['V7', 'V8', 'V9'].includes(lead)) {
      if (deviationMm >= 0.5) {
        return { meets: true, text: 'Meets Posterior STEMI criteria (≥ 0.5 mm ST elevation in supplemental V7–V9).' };
      }
      return { meets: false, text: 'Below posterior supplemental cutoff (≥ 0.5 mm).' };
    } else if (lead === 'aVR') {
      if (deviationMm >= 1.0) {
        return { meets: true, text: 'Meets Left Main / Proximal LAD occlusion criteria (ST elevation in aVR ≥ 1.0 mm with multi-lead ST depression).' };
      }
      return { meets: false, text: 'Within normal baseline limits in lead aVR.' };
    } else {
      if (deviationMm >= 1.0) {
        return { meets: true, text: 'Meets standard STEMI criteria (≥ 1.0 mm ST elevation in ≥ 2 contiguous leads).' };
      } else if (deviationMm <= -1.0) {
        return { meets: true, text: 'Significant reciprocal ST depression (≥ 1.0 mm mirror image injury).' };
      }
      return { meets: false, text: 'Within normal limits (< 1.0 mm standard threshold).' };
    }
  };

  const currentDev = delta?.stElevationMm || 0;
  const activeDev = caliper !== null ? caliper.mm : currentDev;
  const evalResult = getClinicalThresholdEvaluation(activeDev);

  // SVG grid lines definition (perfect 10px squares minor; 50px squares major)
  const minorYLines: number[] = [];
  for (let y = 10; y <= 350; y += 10) {
    minorYLines.push(y);
  }
  const majorYLines = [0, 50, 100, 150, 200, 250, 300, 350];

  const minorXLines: number[] = [];
  for (let x = 10; x <= 710; x += 10) {
    minorXLines.push(x);
  }
  const majorXLines: number[] = [];
  for (let x = 0; x <= 720; x += 50) {
    majorXLines.push(x);
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`border rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
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
                Pattern: <strong className={theme.accentText}>{territory.name}</strong> • Calibrated 25 mm/s • 10 mm/mV (1:1 Square Grid)
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

            {isSweepActive && (
              <button
                onClick={() => {
                  setSweepTime(0);
                  setIsPlaying(false);
                }}
                className={`p-1.5 rounded-lg border transition ${
                  isBright ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
                title="Reset sweep to start"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {territoryId !== 'normal' && (
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
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close modal"
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

            {/* SVG High-Res Waveform with 1:1 isometric square grid */}
            <svg
              viewBox="0 0 720 360"
              className="w-full h-auto cursor-crosshair block touch-none"
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const svgX = (clickX / rect.width) * 720;
                const svgY = (clickY / rect.height) * 360;
                // Baseline 0 mV is at Y = 200. 1 mV = 100px => 0.1 mV (1 mm) = 10px
                const devMv = (200 - svgY) / 100;
                const devMm = parseFloat((devMv * 10).toFixed(1));
                setCaliper({ x: svgX, y: svgY, mm: devMm, mv: devMv });
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                const svgX = (clickX / rect.width) * 720;
                const svgY = (clickY / rect.height) * 360;
                // Baseline 0 mV is at Y = 200. 1 mV = 100px => 0.1 mV (1 mm) = 10px
                const devMv = (200 - svgY) / 100;
                const devMm = parseFloat((devMv * 10).toFixed(1));
                setCaliper({ x: svgX, y: svgY, mm: devMm, mv: devMv });
              }}
            >
              {/* Minor Grid Lines (1 mm / 0.04s / 0.1 mV) */}
              {minorYLines.map(y => (
                <line
                  key={`min-y-${y}`}
                  x1="0"
                  y1={y}
                  x2="720"
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
                  y2="360"
                  stroke={paperMode === 'paper' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(30, 58, 138, 0.30)'}
                  strokeWidth="0.5"
                />
              ))}

              {/* Major Grid Lines (5 mm = 1 large box = 0.20s / 0.5 mV) */}
              {majorYLines.map(y => (
                <line
                  key={`maj-y-${y}`}
                  x1="0"
                  y1={y}
                  x2="720"
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
                  y2="360"
                  stroke={paperMode === 'paper' ? 'rgba(225, 29, 72, 0.40)' : 'rgba(37, 99, 235, 0.50)'}
                  strokeWidth="0.9"
                />
              ))}

              {/* Isoelectric PR/TP Baseline Line (0.0 mV) */}
              <line
                x1="10"
                y1="200"
                x2="710"
                y2="200"
                stroke={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                strokeWidth="1.2"
                strokeDasharray="4,3"
                opacity="0.8"
              />
              <text
                x="20"
                y="215"
                fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                fontSize="8.5"
                fontWeight="700"
                opacity="0.9"
              >
                0.0 mV Baseline
              </text>
              <text
                x="705"
                y="215"
                textAnchor="end"
                fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                fontSize="8.5"
                fontWeight="700"
                opacity="0.9"
              >
                PR Segment Isoelectric Reference (0 mV)
              </text>

              {/* Standard Calibration Pulse (10 mm = 1.0 mV high = 100px, 0.20s = 5 mm wide = 50px) */}
              <path
                d="M 20 200 L 20 100 L 70 100 L 70 200 L 90 200"
                fill="none"
                stroke={paperMode === 'paper' ? '#be123c' : '#38bdf8'}
                strokeWidth="2"
              />
              <text x="45" y="94" textAnchor="middle" fill={paperMode === 'paper' ? '#be123c' : '#38bdf8'} fontSize="8" fontWeight="bold">
                1.0 mV (0.20s)
              </text>

              {/* Normal Baseline Comparison Waveform (Dashed slate) */}
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

              {/* Active Abnormal Waveform (Swept in active color, Unswept in gray when Live Sweep is active) */}
              {isSweepActive ? (
                <g>
                  {/* Unswept waveform ahead of orange sweep cursor: displayed in clinical gray */}
                  <path
                    d={unsweptPathD}
                    fill="none"
                    stroke={unsweptColor}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Active fresh swept waveform up to orange sweep cursor: displayed in active injury color */}
                  <path
                    d={sweptPathD}
                    fill="none"
                    stroke={activeColor}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              ) : (
                <path
                  d={abnormalPathD}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Animated Live Sweep Beam & Cursor Point */}
              {isSweepActive && (
                <g>
                  <line
                    x1={currentCursorX}
                    y1={0}
                    x2={currentCursorX}
                    y2={360}
                    stroke={paperMode === 'paper' ? '#ea580c' : '#22d3ee'}
                    strokeWidth="1.6"
                    strokeDasharray={!isPlaying ? '3,3' : undefined}
                    opacity="0.9"
                  />
                  {/* Normal Reference Cursor Point (if comparing normal) */}
                  {showNormalComparison && territoryId !== 'normal' && (
                    <g>
                      <line
                        x1={currentCursorX}
                        y1={normalCursorY}
                        x2={currentCursorX}
                        y2={currentCursorY}
                        stroke={paperMode === 'paper' ? 'rgba(100, 116, 139, 0.6)' : 'rgba(148, 163, 184, 0.6)'}
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      <circle
                        cx={currentCursorX}
                        cy={normalCursorY}
                        r="3.5"
                        fill={paperMode === 'paper' ? '#64748b' : '#94a3b8'}
                      />
                    </g>
                  )}
                  {/* Active Waveform Cursor Point */}
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

              {/* Landmark Clickable Circles & Badges (Centered on Cycle 2) */}
              {landmarks.map(lm => {
                const lx = timeToX(lm.timeSec + 0.8);
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
                      stroke={paperMode === 'paper' ? '#fff9f5' : '#080d1a'}
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      paintOrder="stroke"
                      fontSize={isActive ? '10' : '8.5'}
                      fontWeight="bold"
                    >
                      {lm.code}
                    </text>
                  </g>
                );
              })}

              {/* Interactive Electronic Caliper anchored at clicked coordinates */}
              {caliper !== null && (
                <g>
                  {/* Caliper level dashed line across width */}
                  <line
                    x1="20"
                    y1={caliper.y}
                    x2="700"
                    y2={caliper.y}
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  {/* Vertical measurement bracket from baseline Y=200 to clicked Y at caliper.x */}
                  <line
                    x1={caliper.x}
                    y1="200"
                    x2={caliper.x}
                    y2={caliper.y}
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  {/* Top and bottom bracket ticks */}
                  <line
                    x1={caliper.x - 6}
                    y1="200"
                    x2={caliper.x + 6}
                    y2="200"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <line
                    x1={caliper.x - 6}
                    y1={caliper.y}
                    x2={caliper.x + 6}
                    y2={caliper.y}
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  {/* Caliper Floating Measurement Pill */}
                  <g transform={`translate(${Math.min(caliper.x + 10, 540)}, ${Math.min(200, caliper.y) + Math.abs(caliper.y - 200) / 2 - 12})`}>
                    <rect
                      x="0"
                      y="0"
                      width="160"
                      height="24"
                      rx="5"
                      fill={paperMode === 'paper' ? '#ecfdf5' : '#064e3b'}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      className="shadow-md"
                    />
                    <text
                      x="8"
                      y="16"
                      fill={paperMode === 'paper' ? '#065f46' : '#a7f3d0'}
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {caliper.mm > 0 ? '+' : ''}{caliper.mm} mm ({caliper.mv > 0 ? '+' : ''}{caliper.mv.toFixed(2)} mV)
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Caliper & Diagnosis Info Pill */}
          <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl text-xs border ${
            isBright ? 'bg-slate-100/90 border-slate-200 text-slate-800' : 'bg-slate-950/70 border-slate-800 text-slate-300'
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`font-semibold ${isBright ? 'text-slate-800' : 'text-slate-300'}`}>
                {caliper !== null ? 'Active Caliper Measurement:' : 'Programmed J-Point Deviation:'}
              </span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                  activeDev > 0
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : activeDev < 0
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : isBright ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300'
                }`}
              >
                {activeDev > 0 ? '+' : ''}{activeDev.toFixed(1)} mm ({(activeDev * 0.1).toFixed(2)} mV)
              </span>
              {caliper !== null && (
                <>
                  <span className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                    (Nominal: {currentDev > 0 ? '+' : ''}{currentDev.toFixed(1)} mm)
                  </span>
                  <button
                    onClick={() => setCaliper(null)}
                    className="text-[11px] text-emerald-500 hover:underline font-semibold"
                  >
                    Reset Caliper
                  </button>
                </>
              )}
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
                Click anywhere on the ECG grid above to place the electronic caliper and measure elevation/depression relative to the isoelectric PR segment baseline.
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
