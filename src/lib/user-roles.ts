export const profileRoles = ["student", "teacher", "admin"] as const;
export type ProfileRole = (typeof profileRoles)[number];

const roleLabels: Record<ProfileRole, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};

export function isProfileRole(value: string): value is ProfileRole {
  return (profileRoles as readonly string[]).includes(value);
}

export function roleLabel(role: string) {
  if (isProfileRole(role)) {
    return roleLabels[role];
  }
  return role;
}

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: ProfileRole;
  roleLabel: string;
  joinedAt: string;
};
