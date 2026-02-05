import { db } from "@/lib/db/client";
import { procedures } from "@/lib/db/schema.runtime";

async function seedProcedures() {
await db.insert(procedures).values([
    {
        code: "LEAVE_APPLICATION",
        title: "How to Apply for Leave",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-01-10T09:12:45Z",
        stepsJson: JSON.stringify([
            "Collect leave application form from department office or portal.",
            "Fill in dates and reason for leave clearly.",
            "Attach supporting documents if medical leave.",
            "Get parent signature if leave exceeds 3 days.",
            "Submit to class advisor for approval.",
            "Collect signed copy and keep for record."
        ])
    },
    {
        code: "TRANSFER_CERTIFICATE",
        title: "How to Get Transfer Certificate (TC)",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-01-10T11:20:14Z",
        stepsJson: JSON.stringify([
            "Clear all department and library dues.",
            "Collect TC request form from admin office.",
            "Fill personal and academic details.",
            "Get HOD signature.",
            "Submit form to admin office.",
            "Collect TC after 5 working days."
        ])
    },
    {
        code: "EXAM_REVALUATION",
        title: "How to Apply for Exam Revaluation",
        domain: "EXAMS",
        owningOffice: "EXAM",
        isActive: true,
        createdAt: "2025-02-05T10:05:33Z",
        stepsJson: JSON.stringify([
            "Download revaluation form from exam portal.",
            "Fill subject details carefully.",
            "Pay prescribed revaluation fee.",
            "Attach payment receipt.",
            "Submit form to exam cell within 5 days of results.",
            "Check portal for updated marks."
        ])
    },
    {
        code: "HOSTEL_ROOM_CHANGE",
        title: "How to Request Hostel Room Change",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        isActive: true,
        createdAt: "2025-01-12T08:45:11Z",
        stepsJson: JSON.stringify([
            "Collect room change request form from warden office.",
            "Mention valid reason for change.",
            "Get roommate consent if required.",
            "Submit form to hostel warden.",
            "Wait for room availability confirmation.",
            "Shift after approval."
        ])
    },
    {
        code: "DUPLICATE_ID_CARD",
        title: "How to Get Duplicate ID Card",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-01-12T14:30:52Z",
        stepsJson: JSON.stringify([
            "Report lost ID to admin office.",
            "Fill duplicate ID request form.",
            "Pay ₹200 fine at accounts.",
            "Submit payment receipt.",
            "Provide passport size photograph.",
            "Collect ID after 3 days."
        ])
    },
    {
        code: "SCHOLARSHIP_APPLICATION",
        title: "How to Apply for Scholarship",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-02-08T09:15:22Z",
        stepsJson: JSON.stringify([
            "Download scholarship form from portal.",
            "Fill academic and family income details.",
            "Attach income certificate and marksheets.",
            "Get HOD signature.",
            "Submit before deadline.",
            "Track approval on portal."
        ])
    },
    {
        code: "CLEAR_LIBRARY_FINE",
        title: "How to Clear Library Fine",
        domain: "GENERAL",
        owningOffice: "LIB",
        isActive: true,
        createdAt: "2025-01-14T11:42:05Z",
        stepsJson: JSON.stringify([
            "Visit library counter with overdue book.",
            "Return the book to librarian.",
            "Check fine amount in system.",
            "Pay fine at library desk.",
            "Collect fine clearance receipt."
        ])
    },
    {
        code: "BOOK_SPORTS_GROUND",
        title: "How to Book Sports Ground",
        domain: "GENERAL",
        owningOffice: "SPORTS",
        isActive: true,
        createdAt: "2025-02-12T13:04:33Z",
        stepsJson: JSON.stringify([
            "Visit sports office for slot availability.",
            "Fill booking register with name and time.",
            "Get sports incharge approval.",
            "Use ground only during allotted slot.",
            "Ensure equipment is returned after use."
        ])
    },
    {
        code: "BUS_PASS_APPLICATION",
        title: "How to Apply for Bus Pass",
        domain: "GENERAL",
        owningOffice: "TRANSPORT",
        isActive: true,
        createdAt: "2025-01-15T10:25:12Z",
        stepsJson: JSON.stringify([
            "Collect bus pass form from transport office.",
            "Fill route and stop details.",
            "Attach passport photo.",
            "Pay semester bus fee.",
            "Submit form and collect pass."
        ])
    },
    {
        code: "HOSTEL_MESS_COMPLAINT",
        title: "How to Raise Mess Complaint",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        isActive: true,
        createdAt: "2025-01-16T15:30:44Z",
        stepsJson: JSON.stringify([
            "Note complaint details clearly.",
            "Report issue to mess supervisor.",
            "Enter complaint in mess register.",
            "Wait for inspection by warden.",
            "Follow up if issue persists."
        ])
    },
    {
        code: "BONAFIDE_CERTIFICATE",
        title: "How to Get Bonafide Certificate",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-01-18T09:18:02Z",
        stepsJson: JSON.stringify([
            "Collect bonafide request form.",
            "Fill purpose of certificate.",
            "Get class advisor signature.",
            "Submit to admin office.",
            "Collect certificate after 2 days."
        ])
    },
    {
        code: "FEE_INSTALLMENT_REQUEST",
        title: "How to Request Fee Installment",
        domain: "FEES",
        owningOffice: "ACC",
        isActive: true,
        createdAt: "2025-01-18T16:22:44Z",
        stepsJson: JSON.stringify([
            "Write application explaining financial issue.",
            "Attach supporting documents.",
            "Get HOD recommendation.",
            "Submit to accounts office.",
            "Wait for approval notification."
        ])
    },
    {
        code: "HOSTEL_OUTPASS",
        title: "How to Apply for Hostel Outpass",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        isActive: true,
        createdAt: "2025-01-20T08:15:36Z",
        stepsJson: JSON.stringify([
            "Fill outpass form with date and reason.",
            "Get parent confirmation call if overnight.",
            "Submit to warden.",
            "Collect approved outpass slip.",
            "Show slip at hostel gate."
        ])
    },
    {
        code: "EXAM_HALL_TICKET_DOWNLOAD",
        title: "How to Download Hall Ticket",
        domain: "EXAMS",
        owningOffice: "EXAM",
        isActive: true,
        createdAt: "2025-02-15T11:38:21Z",
        stepsJson: JSON.stringify([
            "Login to exam portal.",
            "Navigate to hall ticket section.",
            "Verify personal details.",
            "Download PDF copy.",
            "Print and carry to exam hall."
        ])
    },
    {
        code: "LIBRARY_BOOK_ISSUE",
        title: "How to Issue Library Book",
        domain: "GENERAL",
        owningOffice: "LIB",
        isActive: true,
        createdAt: "2025-01-22T14:55:08Z",
        stepsJson: JSON.stringify([
            "Search book in library system.",
            "Take book to issue counter.",
            "Show ID card.",
            "Get issue entry done.",
            "Note due date."
        ])
    },
    {
        code: "HOSTEL_MAINTENANCE_REQUEST",
        title: "How to Request Hostel Maintenance",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        isActive: true,
        createdAt: "2025-01-24T10:11:19Z",
        stepsJson: JSON.stringify([
            "Report issue to floor representative.",
            "Fill maintenance request slip.",
            "Submit to warden office.",
            "Wait for technician visit.",
            "Confirm issue resolution."
        ])
    },
    {
        code: "SPORTS_EQUIPMENT_ISSUE",
        title: "How to Borrow Sports Equipment",
        domain: "GENERAL",
        owningOffice: "SPORTS",
        isActive: true,
        createdAt: "2025-02-18T09:12:44Z",
        stepsJson: JSON.stringify([
            "Visit sports office with ID card.",
            "Request equipment from incharge.",
            "Make entry in equipment register.",
            "Return equipment before closing time."
        ])
    },
    {
        code: "EXAM_MARKSHEET_REQUEST",
        title: "How to Request Duplicate Marksheet",
        domain: "EXAMS",
        owningOffice: "EXAM",
        isActive: true,
        createdAt: "2025-02-20T13:55:12Z",
        stepsJson: JSON.stringify([
            "Write application for duplicate marksheet.",
            "Attach ID proof.",
            "Pay duplicate fee at accounts.",
            "Submit to exam cell.",
            "Collect after verification."
        ])
    },
    {
        code: "CHANGE_ELECTIVE_SUBJECT",
        title: "How to Change Elective Subject",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-01-28T11:20:19Z",
        stepsJson: JSON.stringify([
            "Collect elective change form.",
            "Mention new elective preference.",
            "Get HOD approval.",
            "Submit before deadline.",
            "Check updated timetable."
        ])
    },
    {
        code: "WIFI_PASSWORD_RESET",
        title: "How to Reset Campus WiFi Password",
        domain: "GENERAL",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-01-30T10:01:36Z",
        stepsJson: JSON.stringify([
            "Visit IT helpdesk.",
            "Show ID card.",
            "Request password reset.",
            "Receive new credentials.",
            "Login and change password."
        ])
    },
    {
        code: "BUS_ROUTE_CHANGE_REQUEST",
        title: "How to Request Bus Route Change",
        domain: "GENERAL",
        owningOffice: "TRANSPORT",
        isActive: true,
        createdAt: "2025-02-22T15:30:14Z",
        stepsJson: JSON.stringify([
            "Collect route change form.",
            "Mention current and requested stop.",
            "Submit to transport office.",
            "Wait for route feasibility approval."
        ])
    },
    {
        code: "SCHOLARSHIP_STATUS_CHECK",
        title: "How to Check Scholarship Status",
        domain: "ACADEMICS",
        owningOffice: "ADMIN",
        isActive: true,
        createdAt: "2025-02-24T09:15:58Z",
        stepsJson: JSON.stringify([
            "Login to student portal.",
            "Navigate to scholarship section.",
            "Check application status.",
            "Contact admin if pending."
        ])
    },
    {
        code: "HOSTEL_LEAVE_ENTRY",
        title: "How to Enter Leave in Hostel Register",
        domain: "HOSTEL",
        owningOffice: "HOSTEL",
        isActive: true,
        createdAt: "2025-02-26T11:15:27Z",
        stepsJson: JSON.stringify([
            "Visit hostel office before leaving.",
            "Enter name and time in leave register.",
            "Mention expected return time.",
            "Sign the register."
        ])
    },
    {
        code: "FEE_RECEIPT_DOWNLOAD",
        title: "How to Download Fee Receipt",
        domain: "FEES",
        owningOffice: "ACC",
        isActive: true,
        createdAt: "2025-02-28T14:45:01Z",
        stepsJson: JSON.stringify([
            "Login to accounts portal.",
            "Go to payment history.",
            "Select semester payment.",
            "Download receipt PDF."
        ])
    }
]);
    console.log("✅ Procedures seeded");
}

seedProcedures();