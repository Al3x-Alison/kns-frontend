"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import type { Role } from "@/lib/types";
import { AppShell } from "./AppShell";

export function ProtectedPage({
  allowedRoles,
  children,
}: {
  allowedRoles: Role[];
  children: React.ReactNode;
}) {
  const { ready, role, name } = useAuthGuard(allowedRoles);

  if (!ready || !role) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border-strong border-t-accent" />
      </div>
    );
  }

  return (
    <AppShell role={role} name={name}>
      {children}
    </AppShell>
  );
}
