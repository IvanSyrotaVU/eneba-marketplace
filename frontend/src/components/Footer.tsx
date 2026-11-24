import { useState, type FormEvent, type MouseEvent, type ReactNode, type SVGProps } from "react";
import { useI18n, type Key } from "../i18n";
import { AppleIcon, CheckIcon, CryptoIcon, GlobeIcon, MailIcon, ShieldIcon } from "../icons";
import { storeHref } from "../router";
import { Logo } from "./Header";

type P = SVGProps<SVGSVGElement>;
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
} as const;

/* ---------- brand glyphs (simplified, monochrome) ---------- */
const Discord = (p: P) => (
  <svg {...stroke} {...p}>
    <path d="M8 6.5c2.6-.9 5.4-.9 8 0 2 2.8 3 5.9 2.8 9.4-1.5 1.2-3.1 2-4.7 2.4l-1-1.9M8 6.5C6 9.3 5 12.4 5.2 15.9c1.5 1.2 3.1 2 4.7 2.4l1-1.9M8.3 15.6c2.4 1 5 1 7.4 0" />
    <circle cx="9.6" cy="12.3" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.4" cy="12.3" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);
const XLogo = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.7 3.5h3l-6.6 7.5 7.8 9.5h-6.1l-4.8-6.2-5.5 6.2h-3l7-8L2.1 3.5h6.2l4.3 5.7 5.1-5.7Zm-1 15.3h1.7L7.4 5.1H5.6l11.1 13.7Z" />
  </svg>
);
const Instagram = (p: P) => (
  <svg {...stroke} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1Z" />
  </svg>
);
const Reddit = (p: P) => (
  <svg {...stroke} {...p}>
    <ellipse cx="12" cy="14.5" rx="8" ry="5.5" />
    <path d="m12 9 1.4-5 4.1 1" />
    <circle cx="18.5" cy="5.2" r="1.5" />
    <circle cx="9.2" cy="13.8" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="13.8" r="1" fill="currentColor" stroke="none" />
    <path d="M9.5 17c1.6.9 3.4.9 5 0" />
  </svg>
);
const GoogleG = (p: P) => (
  <svg {...stroke} strokeWidth={2.4} {...p}>
    <path d="M20 12.2h-8M19.6 10A8 8 0 1 0 20 12.2" />
  </svg>
);
const PlayTriangle = (p: P) => (
  <svg viewBox="0 0 24 24" {...p}>
    <path d="M4.5 3.2 14 12l-9.5 8.8c-.4-.2-.6-.6-.6-1.1V4.3c0-.5.2-.9.6-1.1Z" fill="#00e08f" />
    <path d="m14 12 2.9 2.7-10.8 6.2c-.6.3-1.1.2-1.6-.1L14 12Z" fill="#fad318" />
    <path d="M16.9 9.3 20 11c.8.5.8 1.5 0 2l-3.1 1.7L14 12l2.9-2.7Z" fill="#ff5a7a" />
    <path d="M4.5 3.2c.5-.3 1-.4 1.6-.1l10.8 6.2L14 12 4.5 3.2Z" fill="#8b6bff" />
  </svg>
);

/* ---------- payment strip ---------- */
function PayBadge({ children, label }: { children: ReactNode; label: string }) {
  return (
    <li
      aria-label={label}
      title={label}
      className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white/80 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
    >
      {children}
    </li>
  );
}

function PaymentStrip() {
  const { t } = useI18n();
  return (
    <div className="border-y border-white/10 bg-surface/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center gap-8 px-8 py-5">
        <div className="flex shrink-0 items-center gap-2 text-xs font-bold tracking-[0.14em] text-lavender uppercase">
          <ShieldIcon className="size-4 text-mint" />
          {t("f.pay.title")}
        </div>
        <ul aria-label={t("f.pay.aria")} className="grid flex-1 grid-cols-8 gap-2.5">
          <PayBadge label="Eneba Wallet">
            <img
              src="/img/eneba-mark.png"
              alt=""
              className="size-[18px] object-contain grayscale-[35%]"
            />
            <span className="text-[13px] font-extrabold tracking-[-0.02em] lowercase">eneba</span>
            <span className="text-[11px] font-semibold text-lavender">wallet</span>
          </PayBadge>
          <PayBadge label="PayPal">
            <span className="text-[15px] font-extrabold tracking-[-0.03em] italic">
              Pay<span className="text-lavender">Pal</span>
            </span>
          </PayBadge>
          <PayBadge label="Visa">
            <span className="text-[17px] font-black tracking-[0.02em] italic">VISA</span>
          </PayBadge>
          <PayBadge label="Mastercard">
            <span className="relative flex items-center">
              <span className="size-[18px] rounded-full bg-white/75" />
              <span className="-ml-[7px] size-[18px] rounded-full bg-white/35 mix-blend-screen ring-0" />
            </span>
            <span className="text-[12px] font-bold tracking-[-0.01em]">mastercard</span>
          </PayBadge>
          <PayBadge label="Apple Pay">
            <AppleIcon className="size-[17px]" />
            <span className="text-[15px] font-semibold">Pay</span>
          </PayBadge>
          <PayBadge label="Google Pay">
            <GoogleG className="size-4" />
            <span className="text-[15px] font-semibold">Pay</span>
          </PayBadge>
          <PayBadge label="Revolut">
            <span className="text-[15px] font-extrabold tracking-[-0.03em]">Revolut</span>
          </PayBadge>
          <PayBadge label="Pay with Crypto">
            <CryptoIcon className="size-[17px]" />
            <span className="text-[13px] font-bold">Crypto</span>
          </PayBadge>
        </ul>
      </div>
    </div>
  );
}

/* ---------- nav columns ---------- */
type LinkDef = { key: Key; href?: string; label?: string };
const COLUMNS: { title: Key; links: LinkDef[] }[] = [
  {
    title: "f.about",
    links: [
      { key: "f.about.us" },
      { key: "f.about.contact" },
      { key: "f.about.careers" },
      { key: "f.about.trust" },
      { key: "f.about.eng" },
    ],
  },
  {
    title: "f.buy",
    links: [
      { key: "f.buy.how" },
      { key: "f.buy.collections", href: storeHref() },
      { key: "f.buy.loyalty" },
      { key: "f.buy.discounts", href: storeHref("cheap") },
    ],
  },
  {
    title: "f.help",
    links: [
      { key: "f.help.faq" },
      { key: "f.help.activate" },
      { key: "f.help.ticket" },
      { key: "f.help.return" },
    ],
  },
  {
    title: "f.community",
    links: [
      { key: "f.community.news" },
      { key: "f.community.giveaways" },
      { key: "f.community.affiliate" },
      { key: "f.community.news", label: "Snakzy" },
    ],
  },
  { title: "f.business", links: [{ key: "f.business.sell" }, { key: "f.business.ads" }] },
];

// Placeholder destinations: keep the user on the current page instead of jumping home
const stay = (e: MouseEvent) => e.preventDefault();

function FooterLink({ href, children }: { href?: string; children: ReactNode }) {
  return (
    <a
      href={href ?? "#"}
      onClick={href ? undefined : stay}
      className="text-sm font-medium text-lavender transition-colors hover:text-white"
    >
      {children}
    </a>
  );
}

function ColTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-[11px] font-extrabold tracking-[0.16em] text-white uppercase">
      {children}
    </h3>
  );
}

/* ---------- follow & partners ---------- */
const SOCIALS = [
  { name: "Discord", Icon: Discord },
  { name: "X", Icon: XLogo },
  { name: "Instagram", Icon: Instagram },
  { name: "Facebook", Icon: Facebook },
  { name: "Reddit", Icon: Reddit },
];

function FollowColumn() {
  const { t } = useI18n();
  return (
    <div>
      <ColTitle>{t("f.follow")}</ColTitle>
      <div className="flex gap-2">
        {SOCIALS.map(({ name, Icon }) => (
          <a
            key={name}
            href="#"
            onClick={stay}
            aria-label={name}
            className="grid size-10 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-lavender transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
          >
            <Icon className="size-[18px]" />
          </a>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="glass flex items-center gap-2.5 rounded-xl px-3 py-2.5 !shadow-none">
          <svg
            viewBox="0 0 24 24"
            className="size-7 shrink-0"
            fill="none"
            stroke="#9be81f"
            strokeWidth={2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 3.5 5.2 8 6.6 11 5 15.5 6.2 20.5M12 2.5l-.8 5 1.4 3.2L11 15.8l1 5.7M18 3.5l-.8 4.5 1.4 3L17 15.5l1.2 5" />
          </svg>
          <div className="min-w-0 leading-tight">
            <div className="text-[11px] font-black tracking-[0.06em] text-white">MONSTER</div>
            <div className="text-[9px] font-bold tracking-[0.12em] text-[#9be81f]">ENERGY</div>
            <div className="mt-0.5 truncate text-[9px] text-lavender">{t("f.sponsor")}</div>
          </div>
        </div>
        <div className="glass flex items-center gap-2.5 rounded-xl px-3 py-2.5 !shadow-none">
          <div className="grid size-7 shrink-0 place-items-center rounded-md bg-[#e4002b] text-[8px] leading-[0.9] font-black text-white">
            <span className="text-center">
              PC
              <br />
              MAG
            </span>
          </div>
          <div className="min-w-0 leading-tight">
            <div className="text-[10px] font-black tracking-[0.04em] text-white">PCMAG</div>
            <div className="truncate text-[9px] font-bold tracking-[0.06em] text-eneba uppercase">
              {t("f.award")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- reviews & app ---------- */
function TrustStars({ value }: { value: number }) {
  return (
    <div className="flex gap-[3px]" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <span
            key={i}
            className="relative grid size-[22px] place-items-center overflow-hidden rounded-[3px] bg-white/15"
          >
            <span
              className="absolute inset-y-0 left-0 bg-[#00b67a]"
              style={{ width: `${fill * 100}%` }}
            />
            <svg viewBox="0 0 24 24" className="relative size-[15px]" fill="white">
              <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}

function ReviewsColumn() {
  const { t, lang } = useI18n();
  const reviews = (335696).toLocaleString(lang === "lt" ? "lt-LT" : "en-US");
  return (
    <div>
      <ColTitle>{t("f.reviews")}</ColTitle>
      <a
        href="#"
        onClick={stay}
        className="glass block rounded-xl p-3.5 !shadow-none transition hover:border-[#00b67a]/50"
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[15px] font-bold">
            <svg viewBox="0 0 24 24" className="size-[18px]" fill="#00b67a" aria-hidden>
              <path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.2 5.8 20.9l1.6-7L2 9.2l7.1-.6L12 2Z" />
            </svg>
            Trustpilot
          </span>
          <span className="text-xs font-bold text-white">{t("f.trust.excellent")}</span>
        </div>
        <div className="mt-2.5" role="img" aria-label="4.5 / 5">
          <TrustStars value={4.5} />
        </div>
        <div className="mt-2 text-[11px] font-semibold text-lavender">
          {t("f.trust.score", { s: lang === "lt" ? "4,4" : "4.4", n: reviews })}
        </div>
      </a>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          { Icon: AppleIcon, top: t("f.app.download"), name: "App Store" },
          { Icon: PlayTriangle, top: t("f.app.get"), name: "Google Play" },
        ].map(({ Icon, top, name }) => (
          <a
            key={name}
            href="#"
            onClick={stay}
            className="flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-cosmos/70 px-2.5 transition hover:border-white/30 hover:bg-white/[0.06]"
          >
            <Icon className="size-[18px] shrink-0" />
            <span className="min-w-0 leading-[1.1]">
              <span className="block truncate text-[8.5px] font-medium text-lavender">{top}</span>
              <span className="block truncate text-[12.5px] font-bold">{name}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ---------- newsletter + region ---------- */
function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (state === "done") return;
    setState(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "done" : "error");
  };
  const done = state === "done";
  return (
    <div className="flex items-center gap-6">
      <div className="hidden w-[250px] shrink-0 xl:block">
        <div className="text-[15px] font-extrabold">{t("f.news.title")}</div>
        <div
          className={`mt-0.5 text-xs ${state === "error" ? "text-[#ff8aa6]" : done ? "text-mint" : "text-lavender"}`}
          aria-live="polite"
        >
          {state === "error" ? t("f.news.invalid") : done ? t("f.news.thanks") : t("f.news.sub")}
        </div>
      </div>
      <form onSubmit={submit} noValidate className="flex items-center gap-2">
        <label
          className={`flex h-[48px] w-[300px] items-center gap-2.5 rounded-xl border bg-white/[0.05] px-3.5 transition focus-within:border-eneba/70 focus-within:bg-surface ${
            state === "error" ? "border-[#ff6b8b]/60" : "border-white/12"
          }`}
        >
          <MailIcon className="size-[18px] shrink-0 text-lavender" />
          <input
            type="email"
            value={email}
            disabled={done}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state === "error") setState("idle");
            }}
            placeholder={t("f.news.placeholder")}
            aria-label={t("f.news.placeholder")}
            className="h-full w-full bg-transparent text-sm font-medium placeholder:text-lavender/60 focus:outline-none disabled:text-lavender"
          />
        </label>
        <button
          type="submit"
          className={`flex h-[48px] min-w-[136px] items-center justify-center gap-1.5 rounded-xl px-5 text-sm font-extrabold text-cosmos transition ${
            done
              ? "bg-mint"
              : "bg-eneba shadow-[0_10px_30px_-12px_rgb(250_211_24/0.8)] hover:-translate-y-0.5 hover:bg-[#ffe03d]"
          }`}
        >
          {done && <CheckIcon className="size-4" strokeWidth={3} />}
          {done ? t("f.news.done") : t("f.news.cta")}
        </button>
      </form>
    </div>
  );
}

function RegionPill() {
  const { t, lang, toggle } = useI18n();
  return (
    <button
      onClick={toggle}
      aria-label={t("f.region.aria")}
      title={t("f.region.aria")}
      className="flex h-[48px] items-center gap-3 rounded-full border border-white/12 bg-white/[0.05] pr-5 pl-2 text-sm font-bold backdrop-blur-md transition hover:border-white/25 hover:bg-white/[0.1]"
    >
      <span
        className="grid size-8 place-items-center overflow-hidden rounded-full ring-1 ring-white/20"
        aria-hidden
      >
        <span className="flex size-full flex-col">
          <span className="flex-1 bg-[#fdb913]" />
          <span className="flex-1 bg-[#006a44]" />
          <span className="flex-1 bg-[#c1272d]" />
        </span>
      </span>
      {t("f.region")}
      <span className="text-lavender/60">•</span>
      <span className="flex items-center gap-1">
        <GlobeIcon className="size-3.5 text-lavender" />
        <span className={lang === "en" ? "text-eneba" : "text-lavender"}>EN</span>
        <span className="text-lavender/50">/</span>
        <span className={lang === "lt" ? "text-eneba" : "text-lavender"}>LT</span>
      </span>
      <span className="h-4 w-px bg-white/15" />
      <span className="text-white">EUR</span>
    </button>
  );
}

/* ---------- footer ---------- */
export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative isolate mt-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_15%_100%,rgb(78_27_217/0.28),transparent_70%),radial-gradient(40%_50%_at_90%_30%,rgb(157_37_216/0.14),transparent_70%),linear-gradient(180deg,transparent,#0d031f_70%)]" />
      <PaymentStrip />

      <div className="mx-auto grid max-w-[1400px] grid-cols-[repeat(5,minmax(0,1fr))_244px_252px] gap-x-7 px-8 pt-14 pb-12">
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={t(c.title)}>
            <ColTitle>{t(c.title)}</ColTitle>
            <ul className="space-y-2.5">
              {c.links.map((l) => (
                <li key={l.label ?? l.key}>
                  <FooterLink href={l.href}>{l.label ?? t(l.key)}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <FollowColumn />
        <ReviewsColumn />
      </div>

      <div className="mx-auto max-w-[1400px] px-8">
        <div className="glass flex items-center justify-between gap-6 rounded-2xl px-6 py-5 !shadow-none">
          <Newsletter />
          <RegionPill />
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1400px] items-center justify-between gap-8 border-t border-white/10 px-8 py-7">
        <div className="flex min-w-0 items-center gap-5">
          <div className="shrink-0 scale-90 opacity-90">
            <Logo />
          </div>
          <p className="text-xs leading-relaxed text-lavender/80">{t("f.copyright")}</p>
        </div>
        <ul className="flex shrink-0 items-center gap-5 text-xs font-semibold">
          {(["f.terms", "f.privacy", "f.cookies"] as const).map((k) => (
            <li key={k}>
              <a
                href="#"
                onClick={stay}
                className="text-lavender transition-colors hover:text-white"
              >
                {t(k)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
