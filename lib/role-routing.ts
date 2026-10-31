export function getRoleDashboard(role: string): string {
  switch (role.toUpperCase()) {
    case "ADMIN":
      return "/admin";

    case "EMPLOYEE":
      return "/dashboard";

    case "PARTNER":
      return "/dashboard";

    case "POS":
      return "/dashboard";

    default:
      return "/login";
  }
}