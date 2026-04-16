"use client";

import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();
  const isLoginPage = pathname === "/login";


  return (
    <html lang="en">
      <body className="flex">
        {/* Show sidebar only if NOT login */}
        {!isLoginPage && <Sidebar />}
        <main className="flex-1 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}