import { db } from "./lib/db/client";
import {
  users,
  campusServices,
  announcements,
  policies,
  procedures,
  academicEvents,
} from "./lib/db/schema.runtime";

async function seed() {
  console.log("Seeding large demo campus data...");

  const now = new Date().toISOString();

  // USERS
  await db.insert(users).values([
    {
      name: "Hosteller Student",
      email: "hosteller@demo.edu",
      passwordHash: "dummy",
      role: "STUDENT",
      department: "CSE",
      isHosteller: true,
    },
    {
      name: "Day Scholar Student",
      email: "dayscholar@demo.edu",
      passwordHash: "dummy",
      role: "STUDENT",
      department: "CSE",
      isHosteller: false,
    },
  ]);

  // CAMPUS SERVICES
  await db.insert(campusServices).values([
    {
      name: "Hostel Room Allotment",
      description: "Room allocation, maintenance and hostel facilities.",
      category: "HOSTEL",
      owningOffice: "Hostel Office",
      visibility: "HOSTELLERS_ONLY",
    },
    {
      name: "Fee Payment Desk",
      description: "Support for fee payment, receipts and queries.",
      category: "FEES",
      owningOffice: "Accounts Office",
      visibility: "ALL_STUDENTS",
    },
    {
      name: "Library Membership",
      description: "Access to books, journals and reading rooms.",
      category: "LIBRARY",
      owningOffice: "Library",
      visibility: "ALL_STUDENTS",
    },
    {
      name: "Campus Transportation",
      description: "Bus routes, passes and transport timings.",
      category: "TRANSPORT",
      owningOffice: "Transport Office",
      visibility: "ALL_STUDENTS",
    },
    {
      name: "Attendance Monitoring",
      description: "Attendance rules, shortage handling and reports.",
      category: "GENERAL",
      owningOffice: "Academic Office",
      visibility: "ALL_STUDENTS",
    },
  ]);

  // ANNOUNCEMENTS (varied)
  await db.insert(announcements).values([
    {
      title: "Semester Fee Deadline Approaching",
      message: "Pay fees before 25th to avoid late fine.",
      priority: "URGENT",
      activeFrom: now,
      isActive: true,
    },
    {
      title: "Mid-Sem Exam Schedule Released",
      message: "Check exam timetable in academic events.",
      priority: "IMPORTANT",
      activeFrom: now,
      isActive: true,
    },
    {
      title: "Library Timing Extended",
      message: "Library open till 10 PM during exams.",
      priority: "NORMAL",
      activeFrom: now,
      isActive: true,
    },
    {
      title: "Hostel Maintenance Notice",
      message: "Water supply interruption tomorrow morning.",
      priority: "IMPORTANT",
      visibility: "HOSTELLERS_ONLY",
      activeFrom: now,
      activeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
      isActive: true,
    },
    {
      title: "Transport Route Updated",
      message: "New bus stop added near main gate.",
      priority: "NORMAL",
      activeFrom: now,
      isActive: true,
    },
  ]);

  // POLICIES
  await db.insert(policies).values([
    {
      code: "FEE_POLICY",
      title: "Fee Payment Policy",
      domain: "FEES",
      owningOffice: "Accounts Office",
      content: "Fees must be paid before deadline to avoid penalties.",
      version: "1.0",
    },
    {
      code: "HOSTEL_POLICY",
      title: "Hostel Rules and Regulations",
      domain: "HOSTEL",
      owningOffice: "Hostel Office",
      content: "Hostellers must follow discipline and timing rules.",
      version: "1.0",
    },
    {
      code: "ATTENDANCE_POLICY",
      title: "Attendance Policy",
      domain: "ACADEMICS",
      owningOffice: "Academic Office",
      content: "Minimum 75% attendance required to sit for exams.",
      version: "1.0",
    },
    {
      code: "EXAM_POLICY",
      title: "Examination Policy",
      domain: "EXAMS",
      owningOffice: "Exam Cell",
      content: "Rules regarding exam conduct and evaluation.",
      version: "1.0",
    },
  ]);

  // PROCEDURES
  await db.insert(procedures).values([
    {
      code: "LEAVE_APPLICATION",
      title: "Leave Application",
      domain: "ACADEMICS",
      stepsJson: JSON.stringify([
        "Fill leave form online",
        "Get HOD approval",
        "Submit to academic office",
      ]),
      owningOffice: "Academic Office",
    },
    {
      code: "EXAM_REVALUATION",
      title: "Exam Revaluation",
      domain: "EXAMS",
      stepsJson: JSON.stringify([
        "Apply within 7 days",
        "Pay revaluation fee",
        "Wait for updated marks",
      ]),
      owningOffice: "Exam Cell",
    },
    {
      code: "HOSTEL_COMPLAINT",
      title: "Hostel Complaint Procedure",
      domain: "HOSTEL",
      stepsJson: JSON.stringify([
        "Submit complaint form",
        "Warden review",
        "Maintenance action",
      ]),
      owningOffice: "Hostel Office",
    },
    {
      code: "FEE_REFUND",
      title: "Fee Refund Request",
      domain: "FEES",
      stepsJson: JSON.stringify([
        "Submit refund form",
        "Accounts verification",
        "Refund processed",
      ]),
      owningOffice: "Accounts Office",
    },
  ]);

  // ACADEMIC EVENTS
  await db.insert(academicEvents).values([
    {
      department: "CSE",
      title: "Mid-Sem Exams",
      description: "Mid semester exams for all subjects",
      type: "EXAM",
      startDate: now,
      createdByRole: "HOD",
    },
    {
      department: "CSE",
      title: "Internal Assessment 2",
      description: "Second internal assessment",
      type: "ASSESSMENT",
      startDate: now,
      createdByRole: "HOD",
    },
    {
      department: "CSE",
      title: "Lab Schedule Update",
      description: "Updated lab timings for this semester",
      type: "SCHEDULE",
      startDate: now,
      createdByRole: "HOD",
    },
  ]);

  console.log("Large demo data seeded successfully.");
}

seed();
