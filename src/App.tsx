import { useState, useEffect } from 'react';
import Navbar, { TabType } from './components/Navbar';
import ECGBasicsModule from './components/ECGBasicsModule';
import AnteriorTorso from './components/AnteriorTorso';
import SupplementalLeadsModule from './components/SupplementalLeadsModule';
import HeartTerritoryView from './components/HeartTerritoryView';
import ECGWaveformMonitor from './components/ECGWaveformMonitor';
import ClinicalScenariosModule from './components/ClinicalScenariosModule';
import ReferencesModule from './components/ReferencesModule';
import { Electrode } from './data/electrodes';
import { THEMES, DEFAULT_THEME_ID, getTheme } from './data/themes';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('basics');
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

  const togglePaperMode = () => {
    setPaperMode(prev => (prev === 'dark' ? 'paper' : 'dark'));
  };

  return (
    <ThemeProvider themeId={currentThemeId} onSelectTheme={handleSelectTheme}>
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${currentTheme.appBg} ${currentTheme.textColor}`}>
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
          {/* Tab 1: ECG Basics */}
          {activeTab === 'basics' && <ECGBasicsModule />}

          {/* Tab 2: Electrode Placement Simulator */}
          {activeTab === 'electrodes' && (
            <div className="space-y-6">
              <div className={`border rounded-xl p-5 shadow-lg transition-colors ${
                isBright ? `${currentTheme.cardBg} ${currentTheme.cardBorder}` : `${currentTheme.cardBg} ${currentTheme.cardBorder}`
              }`}>
                <span className={`text-xs font-mono font-bold ${currentTheme.accentText} uppercase tracking-wider block mb-1`}>
                  Module 1: Standard 12-Lead Placement Simulator
                </span>
                <h2 className={`text-xl font-bold ${currentTheme.headingColor}`}>
                  Anterior Chest Anatomy & Precordial Electrode Positioning
                </h2>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${currentTheme.subtextColor}`}>
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
                isBright ? `${currentTheme.cardBg} ${currentTheme.cardBorder}` : `${currentTheme.cardBg} ${currentTheme.cardBorder}`
              }`}>
                <span className={`text-xs font-mono font-bold ${currentTheme.accentText} uppercase tracking-wider block mb-1`}>
                  Module 3: Myocardial Infarction Anatomical Localization
                </span>
                <h2 className={`text-xl font-bold ${currentTheme.headingColor}`}>
                  Coronary Perfusion Territories & Lead Group Correlation
                </h2>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${currentTheme.subtextColor}`}>
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
                isBright ? `${currentTheme.cardBg} ${currentTheme.cardBorder}` : `${currentTheme.cardBg} ${currentTheme.cardBorder}`
              }`}>
                <span className={`text-xs font-mono font-bold ${currentTheme.accentText} uppercase tracking-wider block mb-1`}>
                  Module 4: Calibrated ECG Waveform Simulator
                </span>
                <h2 className={`text-xl font-bold ${currentTheme.headingColor}`}>
                  Live 12-Lead Animated Traces & Rhythm Strip
                </h2>
                <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${currentTheme.subtextColor}`}>
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
            <p className={`font-semibold ${currentTheme.accentText}`}>
              Interactive 12-Lead ECG & Myocardial Infarction Learning Simulator • Release v5.2
            </p>
            <p className={`text-[11px] max-w-xl mx-auto ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
              Developed in accordance with the 2025 ACC/AHA ACS Guidelines, 2023 ESC ACS Guidelines, and Queensland Ambulance Service March 2026 Clinical Practice Procedures. Educational model only.
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
