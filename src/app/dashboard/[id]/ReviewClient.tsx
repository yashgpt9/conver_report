"use client";

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';

export default function ReviewClient({ audit }: { audit: any }) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  const [comment1, setComment1] = useState(audit.reviewComment1 || '');
  const [comment2, setComment2] = useState(audit.reviewComment2 || '');
  const [comment3, setComment3] = useState(audit.reviewComment3 || '');
  const [loading, setLoading] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Audit_${audit.workZone}_${audit.auditDate}`,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/audits/${audit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: [comment1, comment2, comment3] })
      });
      if (res.ok) {
        alert("Review Saved!");
        router.refresh();
      } else {
        alert("Failed to save review");
      }
    } catch (e) {
      alert("Error saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this audit entirely?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/audits/${audit.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert("Failed to delete");
        setLoading(false);
      }
    } catch (e) {
      alert("Error deleting");
      setLoading(false);
    }
  };

  const q = (idx: number) => {
    return audit[`q${idx}`] as number;
  };

  // We inject the user's exact CSS into a <style> tag so it perfectly styles the printed document
  const cssStyles = `
    * { box-sizing: border-box; }
    @page { size: A4 portrait; margin: 12mm 15mm; }
    .print-doc { font-family: Arial, sans-serif; font-size: 8px; color: #040303; margin: 0; padding: 0; }
    .print-doc table { width: 100%; border-collapse: collapse; margin-bottom: 8px; table-layout: fixed; }
    .print-doc .keep-together { page-break-inside: avoid; }
    .print-doc th, .print-doc td { border: 1px solid #000; padding: 3px 2px; text-align: center; vertical-align: middle; word-wrap: break-word; overflow-wrap: break-word; }
    .print-doc tr { page-break-inside: avoid; }
    
    .print-doc .col-phase { width: 8%; }
    .print-doc .col-desc  { width: 34%; text-align: left; }
    .print-doc .col-evid  { width: 16%; text-align: left; }
    .print-doc .col-score { width: 6.2%; }
    .print-doc .col-remark{ width: 11%; }  
    
    .print-doc .bg-yellow { background-color: #ffc000; font-weight: bold; }
    .print-doc .bg-blue { background-color: #8eaadb; font-weight: bold; }
    .print-doc .bg-light-blue { background-color: #b4c6e7; font-weight: bold; }
    .print-doc .bg-red { background-color: #e6b8b7; font-weight: bold; }
    .print-doc .bg-grey { background-color: #d9d9d9; font-weight: bold; }
    .print-doc .text-left { text-align: left; }
    
    .print-doc .header-title { font-size: 15px; font-weight: bold; padding: 8px; }
    .print-doc .logo-text { color: #0070c0; font-size: 13px; font-weight: bold; text-align: right; border: none; }
    .print-doc .logo-sub { color: #7f7f7f; font-size: 9px; font-style: italic; }
    .print-doc .check { font-size: 11px; font-weight: bold; color: #000; }
    .print-doc .bold { font-weight: bold; }
    .print-doc .no-border-table td { border: 1px solid #000; text-align: left; padding: 4px; font-size: 10px; font-weight: bold; }
  `;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden when printing) */}
      <div className="print:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Review Actions</h2>
        <div className="flex gap-3">
          <button onClick={() => handlePrint()} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-sm">
            Print PDF
          </button>
          <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70">
            Save Review
          </button>
          <button onClick={handleDelete} disabled={loading} className="px-4 py-2 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors shadow-sm disabled:opacity-70">
            Delete
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow print:p-0 print:shadow-none overflow-x-auto">
        <div ref={printRef} className="print-doc w-full min-w-[800px] print:min-w-0 bg-white">
          <style dangerouslySetInnerHTML={{ __html: cssStyles }} />
          
          <table style={{ border: 'none', marginBottom: '0' }}>
              <tbody>
              <tr>
                  <td style={{ border: 'none', textAlign: 'center', width: '80%' }} className="header-title">MONTHLY 6S AUDIT CHECKSHEET</td>
                  <td style={{ border: 'none', textAlign: 'right', width: '20%' }}>
                      <span className="logo-text">SANSERA</span><br/>
                      <span className="logo-sub">ideas@work</span>
                  </td>
              </tr>
              </tbody>
          </table>

          <table className="no-border-table">
              <tbody>
              <tr>
                  <td style={{ width: '50%' }}>WORK ZONE: <span style={{ fontWeight: 'normal' }}>{audit.workZone}</span></td>
                  <td style={{ width: '50%' }}>AUDIT DATE: <span style={{ fontWeight: 'normal' }}>{audit.auditDate}</span></td>
              </tr>
              <tr>
                  <td>ZONE LEADER: <span style={{ fontWeight: 'normal' }}>{audit.zoneLeader}</span></td>
                  <td>AUDITOR: <span style={{ fontWeight: 'normal' }}>{audit.auditorName}</span></td>
              </tr>
              </tbody>
          </table>

          <table>
              <thead>
                  <tr>
                      <td className="bg-yellow col-phase" rowSpan={2}>PHASE</td>
                      <td className="bg-yellow col-desc" rowSpan={2}>CHECK ITEM DESCRIPTION</td>
                      <td className="bg-yellow col-evid" rowSpan={2}>OBJECTIVE EVIDENCE</td>
                      <td className="bg-blue col-score">0</td>
                      <td className="bg-blue col-score">1</td>
                      <td className="bg-blue col-score">2</td>
                      <td className="bg-blue col-score">3</td>
                      <td className="bg-blue col-score">4</td>
                      <td className="bg-blue col-remark" rowSpan={2}>Remark</td>
                  </tr>
                  <tr>
                      <td className="bg-yellow">Very Bad</td>
                      <td className="bg-yellow">Bad</td>
                      <td className="bg-yellow">AVERAGE</td>
                      <td className="bg-yellow">GOOD</td>
                      <td className="bg-yellow">EXCELLENT</td>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td rowSpan={5} className="bg-light-blue">"1S"-SHORTING<br/>"SEIRI"</td>
                      <td className="text-left">Awareness of Concerned person about sorting phase</td>
                      <td className="text-left">Skill Matrix/Verbal communication</td>
                      <td><span className="check">{q(1) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(1) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(1) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(1) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(1) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[0] ? audit.remarks[0] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Only Required Material present in area.Obsolete & Unnaccessory material/ Equipement removed or red tagged.</td>
                      <td className="text-left">List of Items/ Red Tag Activity</td>
                      <td><span className="check">{q(2) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(2) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(2) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(2) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(2) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[1] ? audit.remarks[1] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Involvement of Supervisors and Department heads in Sorting activity</td>
                      <td className="text-left">Daily Checksheet Review</td>
                      <td><span className="check">{q(3) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(3) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(3) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(3) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(3) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[2] ? audit.remarks[2] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Storage area is defined to store broken, unusable or occasionally used items.</td>
                      <td className="text-left">5S Layout Plan</td>
                      <td><span className="check">{q(4) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(4) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(4) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(4) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(4) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[3] ? audit.remarks[3] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Only Job-related documents stored in the work zone and other waste disposition is proper</td>
                      <td className="text-left">Doc. File/Disposal Bins/Scrap Note</td>
                      <td><span className="check">{q(5) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(5) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(5) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(5) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(5) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[4] ? audit.remarks[4] : ''}</td>
                  </tr>

                  <tr>
                      <td rowSpan={4} className="bg-light-blue">"2S"SET IN ORDER<br/>"SEITON"</td>
                      <td className="text-left">Awareness of Concerned person about Set in Order phase</td>
                      <td className="text-left">Skill Matrix/Verbal communication</td>
                      <td><span className="check">{q(6) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(6) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(6) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(6) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(6) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[5] ? audit.remarks[5] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Equipement/Machinery is clearly identified (Number/Name/Color Code) & Placed at Proeperly defined location</td>
                      <td className="text-left">Equipement/ Item Identification</td>
                      <td><span className="check">{q(7) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(7) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(7) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(7) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(7) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[6] ? audit.remarks[6] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Is Material Placed as per defined layout plan and Everything put back to its defined place?</td>
                      <td className="text-left">5S Layout Plan/Ergonomic Chart</td>
                      <td><span className="check">{q(8) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(8) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(8) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(8) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(8) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[7] ? audit.remarks[7] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Are Cupboards/Walkways clear, Unblocked and area well organized</td>
                      <td className="text-left">Physical Verification</td>
                      <td><span className="check">{q(9) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(9) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(9) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(9) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(9) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[8] ? audit.remarks[8] : ''}</td>
                  </tr>

                  <tr>
                      <td rowSpan={5} className="bg-light-blue">"3S" SHINE<br/>"SEISO"</td>
                      <td className="text-left bg-yellow">Is Working Area and nearby location cleaned properly and free from dust,waste, water, oil, chips and coolant overflow ?</td>
                      <td className="text-left">Physical Verification</td>
                      <td><span className="check">{q(10) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(10) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(10) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(10) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(10) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[9] ? audit.remarks[9] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Are the machine/Equipement/Tables/floors/Taps cleans at regular defined frequency ?</td>
                      <td className="text-left">Clit/ JH/ Sampling</td>
                      <td><span className="check">{q(11) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(11) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(11) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(11) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(11) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[10] ? audit.remarks[10] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Floors, walls, ceilings, Racks and pipework are in good condition and free from dirt and dust</td>
                      <td className="text-left">Physical Verification</td>
                      <td><span className="check">{q(12) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(12) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(12) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(12) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(12) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[11] ? audit.remarks[11] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Machines, equipment, tools and Stored items, materials and products are kept clean.</td>
                      <td className="text-left">Physical Verification</td>
                      <td><span className="check">{q(13) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(13) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(13) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(13) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(13) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[12] ? audit.remarks[12] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left bg-yellow">Lighting/Lux Level is enough (as required) and all lighting is free from dust</td>
                      <td className="text-left bg-yellow">Lux Level with Monitoring sheet</td>
                      <td><span className="check">{q(14) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(14) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(14) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(14) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(14) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[13] ? audit.remarks[13] : ''}</td>
                  </tr>

                  <tr>
                      <td rowSpan={4} className="bg-light-blue">"4S"<br/>STANDARDIZATION<br/>"SEIKETSU"</td>
                      <td className="text-left">Are 6S Audit Previous Observations closed and actions initiated/implemented?</td>
                      <td className="text-left">WI/ Visual Control</td>
                      <td><span className="check">{q(15) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(15) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(15) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(15) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(15) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[14] ? audit.remarks[14] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Independency followed in Audit and results are declared and Communicated to entire team.</td>
                      <td className="text-left">Audit schedule & Result display</td>
                      <td><span className="check">{q(16) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(16) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(16) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(16) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(16) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[15] ? audit.remarks[15] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Work Zone is properly marked and indicates walkways, storage and other area clearly.</td>
                      <td className="text-left">Area Marking as per 5S Layout Plan</td>
                      <td><span className="check">{q(17) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(17) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(17) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(17) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(17) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[16] ? audit.remarks[16] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Are Initiatives taken for continual improvement of all 3S and First 3S being maintained ?</td>
                      <td className="text-left">improvement Details</td>
                      <td><span className="check">{q(18) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(18) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(18) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(18) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(18) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[17] ? audit.remarks[17] : ''}</td>
                  </tr>

                  <tr>
                      <td rowSpan={4} className="bg-light-blue">"5S"<br/>SUSTAINENANCE<br/>"SHITSUKE"</td>
                      <td className="text-left">Effectiveness verification system exist/ Regular audits are conducted to ensure 6S compliance?</td>
                      <td className="text-left">5S Audit and Action plan</td>
                      <td><span className="check">{q(19) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(19) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(19) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(19) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(19) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[18] ? audit.remarks[18] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Does Leaders enforce Training and awareness for to encourage 5S and Safety at shop floor.</td>
                      <td className="text-left">Training and awareness</td>
                      <td><span className="check">{q(20) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(20) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(20) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(20) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(20) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[19] ? audit.remarks[19] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Is actions implemented for the previous observations are effective ?</td>
                      <td className="text-left">Previous Action plan Effectiveness</td>
                      <td><span className="check">{q(21) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(21) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(21) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(21) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(21) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[20] ? audit.remarks[20] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Management Support to 6S Programme by providing resources, rewards and recognition</td>
                      <td className="text-left">Monthly Recognition</td>
                      <td><span className="check">{q(22) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(22) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(22) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(22) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(22) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[21] ? audit.remarks[21] : ''}</td>
                  </tr>

                  <tr>
                      <td rowSpan={3} className="bg-light-blue">"6S" SAFETY<br/>AT WORK<br/>STATION</td>
                      <td className="text-left">Are Workmen wear Proper PPEs and Required PPE matrix available & displayed at appropriate area.</td>
                      <td className="text-left">Skill Matrix/Verbal communication</td>
                      <td><span className="check">{q(23) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(23) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(23) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(23) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(23) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[22] ? audit.remarks[22] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Safety equipment are in ready to use condition and available in required quantity.(PPEs/Emergency Exit/Evacuation Plan)</td>
                      <td className="text-left">Safety Equipement condition</td>
                      <td><span className="check">{q(24) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(24) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(24) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(24) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(24) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[23] ? audit.remarks[23] : ''}</td>
                  </tr>
                  <tr>
                      <td className="text-left">Any material/Unsafe act/condition at shop floor which can cause safety incident to workman (Ensure controls)</td>
                      <td className="text-left">Identify Safety Hazard</td>
                      <td><span className="check">{q(25) === 0 ? '✓' : ''}</span></td><td><span className="check">{q(25) === 1 ? '✓' : ''}</span></td><td><span className="check">{q(25) === 2 ? '✓' : ''}</span></td><td><span className="check">{q(25) === 3 ? '✓' : ''}</span></td><td><span className="check">{q(25) === 4 ? '✓' : ''}</span></td><td>{audit.remarks && audit.remarks[24] ? audit.remarks[24] : ''}</td>
                  </tr>

                  <tr>
                      <td colSpan={3} className="bg-light-blue bold" style={{ textAlign: 'center' }}>TOTAL MARKS</td>
                      <td colSpan={6} className="bold" style={{ textAlign: 'center' }}>100</td>
                  </tr>
                  <tr>
                      <td colSpan={3} className="bg-light-blue bold" style={{ textAlign: 'center' }}>TOTAL OBTAIN MARKS</td>
                      <td colSpan={6} className="bold" style={{ textAlign: 'center' }}>{audit.totalScore}</td>
                  </tr>
                  <tr>
                      <td colSpan={3} className="bg-light-blue bold" style={{ textAlign: 'center' }}>SCORE %</td>
                      <td colSpan={6} className="bold" style={{ textAlign: 'center' }}>{audit.totalScore}</td>
                  </tr>
              </tbody>
          </table>

          <table className="keep-together">
              <tbody>
              <tr>
                  <td colSpan={3} className="bg-blue">SCORING CRITERIA</td>
              </tr>
              <tr>
                  <td className="bg-red" style={{ width: '5%' }}>ITEM</td>
                  <td className="bg-red" style={{ width: '15%' }}>TYPE</td>
                  <td className="bg-red text-left">CRITERIA</td>
              </tr>
              <tr>
                  <td>0</td>
                  <td className="bg-yellow">POOR</td>
                  <td className="text-left">Activities not conducted at All- Immediate Action Required</td>
              </tr>
              <tr>
                  <td>1</td>
                  <td className="bg-yellow">MARGINAL</td>
                  <td className="text-left">Activities adherence below 50% - obstacle to achieve process Targets - Action Plan Required within 15 days</td>
              </tr>
              <tr>
                  <td>2</td>
                  <td className="bg-yellow">AVERAGE</td>
                  <td className="text-left">Activities adherence 51-70% - If Attention not paid Could become a Major Issue - Action Plan will be reviewed during next Audit Cycle</td>
              </tr>
              <tr>
                  <td>3</td>
                  <td className="bg-yellow">GOOD</td>
                  <td className="text-left">Activities adherence 71-90% - Activities conducted in a systematic way but could improved.</td>
              </tr>
              <tr>
                  <td>4</td>
                  <td className="bg-yellow">EXCELLENT</td>
                  <td className="text-left">Activities adherence 91-100% - Best Practices to be Benchmarked for Other Areas and Scope for Improvement to be Focused.</td>
              </tr>
              </tbody>
          </table>

          <table className="keep-together">
              <tbody>
              <tr>
                  <td className="bg-grey" style={{ width: '5%' }}>Sl.<br/>No.</td>
                  <td className="bg-grey" style={{ width: '30%' }}>Non-Conformance / Problem statement</td>
                  <td className="bg-grey" style={{ width: '15%' }}>Correction</td>
                  <td className="bg-grey" style={{ width: '15%' }}>Corrective Action(s)</td>
                  <td className="bg-grey" style={{ width: '10%' }}>Target Date</td>
                  <td className="bg-grey" style={{ width: '15%' }}>Responsibility</td>
                  <td className="bg-grey" style={{ width: '10%' }}>Status</td>
              </tr>
              {audit.actionPlanItems && audit.actionPlanItems.length > 0 ? (
                audit.actionPlanItems.map((ap: any, i: number) => (
                  <tr key={i}>
                    <td>{ap.slNo || '\u00A0'}</td>
                    <td>{ap.nonConformance}</td>
                    <td>{ap.correction}</td>
                    <td>{ap.correctiveAction}</td>
                    <td>{ap.targetDate}</td>
                    <td>{ap.responsibility}</td>
                    <td>{ap.status}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                  <tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </>
              )}
              </tbody>
          </table>

          <table className="keep-together">
              <tbody>
              <tr>
                  <td className="bg-blue">REVIEW COMMENT HOD/PLANT MANAGEMENT/ SYSTEMS</td>
              </tr>
              <tr>
                  <td className="text-left print:hidden p-2">
                      <textarea className="w-full border border-gray-300 p-2 text-sm" value={comment1} onChange={e => setComment1(e.target.value)} placeholder="Comment 1" />
                  </td>
                  <td className="text-left hidden print:table-cell p-2 font-bold">{comment1 || '\u00A0'}</td>
              </tr>
              <tr>
                  <td className="text-left print:hidden p-2">
                      <textarea className="w-full border border-gray-300 p-2 text-sm" value={comment2} onChange={e => setComment2(e.target.value)} placeholder="Comment 2" />
                  </td>
                  <td className="text-left hidden print:table-cell p-2 font-bold">{comment2 || '\u00A0'}</td>
              </tr>
              <tr>
                  <td className="text-left print:hidden p-2">
                      <textarea className="w-full border border-gray-300 p-2 text-sm" value={comment3} onChange={e => setComment3(e.target.value)} placeholder="Comment 3" />
                  </td>
                  <td className="text-left hidden print:table-cell p-2 font-bold">{comment3 || '\u00A0'}</td>
              </tr>
              </tbody>
          </table>

          <table className="keep-together">
              <tbody>
              <tr>
                  <td className="bg-blue">GUIDELINES FOR EFFECTIVE IMPLEMENTATION & VERIFICATION OF 6S PROCESS</td>
              </tr>
              <tr><td className="text-left">Following Documents shall be available with Auditee during 6S Audit</td></tr>
              <tr><td className="text-left">1. Updated Hazard Identification and Risk assessment sheet</td></tr>
              <tr><td className="text-left">2. Updated Environment Aspect and Impact Register</td></tr>
              <tr><td className="text-left bg-yellow">3. History of Accident/Incident / Nearmiss/ First Aid of last Accident/ Repetitive Environmetal Incidents.</td></tr>
              <tr><td className="text-left">4. Action plan of Previous Non Conformity/ Improvement Plan.</td></tr>
              <tr><td className="text-left">5.History of any type of leakage/ spillage in area.</td></tr>
              <tr><td className="text-left">6.JH/ CLIT / Cleaning Checksheet /Visual check</td></tr>
              <tr><td className="text-left">7.Red Tag Activity Plan and disposition record</td></tr>
              <tr><td className="text-left">8.Shop Floor Layout Change/ EOHS Change Management Register</td></tr>
              </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
