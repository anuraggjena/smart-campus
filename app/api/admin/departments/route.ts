import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

// GET ALL DEPARTMENTS
export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select()
    .from(departments)
    .orderBy(departments.code);

  return NextResponse.json(list);
}

// CREATE NEW DEPARTMENT
export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  try {
    const body = await req.json();
    const { id, code, name } = body;

    // Basic Validation
    if (!id || !code || !name) {
      return NextResponse.json(
        { error: "Missing required fields (ID, Code, Name)" },
        { status: 400 }
      );
    }

    // Insert into DB
    await db.insert(departments).values({
      id,
      code,
      name,
    });

    return NextResponse.json({ success: true, message: "Department created" });
  } catch (error: any) {
    // Handle duplicate ID or Code errors
    if (error.code === 'SQLITE_CONSTRAINT' || error.message?.includes('UNIQUE')) {
       return NextResponse.json(
         { error: "A department with this ID or Code already exists." },
         { status: 409 }
       );
    }
    
    console.error("Failed to create department:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}