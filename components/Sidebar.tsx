"use client";

import {
  LayoutDashboard,
  Kanban,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between">
      
      {/* Top Section */}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">lenderPro</h1>

        <nav className="space-y-2">
          <MenuItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <MenuItem icon={<Kanban size={18} />} label="Loan Pipeline" active />
          <MenuItem icon={<FileText size={18} />} label="Applications" />
          <MenuItem icon={<Users size={18} />} label="Borrowers" />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700">
        <nav className="space-y-2">
          <MenuItem icon={<Settings size={18} />} label="Settings" />
          <MenuItem icon={<LogOut size={18} />} label="Logout" />
        </nav>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
        active ? "bg-blue-600" : "hover:bg-slate-800"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}