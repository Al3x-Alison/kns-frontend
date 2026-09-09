import type { AssistantChatMessage, Company } from "@/lib/types";
import { RevealText } from "./RevealText";
import { SourcesPanel } from "./SourcesPanel";
import { CacheBadge, CompanyBadge, TimingBadge } from "./Badges";
import { AlertCircleIcon, InfoIcon, MapPinIcon, RetryIcon } from "@/components/ui/icons";

function parseAvailableCompany(label: string, companies: Company[]): Company | undefined {
  const match = label.match(/^(.*)\s\(([^)]+)\)$/);
  const shortname = match?.[2]?.trim().toLowerCase();
  const name = (match?.[1] ?? label).trim().toLowerCase();
  return companies.find(
    (c) => c.shortname.toLowerCase() === shortname || c.name.toLowerCase() === name
  );
}

export function AssistantMessage({
  message,
  companies,
  onConfirm,
  onSelectMatch,
  onSelectCompany,
  onRetry,
}: {
  message: AssistantChatMessage;
  companies: Company[];
  onConfirm: (companyId: string, query: string) => void;
  onSelectMatch: (companyId: string, query: string) => void;
  onSelectCompany: (companyId: string) => void;
  onRetry: (query: string) => void;
}) {
  const data = message.data;

  switch (data.type) {
    case "search":
    case "direction":
      return (
        <Bubble>
          <div className="flex items-start gap-2">
            {data.type === "direction" && <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-text" />}
            <RevealText text={data.answer} instant={data.from_cache} />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            <CompanyBadge name={data.company} shortname={data.company_shortname} />
            {data.from_cache && <CacheBadge ageSeconds={data.cache_age_seconds} />}
            <TimingBadge ms={data.response_ms} />
          </div>
          <SourcesPanel sources={data.sources} />
        </Bubble>
      );

    case "greeting":
      return (
        <Bubble>
          <RevealText text={data.answer} instant />
        </Bubble>
      );

    case "no_results":
      return (
        <Bubble>
          <div className="flex items-start gap-2 text-foreground-muted">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
            <RevealText text={data.answer} />
          </div>
          {(data.company || data.company_shortname) && (
            <div className="mt-2.5">
              <CompanyBadge name={data.company} shortname={data.company_shortname} />
            </div>
          )}
        </Bubble>
      );

    case "clarification_needed":
      return (
        <Bubble accent>
          <p className="text-foreground">{data.message}</p>
          <p className="mt-1 text-xs text-foreground-muted">{data.confidence} confidence</p>
          <button
            onClick={() => onConfirm(data.company_id, data.question)}
            className="mt-3 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Yes, {data.suggested_company}
          </button>
        </Bubble>
      );

    case "multiple_matches":
      return (
        <Bubble accent>
          <p className="text-foreground">{data.message}</p>
          <div className="mt-3 flex flex-col gap-1.5">
            {data.matches.map((m) => (
              <button
                key={m.company_id}
                onClick={() => onSelectMatch(m.company_id, data.question)}
                className="flex items-center justify-between rounded-lg border border-border-strong bg-surface px-3 py-2 text-left text-xs font-medium text-foreground transition-colors hover:border-accent hover:bg-accent-soft"
              >
                <span>
                  {m.name} <span className="text-foreground-subtle">({m.shortname})</span>
                </span>
                <span className="text-foreground-subtle">{m.confidence}</span>
              </button>
            ))}
          </div>
        </Bubble>
      );

    case "format_error":
      return (
        <Bubble tone="warning">
          <div className="flex items-start gap-2">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="text-foreground">{data.message}</p>
              <p className="mt-1.5 rounded-md bg-surface px-2 py-1 font-mono text-xs text-foreground-muted">
                {data.example}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.available_companies.map((label) => {
              const company = parseAvailableCompany(label, companies);
              return (
                <button
                  key={label}
                  disabled={!company}
                  onClick={() => company && onSelectCompany(company.id)}
                  className="rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-medium text-foreground-muted transition-colors enabled:hover:border-accent enabled:hover:text-accent-text disabled:cursor-default"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </Bubble>
      );

    case "error":
      return (
        <Bubble tone="danger">
          <div className="flex items-start gap-2">
            <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <p className="text-foreground">{data.error ?? data.answer ?? "Something went wrong."}</p>
          </div>
          <button
            onClick={() => onRetry(message.forQuery)}
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-secondary"
          >
            <RetryIcon className="h-3.5 w-3.5" />
            Retry
          </button>
        </Bubble>
      );
  }
}

function Bubble({
  children,
  accent,
  tone,
}: {
  children: React.ReactNode;
  accent?: boolean;
  tone?: "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "border-danger-soft-border bg-danger-soft"
      : tone === "warning"
        ? "border-warning-soft-border bg-warning-soft"
        : accent
          ? "border-accent-soft-border bg-accent-soft/40"
          : "border-border bg-surface";
  return (
    <div
      className={`max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm md:max-w-[70%] ${toneClass}`}
    >
      {children}
    </div>
  );
}
