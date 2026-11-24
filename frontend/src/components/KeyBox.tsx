import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, KeyIcon } from "../icons";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Fallback for iframes without clipboard permission
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
}

export function CopyButton({ text, size = "md" }: { text: string; size?: "sm" | "md" }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={async () => {
        await copyText(text);
        setCopied(true);
      }}
      aria-label={copied ? "Key copied" : `Copy key ${text}`}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-extrabold transition ${
        size === "sm" ? "h-8 min-w-[92px] px-3 text-xs" : "h-[42px] min-w-[120px] px-4 text-sm"
      } ${copied ? "bg-mint text-cosmos" : "bg-eneba text-cosmos hover:-translate-y-0.5 hover:bg-[#ffe03d]"}`}
    >
      {copied ? (
        <CheckIcon className="size-4" strokeWidth={3} />
      ) : (
        <CopyIcon className="size-4" strokeWidth={2.25} />
      )}
      {copied ? "Copied!" : "Copy Key"}
    </button>
  );
}

/** Glowing activation-key box used on the confirmation screen. */
export function KeyBox({ value }: { value: string }) {
  return (
    <div className="relative flex items-center gap-4 rounded-xl border border-eneba/45 bg-[linear-gradient(135deg,rgb(250_211_24/0.1),rgb(78_27_217/0.18))] py-2.5 pr-2.5 pl-4 shadow-[0_0_0_1px_rgb(250_211_24/0.12),0_0_36px_-8px_rgb(250_211_24/0.45)]">
      <KeyIcon className="size-5 shrink-0 text-eneba" />
      <code className="flex-1 font-mono text-[19px] font-bold tracking-[0.14em] text-white select-all">
        {value}
      </code>
      <CopyButton text={value} />
    </div>
  );
}

/** Compact inline key + copy, used in order history rows. */
export function KeyInline({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-cosmos/60 py-1 pr-1 pl-3">
      <code className="font-mono text-[13px] font-bold tracking-[0.12em] text-white select-all">
        {value}
      </code>
      <CopyButton text={value} size="sm" />
    </div>
  );
}
