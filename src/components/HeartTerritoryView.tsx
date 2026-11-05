import { useState, useEffect } from 'react';
import { MI_TERRITORIES, MITerritory } from '../data/miTerritories';
import { Activity, ShieldAlert, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeartTerritoryViewProps {
  selectedTerritoryId: string;
  onSelectTerritory: (territoryId: string) => void;
}

export default function HeartTerritoryView({
  selectedTerritoryId,
  onSelectTerritory
}: HeartTerritoryViewProps) {
  const { theme, isBright } = useTheme();
  const [viewOrientation, setViewOrientation] = useState<'anterior' | 'posterior'>(
    selectedTerritoryId === 'posterior' ? 'posterior' : 'anterior'
  );

  // Automatically switch to posterior orientation when Posterior STEMI is selected
  useEffect(() => {
    setViewOrientation(selectedTerritoryId === 'posterior' ? 'posterior' : 'anterior');
  }, [selectedTerritoryId]);

  const currentTerritory: MITerritory = MI_TERRITORIES[selectedTerritoryId] || MI_TERRITORIES['normal'];

  // All STEMI territories list
  const territoryKeys = [
    'normal',
    'septal',
    'anterior',
    'anteroseptal',
    'extensive_anterior',
    'lateral',
    'high_lateral',
    'inferior',
    'posterior',
    'right_ventricular'
  ];

  const mimicsKeys = ['pericarditis', 'early_repolarization'];

  const isHighlighted = (svgRegionId: string) => {
    if (viewOrientation === 'anterior') {
      return currentTerritory.heartRegionCoords.anteriorHighlightSvgId?.includes(svgRegionId);
    } else {
      return currentTerritory.heartRegionCoords.posteriorHighlightSvgId?.includes(svgRegionId);
    }
  };

  return (
    <div className={`border rounded-xl p-4 shadow-xl flex flex-col xl:flex-row gap-6 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
      {/* Left: Interactive 2D Vector Heart Diagram */}
      <div className="flex-1 flex flex-col items-center">
        {/* View Toggle Bar */}
        <div className="w-full flex items-center justify-between mb-3 px-2 text-xs">
          <div className={`flex items-center gap-1.5 p-1 rounded-lg border ${theme.cardSubBg} ${theme.cardBorder}`}>
            <button
              onClick={() => setViewOrientation('anterior')}
              aria-pressed={viewOrientation === 'anterior'}
              className={`px-3 py-1 rounded font-medium transition ${
                viewOrientation === 'anterior'
                  ? `${theme.accentBg} shadow`
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Anterior Heart View (Sternocostal)
            </button>
            <button
              onClick={() => setViewOrientation('posterior')}
              aria-pressed={viewOrientation === 'posterior'}
              className={`px-3 py-1 rounded font-medium transition ${
                viewOrientation === 'posterior'
                  ? `${theme.accentBg} shadow`
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Posterior Heart View
            </button>
          </div>

          <span className={`text-[11px] font-mono font-medium ${theme.subtextColor}`}>
            Current: <span className={`${theme.accentText} font-bold`}>{currentTerritory.name}</span>
          </span>
        </div>

        {/* Anatomical Heart 2D SVG */}
        <div className={`relative w-full max-w-[480px] aspect-[1/1] rounded-xl border p-2 flex items-center justify-center select-none overflow-hidden transition-colors ${
          isBright ? 'bg-slate-100 border-slate-300' : 'bg-slate-950/70 border-slate-800'
        }`}>
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <defs>
              <linearGradient id="heartBaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4c0519" />
                <stop offset="40%" stopColor="#7a0d2e" />
                <stop offset="70%" stopColor="#881337" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="aortaTubularGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7f1d1d" />
                <stop offset="35%" stopColor="#dc2626" />
                <stop offset="70%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="pulmTubularGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="40%" stopColor="#3b82f6" />
                <stop offset="75%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="csTubularGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#172554" />
              </linearGradient>
              <linearGradient id="fatPadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="infarctGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#990000" />
              </linearGradient>
              <filter id="heartGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="pericarditisGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ANTERIOR VIEW (STERNOCOSTAL) */}
            {viewOrientation === 'anterior' ? (
              <g>
                {/* 1. Great Vessels (Posterior Layer) */}
                {/* Superior Vena Cava (SVC) entering RA */}
                <path
                  d="M 116 35 L 116 115 C 120 120, 138 122, 142 118 L 142 35 Z"
                  fill="url(#pulmTubularGrad)"
                  stroke="#3b82f6"
                  strokeWidth="1.8"
                />
                <ellipse cx="129" cy="35" rx="13" ry="5" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.2" />
                <text x="105" y="55" fill="#93c5fd" fontSize="7.5" fontWeight="bold" textAnchor="end">SVC</text>

                {/* Ascending Aorta, Aortic Arch & Supra-Aortic Branches */}
                {/* Aortic Arch branches: Brachiocephalic, Left Common Carotid, Left Subclavian */}
                <path d="M 186 35 L 186 14 C 186 11, 194 11, 194 14 L 194 35 Z" fill="url(#aortaTubularGrad)" stroke="#ef4444" strokeWidth="1.2" />
                <path d="M 204 30 L 204 12 C 204 9, 212 9, 212 12 L 212 30 Z" fill="url(#aortaTubularGrad)" stroke="#ef4444" strokeWidth="1.2" />
                <path d="M 220 35 L 220 15 C 220 12, 228 12, 228 15 L 228 35 Z" fill="url(#aortaTubularGrad)" stroke="#ef4444" strokeWidth="1.2" />
                <text x="210" y="8" fill="#fca5a5" fontSize="6.5" textAnchor="middle">Supra-Aortic Branches</text>

                {/* Main Aorta Body */}
                <path
                  d="M 172 120
                     L 172 65
                     C 172 26, 240 24, 246 65
                     L 246 120
                     Z"
                  fill="url(#aortaTubularGrad)"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <text x="210" y="58" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Aorta</text>

                {/* Pulmonary Trunk & Bifurcation (Winding anterior to aorta) */}
                <path
                  d="M 202 125
                     C 200 95, 215 75, 252 68
                     C 265 78, 260 98, 235 128
                     Z"
                  fill="url(#pulmTubularGrad)"
                  stroke="#60a5fa"
                  strokeWidth="2"
                />
                {/* Left & Right Pulmonary Artery Branches */}
                <path d="M 252 68 C 275 62, 290 70, 298 82 L 288 88 C 278 78, 266 75, 250 78 Z" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1.2" />
                <text x="282" y="65" fill="#93c5fd" fontSize="7.5" fontWeight="bold">Pulmonary Trunk</text>

                {/* Right Atrium & Auricle Silhouette */}
                <path
                  d="M 120 115
                     C 85 130, 75 185, 95 235
                     C 105 255, 115 270, 125 285
                     L 135 240
                     C 125 180, 130 140, 142 118 Z"
                  fill="#581c87"
                  opacity="0.75"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                />
                <text x="82" y="195" fill="#e9d5ff" fontSize="7.5" fontWeight="bold" textAnchor="end">Right Atrium</text>

                {/* Left Auricle (Appendage) Silhouette */}
                <path
                  d="M 260 120
                     C 285 125, 298 145, 292 165
                     C 285 175, 275 170, 265 155 Z"
                  fill="#581c87"
                  opacity="0.8"
                  stroke="#c084fc"
                  strokeWidth="1.5"
                />
                <text x="305" y="145" fill="#e9d5ff" fontSize="7" fontWeight="bold">Left Auricle</text>

                {/* Ventricular Silhouette Base (Sternocostal Surface) */}
                <path
                  d="M 125 140
                     C 92 175, 90 240, 115 295
                     C 135 335, 185 372, 230 376
                     C 275 372, 315 320, 322 245
                     C 326 185, 305 140, 260 125
                     Z"
                  fill="url(#heartBaseGrad)"
                  stroke="#fda4af"
                  strokeWidth="2.5"
                />

                {/* Myocardial Territories (Anatomical Segments) */}
                {/* 1. Right Ventricle (RV) */}
                <path
                  id="region-rv"
                  d="M 125 140
                     C 100 185, 102 245, 125 295
                     C 145 322, 175 336, 195 342
                     L 186 140 Z"
                  fill={isHighlighted('region-rv') ? '#ef4444' : '#641e2e'}
                  opacity={isHighlighted('region-rv') ? 0.95 : 0.65}
                  stroke={isHighlighted('region-rv') ? '#fef08a' : '#9f1239'}
                  strokeWidth={isHighlighted('region-rv') ? 3.5 : 1.2}
                  className="transition-all duration-300"
                />
                <text x="145" y="225" fill="#ffffff" fontSize="9" fontWeight="bold" opacity="0.95">Right Ventricle</text>
                <text x="145" y="238" fill="#fbcfe8" fontSize="7.5" fontWeight="medium">(V3R, V4R)</text>

                {/* 2. Interventricular Septum (Anterior groove region) */}
                <path
                  id="region-septum"
                  d="M 186 140 L 195 342 L 222 362 L 216 140 Z"
                  fill={isHighlighted('region-septum') ? '#f59e0b' : '#831843'}
                  opacity={isHighlighted('region-septum') ? 0.95 : 0.65}
                  stroke={isHighlighted('region-septum') ? '#ffffff' : '#be123c'}
                  strokeWidth={isHighlighted('region-septum') ? 3.5 : 1.2}
                  className="transition-all duration-300"
                />
                <text x="204" y="270" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Septum</text>
                <text x="204" y="281" fill="#fef08a" fontSize="7" fontWeight="bold" textAnchor="middle">(V1, V2)</text>

                {/* 3. Anterior Free Wall of Left Ventricle */}
                <path
                  id="region-anterior"
                  d="M 216 140 L 222 362 C 238 366, 258 350, 272 318 L 260 140 Z"
                  fill={isHighlighted('region-anterior') ? '#ef4444' : '#500724'}
                  opacity={isHighlighted('region-anterior') ? 0.95 : 0.65}
                  stroke={isHighlighted('region-anterior') ? '#fef08a' : '#be123c'}
                  strokeWidth={isHighlighted('region-anterior') ? 3.5 : 1.2}
                  className="transition-all duration-300"
                />
                <text x="245" y="225" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Anterior LV</text>
                <text x="245" y="238" fill="#fbcfe8" fontSize="7.5" fontWeight="medium" textAnchor="middle">(V3, V4)</text>

                {/* 4. Lateral LV Free Wall */}
                <path
                  id="region-lateral"
                  d="M 260 140 L 272 318 C 292 280, 312 230, 312 180 C 302 150, 280 140, 260 140 Z"
                  fill={isHighlighted('region-lateral') ? '#8b5cf6' : '#3f0c1a'}
                  opacity={isHighlighted('region-lateral') ? 0.95 : 0.65}
                  stroke={isHighlighted('region-lateral') ? '#fef08a' : '#be123c'}
                  strokeWidth={isHighlighted('region-lateral') ? 3.5 : 1.2}
                  className="transition-all duration-300"
                />
                <text x="290" y="210" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Lateral LV</text>
                <text x="290" y="222" fill="#e9d5ff" fontSize="7" fontWeight="medium" textAnchor="middle">(I, aVL, V5, V6)</text>

                {/* 5. High Lateral Territory */}
                <circle
                  id="region-high-lateral"
                  cx="285"
                  cy="155"
                  r="18"
                  fill={isHighlighted('region-high-lateral') ? '#38bdf8' : 'rgba(56, 189, 248, 0.25)'}
                  stroke={isHighlighted('region-high-lateral') ? '#ffffff' : '#38bdf8'}
                  strokeWidth={isHighlighted('region-high-lateral') ? 3 : 1.5}
                  strokeDasharray={isHighlighted('region-high-lateral') ? undefined : '3,3'}
                  opacity="0.9"
                />
                <text x="285" y="158" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle">High Lat</text>

                {/* 6. Inferior Margin visible anteriorly */}
                <path
                  id="region-inferior"
                  d="M 155 330 C 180 350, 210 367, 235 374 C 252 370, 266 360, 278 344 C 250 356, 218 355, 190 341 Z"
                  fill={isHighlighted('region-inferior') ? '#10b981' : '#2b0716'}
                  opacity={isHighlighted('region-inferior') ? 0.95 : 0.55}
                  stroke={isHighlighted('region-inferior') ? '#ffffff' : 'none'}
                  strokeWidth="2.5"
                />

                {/* Subepicardial Adipose Sulcus Highlights */}
                <path d="M 180 125 C 150 135, 126 155, 120 190" fill="none" stroke="url(#fatPadGrad)" strokeWidth="6" opacity="0.4" />
                <path d="M 225 140 C 220 170, 205 230, 206 280 C 206 320, 216 350, 228 372" fill="none" stroke="url(#fatPadGrad)" strokeWidth="5" opacity="0.35" />

                {/* Coronary Arteries (High-Fidelity Arterial Network) */}
                {/* Right Coronary Artery (RCA) in right AV groove */}
                <path
                  id="artery-rca"
                  d="M 180 120 C 145 130, 122 152, 116 190 C 110 230, 120 270, 136 295"
                  fill="none"
                  stroke={isHighlighted('artery-rca') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-rca') ? 5.5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-rca') ? 'url(#heartGlow)' : undefined}
                />
                {/* RCA Acute marginal branches */}
                <path d="M 116 190 L 142 218" fill="none" stroke={isHighlighted('artery-rca') ? '#fef08a' : '#ef4444'} strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 120 240 L 152 260" fill="none" stroke={isHighlighted('artery-rca') ? '#fef08a' : '#ef4444'} strokeWidth="2.2" strokeLinecap="round" />
                <text x="92" y="178" fill="#fbbf24" fontSize="8" fontWeight="bold">RCA</text>

                {/* Left Main Coronary Artery (LMCA) originating behind pulmonary trunk */}
                <path
                  id="artery-lmca"
                  d="M 215 125 L 226 140"
                  fill="none"
                  stroke={isHighlighted('artery-lmca') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lmca') ? 6 : 4.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-lmca') ? 'url(#heartGlow)' : undefined}
                />
                <text x="238" y="134" fill={isHighlighted('artery-lmca') ? '#fbbf24' : '#f87171'} fontSize="7.5" fontWeight="bold">LMCA</text>

                {/* Left Anterior Descending Artery (LAD) coursing down anterior IV sulcus */}
                <path
                  id="artery-lad"
                  d="M 226 140 C 220 170, 206 230, 206 280 C 206 320, 216 350, 228 372"
                  fill="none"
                  stroke={isHighlighted('artery-lad') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lad') ? 5.5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-lad') ? 'url(#heartGlow)' : undefined}
                />
                {/* LAD Diagonal Branches (D1, D2) */}
                <path d="M 220 175 L 256 210" fill="none" stroke={isHighlighted('artery-lad') ? '#fef08a' : '#ef4444'} strokeWidth="2.4" strokeLinecap="round" />
                <text x="262" y="200" fill="#fca5a5" fontSize="7" fontWeight="bold">D1 Branch</text>
                <path d="M 210 240 L 246 270" fill="none" stroke={isHighlighted('artery-lad') ? '#fef08a' : '#ef4444'} strokeWidth="2.2" strokeLinecap="round" />
                <text x="252" y="266" fill="#fca5a5" fontSize="7" fontWeight="bold">D2 Branch</text>
                {/* Septal perforating branches (S1, S2 - penetrating septum) */}
                <path d="M 215 190 L 186 205" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="3,2" />
                <path d="M 208 230 L 182 245" fill="none" stroke="#fca5a5" strokeWidth="2" strokeDasharray="3,2" />
                <text x="162" y="198" fill="#fca5a5" fontSize="6.5">Septal (S1)</text>

                {/* Left Circumflex Artery (LCx) coursing in left AV groove */}
                <path
                  id="artery-lcx"
                  d="M 226 140 C 255 145, 290 160, 305 190"
                  fill="none"
                  stroke={isHighlighted('artery-lcx') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lcx') ? 5.5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-lcx') ? 'url(#heartGlow)' : undefined}
                />
                {/* Obtuse Marginal Branches (OM1, OM2) */}
                <path d="M 270 155 L 292 200" fill="none" stroke={isHighlighted('artery-lcx') ? '#fef08a' : '#ef4444'} strokeWidth="2.4" strokeLinecap="round" />
                <text x="312" y="165" fill="#fbbf24" fontSize="8" fontWeight="bold">LCx (OM)</text>

                {/* Cardiac Apex Landmark */}
                <circle cx="230" cy="374" r="4" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
                <text x="230" y="392" fill={isBright ? "#334155" : "#cbd5e1"} fontSize="8" textAnchor="middle" fontWeight="bold">Cardiac Apex (LV)</text>
              </g>
            ) : (
              /* POSTERIOR / INFERIOR VIEW (DIAPHRAGMATIC & BASE) */
              <g>
                {/* ─── Posterior View Anatomical Key ─────────────────────
                    Orientation: as if looking at the back of the heart
                    (patient's right = viewer's right; patient's left = viewer's left).
                    Top:   base of heart (LA, atria, great veins).
                    Bottom: cardiac apex.
                    Left side of image = patient's right (RA / RCA).
                    Right side of image = patient's left.
                ─────────────────────────────────────────────────────── */}

                {/* 1. Left Atrium — posterior wall, occupying most of the base */}
                <path
                  d="M 130 95 C 128 65, 272 65, 270 95 C 280 122, 268 148, 252 150 L 148 150 C 132 148, 120 122, 130 95 Z"
                  fill="#4c1d95"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  opacity="0.9"
                />
                <text x="200" y="110" fill="#e9d5ff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Left Atrium (Posterior Wall)</text>

                {/* 2. Right Atrium — visible on the right side of the base (patient's right = viewer's left) */}
                <path
                  d="M 270 95 C 285 80, 330 88, 338 120 C 340 138, 328 152, 310 155 L 270 152 C 280 135, 280 115, 270 95 Z"
                  fill="#4c1d95"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  opacity="0.75"
                />
                <text x="305" y="120" fill="#e9d5ff" fontSize="7" fontWeight="bold" textAnchor="middle">Right</text>
                <text x="305" y="130" fill="#e9d5ff" fontSize="7" fontWeight="bold" textAnchor="middle">Atrium</text>

                {/* 3. Pulmonary Veins (4 veins entering LA from lungs)
                    In posterior view: Left PVs enter from the patient's left (viewer's right),
                    Right PVs enter from the patient's right (viewer's left). */}
                {/* Left Sup + Inf PVs (patient left = viewer right) */}
                <ellipse cx="115" cy="95" rx="9" ry="6" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
                <ellipse cx="110" cy="122" rx="9" ry="6" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="97" y="95" fill="#93c5fd" fontSize="6.5" textAnchor="end">L. Sup PV</text>
                <text x="92" y="122" fill="#93c5fd" fontSize="6.5" textAnchor="end">L. Inf PV</text>

                {/* Right Sup + Inf PVs (patient right = viewer left, approaching from left side) */}
                <ellipse cx="255" cy="78" rx="9" ry="6" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
                <ellipse cx="260" cy="102" rx="9" ry="6" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="268" y="78" fill="#93c5fd" fontSize="6.5">R. Sup PV</text>
                <text x="273" y="102" fill="#93c5fd" fontSize="6.5">R. Inf PV</text>

                {/* 4. Inferior Vena Cava (IVC) entering RA inferiorly — on patient's right = viewer's left */}
                <ellipse cx="318" cy="157" rx="11" ry="6" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="338" y="160" fill="#93c5fd" fontSize="7" fontWeight="bold">IVC</text>

                {/* 5. Posterior Ventricular Silhouette (main body of both ventricles) */}
                <path
                  d="M 118 148 C 78 182, 80 252, 112 310 C 142 358, 196 380, 236 378 C 278 375, 318 322, 322 252 C 322 188, 296 148, 256 148 Z"
                  fill="url(#heartBaseGrad)"
                  stroke="#fda4af"
                  strokeWidth="2.5"
                />

                {/* 6. Posterior LV wall — posterobasal territory (V7-V9; predominantly patient's left side) */}
                <path
                  id="region-posterior"
                  d="M 118 148 C 86 188, 86 258, 116 316 L 195 352 L 195 152 Z"
                  fill={isHighlighted('region-posterior') ? '#f97316' : '#4a044e'}
                  opacity={isHighlighted('region-posterior') ? 0.95 : 0.65}
                  stroke={isHighlighted('region-posterior') ? '#ffffff' : '#701a75'}
                  strokeWidth={isHighlighted('region-posterior') ? 3.5 : 1.2}
                  className="transition-all duration-300"
                />
                <text x="145" y="230" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Posterior LV</text>
                <text x="145" y="244" fill="#fed7aa" fontSize="8" fontWeight="bold" textAnchor="middle">(V7, V8, V9)</text>

                {/* 7. Inferior / Diaphragmatic wall (II, III, aVF; RCA/PDA territory — straddles the septum at the bottom) */}
                <path
                  id="region-inferior-post"
                  d="M 116 316 C 135 350, 178 378, 220 382 C 264 380, 300 345, 322 300 C 296 321, 268 338, 236 344 C 190 350, 148 336, 116 316 Z"
                  fill={isHighlighted('region-inferior-post') ? '#10b981' : '#312e81'}
                  opacity={isHighlighted('region-inferior-post') ? 0.95 : 0.65}
                  stroke={isHighlighted('region-inferior-post') ? '#ffffff' : '#3730a3'}
                  strokeWidth={isHighlighted('region-inferior-post') ? 3.5 : 1.2}
                  className="transition-all duration-300"
                />
                <text x="220" y="358" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Inferior Wall</text>
                <text x="220" y="370" fill="#a7f3d0" fontSize="8" fontWeight="bold" textAnchor="middle">(II, III, aVF)</text>

                {/* 8. Right Ventricle — thin sliver visible at patient's right base on posterior view */}
                <path
                  id="region-rv-post"
                  d="M 288 152 L 308 305 C 320 280, 322 240, 320 200 C 318 172, 308 155, 288 152 Z"
                  fill={isHighlighted('region-rv-post') ? '#ef4444' : '#641e2e'}
                  opacity={isHighlighted('region-rv-post') ? 0.95 : 0.55}
                  stroke={isHighlighted('region-rv-post') ? '#fef08a' : '#9f1239'}
                  strokeWidth={isHighlighted('region-rv-post') ? 3.5 : 1}
                  className="transition-all duration-300"
                />
                <text x="310" y="210" fill="#fbcfe8" fontSize="7" fontWeight="bold" textAnchor="middle">RV</text>

                {/* 9. Coronary Sinus — runs in the posterior AV groove between LA (top) and LV (below) */}
                {/* Correctly positioned: horizontal channel along the INFERIOR border of the left atrium */}
                <path
                  d="M 148 150 C 178 155, 218 156, 256 154"
                  fill="none"
                  stroke="url(#csTubularGrad)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text x="198" y="147" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">Coronary Sinus (CS)</text>

                {/* 10. Posterior interventricular sulcus fat pad */}
                <path d="M 195 152 L 195 360" fill="none" stroke="url(#fatPadGrad)" strokeWidth="6" opacity="0.35" />

                {/* 11. Posterior Descending Artery (PDA) in posterior IV sulcus */}
                <path
                  id="artery-rca-pda"
                  d="M 195 148 L 195 360"
                  fill="none"
                  stroke={isHighlighted('artery-rca-pda') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-rca-pda') ? 5.5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-rca-pda') ? 'url(#heartGlow)' : undefined}
                />
                <text x="202" y="280" fill="#fbbf24" fontSize="7.5" fontWeight="bold">PDA (RCA ~85% / LCx ~15%)</text>

                {/* 12. RCA running in right AV groove (patient right = viewer right, superior to inferior along right border) */}
                <path
                  id="artery-rca"
                  d="M 310 155 C 325 178, 322 225, 312 270 C 302 305, 284 330, 260 348"
                  fill="none"
                  stroke={isHighlighted('artery-rca') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-rca') ? 5.5 : 3}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-rca') ? 'url(#heartGlow)' : undefined}
                />
                <text x="340" y="200" fill="#fbbf24" fontSize="7.5" fontWeight="bold" textAnchor="start">RCA</text>

                {/* 13. Posterolateral Branches (PLB) from LCx — patient's left = viewer's left */}
                <path
                  id="artery-lcx-post"
                  d="M 140 152 C 125 188, 130 232, 148 272"
                  fill="none"
                  stroke={isHighlighted('artery-lcx-post') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lcx-post') ? 4.5 : 2.8}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-lcx-post') ? 'url(#heartGlow)' : undefined}
                />
                <text x="90" y="185" fill={isHighlighted('artery-lcx-post') ? '#fbbf24' : '#fca5a5'} fontSize="7" fontWeight="bold">LCx PLB</text>

                {/* 14. Cardiac Apex */}
                <circle cx="234" cy="376" r="4" fill="#ffffff" stroke="#e11d48" strokeWidth="1.5" />
                <text x="234" y="394" fill={isBright ? "#334155" : "#cbd5e1"} fontSize="8" textAnchor="middle" fontWeight="bold">Cardiac Apex</text>

                {/* 15. Orientation compass */}
                <text x="14" y="165" fill={isBright ? "#475569" : "#94a3b8"} fontSize="6.5" fontWeight="bold">Patient</text>
                <text x="14" y="174" fill={isBright ? "#475569" : "#94a3b8"} fontSize="6.5" fontWeight="bold">Right →</text>
                <text x="355" y="165" fill={isBright ? "#475569" : "#94a3b8"} fontSize="6.5" fontWeight="bold" textAnchor="end">← Patient</text>
                <text x="355" y="174" fill={isBright ? "#475569" : "#94a3b8"} fontSize="6.5" fontWeight="bold" textAnchor="end">Left</text>
              </g>
            )}
          </svg>
        </div>

        {/* Territory Selector Buttons */}
        <div className="w-full mt-3 flex flex-wrap gap-1.5 justify-center">
          {territoryKeys.map(key => {
            const terr = MI_TERRITORIES[key];
            const isSelected = selectedTerritoryId === key;
            return (
              <button
                key={key}
                aria-pressed={isSelected}
                onClick={() => {
                  onSelectTerritory(key);
                  // Auto-orient: Posterior STEMI → posterior view; all others → anterior
                  if (key === 'posterior') {
                    setViewOrientation('posterior');
                  } else {
                    setViewOrientation('anterior');
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border flex items-center gap-1.5 ${
                  isSelected
                    ? `${theme.accentBg} ${theme.accentBorder} shadow-md scale-105 font-bold`
                    : isBright
                    ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-600'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                {terr.name.replace(' STEMI', '').replace(' Infarction', '')}
              </button>
            );
          })}
        </div>

        {/* Mimics Selector Buttons */}
        <div className={`w-full mt-2 pt-2 border-t flex items-center justify-center gap-2 text-xs ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
          <span className={theme.subtextColor}>STEMI Mimics:</span>
          {mimicsKeys.map(key => {
            const terr = MI_TERRITORIES[key];
            const isSelected = selectedTerritoryId === key;
            return (
              <button
                key={key}
                aria-pressed={isSelected}
                onClick={() => onSelectTerritory(key)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-sm'
                    : isBright
                    ? 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {terr.name.replace('STEMI Mimic: ', '')}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Synchronized Territory Details & ECG Leads Box */}
      <div className={`w-full xl:w-96 flex flex-col justify-between border rounded-xl p-4 transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
        <div className="space-y-3.5 text-xs">
          {/* Header */}
          <div className={`border-b pb-2 ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
            <span className={`text-[10px] uppercase font-mono tracking-wider font-bold flex items-center gap-1 ${theme.accentText}`}>
              <Activity className="w-3.5 h-3.5" /> Myocardial Territory Profile
            </span>
            <h3 className={`text-base font-bold mt-0.5 ${theme.headingColor}`}>
              {currentTerritory.name}
            </h3>
            <p className={`text-xs mt-1 ${theme.subtextColor}`}>
              {currentTerritory.shortDescription}
            </p>
          </div>

          {/* Primary Leads Highlight */}
          {currentTerritory.primaryLeads.length > 0 && (
            <div className={`border rounded-lg p-2.5 ${isBright ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}>
              <span className={`font-semibold uppercase tracking-wide text-[11px] block mb-1 ${theme.accentText}`}>
                Primary Contiguous ECG Leads:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTerritory.primaryLeads.map(lead => (
                  <span
                    key={lead}
                    className={`px-2 py-0.5 font-mono font-bold rounded border ${
                      isBright 
                        ? 'bg-rose-100 border-rose-300 text-rose-800' 
                        : 'bg-rose-600/30 border-rose-500/60 text-rose-200'
                    }`}
                  >
                    {lead}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reciprocal Leads */}
          {currentTerritory.reciprocalLeads.length > 0 && (
            <div className={`border rounded-lg p-2.5 ${isBright ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide text-[11px] block mb-1">
                Reciprocal Mirror ECG Leads:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentTerritory.reciprocalLeads.map(lead => (
                  <span
                    key={lead}
                    className={`px-2 py-0.5 font-mono font-bold rounded border ${
                      isBright 
                        ? 'bg-cyan-50 border-cyan-200 text-cyan-800' 
                        : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                    }`}
                  >
                    {lead}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Culprit Artery & Dominance Notes */}
          <div>
            <span className="font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide text-[11px] block mb-0.5">
              Culprit Vessel & Anatomy:
            </span>
            <p className={`font-semibold ${isBright ? 'text-slate-900' : 'text-slate-200'}`}>
              {currentTerritory.culpritArtery}
            </p>
            <p className={`text-[11px] mt-1 leading-snug ${theme.subtextColor}`}>
              {currentTerritory.coronaryAnatomyNotes}
            </p>
          </div>

          {/* Expected Waveform Abnormalities */}
          <div className={`space-y-1 p-2.5 rounded-lg border ${
            isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-slate-200'
          }`}>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide text-[11px] block mb-1">
              Hallmark ECG Abnormalities:
            </span>
            <p className={`text-xs ${theme.subtextColor}`}>
              <strong className={isBright ? 'text-slate-900' : 'text-slate-200'}>ST Segment:</strong> {currentTerritory.expectedECG.stSegment}
            </p>
            <p className={`text-xs ${theme.subtextColor}`}>
              <strong className={isBright ? 'text-slate-900' : 'text-slate-200'}>T Wave:</strong> {currentTerritory.expectedECG.tWave}
            </p>
            <p className={`text-xs ${theme.subtextColor}`}>
              <strong className={isBright ? 'text-slate-900' : 'text-slate-200'}>Q Wave:</strong> {currentTerritory.expectedECG.qWave}
            </p>
          </div>

          {/* Supplemental Leads Recommendation Callout */}
          {currentTerritory.supplementalLeadsRecommended && (
            <div className={`p-2.5 rounded-lg border ${
              isBright ? 'bg-amber-50 border-amber-200 text-slate-800' : 'bg-amber-950/40 border-amber-500/40 text-slate-200'
            }`}>
              <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 mb-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5" /> Acquire Supplemental Leads: {currentTerritory.supplementalLeadsRecommended.leads.join(', ')}
              </span>
              <p className={`text-xs ${isBright ? 'text-slate-700' : 'text-amber-200/90'}`}>
                {currentTerritory.supplementalLeadsRecommended.clinicalPearl}
              </p>
            </div>
          )}

          {/* Clinical Pearls */}
          <div>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide text-[11px] block mb-1">
              Practical Clinical Pearls:
            </span>
            <ul className={`space-y-1 ${theme.subtextColor}`}>
              {currentTerritory.clinicalPearls.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5 leading-snug">
                  <ChevronRight className="w-3 h-3 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Anatomical Variation Note */}
        <div className={`mt-3 pt-2 border-t text-[10px] flex items-start gap-1.5 ${
          isBright ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
        }`}>
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
          <span>
            Clinical Note: ECG lead territories represent typical electrical projections. Biological variation in coronary dominance and collateral channels means findings are supportive, not an absolute one-to-one anatomical map.
          </span>
        </div>
      </div>
    </div>
  );
}
