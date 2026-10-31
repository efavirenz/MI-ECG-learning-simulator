import { useState } from 'react';
import { LEAD_MAPPINGS } from '../data/electrodes';
import { AlertTriangle, CheckCircle2, Activity } from 'lucide-react';

export default function ECGBasicsModule() {
  const [activeSection, setActiveSection] = useState<'electrodes_vs_leads' | 'limb_placement' | 'precordial_anatomy' | 'waveform_intervals'>('electrodes_vs_leads');

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono font-bold text-rose-400 uppercase tracking-wider text-[11px]">
            <Activity className="w-4 h-4" /> Core Electrophysiology & Principles
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            ECG Fundamentals: Electrodes vs Leads, Torso Anatomy & Intervals
          </h2>
          <p className="text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Master the vital clinical distinction between physical sensors (electrodes) and electrical perspectives (leads), the Angle of Louis, and waveform interval physiology.
          </p>
        </div>

        {/* Section Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSection('electrodes_vs_leads')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSection === 'electrodes_vs_leads'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            10 Electrodes vs 12 Leads
          </button>
          <button
            onClick={() => setActiveSection('limb_placement')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSection === 'limb_placement'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Limb Leads & Torso Modification
          </button>
          <button
            onClick={() => setActiveSection('precordial_anatomy')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSection === 'precordial_anatomy'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Precordial & Angle of Louis
          </button>
          <button
            onClick={() => setActiveSection('waveform_intervals')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeSection === 'waveform_intervals'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Waveforms & Intervals
          </button>
        </div>
      </div>

      {/* SECTION 1: ELECTRODES VS LEADS */}
      {activeSection === 'electrodes_vs_leads' && (
        <div className="space-y-6 animate-fade-in">
          {/* Concept Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                  10
                </span>
                <h3 className="text-sm font-bold text-white">Physical Electrodes (Sensors)</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Electrodes are physical conductive adhesive pads affixed directly to the patient's skin. 
                A standard 12-lead ECG uses exactly <strong className="text-cyan-300">10 physical electrodes</strong>:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-white">4 Limb Electrodes:</strong> RA, LA, RL (earth/ground), LL.</li>
                <li><strong className="text-white">6 Precordial Electrodes:</strong> V1, V2, V3, V4, V5, V6.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                  12
                </span>
                <h3 className="text-sm font-bold text-white">Electrical Leads (Views of the Heart)</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                A lead is <strong className="text-rose-300">NOT</strong> a wire. A lead is an electrical perspective or vector projection calculated from the voltage difference between electrodes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li><strong className="text-white">3 Bipolar Limb Leads:</strong> Lead I, Lead II, Lead III (Einthoven).</li>
                <li><strong className="text-white">3 Augmented Unipolar Leads:</strong> aVR, aVL, aVF (Goldberger).</li>
                <li><strong className="text-white">6 Unipolar Precordial Leads:</strong> V1 through V6 (Wilson).</li>
              </ul>
            </div>
          </div>

          {/* Full Lead Mapping Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-950 font-bold text-white flex items-center justify-between border-b border-slate-800">
              <span>Standard 12 Leads Generation Matrix</span>
              <span className="text-[11px] text-slate-400 font-normal">How 10 physical electrodes produce 12 electrical views</span>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="p-3">Lead Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Electrodes Used / Reference Vector</th>
                  <th className="p-3">Anatomical Myocardial View</th>
                  <th className="p-3">Typical Perfusing Artery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {LEAD_MAPPINGS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono font-bold text-rose-400">{row.leadName}</td>
                    <td className="p-3 text-slate-400">{row.category}</td>
                    <td className="p-3 font-mono text-slate-300">{row.electrodesUsed}</td>
                    <td className="p-3 font-medium text-white">{row.viewOfHeart}</td>
                    <td className="p-3 text-cyan-300">{row.artery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: LIMB PLACEMENT & TORSO MODIFICATION */}
      {activeSection === 'limb_placement' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Standard Limb Placement */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-white">Diagnostic Standard Limb Placement</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                For a true diagnostic 12-lead ECG, electrodes must be placed on the <strong className="text-white">extremities (wrists/forearms and lower legs above ankles)</strong>.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-rose-400 w-8">RA:</span>
                  <span>Right inner forearm or wrist (Red).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-amber-400 w-8">LA:</span>
                  <span>Left inner forearm or wrist (Yellow).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-emerald-400 w-8">RL:</span>
                  <span>Right lower leg above ankle — Electrical Ground (Green/Black).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-cyan-400 w-8">LL:</span>
                  <span>Left lower leg above ankle (Green/Cyan).</span>
                </div>
              </div>
            </div>

            {/* Torso / Mason-Likar Warning */}
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-rose-800/40 pb-2 text-rose-300 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Modified Torso (Mason-Likar) Caution</span>
              </div>
              <p className="text-slate-200 leading-relaxed">
                Moving limb electrodes onto the shoulders and lower abdomen (Mason-Likar modification) is standard for continuous monitor telemetry or exercise stress testing, <strong className="text-rose-300">BUT MUST NOT BE USED FOR FORMAL STEMI DIAGNOSIS</strong>.
              </p>
              <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] space-y-1.5 text-slate-300">
                <span className="font-bold text-amber-300 block">Documented Electrocardiographic Distortions:</span>
                <ul className="list-disc list-inside space-y-1">
                  <li>Causes rightward or leftward shift in frontal plane QRS axis (up to 30°–60°).</li>
                  <li>Produces false pathological Q waves in inferior leads (simulating old inferior MI).</li>
                  <li>Alters ST segment amplitudes, risking both false-positive and false-negative STEMI alerts.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PRECORDIAL ANATOMY & ANGLE OF LOUIS */}
      {activeSection === 'precordial_anatomy' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Angle of Louis */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">
                Step 1: Primary Bony Landmark
              </span>
              <h4 className="text-sm font-bold text-white">The Angle of Louis (Sternal Angle)</h4>
              <p className="text-slate-300 leading-relaxed">
                Palpate the suprasternal notch at the base of the neck. Move fingers down ~4–5 cm until feeling a distinct horizontal bony ridge. This is the manubriosternal junction (Angle of Louis).
              </p>
              <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[11px] text-amber-300 font-medium">
                ★ The 2nd rib attaches directly to the Angle of Louis! The space immediately below is the 2nd Intercostal Space (ICS).
              </div>
            </div>

            {/* Counting Intercostal Spaces */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 block">
                Step 2: Counting Spaces
              </span>
              <h4 className="text-sm font-bold text-white">Counting Down to the 4th and 5th ICS</h4>
              <p className="text-slate-300 leading-relaxed">
                From the 2nd ICS, palpate over the 3rd rib to find the 3rd ICS, then over the 4th rib to reach the <strong className="text-cyan-300">4th Intercostal Space</strong>.
              </p>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-rose-400">V1</strong> goes at the 4th ICS right sternal border. <strong className="text-amber-400">V2</strong> goes at the 4th ICS left sternal border.
              </p>
            </div>

            {/* Sequence Rule */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 block">
                Step 3: Correct Sequence
              </span>
              <h4 className="text-sm font-bold text-white">Place V4 Before Placing V3!</h4>
              <p className="text-slate-300 leading-relaxed">
                Identify the left midclavicular line and 5th ICS to secure <strong className="text-blue-400">V4</strong>. THEN place <strong className="text-emerald-400">V3</strong> midway between V2 and V4 on a diagonal straight line.
              </p>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                V5 and V6 are placed on the horizontal plane of V4 at the anterior axillary and midaxillary lines.
              </p>
            </div>
          </div>

          {/* Female Patient Anatomy Banner */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <span className="font-bold text-white text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Precordial Electrode Placement in Adult Female Patients
            </span>
            <p className="text-slate-300 leading-relaxed">
              Never place precordial electrodes on breast tissue or over the nipple. Nipple location varies greatly with age, body mass index, and posture and is NOT a reliable anatomical landmark.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Use the back of the hand to gently elevate the breast tissue and attach electrodes <strong className="text-white">directly to the chest wall in the inframammary fold (5th ICS)</strong>. Maintain patient privacy and dignity while ensuring true thoracic wall electrode contact.
            </p>
          </div>
        </div>
      )}

      {/* SECTION 4: WAVEFORM INTERVALS */}
      {activeSection === 'waveform_intervals' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="font-mono font-bold text-cyan-400 text-sm">P Wave</span>
              <p className="text-slate-300 leading-relaxed">
                Represents atrial depolarization. Normal duration: &lt; 0.12 s (3 small boxes), amplitude &lt; 0.25 mV (2.5 mm).
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="font-mono font-bold text-amber-400 text-sm">PR Interval</span>
              <p className="text-slate-300 leading-relaxed">
                AV conduction time from SA node to ventricular myocardium. Normal: 0.12 to 0.20 s (3 to 5 small boxes).
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="font-mono font-bold text-rose-400 text-sm">QRS Complex</span>
              <p className="text-slate-300 leading-relaxed">
                Ventricular depolarization. Normal duration: 0.07 to 0.10 s (&lt; 120 ms). Duration ≥ 0.12s indicates bundle branch block or ventricular rhythm.
              </p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
              <span className="font-mono font-bold text-emerald-400 text-sm">QT / QTc Interval</span>
              <p className="text-slate-300 leading-relaxed">
                Total ventricular depolarization and repolarization time. Normal QTc: &lt; 440 ms in men, &lt; 460 ms in women.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
