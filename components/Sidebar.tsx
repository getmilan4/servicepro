"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Kanban,
  Users,
  FileText,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between">

      {/* Top Section */}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-6">Service Pro</h1>

        <nav className="space-y-2">
          <MenuItem icon={<LayoutDashboard size={18} />} label="Dashboard" href="/dashboard" 
          active={pathname.startsWith("/dashboard")} />
          <MenuItem icon={<Kanban size={18} />} label="Loan Pipeline" href="/pipeline" 
          active={pathname.startsWith("/pipeline")} />
          <MenuItem icon={<FileText size={18} />} label="Applications" href="/applications" 
          active={pathname.startsWith("/applications")} />
          <MenuItem icon={<Users size={18} />} label="Borrowers" href="/borrowers" 
          active={pathname.startsWith("/borrowers")} />
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700">
        <nav className="space-y-2">
          <MenuItem icon={<Settings size={18} />} label="Settings" href="/settings" />
          <MenuItem icon={<LogOut size={18} />} label="Logout" href="/logout" />
        </nav>
      </div>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
      ${active ? "bg-blue-600" : "hover:bg-slate-800"
        }`}>
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
