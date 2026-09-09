"use client";

import { useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import type { Role, User } from "@/lib/types";

const ROLES: Role[] = ["admin", "uploader", "call_center"];
const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const labelClass = "mb-1 block text-xs font-medium text-foreground-muted";

export function UserFormModal({
  mode,
  user,
  onClose,
  onSaved,
}: {
  mode: "add" | "edit";
  user?: User;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(user?.role ?? "call_center");
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (mode === "add") {
        await apiFetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ full_name: fullName, email, password, role }),
        });
      } else if (user) {
        const payload: Record<string, unknown> = {
          full_name: fullName,
          email,
          role,
          is_active: isActive,
        };
        if (password.trim()) payload.password = password;
        await apiFetch(`/api/auth/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-danger-soft-border bg-danger-soft px-3 py-2 text-sm text-danger">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Full name</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Password {mode === "edit" && <span className="text-foreground-subtle">(leave blank to keep current)</span>}
        </label>
        <input
          type="password"
          required={mode === "add"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className={inputClass}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      {mode === "edit" && (
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong bg-background text-accent focus:ring-accent"
          />
          Active
        </label>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground-muted hover:bg-surface-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "add" ? "Create user" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
