import { useState, useEffect, useRef } from 'react';
import { MI_TERRITORIES } from '../data/miTerritories';
import { getEcgVoltage } from '../utils/ecgGenerator';
import LeadDetailModal from './LeadDetailModal';
import { useTheme } from '../context/ThemeContext';
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
  const { theme, isBright } = useTheme();
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showSupplemental, setShowSupplemental] = useState(false);
  const [showNormalOverlay, setShowNormalOverlay] = useState(false);
  const [detailLead, setDetailLead] = useState<string | null>(null);

  const territory = MI_TERRITORIES[selectedTerritoryId] || MI_TERRITORIES['normal'];

  // Animation time tracker
  const timeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Canvas elements refs
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  // Clinically sorted lead list:
  // Mobile: single column; tablet portrait: 2 columns; desktop / tablet landscape: standard 3x4 layout.
  // Tablet columns: limb leads in column 1, augmented leads in column 2, then precordial leads.
  // Desktop columns: I/II/III | aVR/aVL/aVF | V1/V2/V3 | V4/V5/V6.
  const clinicalOrderedLeads: { name: string; gridClass: string }[] = [
    { name: 'I', gridClass: 'md:col-start-1 md:row-start-1 lg:col-start-1 lg:row-start-1' },
    { name: 'II', gridClass: 'md:col-start-1 md:row-start-2 lg:col-start-1 lg:row-start-2' },
    { name: 'III', gridClass: 'md:col-start-1 md:row-start-3 lg:col-start-1 lg:row-start-3' },
    { name: 'aVR', gridClass: 'md:col-start-2 md:row-start-1 lg:col-start-2 lg:row-start-1' },
    { name: 'aVL', gridClass: 'md:col-start-2 md:row-start-2 lg:col-start-2 lg:row-start-2' },
    { name: 'aVF', gridClass: 'md:col-start-2 md:row-start-3 lg:col-start-2 lg:row-start-3' },
    { name: 'V1', gridClass: 'md:col-start-1 md:row-start-4 lg:col-start-3 lg:row-start-1' },
    { name: 'V2', gridClass: 'md:col-start-1 md:row-start-5 lg:col-start-3 lg:row-start-2' },
    { name: 'V3', gridClass: 'md:col-start-1 md:row-start-6 lg:col-start-3 lg:row-start-3' },
    { name: 'V4', gridClass: 'md:col-start-2 md:row-start-4 lg:col-start-4 lg:row-start-1' },
    { name: 'V5', gridClass: 'md:col-start-2 md:row-start-5 lg:col-start-4 lg:row-start-2' },
    { name: 'V6', gridClass: 'md:col-start-2 md:row-start-6 lg:col-start-4 lg:row-start-3' },
  ];

  const supplementalLeads = ['V3R', 'V4R', 'V7', 'V8', 'V9'];

  // Auto-enable supplemental leads view if posterior or right ventricular is selected
  useEffect(() => {
    if (selectedTerritoryId === 'posterior' || selectedTerritoryId === 'right_ventricular') {
      setShowSupplemental(true);
    }
  }, [selectedTerritoryId]);

  // Main synchronized rendering loop with rock-solid, jitter-free fixed pixel sampling
  useEffect(() => {
    const render = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const rawDelta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;
      const deltaSec = Math.min(0.1, Math.max(0, rawDelta));

      if (isPlaying) {
        timeRef.current += deltaSec * playbackSpeed;
      }

      // Leads to render
      const leadsToDraw = [
        ...clinicalOrderedLeads.map(l => l.name),
        'II_RHYTHM',
        ...(showSupplemental ? supplementalLeads : [])
      ];

      // Unified clinical calibration:
      // Measure standard lead card width (Lead I or Lead II) to determine the unified millimeter scale.
      // Standard 12-lead ECG calibration: 25 mm/s paper speed, 10 mm/mV gain.
      // All leads (12-lead matrix, rhythm strip, supplemental leads) MUST share this identical millimeter scale
      // so waveforms are never disproportionately shrunken or distorted across devices.
      const stdCanvas = canvasRefs.current['I'] || canvasRefs.current['II'];
      const stdRect = stdCanvas?.getBoundingClientRect();
      const stdWidth = stdRect && stdRect.width > 0 ? stdRect.width : 0;
      // In desktop 3x4 matrix (4 cols), standard lead width is ~240-300px -> ~4.2-5.0 px/mm.
      // On mobile (1 col), standard lead width is ~340-390px -> ~5.0-5.8 px/mm.
      // On tablet (4 cols), standard lead width is ~160-180px -> clamp to minimum 4.6 px/mm so waveforms are never compressed.
      const baseSmallBox = stdWidth > 0 ? (stdWidth / 60.0) : 4.8;
      const unifiedSmallBox = Math.max(4.6, Math.min(5.6, baseSmallBox));

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
        // All leads share the unified scale so grid boxes and voltage gain are square and identical across leads
        const smallBox = unifiedSmallBox;
        const largeBox = smallBox * 5;
        const voltScale = smallBox * 10; // 1.0 mV = 10 mm = 10 small boxes

        // Calibrated Anti-Clipping Baseline:
        // Ensure at least 1.6 mV headroom below baseline for deep S waves (V1-V2: -1.45 mV)
        // and at least 1.8 mV headroom above baseline for tall R waves (Lead II, V4, V5: +1.45 mV) + STEMI elevation.
        const minHeadroomDown = 1.60 * voltScale;
        let baselineRow = Math.max(1, Math.round((h * (isRhythmStrip ? 0.54 : 0.52)) / largeBox));
        while (h - (baselineRow * largeBox) < minHeadroomDown && baselineRow > 1) {
          baselineRow--;
        }
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

        // Rhythm strip calibration pulse lead-in: exactly 20.0 mm (4 large boxes = 0.80s = 1 complete cardiac cycle)
        // This guarantees that beats across the rhythm strip and 12-lead boxes are in 100% synchronous phase lock!
        const stripLeadInMm = 20.0;
        const stripLeadInPx = isRhythmStrip ? (stripLeadInMm * smallBox) : 0;

        const pulseX = smallBox * 2.5;
        const pulseW = largeBox;
        const pulseH = voltScale;

        // Standard Calibration Pulse on Lead II rhythm strip: 10 mm (1.0 mV) high, 5 mm (0.20s) wide
        if (isRhythmStrip) {
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

        // Trace voltage sampler calibrated to exact 25 mm/s paper speed
        const getTraceVoltage = (x: number, territoryKey: string) => {
          if (isRhythmStrip && x < stripLeadInPx) {
            // Actively trace the 1.0 mV calibration pulse during lead-in
            if (x >= pulseX && x <= pulseX + pulseW) {
              return 1.0;
            }
            return 0.0;
          }
          const t = isRhythmStrip
            ? (x - stripLeadInPx) / (smallBox * 25)
            : (x / (smallBox * 25));
          return getEcgVoltage(actualLead, t, territoryKey, 75);
        };

        // Electrophysiologically Synchronized Sweep Duration:
        // Standard and supplemental leads show exactly 3 complete cardiac cycles (2.40s at 75 bpm = 60 mm at 25 mm/s).
        // Continuous Lead II rhythm strip shows exactly 12 complete cardiac cycles (9.60s = 4 x 2.40s = 240 mm at 25 mm/s).
        // This harmonic 4:1 phase lock guarantees that standard leads wrap cleanly without mid-beat cutting,
        // and all leads remain in 100% synchronous cardiac phase indefinitely without subpixel drift!
        const durationSec = isRhythmStrip ? 9.60 : 2.40;
        const sweepTime = timeRef.current % durationSec;
        const sweepX = (sweepTime / durationSec) * w;
        const eraseWidth = Math.max(14, w * 0.04);

        // Fixed 1.0 CSS pixel increment ensures rock-solid, jitter-free waveform rendering
        const stepPx = 1.0;

        // 2. Draw Normal Reference Overlay (if enabled & current territory is abnormal)
        if (showNormalOverlay && selectedTerritoryId !== 'normal') {
          ctx.beginPath();
          ctx.strokeStyle = paperMode === 'paper' ? 'rgba(100, 116, 139, 0.70)' : 'rgba(148, 163, 184, 0.55)';
          ctx.lineWidth = 1.3;
          ctx.setLineDash([3, 3]);

          const maxNormalX = w;
          for (let x = 0; x <= maxNormalX; x += stepPx) {
            const v = getTraceVoltage(x, 'normal');
            const y = centerY - v * voltScale;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Determine active waveform trace color
        let activeColor = paperMode === 'paper' ? '#0f172a' : '#38bdf8';
        let oldColor = paperMode === 'paper' ? 'rgba(15, 23, 42, 0.25)' : 'rgba(56, 189, 248, 0.25)';
        if (delta?.stElevationMm && delta.stElevationMm > 0) {
          activeColor = paperMode === 'paper' ? '#dc2626' : '#f87171'; // Red for ST elevation
          oldColor = paperMode === 'paper' ? 'rgba(220, 38, 38, 0.25)' : 'rgba(248, 113, 113, 0.25)';
        } else if ((delta?.stElevationMm && delta.stElevationMm < 0) || territory.reciprocalLeads.includes(actualLead)) {
          activeColor = paperMode === 'paper' ? '#0284c7' : '#38bdf8'; // Cyan for ST depression / reciprocal
          oldColor = paperMode === 'paper' ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.25)';
        }

        // 3. Draw Previous Cycle Trace (Beyond erase gap ahead of sweep beam)
        if (sweepX + eraseWidth < w) {
          ctx.beginPath();
          ctx.strokeStyle = oldColor;
          ctx.lineWidth = 1.8;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';

          const startOldX = sweepX + eraseWidth;
          const firstOldX = Math.ceil(startOldX);
          for (let x = firstOldX; x <= w; x += stepPx) {
            const v = getTraceVoltage(x, selectedTerritoryId);
            const y = centerY - v * voltScale;
            if (x === firstOldX) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // 4. Draw Active Fresh Trace (From x = 0 up to sweepX)
        let headY = centerY;
        const currentTraceWidth = sweepX;

        if (currentTraceWidth > 0.5) {
          ctx.beginPath();
          ctx.strokeStyle = activeColor;
          ctx.lineWidth = 2.2;
          ctx.lineJoin = 'round';
          ctx.lineCap = 'round';

          for (let x = 0; x <= currentTraceWidth; x += stepPx) {
            const v = getTraceVoltage(x, selectedTerritoryId);
            const y = centerY - v * voltScale;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            headY = y;
          }
          if (currentTraceWidth % stepPx !== 0) {
            const x = currentTraceWidth;
            const v = getTraceVoltage(x, selectedTerritoryId);
            const y = centerY - v * voltScale;
            ctx.lineTo(x, y);
            headY = y;
          }
          ctx.stroke();
        }

        // 5. Draw Animated Sweep Cursor & Glowing Lead Head (in both playing and paused/frozen state)
        // Vertical sweeping line
        ctx.beginPath();
        ctx.strokeStyle = paperMode === 'paper' ? '#ea580c' : '#22d3ee';
        ctx.lineWidth = 1.5;
        if (!isPlaying) {
          ctx.setLineDash([2, 2]);
        }
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, h);
        ctx.stroke();
        ctx.setLineDash([]);

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

        // If paused, show subtle freeze watermark
        if (!isPlaying) {
          ctx.fillStyle = paperMode === 'paper' ? 'rgba(15, 23, 42, 0.45)' : 'rgba(148, 163, 184, 0.45)';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('PAUSED', w - 42, 12);
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
    lastTimestampRef.current = null;
  };

  const handleTogglePlay = () => {
    lastTimestampRef.current = null;
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={`border rounded-xl p-4 shadow-xl flex flex-col gap-4 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Top Toolbar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
        <div className="flex flex-wrap items-center gap-2">
          {/* Play / Pause - Theme Accent Highlight */}
          <button
            onClick={handleTogglePlay}
            className={`px-3.5 py-1.5 ${theme.accentBg} ${theme.accentHoverBg} rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : 'Play Trace'}
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className={`p-1.5 rounded-lg border transition ${
              isBright 
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' 
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Reset sweep animation to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs ${
            isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
          }`}>
            <span className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>Speed:</span>
            {[0.5, 1.0, 2.0].map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition ${
                  playbackSpeed === s
                    ? `${theme.accentBg} font-bold shadow-sm`
                    : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Paper / Dark Mode Toggle */}
          <button
            onClick={onTogglePaperMode}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition ${
              isBright
                ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {paperMode === 'paper' ? <Moon className="w-3.5 h-3.5 text-cyan-500" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {paperMode === 'paper' ? 'Dark Monitor View' : 'Pink ECG Paper View'}
          </button>

          {/* Normal Overlay Toggle */}
          <button
            onClick={() => setShowNormalOverlay(!showNormalOverlay)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
              showNormalOverlay
                ? `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} font-semibold`
                : isBright
                ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
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
                ? 'bg-amber-500 text-white border-amber-600 shadow'
                : isBright
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
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
        {/* Clinically Sorted 3x4 Matrix:
            Mobile: one column; tablet portrait: two columns; desktop / tablet landscape: standard 3x4 layout. */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-6 lg:grid-cols-4 lg:grid-rows-3 gap-3">
          {clinicalOrderedLeads.map(({ name: leadName, gridClass }) => {
            const delta = territory.waveformDeltas[leadName];
            const isPrimary = territory.primaryLeads.includes(leadName);
            const isReciprocal = territory.reciprocalLeads.includes(leadName);

            return (
              <div
                key={leadName}
                onClick={() => setDetailLead(leadName)}
                className={`group relative rounded-lg border p-2 cursor-pointer transition shadow-sm hover:ring-2 hover:ring-cyan-500 overflow-hidden ${gridClass} ${
                  paperMode === 'paper'
                    ? 'bg-white/90 border-rose-200/90 shadow-rose-100/50'
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
                  className="w-full h-44 sm:h-48 block rounded"
                />
              </div>
            );
          })}
        </div>

        {/* Lead II Continuous Rhythm Strip at Bottom */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5 px-2">
            <span className="font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                Lead II (Continuous Rhythm Strip • 25 mm/s • 10 mm/mV)
              </span>
              <span className="text-[11px] font-normal opacity-75 hidden sm:inline">
                Evaluates baseline rhythm, P waves, PR interval, and underlying rate
              </span>
            </span>

            <button
              onClick={() => setDetailLead('II')}
              className={`text-xs ${theme.accentText} hover:underline flex items-center gap-1 font-semibold`}
            >
              <Maximize2 className="w-3 h-3" /> Inspect Lead II
            </button>
          </div>

          <div className={`rounded-lg border p-1 overflow-hidden ${
            paperMode === 'paper' ? 'bg-white/80 border-rose-200' : 'bg-slate-950/80 border-slate-800'
          }`}>
            <canvas
              ref={el => { canvasRefs.current['II_RHYTHM'] = el; }}
              className="w-full h-44 sm:h-48 block rounded"
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
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
                      className="w-full h-44 sm:h-48 block rounded"
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
