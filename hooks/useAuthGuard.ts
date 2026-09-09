"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRole, getToken, getName, roleHome } from "@/lib/api";
import type { Role } from "@/lib/types";

/**
 * Client-side auth gate. Redirects to /login if there's no token, or to the
 * user's role home if they land on a page their role can't access.
 * `ready` stays false until the check passes, so pages can avoid flashing
 * protected content before the redirect happens.
 */
export function useAuthGuard(allowedRoles: Role[]) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const currentRole = getRole();
    if (!currentRole || !allowedRoles.includes(currentRole)) {
      router.replace(roleHome(currentRole));
      return;
    }

    // localStorage is only readable client-side, so this first read has to
    // happen post-mount to avoid an SSR/hydration mismatch — the resulting
    // setState calls are the intentional sync-to-render-state step, not an
    // accidental cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRole(currentRole);
    setName(getName());
    setReady(true);
    // allowedRoles is derived fresh per-render from a literal array in
    // callers; re-running this effect on every render would loop redirects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return { ready, role, name };
}
