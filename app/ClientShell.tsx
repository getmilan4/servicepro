"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function ClientShell({
  children,
  role,
}: {
  children: React.ReactNode;
  role: string | null;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Sidebar role={role} />}
      <main className="flex-1 p-6">
        {children}
      </main>
    </>
  );
}