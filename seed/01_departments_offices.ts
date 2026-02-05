import { db } from "@/lib/db/client";
import { departments, offices } from "@/lib/db/schema.runtime";

async function seed() {
  await db.insert(departments).values([
    { id: "CSE", code: "CSE", name: "Computer Science Engineering" },
    { id: "IT", code: "IT", name: "Information Technology" },
    { id: "ECE", code: "ECE", name: "Electronics and Communication Engineering" },
    { id: "EEE", code: "EEE", name: "Electrical and Electronics Engineering" },
    { id: "MECH", code: "MECH", name: "Mechanical Engineering" },
    { id: "CIVIL", code: "CIVIL", name: "Civil Engineering" },
  ]);

  await db.insert(offices).values([
    { id: "ACC", code: "ACC", name: "Accounts Office" },
    { id: "ADMIN", code: "ADMIN", name: "Administration Office" },
    { id: "EXAM", code: "EXAM", name: "Examination Cell" },
    { id: "HOSTEL", code: "HOSTEL", name: "Hostel Office" },
    { id: "LIB", code: "LIB", name: "Library Office" },
    { id: "SPORTS", code: "SPORTS", name: "Sports Office" },
    { id: "TRANSPORT", code: "TRANSPORT", name: "Transport Office" },
  ]);

  console.log("Departments & Offices seeded");
}

seed();
