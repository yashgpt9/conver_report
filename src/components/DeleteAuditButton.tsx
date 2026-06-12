"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAuditButton({ id, zoneName }: { id: string, zoneName: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the audit for ${zoneName}? This will unlock the zone for the current month.`)) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/audits/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete audit");
      }
    } catch (e) {
      alert("Error deleting audit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 font-bold transition-colors disabled:opacity-50 ml-4"
    >
      {loading ? "Deleting..." : "Delete / Unlock"}
    </button>
  );
}
