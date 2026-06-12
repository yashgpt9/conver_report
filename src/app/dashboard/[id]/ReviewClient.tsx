"use client";

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';

export default function ReviewClient({ audit }: { audit: any }) {
  const router = useRouter();
  const printRef = useRef(null);
  
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

      {/* The Printable Area */}
      <div ref={printRef} className="bg-white p-10 rounded-xl shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:w-full">
        
        {/* Header */}
        <div className="text-center border-b-2 border-slate-800 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">5S Audit Report</h1>
          <p className="text-slate-500 mt-2 font-medium">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8 text-sm">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong className="text-slate-500 block mb-1">Work Zone</strong><span className="font-bold text-lg">{audit.workZone}</span></div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong className="text-slate-500 block mb-1">Audit Date</strong><span className="font-bold text-lg">{audit.auditDate}</span></div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong className="text-slate-500 block mb-1">Zone Leader</strong><span className="font-bold text-lg">{audit.zoneLeader}</span></div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong className="text-slate-500 block mb-1">Auditor Name</strong><span className="font-bold text-lg">{audit.auditorName}</span></div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><strong className="text-slate-500 block mb-1">Status</strong><span className="font-bold text-lg text-blue-700">{audit.status}</span></div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200"><strong className="text-blue-600 block mb-1">Total Score</strong><span className="font-extrabold text-2xl text-blue-800">{audit.totalScore} / 125</span></div>
        </div>

        {/* Action Plan */}
        <div className="mb-8 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Action Plan</h3>
          {audit.actionPlanItems && audit.actionPlanItems.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 border text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Sl.No</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Non-Conformance</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Correction</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Corrective Action</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Target Date</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Responsibility</th>
                  <th className="px-3 py-2 text-left font-bold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {audit.actionPlanItems.map((ap: any) => (
                  <tr key={ap.id}>
                    <td className="px-3 py-2">{ap.slNo}</td>
                    <td className="px-3 py-2">{ap.nonConformance}</td>
                    <td className="px-3 py-2">{ap.correction}</td>
                    <td className="px-3 py-2">{ap.correctiveAction}</td>
                    <td className="px-3 py-2">{ap.targetDate}</td>
                    <td className="px-3 py-2">{ap.responsibility}</td>
                    <td className="px-3 py-2 font-bold">{ap.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-slate-500 italic">No action plan items recorded.</p>
          )}
        </div>

        {/* Supervisor Comments */}
        <div className="print:break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4">Supervisor Review Comments</h3>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">1. Good points / Best practices observed</label>
              <textarea 
                className="w-full bg-white border border-slate-300 rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0 print:resize-none" 
                rows={3} 
                value={comment1} 
                onChange={e => setComment1(e.target.value)}
                placeholder="Enter comments here..."
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">2. Areas for improvement</label>
              <textarea 
                className="w-full bg-white border border-slate-300 rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0 print:resize-none" 
                rows={3} 
                value={comment2} 
                onChange={e => setComment2(e.target.value)}
                placeholder="Enter comments here..."
              />
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-2">3. General feedback</label>
              <textarea 
                className="w-full bg-white border border-slate-300 rounded p-3 text-sm focus:ring-2 focus:ring-blue-500 print:border-none print:bg-transparent print:p-0 print:resize-none" 
                rows={3} 
                value={comment3} 
                onChange={e => setComment3(e.target.value)}
                placeholder="Enter comments here..."
              />
            </div>
          </div>
        </div>

        {/* Signatures for Print */}
        <div className="hidden print:flex justify-between mt-16 pt-8 border-t border-slate-300">
          <div className="text-center w-64">
            <div className="border-b-2 border-slate-800 mb-2 pb-8"></div>
            <p className="font-bold">Auditor Signature</p>
            <p className="text-sm text-slate-500">{audit.auditorName}</p>
          </div>
          <div className="text-center w-64">
            <div className="border-b-2 border-slate-800 mb-2 pb-8"></div>
            <p className="font-bold">Supervisor Signature</p>
          </div>
        </div>

      </div>
    </div>
  );
}
