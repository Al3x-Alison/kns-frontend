type IconProps = { className?: string };

/**
 * Shared stroke-SVG icon set — same style as the nav icons originally in
 * AppShell (24x24 viewBox, round caps/joins, strokeWidth 1.75), extended
 * app-wide so nothing falls back to emoji.
 */
function Icon({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const SunIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.14-6.14L19.5 4.5M4.5 19.5l1.36-1.36m0-12.28L4.5 4.5m14.14 14.14 1.36-1.36" />
    <circle cx="12" cy="12" r="4.5" strokeLinecap="round" strokeLinejoin="round" />
  </Icon>
);

export const MoonIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </Icon>
);

export const ChevronDownIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChevronRightIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
  </Icon>
);

export const CloudUploadIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 18a4.5 4.5 0 0 1-.5-8.97A5.5 5.5 0 0 1 17.3 8.02 4 4 0 0 1 17 16" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v8m0-8 3 3m-3-3-3 3" />
  </Icon>
);

export const LinkIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.5 14.5 9.5m-5-2 1-1a3.5 3.5 0 0 1 5 5l-1 1m-8 0-1 1a3.5 3.5 0 0 0 5 5l1-1" />
  </Icon>
);

export const FileIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3.5h7l3.5 3.5V20a.5.5 0 0 1-.5.5H7a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.5V7h3.5" />
  </Icon>
);

export const BuildingIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 20V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15M5 20h14M5 20H3m16 0h2m-7 0v-6h-3v6M9 7h.01M9 10h.01M9 13h.01M13 7h.01" />
  </Icon>
);

export const ClockIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4.5l3 2" />
  </Icon>
);

export const BoltIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.5 3 5 13.5h5.5L11 21l7.5-10.5H13L12.5 3Z" />
  </Icon>
);

export const HourglassIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3.5h12M6 20.5h12M7 3.5v3a5 5 0 0 0 5 5 5 5 0 0 0 5-5v-3M7 20.5v-3a5 5 0 0 1 5-5 5 5 0 0 1 5 5v3" />
  </Icon>
);

export const RefreshIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66M17 4v3.5h-3.5M7 20v-3.5h3.5" />
  </Icon>
);

export const AlertCircleIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5M12 16h.01" />
  </Icon>
);

export const InfoIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v5M12 8h.01" />
  </Icon>
);

export const CheckCircleIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12.5 2.5 2.5 4.5-5" />
  </Icon>
);

export const XIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const MapPinIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.5 7-11.5a7 7 0 1 0-14 0C5 14.5 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.25" strokeLinecap="round" strokeLinejoin="round" />
  </Icon>
);

export const SendIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 11.5 20 4l-6.5 16-3-6.5-6-2Z" />
  </Icon>
);

export const RetryIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4.5 9a8 8 0 0 1 14.1-3.5M19.5 15a8 8 0 0 1-14.1 3.5" />
  </Icon>
);

export const TrashIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
  </Icon>
);

export const PencilIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 4.5 19.5 8.5 8 20H4v-4L15.5 4.5Z" />
  </Icon>
);

export const PlusIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
  </Icon>
);

export const MenuIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </Icon>
);

export const ChatIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12a8.96 8.96 0 0 1-1.5 5L21 21l-4-1.5A9 9 0 1 1 21 12Z" />
  </Icon>
);

export const UsersIcon = ({ className }: IconProps) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 20c0-3.5 3.5-6 8-6s8 2.5 8 6" />
  </Icon>
);
