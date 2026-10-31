import { useState, useEffect, useRef } from 'react';
import { MI_TERRITORIES } from '../data/miTerritories';
import { getEcgVoltage } from '../utils/ecgGenerator';
import LeadDetailModal from './LeadDetailModal';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Layers,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';

interface ECGWaveformMonitorProps {
  selectedTerritoryId: string;
  paperMode: 'dark' | 'paper';
  onTogglePaperMode: () => void;
}

export default function ECGWaveformMonitor({
  selectedTerritoryId,
  paperMode,
  onTogglePaperMode
}: ECGWaveformMonitorProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSupplemental, setShowSupplemental] = useState(false);
  const [showNormalOverlay, setShowNormalOverlay] = useState(true);
  const [detailLead, setDetailLead] = useState<string | null>(null);

  const territory = MI_TERRITORIES[selectedTerritoryId] || MI_TERRITORIES['normal'];

  // Animation time tracker
  const timeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Canvas elements refs
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  // 12 Leads in standard clinical 3x4 layout
  const standardLayout: string[][] = [
    ['I', 'aVR', 'V1', 'V4'],
    ['II', 'aVL', 'V2', 'V5'],
    ['III', 'aVF', 'V3', 'V6']
  ];

  const supplementalLeads = ['V3R', 'V4R', 'V7', 'V8', 'V9'];

  // Auto-enable supplemental leads view if posterior or right ventricular is selected
  useEffect(() => {
    if (selectedTerritoryId === 'posterior' || selectedTerritoryId === 'right_ventricular') {
      setShowSupplemental(true);
    }
  }, [selectedTerritoryId]);

  // Main synchronized rendering loop
  useEffect(() => {
    const render = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        timeRef.current += deltaSec * playbackSpeed;
      }

      // Leads to render
      const leadsToDraw = [
        ...standardLayout.flat(),
        'II_RHYTHM',
        ...(showSupplemental ? supplementalLeads : [])
      ];

      leadsToDraw.forEach(leadKey => {
        const canvas = canvasRefs.current[leadKey];
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Auto-scale canvas internal buffer for crisp High-DPI / Retina display
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetWidth = Math.floor(rect.width * dpr);
        const targetHeight = Math.floor(rect.height * dpr);

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        const actualLead = leadKey === 'II_RHYTHM' ? 'II' : leadKey;
        const delta = territory.waveformDeltas[actualLead];
        const isRhythmStrip = leadKey === 'II_RHYTHM';

        // Standard 25 mm/s paper speed & 10 mm/mV voltage calibration
        // Calibrate physical millimeter scale on screen to ensure tall R waves and deep S waves never clip:
        const targetMm = isRhythmStrip ? Math.max(150, w / 4.0) : 62.5; // 2.5s = 62.5 mm
        const smallBox = Math.max(3.5, Math.min(4.2, w / targetMm));
        const largeBox = smallBox * 5;
        const voltScale = smallBox * 10; // 1.0 mV = 10 mm = 10 small boxes
        const durationSec = isRhythmStrip ? (w / (smallBox * 25)) : 2.5;

        // Place isoelectric baseline (0.0 mV) strictly on a major horizontal grid line with anti-clipping clearance:
        // Lead II rhythm strip: 60% height gives 30+ px clearance above for tall Lead II R waves (1.25 mV)
        // 3x4 lead cards: 52% height balances clearance for tall R (V4-V5: 1.45 mV) and deep S (V1-V2: -1.45 mV)
        const baselineRatio = isRhythmStrip ? 0.60 : 0.52;
        const baselineRow = Math.max(1, Math.round((h * baselineRatio) / largeBox));
        const centerY = baselineRow * largeBox;

        // 1. Draw Calibrated ECG Grid directly on canvas
        ctx.fillStyle = paperMode === 'paper' ? '#fff9f5' : '#0a0f1d';
        ctx.fillRect(0, 0, w, h);

        // Minor grid lines (1 mm / 0.04s / 0.1 mV)
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = paperMode === 'paper' ? 'rgba(244, 63, 94, 0.18)' : 'rgba(30, 58, 138, 0.35)';
        ctx.beginPath();
        for (let x = 0; x <= w; x += smallBox) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let y = centerY % smallBox; y <= h; y += smallBox) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();

        // Major grid lines (5 mm / 0.20s / 0.5 mV)
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = paperMode === 'paper' ? 'rgba(225, 29, 72, 0.40)' : 'rgba(37, 99, 235, 0.55)';
        ctx.beginPath();
        for (let x = 0; x <= w; x += largeBox) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
        }
        for (let y = centerY % largeBox; y <= h; y += largeBox) {
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
        }
        ctx.stroke();

        // Isoelectric Baseline Guide (0.0 mV / PR Segment)
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = paperMode === 'paper' ? 'rgba(225, 29, 72, 0.65)' : 'rgba(56, 189, 248, 0.45)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(w, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Standard Calibration Pulse on Lead II rhythm strip: 10 mm (1.0 mV) high, 5 mm (0.20s) wide
        if (isRhythmStrip) {
          const pulseX = 6;
          const pulseW = largeBox;
          const pulseH = voltScale;
          ctx.lineWidth = 1.8;
          ctx.strokeStyle = paperMode === 'paper' ? '#be123c' : '#38bdf8';
          ctx.beginPath();
          ctx.moveTo(pulseX, centerY);
          ctx.lineTo(pulseX, centerY - pulseH);
          ctx.lineTo(pulseX + pulseW, centerY - pulseH);
          ctx.lineTo(pulseX + pulseW, centerY);
          ctx.stroke();

          ctx.fillStyle = paperMode === 'paper' ? '#be123c' : '#38bdf8';
          ctx.font = 'bold 8.5px monospace';
          ctx.fillText('1.0 mV', pulseX + 2, centerY - pulseH - 3);
        }

        // Calculate sweep position
        const sweepTime = timeRef.current % durationSec;
        const sweepX = (sweepTime / durationSec) * w;
        const eraseWidth = Math.max(14, w * 0.05);

        // 2. Draw Normal Reference Overlay (if enabled & current territory is abnormal)
        if (showNormalOverlay && selectedTerritoryId !== 'normal') {
          ctx.beginPath();
          ctx.strokeStyle = paperMode === 'paper' ? 'rgba(100, 116, 139, 0.70)' : 'rgba(148, 163, 184, 0.55)';
          ctx.lineWidth = 1.3;
          ctx.setLineDash([3, 3]);

          const maxNormalX = isPlaying ? sweepX : w;
          const normalSteps = Math.max(20, Math.floor(maxNormalX * 1.5));
          for (let i = 0; i <= normalSteps; i++) {
            const x = (i / normalSteps) * maxNormalX;
            const t = (x / w) * durationSec;
            const v = getEcgVoltage(actualLead, t, 'normal', 75);
            const y = centerY - v * voltScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Determine active waveform trace color
        let activeColor = paperMode === 'paper' ? '#0f172a' : '#38bdf8';
        if (delta?.stElevationMm && delta.stElevationMm > 0) {
          activeColor = paperMode === 'paper' ? '#dc2626' : '#f87171'; // Red for ST elevation
        } else if (delta?.stElevationMm && delta.stElevationMm < 0) {
          activeColor = paperMode === 'paper' ? '#0284c7' : '#38bdf8'; // Cyan for ST depression
        } else if (territory.reciprocalLeads.includes(actualLead)) {
          activeColor = paperMode === 'paper' ? '#0284c7' : '#38bdf8'; // Cyan for reciprocal
        }

        // 3. Draw Previous Cycle Trace (Beyond erase gap ahead of sweep beam)
        if (isPlaying && sweepX + eraseWidth < w) {
          ctx.beginPath();
          ctx.strokeStyle = paperMode === 'paper' ? 'rgba(15, 23, 42, 0.25)' : 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1.8;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';

          const startOldX = sweepX + eraseWidth;
          const oldSteps = Math.max(10, Math.floor((w - startOldX) * 1.5));
          for (let i = 0; i <= oldSteps; i++) {
            const x = startOldX + (i / oldSteps) * (w - startOldX);
            const t = (x / w) * durationSec;
            const v = getEcgVoltage(actualLead, t, selectedTerritoryId, 75);
            const y = centerY - v * voltScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // 4. Draw Active Fresh Trace (From x = 0 up to sweepX)
        let headY = centerY;
        const currentTraceWidth = isPlaying ? sweepX : w;

        if (currentTraceWidth > 0.5) {
          ctx.beginPath();
          ctx.strokeStyle = activeColor;
          ctx.lineWidth = 2.2;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';

          const activeSteps = Math.max(10, Math.floor(currentTraceWidth * 1.5));
          for (let i = 0; i <= activeSteps; i++) {
            const x = (i / activeSteps) * currentTraceWidth;
            const t = (x / w) * durationSec;
            const v = getEcgVoltage(actualLead, t, selectedTerritoryId, 75);
            const y = centerY - v * voltScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            if (i === activeSteps) {
              headY = y;
            }
          }
          ctx.stroke();
        }

        // 5. Draw Animated Sweep Cursor & Glowing Lead Head
        if (isPlaying) {
          // Vertical sweeping line
          ctx.beginPath();
          ctx.strokeStyle = paperMode === 'paper' ? '#ea580c' : '#22d3ee';
          ctx.lineWidth = 1.5;
          ctx.moveTo(sweepX, 0);
          ctx.lineTo(sweepX, h);
          ctx.stroke();

          // Glowing cursor point at current lead waveform voltage
          ctx.beginPath();
          ctx.arc(sweepX, headY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = paperMode === 'paper' ? '#ea580c' : '#ffffff';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(sweepX, headY, 6.5, 0, Math.PI * 2);
          ctx.strokeStyle = paperMode === 'paper' ? 'rgba(234, 88, 12, 0.4)' : 'rgba(34, 211, 238, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed, selectedTerritoryId, showNormalOverlay, paperMode, showSupplemental]);

  const handleReset = () => {
    timeRef.current = 0;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Trace'}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            title="Reset sweep animation to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 text-[11px]">Speed:</span>
            {[0.5, 1.0, 2.0].map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                  playbackSpeed === s
                    ? 'bg-rose-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Paper / Dark Mode Toggle */}
          <button
            onClick={onTogglePaperMode}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition"
          >
            {paperMode === 'paper' ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            {paperMode === 'paper' ? 'Dark Monitor View' : 'Pink ECG Paper View'}
          </button>

          {/* Normal Overlay Toggle */}
          <button
            onClick={() => setShowNormalOverlay(!showNormalOverlay)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
              showNormalOverlay
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Normal Baseline Overlay (Dashed)
          </button>
        </div>

        {/* Supplemental Leads Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSupplemental(!showSupplemental)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 ${
              showSupplemental
                ? 'bg-amber-950 border-amber-500/60 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showSupplemental ? 'Hide Supplemental Leads' : 'Show Supplemental (V3R-V4R, V7-V9)'}
          </button>
        </div>
      </div>

      {/* Grid Mode Container */}
      <div
        className={`rounded-xl border p-4 transition-colors select-none ${
          paperMode === 'paper'
            ? 'bg-[#fff9f5] border-rose-200 text-slate-900'
            : 'bg-[#080d1a] border-slate-800 text-slate-100'
        }`}
      >
        {/* Standard 3x4 Layout Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {standardLayout.map((column) =>
            column.map(leadName => {
              const delta = territory.waveformDeltas[leadName];
              const isPrimary = territory.primaryLeads.includes(leadName);
              const isReciprocal = territory.reciprocalLeads.includes(leadName);

              return (
                <div
                  key={leadName}
                  onClick={() => setDetailLead(leadName)}
                  className={`group relative rounded-lg border p-2 cursor-pointer transition shadow-sm hover:ring-2 hover:ring-rose-500 overflow-hidden ${
                    paperMode === 'paper'
                      ? 'bg-white/80 border-rose-200/90 shadow-rose-100/50'
                      : 'bg-slate-950/80 border-slate-800/90'
                  } ${
                    isPrimary ? 'ring-2 ring-rose-500 bg-rose-950/20' : isReciprocal ? 'ring-1 ring-cyan-500 bg-cyan-950/20' : ''
                  }`}
                >
                  {/* Lead Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm px-1.5 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                        {leadName}
                      </span>
                      {isPrimary && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                          PRIMARY
                        </span>
                      )}
                      {isReciprocal && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-700 text-white">
                          RECIPROCAL
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {delta?.stElevationMm !== undefined && delta.stElevationMm !== 0 && (
                        <span
                          className={`font-mono text-xs font-bold ${
                            delta.stElevationMm > 0 ? 'text-rose-500' : 'text-cyan-400'
                          }`}
                        >
                          {delta.stElevationMm > 0 ? '+' : ''}{delta.stElevationMm} mm
                        </span>
                      )}
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                    </div>
                  </div>

                  {/* Animated Lead Canvas */}
                  <canvas
                    ref={el => { canvasRefs.current[leadName] = el; }}
                    className="w-full h-28 sm:h-30 block rounded"
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Lead II Continuous Rhythm Strip at Bottom */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5 px-2">
            <span className="font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                Lead II (Continuous Rhythm Strip • 25 mm/s • 10 mm/mV)
              </span>
              <span className="text-[11px] font-normal opacity-75">
                Evaluates baseline rhythm, P waves, PR interval, and underlying rate
              </span>
            </span>

            <button
              onClick={() => setDetailLead('II')}
              className="text-xs text-rose-500 hover:underline flex items-center gap-1 font-semibold"
            >
              <Maximize2 className="w-3 h-3" /> Inspect Lead II
            </button>
          </div>

          <div className={`rounded-lg border p-1 overflow-hidden ${
            paperMode === 'paper' ? 'bg-white/80 border-rose-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <canvas
              ref={el => { canvasRefs.current['II_RHYTHM'] = el; }}
              className="w-full h-36 sm:h-40 block rounded"
            />
          </div>
        </div>

        {/* Supplemental Leads Row (V3R, V4R, V7, V8, V9) */}
        {showSupplemental && (
          <div className="mt-4 pt-3 border-t-2 border-dashed border-amber-500/40">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-600 text-white font-bold font-mono text-xs rounded">
                  Supplemental Leads
                </span>
                <span className="text-xs text-amber-500 font-semibold">
                  Right-Sided (V3R, V4R) & Posterior (V7, V8, V9)
                </span>
              </div>
              <span className="text-[11px] opacity-75">
                Click any lead to enlarge & measure J-point deviation
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {supplementalLeads.map(leadName => {
                const delta = territory.waveformDeltas[leadName];
                const isPrimary = territory.primaryLeads.includes(leadName);

                return (
                  <div
                    key={leadName}
                    onClick={() => setDetailLead(leadName)}
                    className={`group relative rounded-lg border p-2 cursor-pointer transition shadow-sm hover:ring-2 hover:ring-amber-500 overflow-hidden ${
                      paperMode === 'paper'
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-amber-950/20 border-amber-800/60'
                    } ${isPrimary ? 'ring-2 ring-amber-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                        {leadName}
                      </span>
                      {delta?.stElevationMm !== undefined && delta.stElevationMm !== 0 && (
                        <span
                          className={`font-mono text-xs font-bold ${
                            delta.stElevationMm > 0 ? 'text-amber-500' : 'text-cyan-400'
                          }`}
                        >
                          {delta.stElevationMm > 0 ? '+' : ''}{delta.stElevationMm} mm
                        </span>
                      )}
                    </div>

                    <canvas
                      ref={el => { canvasRefs.current[leadName] = el; }}
                      className="w-full h-28 block rounded"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Magnified Modal Inspection */}
      {detailLead && (
        <LeadDetailModal
          lead={detailLead}
          territoryId={selectedTerritoryId}
          paperMode={paperMode}
          onClose={() => setDetailLead(null)}
        />
      )}
    </div>
  );
}
