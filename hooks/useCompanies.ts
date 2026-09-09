"use client";

import { useEffect, useState } from "react";
import { apiErrorMessage, apiFetch } from "@/lib/api";
import type { Company } from "@/lib/types";

// Module-level cache so the chat page and the upload page share one fetch
// of GET /api/query/companies instead of duplicating it per page mount.
let cache: Company[] | null = null;
let inflight: Promise<Company[]> | null = null;

async function loadCompanies(): Promise<Company[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = apiFetch("/api/query/companies")
      .then((data) => {
        const companies: Company[] = Array.isArray(data?.companies) ? data.companies : [];
        cache = companies;
        return companies;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadCompanies()
      .then((data) => {
        if (!cancelled) setCompanies(data);
      })
      .catch((err) => {
        if (!cancelled) setError(apiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { companies, loading, error };
}
