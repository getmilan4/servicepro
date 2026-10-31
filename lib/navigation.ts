import { FolderKanban } from "lucide-react";

export type Role = "ADMIN" | "EMPLOYEE" | "PARTNER" | "POS";

export type NavigationItem = {
  label: string;
  href: string;
  roles: Role[];
};

export const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["ADMIN", "EMPLOYEE", "PARTNER", "POS"],
  },
  {
    label: "Loan Pipeline",
    href: "/pipeline",
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    label: "Applications",
    href: "/applications",
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    label: "Customers",
    href: "/customers",
    roles: ["ADMIN", "EMPLOYEE"],
  },
  {
    label: "User Management",
    href: "/admin/users",
    roles: ["ADMIN"],
  },
  {
    label: "Central Resource Management",
    href: "/resources",
    roles: ["ADMIN", "EMPLOYEE", "PARTNER"],
  },
  {
    label: "Settings",
    href: "/settings",
    roles: ["ADMIN", "EMPLOYEE", "PARTNER", "POS"],
  },
];

export function getVisibleNavigation(role: Role) {
  return navigation.filter((item) => item.roles.includes(role));
}