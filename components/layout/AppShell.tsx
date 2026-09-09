"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/api";
import type { Role } from "@/lib/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ChatIcon, CloudUploadIcon, MenuIcon, UsersIcon, XIcon } from "@/components/ui/icons";

interface NavItem {
  href: string;
  label: string;
  roles: Role[];
  icon: (props: { className?: string }) => React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Chat", roles: ["admin", "call_center"], icon: ChatIcon },
  { href: "/upload", label: "Upload", roles: ["admin", "uploader"], icon: CloudUploadIcon },
  { href: "/admin", label: "Admin", roles: ["admin"], icon: UsersIcon },
];

export function AppShell({
  role,
  name,
  children,
}: {
  role: Role;
  name: string | null;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <div className="flex h-screen bg-background text-foreground">
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}

      <aside
        className={`fixed z-40 h-full w-64 shrink-0 transform border-r border-border bg-surface transition-transform duration-200 ease-out md:static md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-border px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
              W
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Wi Sabi</span>
          </div>
          <button
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-foreground-muted hover:bg-surface-secondary hover:text-foreground md:hidden"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-text"
                    : "text-foreground-muted hover:bg-surface-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 backdrop-blur md:px-6">
          <button
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-foreground-muted hover:bg-surface-secondary hover:text-foreground md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{name ?? "—"}</p>
              <p className="text-xs capitalize text-foreground-muted">{role.replace("_", " ")}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-secondary text-sm font-semibold text-foreground-muted">
              {name ? name.charAt(0).toUpperCase() : "?"}
            </div>
            <button
              onClick={logout}
              className="ml-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:border-border-strong hover:bg-surface-secondary hover:text-foreground"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
