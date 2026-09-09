import { BoltIcon, BuildingIcon, ClockIcon, HourglassIcon, RefreshIcon } from "@/components/ui/icons";

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium";

export function CompanyBadge({ name, shortname }: { name?: string; shortname?: string }) {
  if (!name && !shortname) return null;
  return (
    <span className={`${badgeBase} border-border-strong bg-surface-secondary text-foreground-muted`}>
      <BuildingIcon className="h-3 w-3" />
      {name ?? shortname}
      {name && shortname && <span className="text-foreground-subtle">· {shortname}</span>}
    </span>
  );
}

export function CacheBadge({ ageSeconds }: { ageSeconds?: number }) {
  return (
    <span className={`${badgeBase} border-info-soft-border bg-info-soft text-info`}>
      <RefreshIcon className="h-3 w-3" />
      cached{typeof ageSeconds === "number" ? ` · ${ageSeconds}s ago` : ""}
    </span>
  );
}

type TimingTier = "fast" | "normal" | "slow";

function timingTier(ms: number): TimingTier {
  if (ms < 1000) return "fast";
  if (ms < 10000) return "normal";
  return "slow";
}

const TIMING_STYLE: Record<TimingTier, string> = {
  fast: "border-success-soft-border bg-success-soft text-success",
  normal: "border-border-strong bg-surface-secondary text-foreground-muted",
  slow: "border-warning-soft-border bg-warning-soft text-warning",
};

const TIMING_ICON: Record<TimingTier, (props: { className?: string }) => React.ReactNode> = {
  fast: BoltIcon,
  normal: ClockIcon,
  slow: HourglassIcon,
};

export function TimingBadge({ ms }: { ms: number }) {
  const tier = timingTier(ms);
  const Icon = TIMING_ICON[tier];
  const label = ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  return (
    <span className={`${badgeBase} ${TIMING_STYLE[tier]}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
