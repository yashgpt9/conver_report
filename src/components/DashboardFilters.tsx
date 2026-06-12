"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FIXED_ZONES } from "@/lib/constants";

export default function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get("month") || new Date().toISOString().substring(0, 7);
  const currentZone = searchParams.get("zone") || "ALL";

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMonth = e.target.value;
    router.push(`/dashboard?month=${newMonth}&zone=${currentZone}`);
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newZone = e.target.value;
    router.push(`/dashboard?month=${currentMonth}&zone=${newZone}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label className="font-bold text-slate-700 text-sm whitespace-nowrap">Filter Month:</label>
        <input 
          type="month" 
          value={currentMonth} 
          onChange={handleMonthChange} 
          className="border border-slate-300 rounded px-2 py-1 text-sm font-medium outline-none focus:border-blue-500 w-full sm:w-auto text-black"
        />
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
