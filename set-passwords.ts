import bcrypt from "bcryptjs";
import { db } from "./lib/db/client";
import { users } from "./lib/db/schema.runtime";
import { eq } from "drizzle-orm";

async function setPasswords() {
  const hash = await bcrypt.hash("password123", 10);

  await db
    .update(users)
    .set({ passwordHash: hash })
    .where(eq(users.email, "hosteller@demo.edu"));

  await db
    .update(users)
    .set({ passwordHash: hash })
    .where(eq(users.email, "dayscholar@demo.edu"));

  console.log("Passwords updated to: password123");
}

setPasswords();
