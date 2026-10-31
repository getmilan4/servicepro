
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WhimstackLogo from "@/components/WhimstackLogo";
import { logout } from "@/app/logout";
import { getVisibleNavigation, type Role } from "@/lib/navigation";
import { getRoleDashboard } from "@/lib/role-routing";

import {
  LayoutDashboard,
  Kanban,
  Users,
  FileText,
  Settings,
  LogOut,
  UserCog,
  FolderKanban,
} from "lucide-react";

export default function Sidebar({ role }: { role: string | null }) {
  const pathname = usePathname();

  const validRoles: Role[] = ["ADMIN", "EMPLOYEE", "PARTNER", "POS"];
  const normalizedRole = role?.trim().toUpperCase();

  const currentRole = validRoles.find(
    (item) => item === normalizedRole
  );

  const visibleNavigation = currentRole
    ? getVisibleNavigation(currentRole)
    : [];

  const topNavigation = visibleNavigation.filter(
    (item) => item.label !== "Settings"
  );

  const settingsItem = visibleNavigation.find(
    (item) => item.label === "Settings"
  );

  const icons: Record<string, React.ReactNode> = {
    Dashboard: <LayoutDashboard size={18} />,
    "Loan Pipeline": <Kanban size={18} />,
    Applications: <FileText size={18} />,
    Customers: <Users size={18} />,
    "User Management": <UserCog size={18} />,
    "Central Resource Management": <FolderKanban size={18} />,
    Settings: <Settings size={18} />,
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between">

      {/* Top Section */}
      <div className="p-4">

        {/* Logo + Name */}
        <div className="flex items-center gap-3 mb-6">
          <WhimstackLogo size={36} />
          <span className="text-lg font-semibold tracking-tight">
            Whim<span style={{ color: "#3B7BF6" }}>stack</span>
          </span>
        </div>

        <nav className="space-y-2">
          {topNavigation.map((item) => {
            const href =
              item.label === "Dashboard" && currentRole
                ? getRoleDashboard(currentRole)
                : item.href;

            const active =
              item.label === "Dashboard"
                ? pathname === href
                : pathname.startsWith(href);

            return (
              <MenuItem
                key={item.href}
                icon={icons[item.label]}
                label={item.label}
                href={href}
                active={active}
              />
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700">
        <nav className="space-y-2">
          {settingsItem && (
            <MenuItem
              icon={icons.Settings}
              label="Settings"
              href={settingsItem.href}
              active={pathname.startsWith(settingsItem.href)}
            />
          )}

          <button onClick={() => logout()} className="w-full">
            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition hover:bg-slate-800">
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </div>
          </button>
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
      <div
        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
        ${active ? "bg-blue-600" : "hover:bg-slate-800"}`}
      >
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
