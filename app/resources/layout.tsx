
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  // Central Resource Management is available to everyone except POS.
  const allowedRoles = ["ADMIN", "EMPLOYEE", "PARTNER"];

  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
