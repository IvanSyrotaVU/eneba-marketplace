import type { Platform, Region } from "../data";
import { GlobeIcon, PlatformGlyph } from "../icons";

export function PlatformBadge({
  platform,
  size = "sm",
}: {
  platform: Platform;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] font-semibold text-white backdrop-blur-md ${
        size === "md" ? "h-9 px-3.5 text-sm" : "h-6 px-2.5 text-[11px]"
      }`}
    >
      <PlatformGlyph platform={platform} className={size === "md" ? "size-4" : "size-3"} />
      {platform}
    </span>
  );
}

export function RegionTag({ region, pill = false }: { region: Region; pill?: boolean }) {
  if (pill)
    return (
      <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-mint/30 bg-mint/10 px-3.5 text-sm font-bold tracking-wide text-mint">
        <GlobeIcon className="size-4" />
        {region}
      </span>
    );
  return <span className="text-[11px] font-extrabold tracking-[0.12em] text-mint">{region}</span>;
}

export function DiscountPill({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-mint px-2.5 py-1 text-xs font-extrabold text-cosmos shadow-[0_6px_20px_-4px_rgb(0_224_143/0.6)] ${className}`}
    >
      -{value}%
    </span>
  );
}
