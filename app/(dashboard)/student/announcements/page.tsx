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

export default async function StudentAnnouncementsPage() {
  const data = await getAnnouncements();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Announcements</h1>

      <div className="grid gap-4">
        {data.length === 0 && (
          <div className="p-6 rounded-lg border bg-white shadow-sm">
            No active announcements.
          </div>
        )}

        {data.map((item: any) => (
          <div
            key={item.id}
            className="p-6 rounded-lg border bg-white shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <span className="text-sm px-2 py-1 rounded bg-gray-100">
                {item.priority}
              </span>
            </div>

            <p className="text-sm text-gray-600">{item.message}</p>

            <div className="text-xs text-gray-400">
              From: {new Date(item.activeFrom).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
