"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FIXED_ZONES } from "@/lib/constants";

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month") || new Date().toISOString().substring(0, 7);
  const currentZone = searchParams.get("zone") || "ALL";

  const currentYear = currentMonth.substring(0, 4);
  const currentMonthNum = currentMonth.substring(5, 7);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    router.push(`/dashboard?month=${newYear}-${currentMonthNum}&zone=${currentZone}`);
  };

  const handleMonthNumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    router.push(`/dashboard?month=${currentYear}-${newMonth}&zone=${currentZone}`);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZone = e.target.value;
    router.push(`/dashboard?month=${currentMonth}&zone=${newZone}`);
  };

  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const years = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="font-bold text-slate-700 text-sm whitespace-nowrap">Filter Year:</label>
        <select 
          value={currentYear} 
          onChange={handleYearChange}
          className="border border-slate-300 rounded px-2 py-1 text-sm font-medium outline-none focus:border-blue-500 w-full sm:w-auto text-black"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="font-bold text-slate-700 text-sm whitespace-nowrap">Filter Month:</label>
        <select 
          value={currentMonthNum} 
          onChange={handleMonthNumChange}
          className="border border-slate-300 rounded px-2 py-1 text-sm font-medium outline-none focus:border-blue-500 w-full sm:w-auto text-black"
        >
          {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="font-bold text-slate-700 text-sm whitespace-nowrap">Filter Zone:</label>
        <select 
          value={currentZone} 
          onChange={handleZoneChange}
          className="border border-slate-300 rounded px-2 py-1 text-sm font-medium outline-none focus:border-blue-500 w-full sm:w-auto text-black"
        >
          <option value="ALL">All Zones</option>
          {FIXED_ZONES.map(z => (
            <option key={z} value={z}>{z}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
