"use client";

import { useState } from 'react';

const QUESTIONS = [
  "1. Are unneeded items identified and removed from the workspace?",
  "2. Is the workspace free of obsolete equipment and tools?",
  "3. Are aisles and walkways clear of obstacles?",
  "4. Are items properly separated (e.g., defective vs. good)?",
  "5. Is there a red tag area for unneeded items?",
  "6. Are tools and equipment arranged logically for easy access?",
  "7. Are locations clearly marked with labels or tape?",
  "8. Is the 'a place for everything and everything in its place' principle followed?",
  "9. Are storage areas clean and organized?",
  "10. Are frequently used items placed closer to the point of use?",
  "11. Is the workspace clean and free of dust and debris?",
  "12. Are machines and equipment clean and well-maintained?",
  "13. Are cleaning supplies easily accessible?",
  "14. Is there a regular cleaning schedule in place?",
  "15. Are spills and leaks addressed immediately?",
  "16. Are 5S procedures documented and accessible?",
  "17. Are visual controls (e.g., color-coding, signage) used effectively?",
  "18. Is there a standard way of labeling and organizing items?",
  "19. Are roles and responsibilities for 5S clear?",
  "20. Are regular audits conducted to maintain standards?",
  "21. Do employees actively participate in 5S activities?",
  "22. Is 5S training provided to all employees?",
  "23. Are continuous improvement suggestions encouraged and implemented?",
  "24. Is management visibly supportive of 5S initiatives?",
  "25. Are 5S audit results shared with the team?"
];

export default function AuditFormClient({ auditorName }: { auditorName: string }) {
  const [workZone, setWorkZone] = useState('');
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);
  const [zoneLeader, setZoneLeader] = useState('');
  
  const [scores, setScores] = useState<number[]>(Array(25).fill(0));
  
  const [actionPlan, setActionPlan] = useState([{
    slNo: '1', nonConformance: '', correction: '', correctiveAction: '', targetDate: '', responsibility: '', status: ''
  }]);

  const [loading, setLoading] = useState(false);

  const calculateTotalScore = () => scores.reduce((a, b) => a + b, 0);
  const totalScore = calculateTotalScore();

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...scores];
    newScores[index] = value;
    setScores(newScores);
  };

  const handleActionPlanChange = (index: number, field: string, value: string) => {
    const newPlan = [...actionPlan];
    (newPlan[index] as any)[field] = value;
    setActionPlan(newPlan);
  };

  const addActionPlanRow = () => {
    setActionPlan([...actionPlan, {
      slNo: String(actionPlan.length + 1),
      nonConformance: '', correction: '', correctiveAction: '', targetDate: '', responsibility: '', status: ''
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        workZone, auditDate, zoneLeader, auditorName,
        scores, totalScore, actionPlan
      };

      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Audit Submitted Successfully! You will now be signed out.");
        window.location.href = '/api/auth/logout';
      } else {
        const errorData = await res.json();
        alert("Failed to submit: " + (errorData.error || "Unknown error"));
        setLoading(false);
      }
    } catch (err) {
      alert("An error occurred during submission.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      
      {/* General Information */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">1. General Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Work Zone Name</label>
            <input type="text" required value={workZone} onChange={e => setWorkZone(e.target.value)} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Audit Date</label>
            <input type="date" required value={auditDate} onChange={e => setAuditDate(e.target.value)} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Zone Leader</label>
            <input type="text" required value={zoneLeader} onChange={e => setZoneLeader(e.target.value)} className="w-full border-slate-300 rounded-md p-2 border focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Auditor Name</label>
            <input type="text" disabled value={auditorName} className="w-full bg-slate-50 border-slate-300 rounded-md p-2 border text-slate-500 font-medium" />
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section>
        <div className="flex justify-between items-end border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-slate-800">2. Assessment Checklist</h2>
          <div className="text-lg font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            Total Score: {totalScore} / 125
          </div>
        </div>
        <div className="space-y-4">
          {QUESTIONS.map((q, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-blue-200 transition-colors gap-4">
              <span className="text-sm font-medium text-slate-700 flex-1">{q}</span>
              <select 
                value={scores[idx]} 
                onChange={(e) => handleScoreChange(idx, parseInt(e.target.value))}
                className="w-full sm:w-24 p-2 border border-slate-300 rounded-md font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500"
              >
                {[0, 1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* Action Plan */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">3. Action Plan</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 border">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sl.No</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Non-Conformance</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Correction</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Corrective Action</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Target Date</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Responsibility</th>
                <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {actionPlan.map((ap, idx) => (
                <tr key={idx}>
                  <td className="px-2 py-2"><input type="text" value={ap.slNo} onChange={e => handleActionPlanChange(idx, 'slNo', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                  <td className="px-2 py-2"><input type="text" value={ap.nonConformance} onChange={e => handleActionPlanChange(idx, 'nonConformance', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                  <td className="px-2 py-2"><input type="text" value={ap.correction} onChange={e => handleActionPlanChange(idx, 'correction', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                  <td className="px-2 py-2"><input type="text" value={ap.correctiveAction} onChange={e => handleActionPlanChange(idx, 'correctiveAction', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                  <td className="px-2 py-2"><input type="date" value={ap.targetDate} onChange={e => handleActionPlanChange(idx, 'targetDate', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                  <td className="px-2 py-2"><input type="text" value={ap.responsibility} onChange={e => handleActionPlanChange(idx, 'responsibility', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                  <td className="px-2 py-2"><input type="text" value={ap.status} onChange={e => handleActionPlanChange(idx, 'status', e.target.value)} className="w-full border p-1 rounded text-sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={addActionPlanRow} className="mt-4 px-4 py-2 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm">
          + Add Action Row
        </button>
      </section>

      <div className="pt-6 border-t border-slate-200">
        <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
          {loading ? 'Submitting...' : 'Submit Audit Report'}
        </button>
      </div>

    </form>
  );
}
