"use client";

import { ChatPanel } from "@/components/chat/ChatPanel";
import { ProtectedPage } from "@/components/layout/ProtectedPage";

export default function DashboardPage() {
  return (
    <ProtectedPage allowedRoles={["admin", "call_center"]}>
      <ChatPanel />
    </ProtectedPage>
  );
}
