import { cookies } from "next/headers";
import AnnouncementsFeed from "./AnnouncementsFeed"; // Import the client component
import { Megaphone, Sparkles } from "lucide-react";

async function getAnnouncements() {
  const cookieStore = await cookies();

  // Ensure this URL is correct for your environment (e.g. use process.env.NEXT_PUBLIC_API_URL if needed)
  const res = await fetch("http://localhost:3000/api/student/announcements", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
      // Handle error gracefully or return empty array
      return [];
  }

  return res.json();
}

export default async function StudentAnnouncementsPage() {
  const data = await getAnnouncements();

  // Initial Sort on Server
  data.sort(
    (a: any, b: any) =>
      new Date(b.activeFrom).getTime() - new Date(a.activeFrom).getTime()
  );

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white p-6 md:p-10 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-600/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/10 bg-neutral-900/30 backdrop-blur-xl p-6 rounded-3xl border-t border-l border-white/5 shadow-2xl">
           <div>
              <div className="flex items-center gap-2 mb-2">
                 <Sparkles size={16} className="text-indigo-400" />
                 <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Digital Notice Board</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Campus Notices</h1>
              <p className="text-neutral-400 text-sm">Official communications from administration and faculty.</p>
           </div>
        </div>

        {/* Client Component for Interactivity */}
        <AnnouncementsFeed initialData={data} />

      </div>
    </div>
  );
}