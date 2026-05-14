"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <main className="flex-1 p-6">
        {children}
      </main>
    </>
  );
}