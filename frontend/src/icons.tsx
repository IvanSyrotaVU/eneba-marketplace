import type { SVGProps } from "react";
import type { Platform } from "./data";

type P = SVGProps<SVGSVGElement>;
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
} as const;

export const SearchIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const CartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2" />
    <circle cx="10" cy="20.5" r="1" />
    <circle cx="17" cy="20.5" r="1" />
  </svg>
);
export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const HeartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7.5-4.6-9.2-9.3C1.7 7.4 4 4 7.4 4c2 0 3.6 1.1 4.6 2.7C13 5.1 14.6 4 16.6 4 20 4 22.3 7.4 21.2 10.7 19.5 15.4 12 20 12 20Z" />
  </svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const ChevronLeft = (p: P) => (
  <svg {...base} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ChevronRight = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const BoltIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor" stroke="none" />
  </svg>
);
export const GlobeIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" />
  </svg>
);
export const CashbackIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12.5 11 14.5 15.5 10" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const SparkIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
  </svg>
);

export function PlatformGlyph({
  platform,
  className = "size-3.5",
}: {
  platform: Platform;
  className?: string;
}) {
  if (platform === "Steam")
    return (
      <svg {...base} className={className}>
        <circle cx="15.5" cy="8.5" r="3.5" />
        <circle cx="8" cy="16" r="2.5" />
        <path d="m10.2 14.6 3-3.4M3 12.5l3 1.4" />
      </svg>
    );
  if (platform === "Switch")
    return (
      <svg {...base} className={className}>
        <rect x="3" y="4" width="7" height="16" rx="2.5" />
        <rect x="14" y="4" width="7" height="16" rx="2.5" />
        <circle cx="6.5" cy="9" r="1" />
        <circle cx="17.5" cy="15" r="1" />
      </svg>
    );
  if (platform === "PC")
    return (
      <svg {...base} className={className}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M9 20h6M12 16v4" />
      </svg>
    );
  if (platform === "Xbox")
    return (
      <svg {...base} className={className}>
        <circle cx="12" cy="12" r="9" />
        <path d="M7 6.5c3 2.5 7 8 9.5 12M17 6.5c-3 2.5-7 8-9.5 12" />
      </svg>
    );
  return (
    <svg {...base} className={className}>
      <path d="M6.5 8h11a4 4 0 0 1 3.9 4.8l-.8 3.7a2.3 2.3 0 0 1-4 1L15 16H9l-1.6 1.5a2.3 2.3 0 0 1-4-1l-.8-3.7A4 4 0 0 1 6.5 8Z" />
      <path d="M8 11v3M6.5 12.5h3" />
      <circle cx="16" cy="12" r=".6" fill="currentColor" />
    </svg>
  );
}
export const StarIcon = (p: P) => (
  <svg {...base} {...p}>
    <path
      d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const ShieldIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3 4.5 6v5.5c0 4.5 3.1 8 7.5 9.5 4.4-1.5 7.5-5 7.5-9.5V6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </svg>
);
export const XIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
export const MinusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);
export const TrashIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
  </svg>
);
export const LockIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
  </svg>
);
export const CardIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10h19M6.5 15h3" />
  </svg>
);
export const AppleIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.6 1.3-2.7 0 0-2.4-1-2.4-4.1ZM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3Z" />
  </svg>
);
export const CryptoIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 7.5h4a2.25 2.25 0 0 1 0 4.5h-4m0 0h4.5a2.25 2.25 0 0 1 0 4.5h-4.5m0-9v9M11 6v1.5M11 16.5V18M13.5 6v1.5M13.5 16.5V18" />
  </svg>
);
export const CopyIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
    <path d="M15.5 8.5V6a2.5 2.5 0 0 0-2.5-2.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
  </svg>
);
export const KeyIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="7.5" cy="15.5" r="4" />
    <path d="m10.5 12.5 9-9M16 7l2.5 2.5M18.5 4.5 21 7" />
  </svg>
);
export const LogoutIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 17l-5-5 5-5M5 12h11" />
  </svg>
);
export const ReceiptIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 3.5h14v17l-3-2-2 2-2-2-2 2-2-2-3 2v-17Z" />
    <path d="M9 8.5h6M9 12.5h6" />
  </svg>
);
export const MailIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
export const EyeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
