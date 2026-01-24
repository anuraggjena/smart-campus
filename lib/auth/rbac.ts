import { Role } from "@/lib/types";

export function requireRole<T extends { role: string }>(
  user: T | null,
  allowedRoles: Role[]
): asserts user is T {
  if (!user) {
    throw new Response(
      JSON.stringify({ error: "UNAUTHENTICATED" }),
      { status: 401 }
    );
  }

  if (!allowedRoles.includes(user.role as Role)) {
    throw new Response(
      JSON.stringify({ error: "FORBIDDEN" }),
      { status: 403 }
    );
  }
}
