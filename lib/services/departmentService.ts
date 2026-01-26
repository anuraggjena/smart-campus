import { db } from "@/lib/db/client";
import { departments } from "@/lib/db/schema.runtime";

export async function getAllDepartments() {
  return db.select().from(departments);
}
