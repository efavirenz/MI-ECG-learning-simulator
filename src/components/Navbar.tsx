import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export type TabType = 
  | 'basics'
  | 'electrodes'
  | 'supplemental'
  | 'localization'
  | 'waveforms'
  | 'cases'
  | 'references';

interface NavbarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  selectedTerritoryId: string;
  onSelectTerritory: (territoryId: string) => void;
}

export default function Navbar({
  activeTab,
  onSelectTab,
  selectedTerritoryId,
  onSelectTerritory
}: NavbarProps) {
  const navItems: { id: TabType; label: string }[] = [
    { id: 'basics', label: '1. ECG Basics' },
    { id: 'electrodes', label: '2. Electrode Placement' },
    { id: 'supplemental', label: '3. Supplemental Leads' },
    { id: 'localization', label: '4. MI Localization' },
    { id: 'waveforms', label: '5. Waveform Simulator' },
    { id: 'cases', label: '6. Cases & Quiz' },
    { id: 'references', label: '7. References & Criteria' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Clinical Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-950/50 flex-shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  12-Lead ECG & MI Simulator
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ACC/AHA 2025 • ESC 2023
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Clinical Simulator: Anatomy → Electrodes → ECG Waveforms
              </p>
            </div>
          </div>

          {/* Top-Right: Interactive Active MI State Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 rounded-xl shadow-inner text-xs">
            <Activity className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <label htmlFor="active-mi-select" className="text-slate-400 text-[11px] font-medium whitespace-nowrap hidden sm:inline">
              Active MI State:
            </label>
            <select
              id="active-mi-select"
              value={selectedTerritoryId}
              onChange={(e) => onSelectTerritory(e.target.value)}
              className="bg-slate-950 text-rose-400 font-semibold font-mono text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <optgroup label="Baseline">
                <option value="normal">Normal Baseline (Sinus)</option>
              </optgroup>
              <optgroup label="Acute STEMI Territories">
                <option value="septal">Septal STEMI (V1–V2)</option>
                <option value="anterior">Anterior STEMI (V3–V4)</option>
                <option value="anteroseptal">Anteroseptal STEMI (V1–V4)</option>
                <option value="extensive_anterior">Extensive Anterior (V1–V6, I, aVL)</option>
                <option value="lateral">Lateral STEMI (I, aVL, V5–V6)</option>
                <option value="high_lateral">High Lateral STEMI (I, aVL)</option>
                <option value="inferior">Inferior STEMI (II, III, aVF)</option>
                <option value="posterior">Posterior STEMI (V7–V9 / Reciprocal V1–V3)</option>
                <option value="right_ventricular">Right Ventricular (V3R, V4R)</option>
              </optgroup>
              <optgroup label="STEMI Mimics">
                <option value="pericarditis">Acute Pericarditis</option>
                <option value="early_repolarization">Benign Early Repolarization</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar border-t border-slate-900">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
