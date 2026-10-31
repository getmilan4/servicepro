
import "./globals.css";
import ClientShell from "./ClientShell";
import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whimstack",
  description: "Whimstack Application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="flex">
        <ClientShell role={user?.role ?? null}>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}
