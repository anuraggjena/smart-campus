import { cookies } from "next/headers";

async function getAnnouncements() {
  const cookieStore = await cookies();

  const res = await fetch("http://localhost:3000/api/student/announcements", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  return res.json();
}

function groupAnnouncements(list: any[]) {
  const today: any[] = [];
  const week: any[] = [];
  const older: any[] = [];

  const now = new Date();

  list.forEach((a) => {
    const from = new Date(a.activeFrom);
    const diffDays =
      (now.getTime() - from.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) today.push(a);
    else if (diffDays <= 7) week.push(a);
    else older.push(a);
  });

  return { today, week, older };
}

function AnnouncementCard({ item }: any) {
  const priorityStyles =
    item.priority === "URGENT"
      ? "border-red-400 bg-red-50"
      : item.priority === "IMPORTANT"
      ? "border-yellow-400 bg-yellow-50"
      : "border-slate-200 bg-white";

  return (
    <div
      className={`p-6 rounded-2xl border shadow-sm transition hover:shadow-md ${priorityStyles}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{item.title}</h3>

        <span
          className={`text-xs px-3 py-1 rounded-full font-medium ${
            item.priority === "URGENT"
              ? "bg-red-600 text-white"
              : item.priority === "IMPORTANT"
              ? "bg-yellow-500 text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {item.priority}
        </span>
      </div>

      <p className="text-sm text-slate-700 mb-3 leading-relaxed">
        {item.message}
      </p>

      <div className="text-xs text-slate-500">
        Active from {new Date(item.activeFrom).toLocaleDateString()}
      </div>
    </div>
  );
}

function Section({ title, items }: any) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">
        {title}
      </h2>

      <div className="grid gap-5">
        {items.map((item: any) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default async function StudentAnnouncementsPage() {
  const data = await getAnnouncements();
  const { today, week, older } = groupAnnouncements(data);

  const urgent = data.filter((a: any) => a.priority === "URGENT");
  const highlights = data
    .filter((a: any) => a.priority !== "URGENT")
    .slice(0, 3);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="bg-linear-to-r from-indigo-600 to-slate-800 text-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold">Campus Notice Board</h1>
        <p className="text-sm opacity-80 mt-1">
          Stay updated with what matters on campus
        </p>
      </div>

      {/* 🔴 Urgent Strip */}
      {urgent.length > 0 && (
        <div className="p-6 rounded-2xl bg-red-600 text-white shadow-lg">
          <h2 className="font-semibold text-lg mb-2">
            Urgent Notices
          </h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {urgent.map((u: any) => (
              <li key={u.id}>{u.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ⭐ Highlights */}
      {highlights.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Highlights</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((item: any) => (
              <AnnouncementCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Timeline sections */}
      <Section title="Today" items={today} />
      <Section title="This Week" items={week} />
      <Section title="Earlier" items={older} />

      {data.length === 0 && (
        <div className="p-6 rounded-xl border bg-white shadow-sm">
          No active announcements.
        </div>
      )}
    </div>
  );
}
