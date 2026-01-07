export type Role = "STUDENT" | "ADMIN";

export function requireRole(
  user: { role: string } | null,
  allowedRoles: Role[]
) {
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (!allowedRoles.includes(user.role as Role)) {
    throw new Error("FORBIDDEN");
  }
}
