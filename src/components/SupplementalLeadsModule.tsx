import { useState } from 'react';
import { Sparkles, AlertTriangle, FileText } from 'lucide-react';
import AnteriorTorso from './AnteriorTorso';
import PosteriorTorso from './PosteriorTorso';
import { Electrode } from '../data/electrodes';
import { useTheme } from '../context/ThemeContext';

export default function SupplementalLeadsModule() {
  const { theme, isBright } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<'right' | 'posterior' | 'workflow'>('right');
  const [selectedElectrode, setSelectedElectrode] = useState<Electrode | null>(null);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className={`border rounded-xl p-5 shadow-lg transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className={`flex items-center gap-2 text-xs font-mono font-bold ${theme.accentText} uppercase tracking-wider`}>
              <Sparkles className="w-4 h-4" /> Supplemental ECG Lead Configurations
            </div>
            <h2 className={`text-xl font-bold mt-1 ${theme.headingColor}`}>
              Right-Sided (V3R/V4R) and Posterior (V7–V9) Acquisition
            </h2>
            <p className={`text-xs mt-1 max-w-2xl leading-relaxed ${theme.subtextColor}`}>
              Standard 12-lead ECGs face predominantly the anterior and lateral left ventricle, leaving the right ventricle and posterior basal LV in an "electrical blind spot". Learn when and how to acquire supplemental leads safely.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border text-xs transition-colors ${theme.cardSubBg} ${theme.cardBorder}`}>
            <button
              onClick={() => { setActiveSubTab('right'); setSelectedElectrode(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeSubTab === 'right'
                  ? 'bg-cyan-600 text-white shadow'
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Right-Sided Leads (V3R, V4R)
            </button>
            <button
              onClick={() => { setActiveSubTab('posterior'); setSelectedElectrode(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeSubTab === 'posterior'
                  ? 'bg-amber-600 text-white shadow'
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Posterior Leads (V7, V8, V9)
            </button>
            <button
              onClick={() => { setActiveSubTab('workflow'); setSelectedElectrode(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeSubTab === 'workflow'
                  ? 'bg-emerald-600 text-white shadow'
                  : isBright ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Prehospital & Clinical Workflow
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: RIGHT-SIDED LEADS (V3R, V4R) */}
      {activeSubTab === 'right' && (
        <div className="space-y-6 animate-fade-in">
          {/* Clinical Rationale Alert Cards (Dark text on light background in bright mode) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isBright
                ? 'bg-cyan-50 border-cyan-200 text-slate-800'
                : 'bg-cyan-950/40 border-cyan-500/40 text-slate-200'
            }`}>
              <span className={`font-bold uppercase tracking-wide block text-[11px] ${
                isBright ? 'text-cyan-800' : 'text-cyan-300'
              }`}>
                Primary Indication:
              </span>
              <p className="font-semibold leading-relaxed">
                Suspected Inferior STEMI (ST elevation in II, III, aVF) or unexplained hypotension with clear lung fields.
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                30% to 50% of acute inferior myocardial infarctions involve the right ventricle.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isBright
                ? 'bg-red-50 border-red-200 text-slate-800'
                : 'bg-rose-950/40 border-rose-500/40 text-slate-200'
            }`}>
              <span className={`font-bold uppercase tracking-wide flex items-center gap-1 text-[11px] ${
                isBright ? 'text-red-700' : 'text-rose-300'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" /> Hemodynamic Danger:
              </span>
              <p className={`font-bold leading-relaxed ${isBright ? 'text-red-950' : 'text-white'}`}>
                Avoid nitroglycerin in suspected RV infarction; do not apply a blanket prohibition to all medication classes.
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
                Morphine is not universally contraindicated and, if considered for pain resistant to other maximally tolerated anti-ischaemic medication, requires the cited guideline context and monitoring. Diuretic use depends on haemodynamic and volume status.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isBright
                ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                : 'bg-emerald-950/40 border-emerald-500/40 text-slate-200'
            }`}>
              <span className={`font-bold uppercase tracking-wide block text-[11px] ${
                isBright ? 'text-emerald-800' : 'text-emerald-300'
              }`}>
                Interpretation Guardrail:
              </span>
              <p className="font-semibold leading-relaxed">
                Assess the right-sided tracing with the full clinical and ECG context.
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Acquire supplemental right-sided leads promptly when RV involvement is suspected.
              </p>
            </div>
          </div>

          {/* Interactive Anterior Torso with Right Precordial Leads Highlighted */}
          <AnteriorTorso
            selectedElectrodeId={selectedElectrode?.id || 'v4r'}
            onSelectElectrode={setSelectedElectrode}
            showSupplementalRight={true}
          />
        </div>
      )}

      {/* SUB-TAB 2: POSTERIOR LEADS (V7, V8, V9) */}
      {activeSubTab === 'posterior' && (
        <div className="space-y-6 animate-fade-in">
          {/* Clinical Rationale Alert Cards (Dark text on light background in bright mode) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isBright
                ? 'bg-amber-50 border-amber-200 text-slate-800'
                : 'bg-amber-950/40 border-amber-500/40 text-slate-200'
            }`}>
              <span className={`font-bold uppercase tracking-wide block text-[11px] ${
                isBright ? 'text-amber-800' : 'text-amber-300'
              }`}>
                Primary Indication:
              </span>
              <p className="font-semibold leading-relaxed">
                Ongoing ischemic chest pain with ST depression, tall R waves, or upright T waves in leads V1–V3.
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Also indicated for persistent high-suspicion chest pain with a nondiagnostic initial 12-lead.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isBright
                ? 'bg-indigo-50 border-indigo-200 text-slate-800'
                : 'bg-indigo-950/40 border-indigo-500/40 text-slate-200'
            }`}>
              <span className={`font-bold uppercase tracking-wide block text-[11px] ${
                isBright ? 'text-indigo-800' : 'text-indigo-300'
              }`}>
                Mirror Image Reciprocal Clue:
              </span>
              <p className="font-semibold leading-relaxed">
                Standard V1–V3 are the reciprocal view of the posterior wall!
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
                Posterior wall injury may create reciprocal horizontal ST depression and tall R waves in V1–V3; interpret these as contextual clues rather than a standalone diagnosis.
              </p>
            </div>

            <div className={`p-4 rounded-xl border space-y-1.5 ${
              isBright
                ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                : 'bg-emerald-950/40 border-emerald-500/40 text-slate-200'
            }`}>
              <span className={`font-bold uppercase tracking-wide block text-[11px] ${
                isBright ? 'text-emerald-800' : 'text-emerald-300'
              }`}>
                Interpretation Guardrail:
              </span>
              <p className="font-semibold leading-relaxed">
                Interpret posterior-lead findings as a lead-group pattern using an explicitly selected source framework; do not treat one lead in isolation as confirmation.
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Posterior leads are acquired when LCx occlusion is suspected, particularly with isolated anterior ST depression. The source-specific lead combination and certainty level must be retained; no universal single-lead confirmation statement is made here.
              </p>
            </div>
          </div>

          {/* Interactive Posterior Torso with V7, V8, V9 Highlighted */}
          <PosteriorTorso
            selectedElectrodeId={selectedElectrode?.id || 'v8'}
            onSelectElectrode={setSelectedElectrode}
          />
        </div>
      )}

      {/* SUB-TAB 3: STEP-BY-STEP ACQUISITION WORKFLOW */}
      {activeSubTab === 'workflow' && (
        <div className={`border rounded-xl p-6 space-y-6 animate-fade-in text-xs transition-colors ${theme.cardBg} ${theme.cardBorder}`}>
          <div className={`border-b pb-3 ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
            <h3 className={`text-base font-bold flex items-center gap-2 ${theme.headingColor}`}>
              <FileText className="w-4 h-4 text-emerald-500" />
              Standard Prehospital & Emergency Lead Acquisition Workflow
            </h3>
            <p className={`mt-1 ${theme.subtextColor}`}>
              Follow this procedural protocol derived from Queensland Ambulance Service (QAS) June 2026 Clinical Practice Procedures and 2025 ACC/AHA guidelines.
            </p>
          </div>

          {/* Step-by-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              <div className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className={`text-sm font-bold ${theme.headingColor}`}>Record Standard 12-Lead ECG</h4>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                Obtain a clean baseline 12-lead ECG with all 10 physical electrodes (4 limb, 6 precordial V1–V6). Ensure patient is supine and relaxed.
              </p>
              <div className={`p-2 rounded border text-[11px] ${
                isBright ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                Landmarks: Angle of Louis, 4th ICS (V1/V2), 5th ICS MCL (V4).
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className={`text-sm font-bold ${theme.headingColor}`}>Assess for Supplemental Triggers</h4>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                Examine tracing for indications:
              </p>
              <ul className={`space-y-1 list-disc list-inside ${theme.subtextColor}`}>
                <li><strong className="text-amber-600 dark:text-amber-300">Inferior STEMI:</strong> ST elevation in II, III, aVF → Record Right-Sided (V4R).</li>
                <li><strong className="text-amber-600 dark:text-amber-300">Posterior Signs:</strong> ST depression in V1–V3 with tall R waves → Record Posterior (V7–V9).</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className={`text-sm font-bold ${theme.headingColor}`}>Reposition & MANDATORY Re-label</h4>
              <p className={`leading-relaxed ${theme.subtextColor}`}>
                Standard 10-lead machines require repositioning cables:
              </p>
              <ul className={`space-y-1 list-disc list-inside ${theme.subtextColor}`}>
                <li>Move V4 cable to right 5th ICS MCL → <strong className="text-rose-600 dark:text-rose-400">Write "V4R"</strong>.</li>
                <li>Move V4–V6 cables to back → <strong className="text-rose-600 dark:text-rose-400">Write "V7, V8, V9"</strong>.</li>
              </ul>
            </div>
          </div>

          {/* Crucial Clinical Caution Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isBright ? 'bg-red-50 border-red-200 text-slate-800' : 'bg-rose-950/50 border-rose-500/50 text-slate-200'
          }`}>
            <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className={`text-sm font-bold ${isBright ? 'text-red-800' : 'text-rose-200'}`}>
                CRITICAL WARNING: The Risk of the Unlabeled Supplemental Tracing
              </h4>
              <p className="leading-relaxed">
                When you move the physical cable labeled <span className={`font-mono font-bold ${isBright ? 'text-red-950' : 'text-white'}`}>"V4"</span> onto the patient's right chest (to record V4R), the ECG machine computer still prints <span className={`font-mono font-bold ${isBright ? 'text-red-950' : 'text-white'}`}>"Lead V4"</span> at the top of the tracing.
              </p>
              <p className={`leading-relaxed ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
                If the tracing is not immediately and clearly hand-annotated with <strong className="text-amber-600 dark:text-amber-300">"V4R"</strong>, another clinician or receiving emergency physician may misread the ST elevation as an acute anterior LAD infarction instead of a right ventricular infarction!
              </p>
            </div>
          </div>

          {/* Reassignment Practical Reference Table */}
          <div className={`rounded-xl border overflow-hidden ${
            isBright ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <div className={`px-4 py-2.5 font-bold text-xs ${
              isBright ? 'bg-slate-100 text-slate-800' : 'bg-slate-800/80 text-white'
            }`}>
              Physical Cable Reassignment Protocol (10-Electrode Equipment)
            </div>
            <table className="w-full text-left text-xs">
              <thead className={`border-b ${
                isBright ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}>
                <tr>
                  <th className="p-3">Supplemental Configuration</th>
                  <th className="p-3">Physical Machine Cable Repurposed</th>
                  <th className="p-3">New Patient Placement Site</th>
                  <th className="p-3">Required Clinician Hand Annotation</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isBright ? 'divide-slate-200 text-slate-800' : 'divide-slate-800/60 text-slate-200'}`}>
                <tr>
                  <td className="p-3 font-semibold text-cyan-600 dark:text-cyan-400">Right Ventricular (V4R)</td>
                  <td className="p-3 font-mono font-bold">V4 Cable</td>
                  <td className="p-3">Right 5th intercostal space, right midclavicular line</td>
                  <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">Cross out V4 → write "V4R"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-600 dark:text-cyan-400">Right Ventricular (V3R)</td>
                  <td className="p-3 font-mono font-bold">V3 Cable</td>
                  <td className="p-3">Between V1 and V4R on right anterior chest</td>
                  <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">Cross out V3 → write "V3R"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">Posterior (V7)</td>
                  <td className="p-3 font-mono font-bold">V4 Cable</td>
                  <td className="p-3">Left posterior axillary line (horizontal level of V6)</td>
                  <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">Cross out V4 → write "V7"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">Posterior (V8)</td>
                  <td className="p-3 font-mono font-bold">V5 Cable</td>
                  <td className="p-3">Left midscapular line below tip (horizontal level of V6)</td>
                  <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">Cross out V5 → write "V8"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-600 dark:text-amber-400">Posterior (V9)</td>
                  <td className="p-3 font-mono font-bold">V6 Cable</td>
                  <td className="p-3">Left paraspinal border (horizontal level of V6)</td>
                  <td className="p-3 font-mono font-bold text-rose-600 dark:text-rose-400">Cross out V6 → write "V9"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
