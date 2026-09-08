export const dashboardNav = [
  { href: "/dashboard", label: "My Courses" },
  { href: "/dashboard/calendar", label: "Calendar" },
  { href: "/dashboard/profile", label: "Profile" },
] as const;

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function dashboardDisplayName({
  fullName,
  metadataName,
  email,
}: {
  fullName?: string | null;
  metadataName?: unknown;
  email?: string | null;
}) {
  const fromProfile = fullName?.trim();
  if (fromProfile) {
    return fromProfile;
  }
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }
  if (email?.trim()) {
    return email.trim();
  }
  return "Account";
}
