import { requireUser } from "@/lib/auth";
import { getRoleDashboard } from "@/lib/role-routing";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await requireUser();
  const destination = getRoleDashboard(user.role);

  if (destination !== "/dashboard") {
    redirect(destination);
  }

  return <div>Welcome {user.name}</div>;
}