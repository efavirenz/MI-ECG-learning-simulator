import { useState } from 'react';
import { Activity, ShieldCheck, HeartPulse, Menu, X, Check, Palette } from 'lucide-react';
import { THEMES, getTheme } from '../data/themes';

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
  currentThemeId: string;
  onSelectTheme: (themeId: string) => void;
}

export default function Navbar({
  activeTab,
  onSelectTab,
  selectedTerritoryId,
  onSelectTerritory,
  currentThemeId,
  onSelectTheme
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const currentTheme = getTheme(currentThemeId);
  const isBright = currentTheme.mode === 'bright';

  const navItems: { id: TabType; label: string; number: string }[] = [
    { id: 'basics', label: '1. ECG Basics', number: '1' },
    { id: 'electrodes', label: '2. Electrode Placement', number: '2' },
    { id: 'supplemental', label: '3. Supplemental Leads', number: '3' },
    { id: 'localization', label: '4. MI Localization', number: '4' },
    { id: 'waveforms', label: '5. Waveform Simulator', number: '5' },
    { id: 'cases', label: '6. Cases & Quiz', number: '6' },
    { id: 'references', label: '7. References & Criteria', number: '7' },
  ];

  const handleTabClick = (tabId: TabType) => {
    onSelectTab(tabId);
    setIsMenuOpen(false); // Auto-close drawer on selection
  };

  const handleThemeClick = (themeId: string) => {
    onSelectTheme(themeId);
    setIsMenuOpen(false); // Auto-close drawer on selection
  };

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${currentTheme.navBg} ${currentTheme.borderCol}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Row 1: Top Bar with Hamburger, Logo, Clinical Title, and v3 Badge */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Top Left: Hamburger Menu Button + Logo + Title */}
          <div className="flex items-center gap-3">
            {/* Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Navigation & Themes Menu"
              className={`p-2 rounded-xl border transition shadow-sm flex items-center justify-center ${
                isBright
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* HeartPulse Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-lg shadow-rose-950/40 flex-shrink-0">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-base sm:text-lg font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  12-Lead ECG & MI Simulator
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  ACC/AHA 2025 • ESC 2023
                </span>
              </div>
              <p className={`text-[11px] hidden sm:block ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Interactive Clinical Simulator: Anatomy → Electrodes → ECG Waveforms
              </p>
            </div>
          </div>

          {/* Top Right: Version Number (v3 in rounded rectangle) */}
          <div className="flex items-center gap-2">
            <span
              title="Simulator Version 3.0"
              className="px-2.5 py-1 rounded-lg border border-rose-500/50 bg-rose-950/60 text-rose-300 font-mono font-bold text-xs tracking-wider shadow-sm flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              v3
            </span>
          </div>
        </div>

        {/* Row 2: Centered Active MI State Dropdown (Between Title/Subtitle and 1. ECG Basics Tab) */}
        <div className={`w-full py-2 flex justify-center items-center border-t border-b ${currentTheme.borderCol}`}>
          <div className={`w-full max-w-3xl flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border shadow-inner text-xs transition-colors ${
            isBright
              ? 'bg-white/95 border-slate-300 text-slate-800'
              : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
          }`}>
            <Activity className="w-4 h-4 text-rose-500 flex-shrink-0 animate-pulse" />
            <label htmlFor="active-mi-select" className={`font-semibold whitespace-nowrap text-xs flex items-center gap-1 ${
              isBright ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Active MI State:
            </label>
            <select
              id="active-mi-select"
              value={selectedTerritoryId}
              onChange={(e) => onSelectTerritory(e.target.value)}
              className={`flex-1 w-full max-w-2xl font-semibold font-mono text-xs rounded-lg px-3 py-1.5 border focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer text-center transition-colors ${
                isBright
                  ? 'bg-slate-50 text-rose-700 border-slate-300'
                  : 'bg-slate-950 text-rose-400 border-slate-700'
              }`}
            >
              <optgroup label="Baseline">
                <option value="normal">Normal Baseline (Sinus Rhythm)</option>
              </optgroup>
              <optgroup label="Acute STEMI Territories">
                <option value="septal">Septal STEMI (V1–V2 • LAD Septal Perforators)</option>
                <option value="anterior">Anterior STEMI (V3–V4 • Mid LAD / Diagonals)</option>
                <option value="anteroseptal">Anteroseptal STEMI (V1–V4 • Proximal LAD)</option>
                <option value="extensive_anterior">Extensive Anterior (V1–V6, I, aVL • Proximal LAD / LMCA)</option>
                <option value="lateral">Lateral STEMI (I, aVL, V5–V6 • LCx / Diagonals)</option>
                <option value="high_lateral">High Lateral STEMI (I, aVL • D1 / OM1)</option>
                <option value="inferior">Inferior STEMI (II, III, aVF • RCA / LCx)</option>
                <option value="posterior">Posterior STEMI (V7–V9 / Reciprocal V1–V3 • LCx / RCA)</option>
                <option value="right_ventricular">Right Ventricular Infarction (V3R, V4R • Proximal RCA)</option>
              </optgroup>
              <optgroup label="STEMI Mimics">
                <option value="pericarditis">Acute Pericarditis (Diffuse Concave ST & PR Depression)</option>
                <option value="early_repolarization">Benign Early Repolarization (Concave ST & J-Point Notch)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Row 3: Navigation Tabs Bar (Starting with 1. ECG Basics) */}
        <nav className="flex space-x-1 overflow-x-auto py-2 no-scrollbar">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md'
                    : isBright
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Auto-closing Hamburger Navigation & Theme Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Semi-transparent Backdrop (auto-closes on click) */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-in Drawer Content */}
          <div className={`relative z-10 w-84 max-w-[85vw] h-full shadow-2xl overflow-y-auto flex flex-col justify-between p-5 border-r transition-colors ${
            isBright
              ? 'bg-white border-slate-300 text-slate-900'
              : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">ECG Simulator Menu</h3>
                    <span className="text-[11px] text-slate-400 font-mono">Clinical Modules & Themes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950/80 text-rose-300 border border-rose-600/40">
                    v3
                  </span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Section 1: The 7 Navigation Tabs */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 block">
                  Modules & Curriculum (7 Tabs)
                </span>
                <div className="space-y-1">
                  {navItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabClick(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                          isActive
                            ? 'bg-rose-600 text-white shadow'
                            : isBright
                            ? 'text-slate-700 hover:bg-slate-100'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                            isActive
                              ? 'bg-rose-700 text-white'
                              : isBright
                              ? 'bg-slate-200 text-slate-700'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.number}
                          </span>
                          {item.label.replace(/^\d+\.\s*/, '')}
                        </span>
                        {isActive && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Section 2: Color Themes (5 Bright + 5 Dark) */}
              <div className="space-y-3 pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    Color Themes (10 Options)
                  </span>
                </div>

                {/* 5 Bright Colors */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block px-1">
                    Bright Themes (5)
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {THEMES.filter(t => t.mode === 'bright').map(theme => {
                      const isSelected = currentThemeId === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeClick(theme.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between border ${
                            isSelected
                              ? 'border-rose-500 bg-rose-500/10 text-rose-600 font-bold'
                              : isBright
                              ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                              : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-sm"
                              style={{ backgroundColor: theme.colorPreview }}
                            />
                            {theme.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5 Dark Colors */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block px-1">
                    Dark Themes (5)
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {THEMES.filter(t => t.mode === 'dark').map(theme => {
                      const isSelected = currentThemeId === theme.id;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeClick(theme.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center justify-between border ${
                            isSelected
                              ? 'border-rose-500 bg-rose-500/10 text-rose-400 font-bold'
                              : isBright
                              ? 'border-slate-200 hover:bg-slate-100 text-slate-700'
                              : 'border-slate-800 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: theme.colorPreview }}
                            />
                            {theme.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-700/50 text-[11px] text-slate-400 flex items-center justify-between">
              <span>ACC/AHA 2025 • ESC 2023</span>
              <span className="font-mono text-rose-400 font-bold">Release v3</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
