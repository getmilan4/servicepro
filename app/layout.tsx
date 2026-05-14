import "./globals.css";
import ClientShell from "./ClientShell";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="logo/logo.svg" type="image/svg+xml" />
      </head>
      <body className="flex">
         <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}