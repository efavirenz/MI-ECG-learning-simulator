import { useState } from 'react';
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
  const [viewOrientation, setViewOrientation] = useState<'anterior' | 'posterior'>('anterior');

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
              className={`px-3 py-1 rounded font-medium transition ${
                viewOrientation === 'posterior'
                  ? `${theme.accentBg} shadow`
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Posterior / Inferior View (Diaphragmatic)
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
                <stop offset="50%" stopColor="#881337" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <linearGradient id="infarctGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#990000" />
              </linearGradient>
              <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* ANTERIOR VIEW */}
            {viewOrientation === 'anterior' ? (
              <g>
                {/* Great Vessels (Aorta & Pulmonary Artery) */}
                {/* Superior Vena Cava */}
                <path d="M 120 40 L 120 120 L 145 120 L 145 40 Z" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="110" y="55" fill="#60a5fa" fontSize="7.5" textAnchor="end">SVC</text>

                {/* Ascending Aorta */}
                <path d="M 180 30 C 180 20, 225 20, 235 60 L 235 120 L 180 120 Z" fill="#991b1b" stroke="#ef4444" strokeWidth="2" />
                <text x="210" y="50" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">Aorta</text>

                {/* Pulmonary Trunk */}
                <path d="M 225 80 C 235 90, 250 110, 245 135 L 210 135 L 210 80 Z" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
                <text x="260" y="105" fill="#93c5fd" fontSize="7.5">Pulm Trunk</text>

                {/* Main Ventricular Mass Silhouette */}
                <path
                  d="M 120 120
                     C 90 150, 80 230, 110 290
                     C 130 330, 180 370, 230 375
                     C 270 370, 310 320, 320 250
                     C 325 190, 305 140, 260 120
                     Z"
                  fill="url(#heartBaseGrad)"
                  stroke="#fda4af"
                  strokeWidth="2"
                />

                {/* Myocardial Territory Polygons (Clickable & Highlightable) */}
                {/* 1. Right Ventricle (RV) Region */}
                <path
                  id="region-rv"
                  d="M 125 140 C 105 180, 105 240, 130 290 C 150 315, 175 330, 195 340 L 185 140 Z"
                  fill={isHighlighted('region-rv') ? '#ef4444' : '#641e2e'}
                  opacity={isHighlighted('region-rv') ? 0.9 : 0.6}
                  stroke={isHighlighted('region-rv') ? '#fef08a' : '#9f1239'}
                  strokeWidth={isHighlighted('region-rv') ? 3 : 1}
                  className="transition-all duration-300"
                />
                <text x="145" y="230" fill="#ffffff" fontSize="9" fontWeight="bold" opacity="0.9">Right Ventricle</text>
                <text x="145" y="242" fill="#fbcfe8" fontSize="7.5">(V3R, V4R)</text>

                {/* 2. Interventricular Septum (Anterior groove region) */}
                <path
                  id="region-septum"
                  d="M 185 140 L 195 340 L 220 360 L 215 140 Z"
                  fill={isHighlighted('region-septum') ? '#f59e0b' : '#831843'}
                  opacity={isHighlighted('region-septum') ? 0.95 : 0.6}
                  stroke={isHighlighted('region-septum') ? '#ffffff' : '#be123c'}
                  strokeWidth={isHighlighted('region-septum') ? 3 : 1}
                  className="transition-all duration-300"
                />
                <text x="205" y="270" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Septum</text>
                <text x="205" y="280" fill="#fef08a" fontSize="7" textAnchor="middle">(V1, V2)</text>

                {/* 3. Anterior Free Wall of LV */}
                <path
                  id="region-anterior"
                  d="M 215 140 L 220 360 C 235 365, 255 350, 270 320 L 260 140 Z"
                  fill={isHighlighted('region-anterior') ? '#ef4444' : '#500724'}
                  opacity={isHighlighted('region-anterior') ? 0.95 : 0.6}
                  stroke={isHighlighted('region-anterior') ? '#fef08a' : '#be123c'}
                  strokeWidth={isHighlighted('region-anterior') ? 3 : 1}
                  className="transition-all duration-300"
                />
                <text x="245" y="230" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Anterior LV</text>
                <text x="245" y="242" fill="#fbcfe8" fontSize="7.5" textAnchor="middle">(V3, V4)</text>

                {/* 4. Lateral LV Wall */}
                <path
                  id="region-lateral"
                  d="M 260 140 L 270 320 C 290 280, 310 230, 310 180 C 300 150, 280 140, 260 140 Z"
                  fill={isHighlighted('region-lateral') ? '#8b5cf6' : '#3f0c1a'}
                  opacity={isHighlighted('region-lateral') ? 0.95 : 0.6}
                  stroke={isHighlighted('region-lateral') ? '#fef08a' : '#be123c'}
                  strokeWidth={isHighlighted('region-lateral') ? 3 : 1}
                  className="transition-all duration-300"
                />
                <text x="290" y="210" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Lateral LV</text>
                <text x="290" y="222" fill="#e9d5ff" fontSize="7" textAnchor="middle">(I, aVL, V5, V6)</text>

                {/* 5. High Lateral Spot */}
                <circle
                  id="region-high-lateral"
                  cx="285"
                  cy="155"
                  r="16"
                  fill={isHighlighted('region-high-lateral') ? '#38bdf8' : 'none'}
                  stroke={isHighlighted('region-high-lateral') ? '#ffffff' : 'none'}
                  strokeWidth="2"
                  opacity="0.85"
                />

                {/* 6. Inferior border seen anteriorly */}
                <path
                  id="region-inferior"
                  d="M 160 330 C 190 365, 235 375, 260 355 L 230 340 Z"
                  fill={isHighlighted('region-inferior') ? '#10b981' : '#2b0716'}
                  opacity={isHighlighted('region-inferior') ? 0.95 : 0.5}
                  stroke={isHighlighted('region-inferior') ? '#ffffff' : 'none'}
                  strokeWidth="2"
                />

                {/* Coronary Arteries (Vivid anatomical overlay) */}
                {/* RCA Course in right atrioventricular groove */}
                <path
                  d="M 180 120 C 145 130, 120 150, 115 190 C 110 230, 120 270, 135 295"
                  fill="none"
                  stroke={isHighlighted('artery-rca') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-rca') ? 5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-rca') ? 'url(#heartGlow)' : undefined}
                />
                {/* RCA Acute marginal branches */}
                <path d="M 115 190 L 140 220" fill="none" stroke="#ef4444" strokeWidth="2" />
                <path d="M 120 240 L 150 260" fill="none" stroke="#ef4444" strokeWidth="2" />
                <text x="90" y="180" fill="#fbbf24" fontSize="8" fontWeight="bold">RCA</text>

                {/* Left Main (LMCA) beneath pulmonary trunk */}
                <path d="M 215 125 L 225 140" fill="none" stroke="#ef4444" strokeWidth="5" />
                <text x="235" y="135" fill="#f87171" fontSize="7.5" fontWeight="bold">LMCA</text>

                {/* LAD coursing down anterior interventricular sulcus to apex */}
                <path
                  d="M 225 140 C 220 170, 205 230, 205 280 C 205 320, 215 350, 228 370"
                  fill="none"
                  stroke={isHighlighted('artery-lad') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lad') ? 5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-lad') ? 'url(#heartGlow)' : undefined}
                />
                {/* LAD Diagonal branches (D1, D2) */}
                <path d="M 220 175 L 255 210" fill="none" stroke="#ef4444" strokeWidth="2.2" />
                <text x="260" y="200" fill="#fca5a5" fontSize="7">D1 Branch</text>
                <path d="M 210 240 L 245 270" fill="none" stroke="#ef4444" strokeWidth="2" />
                <text x="250" y="265" fill="#fca5a5" fontSize="7">D2 Branch</text>
                {/* Septal perforators (dashed into septum) */}
                <path d="M 215 190 L 185 205" fill="none" stroke="#f87171" strokeWidth="1.8" strokeDasharray="2,2" />
                <path d="M 208 230 L 180 245" fill="none" stroke="#f87171" strokeWidth="1.8" strokeDasharray="2,2" />
                <text x="160" y="200" fill="#fca5a5" fontSize="6.5">Septal (S1)</text>

                {/* LCx coursing in left AV groove */}
                <path
                  d="M 225 140 C 255 145, 290 160, 305 190"
                  fill="none"
                  stroke={isHighlighted('artery-lcx') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lcx') ? 5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-lcx') ? 'url(#heartGlow)' : undefined}
                />
                {/* Obtuse marginal branches (OM1) */}
                <path d="M 270 155 L 290 200" fill="none" stroke="#ef4444" strokeWidth="2.2" />
                <text x="310" y="165" fill="#fbbf24" fontSize="8" fontWeight="bold">LCx (OM)</text>

                {/* Cardiac Apex */}
                <circle cx="230" cy="372" r="3.5" fill="#ffffff" />
                <text x="230" y="390" fill="#cbd5e1" fontSize="8" textAnchor="middle" fontWeight="bold">Cardiac Apex</text>
              </g>
            ) : (
              /* POSTERIOR / INFERIOR VIEW */
              <g>
                {/* Posterior Ventricular Mass */}
                <path
                  d="M 120 120
                     C 80 160, 85 240, 115 300
                     C 145 350, 195 375, 235 370
                     C 285 365, 320 310, 325 240
                     C 325 180, 295 130, 250 115
                     Z"
                  fill="url(#heartBaseGrad)"
                  stroke="#fda4af"
                  strokeWidth="2"
                />

                {/* Posterior Left Ventricle Region (V7-V9 territory) */}
                <path
                  id="region-posterior"
                  d="M 125 140 C 95 180, 95 245, 125 300 L 195 340 L 195 140 Z"
                  fill={isHighlighted('region-posterior') ? '#f97316' : '#4a044e'}
                  opacity={isHighlighted('region-posterior') ? 0.95 : 0.6}
                  stroke={isHighlighted('region-posterior') ? '#ffffff' : '#701a75'}
                  strokeWidth={isHighlighted('region-posterior') ? 3 : 1}
                />
                <text x="145" y="220" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Posterior Wall</text>
                <text x="145" y="235" fill="#fed7aa" fontSize="8" textAnchor="middle">(V7, V8, V9)</text>

                {/* Inferior / Diaphragmatic Wall (II, III, aVF) */}
                <path
                  id="region-inferior-post"
                  d="M 195 140 L 195 340 C 235 370, 275 355, 305 300 L 285 140 Z"
                  fill={isHighlighted('region-inferior-post') ? '#10b981' : '#312e81'}
                  opacity={isHighlighted('region-inferior-post') ? 0.95 : 0.6}
                  stroke={isHighlighted('region-inferior-post') ? '#ffffff' : '#3730a3'}
                  strokeWidth={isHighlighted('region-inferior-post') ? 3 : 1}
                />
                <text x="245" y="220" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Inferior Wall</text>
                <text x="245" y="235" fill="#a7f3d0" fontSize="8" textAnchor="middle">(II, III, aVF)</text>

                {/* Posterior Descending Artery (PDA) coursing in posterior interventricular groove */}
                <path
                  id="artery-rca-pda"
                  d="M 195 130 L 195 350"
                  fill="none"
                  stroke={isHighlighted('artery-rca-pda') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-rca-pda') ? 5 : 3.5}
                  strokeLinecap="round"
                  filter={isHighlighted('artery-rca-pda') ? 'url(#heartGlow)' : undefined}
                />
                <text x="200" y="270" fill="#fbbf24" fontSize="8" fontWeight="bold">PDA (from RCA ~85%)</text>

                {/* Posterolateral Branches (from LCx or RCA) */}
                <path
                  id="artery-lcx-post"
                  d="M 140 140 C 130 180, 135 220, 150 260"
                  fill="none"
                  stroke={isHighlighted('artery-lcx-post') ? '#fbbf24' : '#ef4444'}
                  strokeWidth={isHighlighted('artery-lcx-post') ? 4 : 2.5}
                />
                <text x="130" y="170" fill="#fca5a5" fontSize="7.5">PLB Branch</text>
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
                onClick={() => {
                  onSelectTerritory(key);
                  if (key === 'posterior' || key === 'inferior') {
                    if (key === 'posterior') setViewOrientation('posterior');
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
