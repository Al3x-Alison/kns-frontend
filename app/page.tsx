"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken, roleHome } from "@/lib/api";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    router.replace(token ? roleHome(getRole()) : "/login");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-950">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-indigo-400" />
    </div>
  );
}
