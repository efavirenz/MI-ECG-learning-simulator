import { useState } from 'react';
import { Sparkles, AlertTriangle, FileText } from 'lucide-react';
import AnteriorTorso from './AnteriorTorso';
import PosteriorTorso from './PosteriorTorso';
import { Electrode } from '../data/electrodes';

export default function SupplementalLeadsModule() {
  const [activeSubTab, setActiveSubTab] = useState<'right' | 'posterior' | 'workflow'>('right');
  const [selectedElectrode, setSelectedElectrode] = useState<Electrode | null>(null);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Supplemental ECG Lead Configurations
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Right-Sided (V3R/V4R) and Posterior (V7–V9) Acquisition
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Standard 12-lead ECGs face predominantly the anterior and lateral left ventricle, leaving the right ventricle and posterior basal LV in an "electrical blind spot". Learn when and how to acquire supplemental leads safely.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => { setActiveSubTab('right'); setSelectedElectrode(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeSubTab === 'right'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Right-Sided Leads (V3R, V4R)
            </button>
            <button
              onClick={() => { setActiveSubTab('posterior'); setSelectedElectrode(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeSubTab === 'posterior'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Posterior Leads (V7, V8, V9)
            </button>
            <button
              onClick={() => { setActiveSubTab('workflow'); setSelectedElectrode(null); }}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
                activeSubTab === 'workflow'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
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
          {/* Clinical Rationale Alert */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/40 rounded-xl space-y-1.5">
              <span className="font-bold text-cyan-300 uppercase tracking-wide block text-[11px]">
                Primary Indication:
              </span>
              <p className="text-slate-200 font-medium">
                Suspected Inferior STEMI (ST elevation in II, III, aVF) or unexplained hypotension with clear lung fields.
              </p>
              <p className="text-slate-400 text-[11px]">
                30% to 50% of acute inferior myocardial infarctions involve the right ventricle.
              </p>
            </div>

            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-1.5">
              <span className="font-bold text-rose-300 uppercase tracking-wide block text-[11px] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Hemodynamic Danger:
              </span>
              <p className="text-slate-200 font-medium">
                DO NOT administer Nitrates, Morphine, or Diuretics!
              </p>
              <p className="text-slate-300 text-[11px]">
                The infarcted RV is a stiff conduit; cardiac output depends strictly on high venous preload. Nitrates drop preload causing catastrophic shock.
              </p>
            </div>

            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1.5">
              <span className="font-bold text-emerald-300 uppercase tracking-wide block text-[11px]">
                Diagnostic Threshold:
              </span>
              <p className="text-slate-200 font-medium">
                ST elevation ≥ 0.5 mm in lead V4R (≥ 1.0 mm in men &lt; 30 years old).
              </p>
              <p className="text-slate-400 text-[11px]">
                Lead V4R has ~100% sensitivity when recorded early (fades within 10 hours).
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
          {/* Clinical Rationale Alert */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-1.5">
              <span className="font-bold text-amber-300 uppercase tracking-wide block text-[11px]">
                Primary Indication:
              </span>
              <p className="text-slate-200 font-medium">
                Ongoing ischemic chest pain with ST depression, tall R waves, or upright T waves in leads V1–V3.
              </p>
              <p className="text-slate-400 text-[11px]">
                Also indicated for persistent high-suspicion chest pain with a nondiagnostic initial 12-lead.
              </p>
            </div>

            <div className="p-4 bg-indigo-950/40 border border-indigo-500/40 rounded-xl space-y-1.5">
              <span className="font-bold text-indigo-300 uppercase tracking-wide block text-[11px]">
                Mirror Image Reciprocal Clue:
              </span>
              <p className="text-slate-200 font-medium">
                Standard V1–V3 are the reciprocal view of the posterior wall!
              </p>
              <p className="text-slate-300 text-[11px]">
                Posterior transmural injury vectors away from the front chest, showing horizontal ST depression and tall R waves in V1–V3.
              </p>
            </div>

            <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1.5">
              <span className="font-bold text-emerald-300 uppercase tracking-wide block text-[11px]">
                Diagnostic Threshold:
              </span>
              <p className="text-slate-200 font-medium">
                ST elevation ≥ 0.5 mm in leads V7, V8, or V9.
              </p>
              <p className="text-slate-400 text-[11px]">
                Voltage is attenuated by thick back musculature; 0.5 mm is fully diagnostic of posterior STEMI.
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6 animate-fade-in text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Standard Prehospital & Emergency Lead Acquisition Workflow
            </h3>
            <p className="text-slate-400 mt-1">
              Follow this procedural protocol derived from Queensland Ambulance Service (QAS) March 2026 Clinical Practice Procedures and 2025 ACC/AHA guidelines.
            </p>
          </div>

          {/* Step-by-Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Record Standard 12-Lead ECG</h4>
              <p className="text-slate-300 leading-relaxed">
                Obtain a clean baseline 12-lead ECG with all 10 physical electrodes (4 limb, 6 precordial V1–V6). Ensure patient is supine and relaxed.
              </p>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] text-slate-400">
                Landmarks: Angle of Louis, 4th ICS (V1/V2), 5th ICS MCL (V4).
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Assess for Supplemental Triggers</h4>
              <p className="text-slate-300 leading-relaxed">
                Examine tracing for indications:
              </p>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li><strong className="text-amber-300">Inferior STEMI:</strong> ST elevation in II, III, aVF → Record Right-Sided (V4R).</li>
                <li><strong className="text-amber-300">Posterior Signs:</strong> ST depression in V1–V3 with tall R waves → Record Posterior (V7–V9).</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Reposition & MANDATORY Re-label</h4>
              <p className="text-slate-300 leading-relaxed">
                Standard 10-lead machines require repositioning cables:
              </p>
              <ul className="space-y-1 text-slate-300 list-disc list-inside">
                <li>Move V4 cable to right 5th ICS MCL → <strong className="text-rose-400">Write "V4R"</strong>.</li>
                <li>Move V4–V6 cables to back → <strong className="text-rose-400">Write "V7, V8, V9"</strong>.</li>
              </ul>
            </div>
          </div>

          {/* Crucial Clinical Caution Banner */}
          <div className="p-4 bg-rose-950/50 border border-rose-500/50 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-200">
                CRITICAL WARNING: The Risk of the Unlabeled Supplemental Tracing
              </h4>
              <p className="text-slate-200 leading-relaxed">
                When you move the physical cable labeled <span className="font-mono font-bold text-white">"V4"</span> onto the patient's right chest (to record V4R), the ECG machine computer still prints <span className="font-mono font-bold text-white">"Lead V4"</span> at the top of the tracing.
              </p>
              <p className="text-slate-300 leading-relaxed">
                If the tracing is not immediately and clearly hand-annotated with <strong className="text-amber-300">"V4R"</strong>, another clinician or receiving emergency physician may misread the ST elevation as an acute anterior LAD infarction instead of a right ventricular infarction!
              </p>
            </div>
          </div>

          {/* Reassignment Practical Reference Table */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-800/80 font-bold text-white text-xs">
              Physical Cable Reassignment Protocol (10-Electrode Equipment)
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Supplemental Configuration</th>
                  <th className="p-3">Physical Machine Cable Repurposed</th>
                  <th className="p-3">New Patient Anatomical Position</th>
                  <th className="p-3">Mandatory Printout Annotation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-3 font-semibold text-cyan-400">Right-Sided V4R (Single Lead)</td>
                  <td className="p-3 font-mono">Lead V4 cable</td>
                  <td className="p-3">Right 5th intercostal space, right midclavicular line</td>
                  <td className="p-3 font-mono font-bold text-amber-400">Strike "V4" → write "V4R"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-400">Right-Sided V3R + V4R</td>
                  <td className="p-3 font-mono">Lead V3 & V4 cables</td>
                  <td className="p-3">V3R (midway V1–V4R), V4R (right 5th ICS MCL)</td>
                  <td className="p-3 font-mono font-bold text-amber-400">Write "V3R" and "V4R"</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-amber-400">Posterior Leads V7, V8, V9</td>
                  <td className="p-3 font-mono">Lead V4, V5, V6 cables</td>
                  <td className="p-3">V7 (left PAL), V8 (left midscapular), V9 (left paraspinal) — level with V6</td>
                  <td className="p-3 font-mono font-bold text-amber-400">Strike V4–V6 → write "V7, V8, V9"</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
