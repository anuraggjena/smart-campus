import { db } from "@/lib/db/client";
import {
  announcements,
  campusServices,
  policies,
  procedures,
} from "@/lib/db/schema.runtime";

function rand(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPastDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d.toISOString();
}

async function seed() {
  console.log("Seeding realistic campus data...");

  // -------- ANNOUNCEMENTS --------
  const announcementTitles = [
    "Mid Semester Exam Schedule Released",
    "Hostel Maintenance Notice",
    "Library Timing Extended",
    "Fee Payment Deadline Reminder",
    "Guest Lecture on AI",
    "Campus Placement Drive",
    "Water Supply Interruption in Hostel",
    "Sports Fest Registrations Open",
    "Internal Assessment Dates",
    "Scholarship Application Notice",
  ];

  for (let i = 0; i < 60; i++) {
    await db.insert(announcements).values({
      title: rand(announcementTitles),
      message: "Please check the portal for full details.",
      priority: rand(["NORMAL", "IMPORTANT", "URGENT"]) as any,
      audience: rand(["ALL", "STUDENTS", "HOSTELLERS"]) as any,
      activeFrom: randomPastDate(90),
      activeUntil: randomPastDate(10),
      isActive: true,
    });
  }

  // -------- SERVICES --------
const services = [
  "Hostel Room Allotment",
  "Bus Pass / Transportation",
  "Library Membership",
  "Fee Payment Desk",
  "Attendance Regularization",
];

for (let i = 0; i < 40; i++) {
  await db.insert(campusServices).values({
    name: rand(services),
    description: "Campus service available for students.",
    category: rand(["HOSTEL", "GENERAL", "ACADEMICS", "FEES", "LIBRARY"]) as any,
    owningOffice: "Admin Office",
    isActive: true,
    createdAt: randomPastDate(60),
    updatedAt: randomPastDate(10),
  });
}

  // -------- POLICIES --------
  const policyTitles = [
    "Attendance Policy",
    "Hostel Discipline Policy",
    "Examination Policy",
    "Fee Refund Policy",
    "Library Usage Policy",
  ];

  for (let i = 0; i < 40; i++) {
    await db.insert(policies).values({
      code: `POL-${i}`,
      title: rand(policyTitles),
      domain: rand(["ACADEMICS", "EXAMS", "FEES", "HOSTEL"]) as any,
      content: "Detailed policy guidelines for students.",
      version: "1.0",
      owningOffice: "Admin Office",
      createdAt: randomPastDate(120),
    });
  }

  // -------- PROCEDURES --------
  const procedureTitles = [
    "Leave Application",
    "Exam Revaluation",
    "Bonafide Certificate Request",
    "Hostel Room Change Request",
    "Library Card Replacement",
  ];

  for (let i = 0; i < 40; i++) {
    await db.insert(procedures).values({
      code: `PROC-${i}`,
      title: rand(procedureTitles),
      domain: rand(["ACADEMICS", "EXAMS", "HOSTEL", "FEES"]) as any,
      stepsJson: JSON.stringify([
        "Fill the online form",
        "Upload required documents",
        "Get approval from concerned office",
        "Receive confirmation mail",
      ]),
      owningOffice: "Academic Office",
      createdAt: randomPastDate(100),
    });
  }

  console.log("Realistic campus data seeded.");
}

seed().then(() => process.exit());
