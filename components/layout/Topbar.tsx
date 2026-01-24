"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="h-16 bg-white border-b flex items-center justify-end px-6">
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  );
}
