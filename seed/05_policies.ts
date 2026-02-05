import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";

async function seedPolicies() {
await db.insert(policies).values([
    {
        code: "FEE_LATE_FINE_01",
        title: "Late Fee Fine Structure",
        domain: "FEES",
        owningOffice: "ACC",
        version: "1.0",
        content: "Students failing to pay semester fees before the due date will incur a late fine of ₹50 per day for the first 10 days and ₹100 per day thereafter. After 30 days, Access to academic facilities may be restricted.",
        isActive: true,
        createdAt: "2025-01-06T09:12:45Z"
    },
    {
        code: "HOSTEL_GATE_TIMING_01",
        title: "Hostel Gate Entry and Exit Timings",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        version: "1.0",
        content: "Hostel students must enter the campus before 9:30 PM. Late entry requires prior written permission from the warden.",
        isActive: true,
        createdAt: "2025-01-06T11:20:14Z"
    },
    {
        code: "EXAM_MALPRACTICE_01",
        title: "Examination Malpractice Rules",
        domain: "EXAMS",
        owningOffice: "EXAM",
        version: "1.0",
        content: "Any student found cheating, possessing unauthorized material, or communicating during exams will have the paper cancelled and may face suspension.",
        isActive: true,
        createdAt: "2025-02-10T10:05:33Z" // Created during EXAM planning
    },
    {
        code: "ATTENDANCE_RULE_01",
        title: "Minimum Attendance Eligibility",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Students must maintain a minimum of 75% attendance in each subject to be eligible for semester examinations.",
        isActive: true,
        createdAt: "2025-01-07T08:45:11Z"
    },
    {
        code: "LIB_OVERDUE_FINE_01",
        title: "Library Overdue Penalty",
        domain: "GENERAL",
        owningOffice: "LIB",
        version: "1.0",
        content: "A fine of ₹5 per day per book will be charged for overdue library books.",
        isActive: true,
        createdAt: "2025-01-07T14:30:52Z"
    },
    {
        code: "SCHOLARSHIP_ELIGIBILITY_01",
        title: "Scholarship Eligibility Criteria",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Scholarships are awarded based on merit, attendance, and family income proof submission before the deadline.",
        isActive: true,
        createdAt: "2025-01-08T09:15:22Z"
    },
    {
        code: "LAB_USAGE_01",
        title: "Laboratory Usage Guidelines",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Students must wear lab coats and handle equipment responsibly. Damages must be reported immediately.",
        isActive: true,
        createdAt: "2025-01-08T11:42:05Z"
    },
    {
        code: "BUS_DISCIPLINE_01",
        title: "Bus Transport Discipline Rules",
        domain: "GENERAL",
        owningOffice: "TRANSPORT",
        version: "1.0",
        content: "Students must follow seating discipline and avoid standing near doors during travel.",
        isActive: true,
        createdAt: "2025-01-09T13:04:33Z"
    },
    {
        code: "HOSTEL_VISITOR_01",
        title: "Hostel Visitor Policy",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        version: "1.0",
        content: "Visitors are allowed only between 4 PM to 7 PM with proper ID verification at the hostel gate.",
        isActive: true,
        createdAt: "2025-01-10T10:25:12Z"
    },
    {
        code: "EXAM_REVALUATION_01",
        title: "Exam Revaluation Procedure",
        domain: "EXAMS",
        owningOffice: "EXAM",
        version: "1.0",
        content: "Students may apply for revaluation within 5 days of result declaration by paying the prescribed fee.",
        isActive: true,
        createdAt: "2025-02-12T15:30:44Z"
    },
    {
        code: "ID_CARD_RULE_01",
        title: "Mandatory ID Card Rule",
        domain: "GENERAL",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Students must carry their ID cards at all times inside the campus premises.",
        isActive: true,
        createdAt: "2025-01-12T09:18:02Z"
    },
    {
        code: "SPORTS_GROUND_RULE_01",
        title: "Sports Ground Usage Rules",
        domain: "GENERAL",
        owningOffice: "SPORTS",
        version: "1.0",
        content: "Students must use sports grounds only during permitted hours and maintain cleanliness.",
        isActive: true,
        createdAt: "2025-01-12T16:22:44Z"
    },
    {
        code: "HOSTEL_MESS_RULE_01",
        title: "Hostel Mess Discipline",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        version: "1.0",
        content: "Students must adhere to mess timings and avoid food wastage.",
        isActive: true,
        createdAt: "2025-01-14T08:15:36Z"
    },
    {
        code: "FEE_REFUND_01",
        title: "Fee Refund Policy",
        domain: "FEES",
        owningOffice: "ACC",
        version: "1.0",
        content: "Fee refund is allowed only within 10 days of semester start with valid reasons.",
        isActive: true,
        createdAt: "2025-01-15T11:38:21Z"
    },
    {
        code: "ATTENDANCE_SHORTAGE_01",
        title: "Attendance Shortage Handling",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Students with attendance below 75% must submit a valid explanation to the department HOD.",
        isActive: true,
        createdAt: "2025-01-16T14:55:08Z"
    },
    {
        code: "LIBRARY_SILENCE_01",
        title: "Library Silence Policy",
        domain: "GENERAL",
        owningOffice: "LIB",
        version: "1.0",
        content: "Absolute silence must be maintained in the library reading halls.",
        isActive: true,
        createdAt: "2025-01-18T10:11:19Z"
    },
    {
        code: "BUS_PASS_RULE_01",
        title: "Bus Pass Renewal Rule",
        domain: "GENERAL",
        owningOffice: "TRANSPORT",
        version: "1.0",
        content: "Bus passes must be renewed every semester before travel.",
        isActive: true,
        createdAt: "2025-01-20T09:12:44Z"
    },
    {
        code: "LAB_EQUIPMENT_DAMAGE_01",
        title: "Lab Equipment Damage Liability",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Students responsible for equipment damage must bear the replacement cost.",
        isActive: true,
        createdAt: "2025-01-22T13:55:12Z"
    },
    {
        code: "EXAM_LATE_ENTRY_01",
        title: "EXAM Late Entry Restriction",
        domain: "EXAMS",
        owningOffice: "EXAM",
        version: "1.0",
        content: "Students arriving more than 30 minutes late will not be permitted to write the EXAM.",
        isActive: true,
        createdAt: "2025-02-15T11:20:19Z"
    },
    {
        code: "HOSTEL_ROOM_INSPECTION_01",
        title: "HOSTEL Room Inspection Policy",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        version: "1.0",
        content: "Periodic room inspections will be conducted to ensure cleanliness and discipline.",
        isActive: true,
        createdAt: "2025-01-25T10:01:36Z"
    },
    {
        code: "SCHOLARSHIP_DOCUMENTS_01",
        title: "Scholarship Document Submission Rule",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "Incomplete document submission will result in scholarship rejection.",
        isActive: true,
        createdAt: "2025-01-28T15:30:14Z"
    },
    {
        code: "SPORTS_EQUIPMENT_01",
        title: "Sports Equipment Issuance Policy",
        domain: "GENERAL",
        owningOffice: "SPORTS",
        version: "1.0",
        content: "Sports equipment must be returned on the same day before 6 PM.",
        isActive: true,
        createdAt: "2025-01-30T09:15:58Z"
    },
    {
        code: "FEE_INSTALLMENT_01",
        title: "Fee Installment Facility",
        domain: "FEES",
        owningOffice: "ACC",
        version: "1.0",
        content: "Students may apply for fee installment by submitting a request to ACCounts office.",
        isActive: true,
        createdAt: "2025-02-02T11:15:27Z"
    },
    {
        code: "ID_CARD_LOSS_01",
        title: "Lost ID Card Replacement Rule",
        domain: "GENERAL",
        owningOffice: "ADMIN",
        version: "1.0",
        content: "A fine of ₹200 is charged for reissuing a lost ID card.",
        isActive: true,
        createdAt: "2025-02-05T14:45:01Z"
    },
    {
        code: "EXAM_HALL_TICKET_01",
        title: "Hall Ticket Mandatory Rule",
        domain: "EXAMS",
        owningOffice: "EXAM",
        version: "1.0",
        content: "Students must carry hall ticket and ID card to enter the EXAM hall.",
        isActive: true,
        createdAt: "2025-02-20T08:15:36Z"
    }
]);

 console.log("✅ Policies seeded");
}

seedPolicies()