"use client";

import { useState } from 'react';

const PHASES = [
  {
    name: '"1S"-SHORTING\n"SEIRI"',
    questions: [
      { id: 1, text: "Awareness of Concerned person about sorting phase", evidence: "Skill Matrix/Verbal communication" },
      { id: 2, text: "Only Required Material present in area.Obsolete & Unnaccessory material/ Equipement removed or red tagged.", evidence: "List of Items/ Red Tag Activity" },
      { id: 3, text: "Involvement of Supervisors and Department heads in Sorting activity", evidence: "Daily Checksheet Review" },
      { id: 4, text: "Storage area is defined to store broken, unusable or occasionally used items.", evidence: "5S Layout Plan" },
      { id: 5, text: "Only Job-related documents stored in the work zone and other waste disposition is proper", evidence: "Doc. File/Disposal Bins/Scrap Note" },
    ]
  },
  {
    name: '"2S"SET IN ORDER\n"SEITON"',
    questions: [
      { id: 6, text: "Awareness of Concerned person about Set in Order phase", evidence: "Skill Matrix/Verbal communication" },
      { id: 7, text: "Equipement/Machinery is clearly identified (Number/Name/Color Code) & Placed at Proeperly defined location", evidence: "Equipement/ Item Identification" },
      { id: 8, text: "Is Material Placed as per defined layout plan and Everything put back to its defined place?", evidence: "5S Layout Plan/Ergonomic Chart" },
      { id: 9, text: "Are Cupboards/Walkways clear, Unblocked and area well organized", evidence: "Physical Verification" },
    ]
  },
  {
    name: '"3S" SHINE\n"SEISO"',
    questions: [
      { id: 10, text: "Is Working Area and nearby location cleaned properly and free from dust,waste, water, oil, chips and coolant overflow ?", evidence: "Physical Verification", highlight: true },
      { id: 11, text: "Are the machine/Equipement/Tables/floors/Taps cleans at regular defined frequency ?", evidence: "Clit/ JH/ Sampling" },
      { id: 12, text: "Floors, walls, ceilings, Racks and pipework are in good condition and free from dirt and dust", evidence: "Physical Verification" },
      { id: 13, text: "Machines, equipment, tools and Stored items, materials and products are kept clean.", evidence: "Physical Verification" },
      { id: 14, text: "Lighting/Lux Level is enough (as required) and all lighting is free from dust", evidence: "Lux Level with Monitoring sheet", highlight: true },
    ]
  },
  {
    name: '"4S"\nSTANDARDIZATION\n"SEIKETSU"',
    questions: [
      { id: 15, text: "Are 6S Audit Previous Observations closed and actions initiated/implemented?", evidence: "WI/ Visual Control" },
      { id: 16, text: "Independency followed in Audit and results are declared and Communicated to entire team.", evidence: "Audit schedule & Result display" },
      { id: 17, text: "Work Zone is properly marked and indicates walkways, storage and other area clearly.", evidence: "Area Marking as per 5S Layout Plan" },
      { id: 18, text: "Are Initiatives taken for continual improvement of all 3S and First 3S being maintained ?", evidence: "improvement Details" },
    ]
  },
  {
    name: '"5S"\nSUSTAINENANCE\n"SHITSUKE"',
    questions: [
      { id: 19, text: "Effectiveness verification system exist/ Regular audits are conducted to ensure 6S compliance?", evidence: "5S Audit and Action plan" },
      { id: 20, text: "Does Leaders enforce Training and awareness for to encourage 5S and Safety at shop floor.", evidence: "Training and awareness" },
      { id: 21, text: "Is actions implemented for the previous observations are effective ?", evidence: "Previous Action plan Effectiveness" },
      { id: 22, text: "Management Support to 6S Programme by providing resources, rewards and recognition", evidence: "Monthly Recognition" },
    ]
  },
  {
    name: '"6S" SAFETY\nAT WORK\nSTATION',
    questions: [
      { id: 23, text: "Are Workmen wear Proper PPEs and Required PPE matrix available & displayed at appropriate area.", evidence: "Skill Matrix/Verbal communication" },
      { id: 24, text: "Safety equipment are in ready to use condition and available in required quantity.(PPEs/Emergency Exit/Evacuation Plan)", evidence: "Safety Equipement condition" },
      { id: 25, text: "Any material/Unsafe act/condition at shop floor which can cause safety incident to workman (Ensure controls)", evidence: "Identify Safety Hazard" },
    ]
  }
];

export default function AuditFormClient({ auditorName }: { auditorName: string }) {
  const [workZone, setWorkZone] = useState('');
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);
  const [zoneLeader, setZoneLeader] = useState('');
  
  const [scores, setScores] = useState<number[]>(Array(25).fill(0));
  
  const [actionPlan, setActionPlan] = useState([
    { slNo: '1', nonConformance: '', correction: '', correctiveAction: '', targetDate: '', responsibility: '', status: '' },
    { slNo: '2', nonConformance: '', correction: '', correctiveAction: '', targetDate: '', responsibility: '', status: '' },
    { slNo: '3', nonConformance: '', correction: '', correctiveAction: '', targetDate: '', responsibility: '', status: '' },
  ]);

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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-2 sm:p-8 rounded-xl shadow-sm border border-slate-200" style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-black uppercase">MONTHLY 6S AUDIT CHECKSHEET</h2>
        <div className="text-right">
          <span className="text-[#0070c0] text-lg sm:text-xl font-bold block leading-none">SANSERA</span>
          <span className="text-[#7f7f7f] text-xs italic">ideas@work</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 text-sm border border-black mb-4">
        <div className="border border-black p-2 font-bold flex gap-2">
          <span className="whitespace-nowrap">WORK ZONE:</span> 
          <input required type="text" value={workZone} onChange={e => setWorkZone(e.target.value)} className="text-black font-bold w-full outline-none bg-slate-100 focus:bg-white px-1" />
        </div>
        <div className="border border-black p-2 font-bold flex gap-2">
          <span className="whitespace-nowrap">AUDIT DATE:</span> 
          <input required type="date" value={auditDate} onChange={e => setAuditDate(e.target.value)} className="text-black font-bold w-full outline-none bg-slate-100 focus:bg-white px-1" />
        </div>
        <div className="border border-black p-2 font-bold flex gap-2">
          <span className="whitespace-nowrap">ZONE LEADER:</span> 
          <input required type="text" value={zoneLeader} onChange={e => setZoneLeader(e.target.value)} className="text-black font-bold w-full outline-none bg-slate-100 focus:bg-white px-1" />
        </div>
        <div className="border border-black p-2 font-bold flex gap-2">
          <span className="whitespace-nowrap">AUDITOR:</span> 
          <span className="text-black font-bold w-full bg-slate-100 px-1">{auditorName}</span>
        </div>
      </div>

      {/* Main Checklist */}
      <div className="overflow-x-auto border border-black mb-6">
        <table className="w-full text-xs text-center border-collapse min-w-[800px]">
          <thead>
            <tr>
              <td className="bg-[#ffc000] font-bold border border-black p-2 w-[8%]" rowSpan={2}>PHASE</td>
              <td className="bg-[#ffc000] font-bold border border-black p-2 w-[34%]" rowSpan={2}>CHECK ITEM DESCRIPTION</td>
              <td className="bg-[#ffc000] font-bold border border-black p-2 w-[16%]" rowSpan={2}>OBJECTIVE EVIDENCE</td>
              <td className="bg-[#8eaadb] font-bold border border-black p-1">0</td>
              <td className="bg-[#8eaadb] font-bold border border-black p-1">1</td>
              <td className="bg-[#8eaadb] font-bold border border-black p-1">2</td>
              <td className="bg-[#8eaadb] font-bold border border-black p-1">3</td>
              <td className="bg-[#8eaadb] font-bold border border-black p-1">4</td>
              <td className="bg-[#8eaadb] font-bold border border-black p-2 w-[11%]" rowSpan={2}>Remark</td>
            </tr>
            <tr>
              <td className="bg-[#ffc000] font-bold border border-black p-1 text-[10px]">Very Bad</td>
              <td className="bg-[#ffc000] font-bold border border-black p-1 text-[10px]">Bad</td>
              <td className="bg-[#ffc000] font-bold border border-black p-1 text-[10px]">AVERAGE</td>
              <td className="bg-[#ffc000] font-bold border border-black p-1 text-[10px]">GOOD</td>
              <td className="bg-[#ffc000] font-bold border border-black p-1 text-[10px]">EXCELLENT</td>
            </tr>
          </thead>
          <tbody>
            {PHASES.map((phase, pIdx) => (
              phase.questions.map((q, qIdx) => {
                const globalQIndex = q.id - 1;
                return (
                  <tr key={q.id}>
                    {qIdx === 0 && (
                      <td rowSpan={phase.questions.length} className="bg-[#b4c6e7] font-bold border border-black p-2 whitespace-pre-wrap">
                        {phase.name}
                      </td>
                    )}
                    <td className={`text-left border border-black p-2 ${q.highlight ? 'bg-[#ffc000] font-bold' : ''}`}>
                      {q.text}
                    </td>
                    <td className={`text-left border border-black p-2 ${q.highlight ? 'bg-[#ffc000] font-bold' : ''}`}>
                      {q.evidence}
                    </td>
                    {[0, 1, 2, 3, 4].map(scoreValue => (
                      <td key={scoreValue} className="border border-black p-1 cursor-pointer hover:bg-blue-50" onClick={() => handleScoreChange(globalQIndex, scoreValue)}>
                        <input type="radio" name={`q${globalQIndex}`} checked={scores[globalQIndex] === scoreValue} onChange={() => handleScoreChange(globalQIndex, scoreValue)} className="cursor-pointer" />
                      </td>
                    ))}
                    <td className="border border-black p-1">
                      <input type="text" className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" />
                    </td>
                  </tr>
                );
              })
            ))}
            <tr>
              <td colSpan={3} className="bg-[#b4c6e7] font-bold border border-black p-2 text-center">TOTAL MARKS</td>
              <td colSpan={6} className="font-bold border border-black p-2 text-center text-sm">100</td>
            </tr>
            <tr>
              <td colSpan={3} className="bg-[#b4c6e7] font-bold border border-black p-2 text-center">TOTAL OBTAIN MARKS</td>
              <td colSpan={6} className="font-bold border border-black p-2 text-center text-sm">{totalScore}</td>
            </tr>
            <tr>
              <td colSpan={3} className="bg-[#b4c6e7] font-bold border border-black p-2 text-center">SCORE %</td>
              <td colSpan={6} className="font-bold border border-black p-2 text-center text-sm">{totalScore}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Plan Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-xs border-collapse border border-black min-w-[800px]">
          <thead>
            <tr>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[5%]">Sl. No.</td>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[30%]">Non-Conformance / Problem statement</td>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[15%]">Correction</td>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[15%]">Corrective Action(s)</td>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[10%]">Target Date</td>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[15%]">Responsibility</td>
              <td className="bg-[#d9d9d9] font-bold border border-black p-2 text-center w-[10%]">Status</td>
            </tr>
          </thead>
          <tbody>
            {actionPlan.map((ap, idx) => (
              <tr key={idx}>
                <td className="border border-black p-1"><input value={ap.slNo} onChange={e => handleActionPlanChange(idx, 'slNo', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white text-center px-1" /></td>
                <td className="border border-black p-1"><input value={ap.nonConformance} onChange={e => handleActionPlanChange(idx, 'nonConformance', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" /></td>
                <td className="border border-black p-1"><input value={ap.correction} onChange={e => handleActionPlanChange(idx, 'correction', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" /></td>
                <td className="border border-black p-1"><input value={ap.correctiveAction} onChange={e => handleActionPlanChange(idx, 'correctiveAction', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" /></td>
                <td className="border border-black p-1"><input type="date" value={ap.targetDate} onChange={e => handleActionPlanChange(idx, 'targetDate', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" /></td>
                <td className="border border-black p-1"><input value={ap.responsibility} onChange={e => handleActionPlanChange(idx, 'responsibility', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" /></td>
                <td className="border border-black p-1"><input value={ap.status} onChange={e => handleActionPlanChange(idx, 'status', e.target.value)} className="w-full text-xs text-black font-bold outline-none bg-slate-100 focus:bg-white px-1" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button type="submit" disabled={loading} className="px-8 py-3 bg-[#0070c0] text-white font-bold rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-70">
          {loading ? 'Submitting...' : 'Submit Audit Report'}
        </button>
      </div>

    </form>
  );
}
