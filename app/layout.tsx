import "./globals.css";
import ClientShell from "./ClientShell";
import { getCurrentUser } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="logo/logo.svg" type="image/svg+xml" />
      </head>
      <body className="flex">
        <ClientShell role={user?.role ?? null}>
          {children}
        </ClientShell>
      </body>
    </html>
  );
}