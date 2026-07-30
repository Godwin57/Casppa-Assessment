"use client";

import { useRouter, usePathname } from "next/navigation";
import { Users, User, ShieldCheck } from "lucide-react";

export function DevRoleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  // Optional: hide on specific pages if needed
  if (pathname === "/login") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 shadow-xl rounded-xl p-2 flex gap-2 z-[9999]">
      <button
        onClick={() => router.push("/student")}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1a2332] rounded-lg transition-colors"
      >
        <User size={14} /> Student
      </button>
      <button
        onClick={() => router.push("/teacher")}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1a2332] rounded-lg transition-colors"
      >
        <Users size={14} /> Teacher
      </button>
      <button
        onClick={() => router.push("/proprietor")}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1a2332] rounded-lg transition-colors"
      >
        <ShieldCheck size={14} /> Proprietor
      </button>
    </div>
  );
}
