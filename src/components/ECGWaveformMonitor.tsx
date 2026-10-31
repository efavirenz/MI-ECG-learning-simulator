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

  // 12 Leads organized in standard clinical 3x4 layout
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

  // Render loop
  useEffect(() => {
    const render = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isPlaying) {
        timeRef.current += deltaSec * playbackSpeed;
      }

      // Draw each active canvas
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

        const w = canvas.width;
        const h = canvas.height;
        const actualLead = leadKey === 'II_RHYTHM' ? 'II' : leadKey;
        const delta = territory.waveformDeltas[actualLead];

        // Clear canvas
        ctx.clearRect(0, 0, w, h);

        // Standard 25 mm/s paper speed
        // If canvas represents 2.5 seconds (standard 12-lead strip per lead)
        const durationSec = leadKey === 'II_RHYTHM' ? 5.0 : 2.5;
        const sweepTime = timeRef.current % durationSec;
        const sweepX = (sweepTime / durationSec) * w;

        // Baseline (0 mV) in vertical center
        const centerY = h * 0.58;
        const voltScale = (h * 0.4) / 1.5; // 1.5 mV fits nicely

        // Draw Normal Overlay if requested & territory is abnormal
        if (showNormalOverlay && selectedTerritoryId !== 'normal') {
          ctx.beginPath();
          ctx.strokeStyle = paperMode === 'paper' ? 'rgba(148, 163, 184, 0.7)' : 'rgba(100, 116, 139, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);

          const steps = Math.floor(w / 2);
          for (let i = 0; i < steps; i++) {
            const x = (i / steps) * w;
            const t = (i / steps) * durationSec;
            const v = getEcgVoltage(actualLead, t, 'normal', 75);
            const y = centerY - v * voltScale;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Draw Active Waveform
        ctx.beginPath();
        if (delta?.stElevationMm) {
          ctx.strokeStyle = paperMode === 'paper' ? '#dc2626' : '#f87171'; // Red for ST deviation
        } else if (territory.reciprocalLeads.includes(actualLead)) {
          ctx.strokeStyle = paperMode === 'paper' ? '#0284c7' : '#38bdf8'; // Cyan for reciprocal
        } else {
          ctx.strokeStyle = paperMode === 'paper' ? '#0f172a' : '#38bdf8';
        }
        ctx.lineWidth = 2.2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        const steps = Math.floor(w / 1.5);
        for (let i = 0; i < steps; i++) {
          const x = (i / steps) * w;
          const t = (i / steps) * durationSec;
          const v = getEcgVoltage(actualLead, t, selectedTerritoryId, 75);
          const y = centerY - v * voltScale;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Draw animated sweeping cursor beam
        if (isPlaying) {
          ctx.beginPath();
          ctx.strokeStyle = paperMode === 'paper' ? '#ea580c' : '#22d3ee';
          ctx.lineWidth = 1.5;
          ctx.moveTo(sweepX, 0);
          ctx.lineTo(sweepX, h);
          ctx.stroke();
        }
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
            title="Reset sweep animation"
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
            Normal Overlay (Dashed)
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
            ? 'bg-[#fff9f5] border-rose-200 ecg-grid-paper text-slate-900'
            : 'bg-[#0b1329] border-slate-800 ecg-grid-background text-slate-100'
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
                  className={`group relative rounded-lg border p-2 cursor-pointer transition shadow-sm hover:ring-2 hover:ring-rose-500 ${
                    paperMode === 'paper'
                      ? 'bg-white/70 border-rose-200/80'
                      : 'bg-slate-950/70 border-slate-800/80'
                  } ${
                    isPrimary ? 'ring-2 ring-rose-500 bg-rose-950/20' : isReciprocal ? 'ring-1 ring-cyan-500 bg-cyan-950/20' : ''
                  }`}
                >
                  {/* Lead Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-sm px-1.5 py-0.5 rounded bg-slate-900/60 text-white border border-slate-700">
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
                      {delta?.stElevationMm && (
                        <span className="font-mono text-xs font-bold text-rose-500">
                          {delta.stElevationMm > 0 ? '+' : ''}{delta.stElevationMm} mm
                        </span>
                      )}
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition" />
                    </div>
                  </div>

                  {/* Animated Lead Canvas */}
                  <canvas
                    ref={el => { canvasRefs.current[leadName] = el; }}
                    width={280}
                    height={100}
                    className="w-full h-24 block"
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

          <div className={`rounded-lg border p-1 ${
            paperMode === 'paper' ? 'bg-white/60 border-rose-200' : 'bg-slate-950/70 border-slate-800'
          }`}>
            <canvas
              ref={el => { canvasRefs.current['II_RHYTHM'] = el; }}
              width={1000}
              height={110}
              className="w-full h-24 block"
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
                    className={`group relative rounded-lg border p-2 cursor-pointer transition shadow-sm hover:ring-2 hover:ring-amber-500 ${
                      paperMode === 'paper'
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-amber-950/20 border-amber-800/60'
                    } ${isPrimary ? 'ring-2 ring-amber-500' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-slate-900 text-white border border-slate-700">
                        {leadName}
                      </span>
                      {delta?.stElevationMm && (
                        <span className="font-mono text-xs font-bold text-amber-500">
                          {delta.stElevationMm > 0 ? '+' : ''}{delta.stElevationMm} mm
                        </span>
                      )}
                    </div>

                    <canvas
                      ref={el => { canvasRefs.current[leadName] = el; }}
                      width={280}
                      height={90}
                      className="w-full h-20 block"
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
