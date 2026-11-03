import { useState } from 'react';
import { STEMI_CRITERIA_TABLE, STEMI_MIMICS, ACS_EQUIVALENTS } from '../data/clinicalCriteria';
import { CLINICAL_REFERENCES, CLINICAL_DISCLAIMER } from '../data/references';
import { ExternalLink, ShieldAlert, BookOpen, Layers, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ReferencesModule() {
  const { theme, isBright } = useTheme();
  const [activeTab, setActiveTab] = useState<'criteria' | 'mimics' | 'equivalents' | 'references'>('criteria');

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className={`border rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
        <div>
          <div className={`flex items-center gap-2 font-mono font-bold ${theme.accentText} uppercase tracking-wider text-[11px]`}>
            <BookOpen className="w-4 h-4" /> Evidence-Based Cardiology Standards
          </div>
          <h2 className={`text-xl font-bold mt-1 ${theme.headingColor}`}>
            Clinical Diagnostic Criteria, STEMI Mimics & Guideline References
          </h2>
          <p className={`mt-1 max-w-2xl leading-relaxed ${theme.subtextColor}`}>
            Standard diagnostic thresholds and procedural standards compiled directly from 2025 ACC/AHA, 2023 ESC, 2026 ESC Universal Definition, and Queensland Ambulance Service June 2026 procedure.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
          <button
            onClick={() => setActiveTab('criteria')}
            aria-pressed={activeTab === 'criteria'}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'criteria'
                ? `${theme.accentBg} shadow`
                : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            STEMI Criteria by Age/Sex
          </button>
          <button
            onClick={() => setActiveTab('mimics')}
            aria-pressed={activeTab === 'mimics'}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'mimics'
                ? 'bg-rose-600 text-white shadow'
                : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            STEMI Mimics Comparison
          </button>
          <button
            onClick={() => setActiveTab('equivalents')}
            aria-pressed={activeTab === 'equivalents'}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'equivalents'
                ? 'bg-amber-600 text-white shadow'
                : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            ACS Equivalents (Wellens & de Winter)
          </button>
          <button
            onClick={() => setActiveTab('references')}
            aria-pressed={activeTab === 'references'}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'references'
                ? 'bg-indigo-600 text-white shadow'
                : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
            }`}
          >
            Guidelines & Disclaimer
          </button>
        </div>
      </div>

      {/* TAB 1: STEMI CRITERIA TABLE */}
      {activeTab === 'criteria' && (
        <div className="space-y-4 animate-fade-in">
          <div className={`border rounded-xl p-4 space-y-3 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
            <div className={`flex items-center justify-between border-b pb-2 ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.headingColor}`}>
                <Layers className="w-4 h-4 text-cyan-500" />
                Guideline ST-Segment Elevation Diagnostic Thresholds
              </h3>
              <span className={`text-[11px] ${theme.subtextColor}`}>
                Measured at the <strong className="text-amber-600 dark:text-amber-300">J point</strong> relative to the preceding <strong className="text-cyan-600 dark:text-cyan-300">PR segment</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className={`border-b text-[11px] ${
                  isBright ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}>
                  <tr>
                    <th className="p-3">ECG Leads</th>
                    <th className="p-3">Patient Group</th>
                    <th className="p-3">ST Elevation Threshold</th>
                    <th className="p-3">Guideline Source</th>
                    <th className="p-3">Clinical Justification & Details</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isBright ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-200'}`}>
                  {STEMI_CRITERIA_TABLE.map((row, idx) => (
                    <tr key={idx} className={isBright ? 'hover:bg-slate-50 transition' : 'hover:bg-slate-800/40 transition'}>
                      <td className="p-3 font-mono font-bold text-cyan-600 dark:text-cyan-300">{row.leads}</td>
                      <td className={`p-3 font-semibold ${theme.headingColor}`}>{row.patientGroup}</td>
                      <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">{row.thresholdMm}</td>
                      <td className={`p-3 text-[11px] ${theme.subtextColor}`}>{row.guidelineSource}</td>
                      <td className={`p-3 text-[11px] leading-relaxed ${theme.subtextColor}`}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Crucial Clinical Rule Card */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className={`p-3 rounded-lg border space-y-1 ${
                isBright ? 'bg-amber-50/80 border-amber-200 text-slate-800' : 'bg-slate-950 rounded-lg border border-slate-800 text-slate-300'
              }`}>
                <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Contiguous Leads Mandate:
                </span>
                <p className="leading-relaxed">
                  ST-segment elevation MUST be present in <strong className={theme.headingColor}>at least two anatomically contiguous leads</strong> (leads looking at the same myocardial territory, such as II + III + aVF for inferior, or V1 through V4 for anterior). Isolated single-lead elevation does not meet criteria.
                </p>
              </div>

              <div className={`p-3 rounded-lg border space-y-1 ${
                isBright ? 'bg-cyan-50/80 border-cyan-200 text-slate-800' : 'bg-slate-950 rounded-lg border border-slate-800 text-slate-300'
              }`}>
                <span className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> J-Point & Baseline Definition:
                </span>
                <p className="leading-relaxed">
                  The standard electrical reference baseline is the <strong className={theme.headingColor}>PR segment</strong> immediately preceding the QRS complex. The J point is where the QRS ends and ST segment begins. In severe sinus tachycardia where P waves merge, the TP segment may be used.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STEMI MIMICS COMPARISON */}
      {activeTab === 'mimics' && (
        <div className={`border rounded-xl p-4 space-y-4 animate-fade-in transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
          <div className={`border-b pb-2 flex items-center justify-between ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${theme.headingColor}`}>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Differential Diagnosis: STEMI vs Common ST-Elevation Mimics
            </h3>
            <span className={`text-[11px] ${theme.subtextColor}`}>
              Distinguishing features according to 2023 ESC & 2025 ACC/AHA
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className={`border-b text-[11px] ${
                isBright ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="p-3 w-32">Diagnostic Feature</th>
                  <th className="p-3 text-rose-600 dark:text-rose-400 font-bold">Acute STEMI</th>
                  <th className="p-3 text-amber-700 dark:text-amber-300">Acute Pericarditis</th>
                  <th className="p-3 text-emerald-700 dark:text-emerald-300">Benign Early Repol (BER)</th>
                  <th className="p-3 text-indigo-700 dark:text-indigo-300">LVH with Strain</th>
                  <th className="p-3 text-purple-700 dark:text-purple-300">Left Bundle Branch Block (LBBB)</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isBright ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-200'}`}>
                {STEMI_MIMICS.map((row, idx) => (
                  <tr key={idx} className={isBright ? 'hover:bg-slate-50 transition' : 'hover:bg-slate-800/40 transition'}>
                    <td className={`p-3 font-semibold ${theme.headingColor}`}>{row.feature}</td>
                    <td className={`p-3 font-medium ${isBright ? 'bg-rose-50 text-rose-900' : 'bg-rose-950/20 text-slate-200'}`}>{row.acuteSTEMI}</td>
                    <td className={`p-3 ${theme.subtextColor}`}>{row.pericarditis}</td>
                    <td className={`p-3 ${theme.subtextColor}`}>{row.earlyRepol}</td>
                    <td className={`p-3 ${theme.subtextColor}`}>{row.lvhWithStrain}</td>
                    <td className={`p-3 ${theme.subtextColor}`}>{row.lbbb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACS EQUIVALENTS */}
      {activeTab === 'equivalents' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACS_EQUIVALENTS.map((item, idx) => (
              <div key={idx} className={`border rounded-xl p-5 space-y-3 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-600 dark:text-amber-400 block">
                  High-Risk STEMI Equivalent
                </span>
                <h4 className={`text-sm font-bold ${theme.headingColor}`}>
                  {item.name}
                </h4>

                <div className={`p-3 rounded-lg border space-y-1 ${
                  isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                }`}>
                  <span className="font-semibold text-rose-600 dark:text-rose-300 text-[11px] block">
                    Diagnostic ECG Pattern:
                  </span>
                  <p className={`leading-relaxed whitespace-pre-line ${theme.subtextColor}`}>
                    {item.leadPattern}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-300 text-[11px] block mb-0.5">
                    Underlying Pathology:
                  </span>
                  <p className={`font-medium ${theme.subtextColor}`}>
                    {item.culpritPathology}
                  </p>
                </div>

                <div className={`p-3 rounded-lg border leading-relaxed ${
                  isBright ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}>
                  <strong className="block mb-0.5">Clinical Urgency:</strong>
                  {item.clinicalSignificance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REFERENCES & DISCLAIMER */}
      {activeTab === 'references' && (
        <div className="space-y-6 animate-fade-in">
          {/* Authoritative References List */}
          <div className={`border rounded-xl p-5 space-y-4 transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 border-b pb-2 ${
              isBright ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-white'
            }`}>
              <FileText className="w-4 h-4 text-emerald-500" />
              Authoritative Clinical Guidelines & Procedural Standards
            </h3>

            <div className="space-y-4">
              {CLINICAL_REFERENCES.map(ref => (
                <div key={ref.id} className={`p-4 rounded-xl border space-y-2 ${
                  isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className={`text-sm font-bold ${theme.headingColor}`}>
                        {ref.title}
                      </h4>
                      <p className="text-cyan-600 dark:text-cyan-400 font-medium text-[11px] mt-0.5">
                        {ref.organization} • {ref.year}
                      </p>
                    </div>

                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                        isBright 
                          ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                    >
                      <span>Direct Official Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <ul className={`space-y-1 list-disc list-inside pt-1 ${theme.subtextColor}`}>
                    {ref.keyContributions.map((c, cIdx) => (
                      <li key={cIdx} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Mandatory Clinical Disclaimer */}
          <div className={`border-2 rounded-xl p-5 space-y-2 ${
            isBright 
              ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
              : 'bg-amber-950/40 border-amber-600/50 text-slate-200'
          }`}>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{CLINICAL_DISCLAIMER.title}</span>
            </div>
            <p className={`leading-relaxed whitespace-pre-line text-xs ${isBright ? 'text-amber-900' : 'text-slate-300'}`}>
              {CLINICAL_DISCLAIMER.content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
