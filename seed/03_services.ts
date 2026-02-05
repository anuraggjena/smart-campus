import { db } from "@/lib/db/client";
import { campusServices } from "@/lib/db/schema.runtime";

async function seedServices() {
  await db.insert(campusServices).values([
    {
      name: "Fee Receipt & Payment Clarification",
      description: "Help students resolve fee receipt, dues, and transaction issues",
      category: "FEES",
      owningOffice: "ACC",
      visibility: "ALL_STUDENTS",
      isActive: true,
      createdAt: "2025-01-10T09:15:22Z", // Shortly after Admin creation
      updatedAt: "2025-01-10T09:15:22Z",
    },
    {
      name: "Hostel Maintenance Complaints",
      description: "Report room, water, electricity or furniture issues",
      category: "HOSTEL",
      owningOffice: "HOSTEL",
      visibility: "HOSTELLERS_ONLY",
      isActive: true,
      createdAt: "2025-01-15T11:42:10Z",
      updatedAt: "2025-01-20T14:20:05Z", // Tweaked a week later
    },
    {
      name: "Library Book Issue & Renewal",
      description: "Assistance in issuing, renewing and returning books",
      category: "LIBRARY",
      owningOffice: "LIB",
      isActive: true,
      createdAt: "2025-02-05T08:33:45Z",
      updatedAt: "2025-02-05T08:33:45Z",
    },
    {
      name: "Sports Ground Booking",
      description: "Book cricket, football or badminton courts",
      category: "GENERAL",
      owningOffice: "SPORTS",
      isActive: true,
      createdAt: "2025-02-12T16:05:12Z",
      updatedAt: "2025-02-12T16:05:12Z",
    },
    {
      name: "Bus Route and Pass Support",
      description: "Transport pass and bus timing assistance",
      category: "TRANSPORT",
      owningOffice: "TRANSPORT",
      isActive: true,
      createdAt: "2025-03-05T10:12:30Z",
      updatedAt: "2025-03-05T10:12:30Z",
    },
    {
      name: "Scholarship & Bonafide Assistance",
      description: "Help with scholarship forms and bonafide certificates",
      category: "SCHOLARSHIP",
      owningOffice: "ADMIN",
      isActive: true,
      createdAt: "2025-04-10T14:55:50Z",
      updatedAt: "2025-04-11T09:10:12Z", // Updated the next morning
    },
  ]);

  console.log("Campus services seeded with matched 2025 timestamps.");
}

seedServices();