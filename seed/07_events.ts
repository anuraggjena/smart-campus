import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";

async function seedAcademicEvents() {
await db.insert(academicEvents).values([
  // --- CSE (Created in Jan/Feb 2025) ---
  {
    title: "Data Structures Internal Test",
    description: "Internal written test for Data Structures module.",
    type: "EXAM",
    departmentId: "CSE",
    startDate: "2025-03-04",
    endDate: "2025-03-04",
    createdByRole: "HOD",
    createdAt: "2025-02-10T09:12:44Z"
  },
  {
    title: "Operating Systems Lab Evaluation",
    description: "Practical evaluation for OS lab experiments.",
    type: "ASSESSMENT",
    departmentId: "CSE",
    startDate: "2025-03-09",
    endDate: "2025-03-09",
    createdByRole: "HOD",
    createdAt: "2025-02-12T11:45:03Z"
  },
  {
    title: "Compiler Design Assignment Review",
    description: "Assignment presentation and review session.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-02-26",
    endDate: "2025-02-26",
    createdByRole: "HOD",
    createdAt: "2025-01-20T14:30:12Z"
  },
  {
    title: "Machine Learning Mini Project Demo",
    description: "Students present ML mini project demos.",
    type: "ASSESSMENT",
    departmentId: "CSE",
    startDate: "2025-04-01",
    endDate: "2025-04-01",
    createdByRole: "HOD",
    createdAt: "2025-03-05T10:05:55Z"
  },
  {
    title: "Cyber Security Class Test",
    description: "Objective test on cybersecurity basics.",
    type: "EXAM",
    departmentId: "CSE",
    startDate: "2025-03-15",
    endDate: "2025-03-15",
    createdByRole: "HOD",
    createdAt: "2025-02-28T08:15:36Z"
  },

  // --- IT ---
  {
    title: "Web Technologies Practical Exam",
    description: "Practical coding test for web tech lab.",
    type: "EXAM",
    departmentId: "IT",
    startDate: "2025-03-11",
    endDate: "2025-03-11",
    createdByRole: "HOD",
    createdAt: "2025-02-15T13:42:01Z"
  },
  {
    title: "Database Systems Assignment Check",
    description: "Assignment viva for DBMS concepts.",
    type: "ASSESSMENT",
    departmentId: "IT",
    startDate: "2025-03-02",
    endDate: "2025-03-02",
    createdByRole: "HOD",
    createdAt: "2025-02-05T10:20:19Z"
  },
  {
    title: "Networking Lab Continuous Evaluation",
    description: "Continuous evaluation for networking lab.",
    type: "ASSESSMENT",
    departmentId: "IT",
    startDate: "2025-03-18",
    endDate: "2025-03-18",
    createdByRole: "HOD",
    createdAt: "2025-03-01T09:11:45Z"
  },
  {
    title: "Information Security Seminar Schedule",
    description: "Seminar presentations by students.",
    type: "SCHEDULE",
    departmentId: "IT",
    startDate: "2025-02-23",
    endDate: "2025-02-23",
    createdByRole: "HOD",
    createdAt: "2025-01-15T15:30:44Z"
  },
  {
    title: "Cloud Infrastructure Internal Review",
    description: "Review of internal cloud lab exercises.",
    type: "ASSESSMENT",
    departmentId: "IT",
    startDate: "2025-03-20",
    endDate: "2025-03-20",
    createdByRole: "HOD",
    createdAt: "2025-03-05T11:04:33Z"
  },

  // --- ECE ---
  {
    title: "Digital Electronics Class Test",
    description: "Written test on digital logic circuits.",
    type: "EXAM",
    departmentId: "ECE",
    startDate: "2025-03-06",
    endDate: "2025-03-06",
    createdByRole: "HOD",
    createdAt: "2025-02-10T16:12:55Z"
  },
  {
    title: "Signals and Systems Assignment Viva",
    description: "Viva for signals assignment work.",
    type: "ASSESSMENT",
    departmentId: "ECE",
    startDate: "2025-02-28",
    endDate: "2025-02-28",
    createdByRole: "HOD",
    createdAt: "2025-01-25T11:38:21Z"
  },
  {
    title: "Embedded Systems Lab Evaluation",
    description: "Evaluation of embedded systems experiments.",
    type: "ASSESSMENT",
    departmentId: "ECE",
    startDate: "2025-03-14",
    endDate: "2025-03-14",
    createdByRole: "HOD",
    createdAt: "2025-03-02T14:55:08Z"
  },
  {
    title: "Communication Systems Quiz",
    description: "Quiz covering modulation techniques.",
    type: "EXAM",
    departmentId: "ECE",
    startDate: "2025-03-19",
    endDate: "2025-03-19",
    createdByRole: "HOD",
    createdAt: "2025-03-08T10:11:19Z"
  },
  {
    title: "PCB Design Workshop Schedule",
    description: "Hands-on workshop for PCB design basics.",
    type: "SCHEDULE",
    departmentId: "ECE",
    startDate: "2025-02-24",
    endDate: "2025-02-24",
    createdByRole: "HOD",
    createdAt: "2025-01-18T09:12:44Z"
  },

  // --- EEE ---
  {
    title: "Power Electronics Internal Exam",
    description: "Internal exam on power electronics topics.",
    type: "EXAM",
    departmentId: "EEE",
    startDate: "2025-03-10",
    endDate: "2025-03-10",
    createdByRole: "HOD",
    createdAt: "2025-02-20T13:55:12Z"
  },
  {
    title: "Control Systems Assignment Evaluation",
    description: "Assignment evaluation for control systems.",
    type: "ASSESSMENT",
    departmentId: "EEE",
    startDate: "2025-03-03",
    endDate: "2025-03-03",
    createdByRole: "HOD",
    createdAt: "2025-02-12T08:45:11Z"
  },
  {
    title: "Electrical Measurements Lab Test",
    description: "Lab test for electrical measurement tools.",
    type: "ASSESSMENT",
    departmentId: "EEE",
    startDate: "2025-03-17",
    endDate: "2025-03-17",
    createdByRole: "HOD",
    createdAt: "2025-03-01T10:05:33Z"
  },
  {
    title: "Switchgear and Protection Quiz",
    description: "Quiz on protection relays and switchgear.",
    type: "EXAM",
    departmentId: "EEE",
    startDate: "2025-03-22",
    endDate: "2025-03-22",
    createdByRole: "HOD",
    createdAt: "2025-03-10T11:20:19Z"
  },
  {
    title: "Renewable Energy Seminar Session",
    description: "Seminar on solar and wind energy trends.",
    type: "SCHEDULE",
    departmentId: "EEE",
    startDate: "2025-02-27",
    endDate: "2025-02-27",
    createdByRole: "HOD",
    createdAt: "2025-01-30T15:01:29Z"
  },

  // --- MECH ---
  {
    title: "Fluid Mechanics Class Test",
    description: "Written test on fluid mechanics principles.",
    type: "EXAM",
    departmentId: "MECH",
    startDate: "2025-03-05",
    endDate: "2025-03-05",
    createdByRole: "HOD",
    createdAt: "2025-02-15T09:18:02Z"
  },
  {
    title: "Manufacturing Processes Lab Assessment",
    description: "Assessment for manufacturing lab exercises.",
    type: "ASSESSMENT",
    departmentId: "MECH",
    startDate: "2025-03-12",
    endDate: "2025-03-12",
    createdByRole: "HOD",
    createdAt: "2025-02-28T14:15:55Z"
  },
  {
    title: "Engineering Graphics Assignment Review",
    description: "Review session for graphics assignments.",
    type: "SCHEDULE",
    departmentId: "MECH",
    startDate: "2025-02-25",
    endDate: "2025-02-25",
    createdByRole: "HOD",
    createdAt: "2025-01-20T10:11:45Z"
  },
  {
    title: "Dynamics of Machines Internal Quiz",
    description: "Quiz on dynamics of machine components.",
    type: "EXAM",
    departmentId: "MECH",
    startDate: "2025-03-18",
    endDate: "2025-03-18",
    createdByRole: "HOD",
    createdAt: "2025-03-05T08:15:22Z"
  },
  {
    title: "Heat Transfer Lab Continuous Evaluation",
    description: "Continuous evaluation for heat transfer lab.",
    type: "ASSESSMENT",
    departmentId: "MECH",
    startDate: "2025-03-21",
    endDate: "2025-03-21",
    createdByRole: "HOD",
    createdAt: "2025-03-12T16:22:44Z"
  },

  // --- CIVIL ---
  {
    title: "Structural Analysis Internal Test",
    description: "Internal test on structural analysis topics.",
    type: "EXAM",
    departmentId: "CIVIL",
    startDate: "2025-03-07",
    endDate: "2025-03-07",
    createdByRole: "HOD",
    createdAt: "2025-02-18T10:11:19Z"
  },
  {
    title: "Geotechnical Engineering Lab Test",
    description: "Lab test on soil testing techniques.",
    type: "ASSESSMENT",
    departmentId: "CIVIL",
    startDate: "2025-03-13",
    endDate: "2025-03-13",
    createdByRole: "HOD",
    createdAt: "2025-03-01T14:45:01Z"
  },
  {
    title: "Transportation Engineering Assignment Viva",
    description: "Viva for transportation assignment work.",
    type: "ASSESSMENT",
    departmentId: "CIVIL",
    startDate: "2025-03-19",
    endDate: "2025-03-19",
    createdByRole: "HOD",
    createdAt: "2025-03-05T11:44:02Z"
  },
  {
    title: "Environmental Engineering Quiz",
    description: "Quiz on environmental pollution control.",
    type: "EXAM",
    departmentId: "CIVIL",
    startDate: "2025-03-23",
    endDate: "2025-03-23",
    createdByRole: "HOD",
    createdAt: "2025-03-15T09:12:44Z"
  },
  {
    title: "Construction Planning Seminar",
    description: "Seminar on modern construction planning tools.",
    type: "SCHEDULE",
    departmentId: "CIVIL",
    startDate: "2025-02-26",
    endDate: "2025-02-26",
    createdByRole: "HOD",
    createdAt: "2025-01-22T13:55:08Z"
  },

  // --- CAMPUS WIDE (Created by ADMIN in Early 2025) ---
  {
    title: "University Sports Day Schedule",
    description: "Annual sports meet schedule for all students.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-03-25",
    endDate: "2025-03-27",
    createdByRole: "ADMIN",
    createdAt: "2025-01-10T10:05:12Z"
  },
  {
    title: "National Science Day Seminar",
    description: "Seminar on innovation and research.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-02-28",
    endDate: "2025-02-28",
    createdByRole: "ADMIN",
    createdAt: "2025-01-12T14:15:36Z"
  },
  {
    title: "Campus Placement Orientation",
    description: "Placement orientation for final year students.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-03-01",
    endDate: "2025-03-01",
    createdByRole: "ADMIN",
    createdAt: "2025-01-15T09:33:12Z"
  },
  {
    title: "Library Orientation Session",
    description: "Introduction to digital library resources.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-02-19",
    endDate: "2025-02-19",
    createdByRole: "ADMIN",
    createdAt: "2025-01-10T11:30:59Z"
  },
  {
    title: "Anti-Ragging Awareness Program",
    description: "Mandatory awareness session for all students.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-02-21",
    endDate: "2025-02-21",
    createdByRole: "ADMIN",
    createdAt: "2025-01-14T12:40:02Z"
  },
  {
    title: "Annual Cultural Fest Schedule",
    description: "Events planned for cultural fest.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    createdByRole: "ADMIN",
    createdAt: "2025-02-01T10:44:19Z"
  },
  {
    title: "Exam Form Filling Deadline",
    description: "Last date to submit exam forms.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-03-03",
    endDate: "2025-03-03",
    createdByRole: "ADMIN",
    createdAt: "2025-02-05T09:40:44Z"
  },
  {
    title: "Scholarship Document Verification",
    description: "Verification drive for scholarship applicants.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-03-06",
    endDate: "2025-03-07",
    createdByRole: "ADMIN",
    createdAt: "2025-02-15T11:01:44Z"
  },
  {
    title: "Internship Awareness Talk",
    description: "Guidance session for internship opportunities.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-03-09",
    endDate: "2025-03-09",
    createdByRole: "ADMIN",
    createdAt: "2025-02-20T14:16:15Z"
  },
  {
    title: "Health Checkup Camp",
    description: "Free health checkup for all students.",
    type: "SCHEDULE",
    departmentId: "CSE",
    startDate: "2025-03-22",
    endDate: "2025-03-22",
    createdByRole: "ADMIN",
    createdAt: "2025-03-01T08:15:19Z"
  },
]);
    console.log("✅ Academic events seeded");
}

seedAcademicEvents();