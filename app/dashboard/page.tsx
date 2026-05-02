import { requireUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await requireUser();
  return <div>Welcome {user.email}</div>;
}