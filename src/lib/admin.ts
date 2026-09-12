export const adminNav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/programs", label: "Programs" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/lecturers", label: "Lecturers" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/users", label: "Users" },
] as const;

export function isAdminNavActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
