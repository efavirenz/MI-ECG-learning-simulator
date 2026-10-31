import { useState, useEffect } from 'react';
import Navbar, { TabType } from './components/Navbar';
import ECGBasicsModule from './components/ECGBasicsModule';
import AnteriorTorso from './components/AnteriorTorso';
import SupplementalLeadsModule from './components/SupplementalLeadsModule';
import HeartTerritoryView from './components/HeartTerritoryView';
import ECGWaveformMonitor from './components/ECGWaveformMonitor';
import ClinicalScenariosModule from './components/ClinicalScenariosModule';
import ReferencesModule from './components/ReferencesModule';
import { MI_TERRITORIES } from './data/miTerritories';
import { Electrode } from './data/electrodes';
import { THEMES, DEFAULT_THEME_ID, getTheme } from './data/themes';
import { Activity, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('localization');
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>('inferior');
  const [selectedElectrode, setSelectedElectrode] = useState<Electrode | null>(null);

  // Theme state persisted in localStorage
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('ecg-simulator-theme') || DEFAULT_THEME_ID;
  });

  const currentTheme = getTheme(currentThemeId);
  const isBright = currentTheme.mode === 'bright';

  // Paper mode tied to active theme, but still toggleable in waveform monitor
  const [paperMode, setPaperMode] = useState<'dark' | 'paper'>(currentTheme.paperMode);

  useEffect(() => {
    setPaperMode(currentTheme.paperMode);
  }, [currentTheme.paperMode]);

  const handleSelectTheme = (themeId: string) => {
    const foundTheme = THEMES.find(t => t.id === themeId);
    if (!foundTheme) return;
    setCurrentThemeId(themeId);
    localStorage.setItem('ecg-simulator-theme', themeId);
    setPaperMode(foundTheme.paperMode);
  };

  const territory = MI_TERRITORIES[selectedTerritoryId] || MI_TERRITORIES['normal'];

  const togglePaperMode = () => {
    setPaperMode(prev => (prev === 'dark' ? 'paper' : 'dark'));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${currentTheme.appBg} ${currentTheme.textColor} selection:bg-rose-500 selection:text-white`}>
      {/* Top Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedTerritoryId={selectedTerritoryId}
        onSelectTerritory={setSelectedTerritoryId}
        currentThemeId={currentThemeId}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Synchronized Educational Context Banner */}
        <div className={`border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl transition-colors ${
          isBright
            ? 'bg-white/90 border-slate-200 text-slate-900 shadow-slate-200/50'
            : 'bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 border-slate-800 text-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-500 font-bold flex-shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-wider text-rose-500 font-bold">
                  Synchronized Educational Core
                </span>
                <span className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>• Concept Triad</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 flex-wrap">
                <span>Anatomy ({territory.name.replace(' STEMI', '')})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span>Leads ({territory.primaryLeads.join(', ') || 'Baseline'})</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span>Waveform Abnormalities</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('waveforms')}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" /> View Animated Waveforms
            </button>
            <button
              onClick={() => setActiveTab('localization')}
              className={`px-3.5 py-1.5 font-semibold text-xs rounded-xl border transition ${
                isBright
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Heart Territories
            </button>
          </div>
        </div>

        {/* Tab 1: ECG Basics */}
        {activeTab === 'basics' && <ECGBasicsModule />}

        {/* Tab 2: Electrode Placement Simulator */}
        {activeTab === 'electrodes' && (
          <div className="space-y-6">
            <div className={`border rounded-xl p-5 shadow-lg transition-colors ${
              isBright ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider block mb-1">
                Module 1: Standard 12-Lead Placement Simulator
              </span>
              <h2 className={`text-xl font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Anterior Chest Anatomy & Precordial Electrode Positioning
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
                Click any electrode marker on the interactive 2D adult torso to inspect anatomical landmarks, the Angle of Louis, step-by-step placement, and common clinical pitfalls. Or switch to Practice Mode for an interactive placement test.
              </p>
            </div>

            <AnteriorTorso
              selectedElectrodeId={selectedElectrode?.id || null}
              onSelectElectrode={setSelectedElectrode}
              showSupplementalRight={true}
            />
          </div>
        )}

        {/* Tab 3: Supplemental Leads (Right & Posterior) */}
        {activeTab === 'supplemental' && <SupplementalLeadsModule />}

        {/* Tab 4: MI Localization (Interactive Heart Anatomy) */}
        {activeTab === 'localization' && (
          <div className="space-y-6">
            <div className={`border rounded-xl p-5 shadow-lg transition-colors ${
              isBright ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider block mb-1">
                Module 3: Myocardial Infarction Anatomical Localization
              </span>
              <h2 className={`text-xl font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Coronary Perfusion Territories & Lead Group Correlation
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
                Select any myocardial infarction location on the heart below to visualize the affected coronary artery branch, contiguous ECG leads, reciprocal mirror changes, and clinical considerations.
              </p>
            </div>

            <HeartTerritoryView
              selectedTerritoryId={selectedTerritoryId}
              onSelectTerritory={setSelectedTerritoryId}
            />
          </div>
        )}

        {/* Tab 5: ECG Waveform Simulator */}
        {activeTab === 'waveforms' && (
          <div className="space-y-6">
            <div className={`border rounded-xl p-5 shadow-lg transition-colors ${
              isBright ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider block mb-1">
                Module 4: Calibrated ECG Waveform Simulator
              </span>
              <h2 className={`text-xl font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Live 12-Lead Animated Traces & Rhythm Strip
              </h2>
              <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
                Calibrated to clinical standards (25 mm/s paper speed, 10 mm/mV voltage calibration). Click on any lead to open the magnified inspection modal with J-point calipers and interval measurements.
              </p>
            </div>

            <ECGWaveformMonitor
              selectedTerritoryId={selectedTerritoryId}
              paperMode={paperMode}
              onTogglePaperMode={togglePaperMode}
            />
          </div>
        )}

        {/* Tab 6: Clinical Cases & Quiz */}
        {activeTab === 'cases' && (
          <ClinicalScenariosModule
            onSelectTerritoryForCase={(territoryId) => {
              setSelectedTerritoryId(territoryId);
            }}
          />
        )}

        {/* Tab 7: References & Diagnostic Criteria */}
        {activeTab === 'references' && <ReferencesModule />}
      </main>

      {/* Footer */}
      <footer className={`mt-auto border-t py-6 text-center text-xs transition-colors ${
        isBright
          ? 'bg-white/95 border-slate-200 text-slate-600'
          : 'bg-slate-950/80 border-slate-800 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-rose-500">
            Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator • Release v3.1
          </p>
          <p className={`text-[11px] max-w-xl mx-auto ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Developed in accordance with the 2025 ACC/AHA ACS Guidelines, 2023 ESC ACS Guidelines, and Queensland Ambulance Service March 2026 Clinical Practice Procedures. Educational model only.
          </p>
        </div>
      </footer>
    </div>
  );
}
