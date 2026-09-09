"use client";

import type { Company } from "@/lib/types";
import { AlertCircleIcon, BuildingIcon, ChevronDownIcon } from "@/components/ui/icons";

export function CompanySelect({
  id,
  label,
  companies,
  value,
  onChange,
  loading,
  error,
  placeholder = "Select a company…",
  required,
}: {
  id: string;
  label: string;
  companies: Company[];
  value: string | null;
  onChange: (companyId: string | null) => void;
  loading?: boolean;
  error?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
        <BuildingIcon className="h-3.5 w-3.5" />
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value ?? ""}
          disabled={loading}
          required={required}
          onChange={(e) => onChange(e.target.value || null)}
          className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">{loading ? "Loading companies…" : placeholder}</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.shortname})
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
          <AlertCircleIcon className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
