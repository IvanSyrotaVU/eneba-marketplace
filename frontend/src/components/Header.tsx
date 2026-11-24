import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../api";
import { fmt, MATCH, tokenSim, type Category, type Product } from "../data";
import { CartIcon, HeartIcon } from "../icons";
import { useI18n, type Key } from "../i18n";
import { authHref, productHref, storeHref, type Route } from "../router";
import { useShop } from "../shop";
import { PlatformBadge, RegionTag } from "./Badges";

const NAV_ITEMS: { cat: Category; key: Key }[] = [
  { cat: "all", key: "nav.store" },
  { cat: "cheap", key: "nav.cheap" },
  { cat: "software", key: "nav.software" },
  { cat: "giftcards", key: "nav.giftcards" },
];

function HighlightTitle({ title, query }: { title: string; query: string }) {
  const qTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean);

  if (!qTokens.length) return <>{title}</>;

  return (
    <>
      {title.split(" ").map((word, idx) => {
        const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
        const hit = qTokens.some((q) => tokenSim(q, clean) >= MATCH);
        return (
          <span key={idx}>
            {idx > 0 && " "}
            <span className={hit ? "text-eneba" : undefined}>{word}</span>
          </span>
        );
      })}
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [corrected, setCorrected] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setCorrected("");
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      apiFetch<{ results: Product[]; corrected: string }>(`/search?q=${encodeURIComponent(q)}`)
        .then((res) => {
          setResults(res.results);
          setCorrected(res.corrected);
        })
        .catch(() => {
          setResults([]);
          setCorrected("");
        })
        .finally(() => setLoading(false));
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative flex-1 max-w-[620px]">
      <div className="flex h-[48px] items-center gap-3 rounded-xl border border-white/15 bg-white/[0.07] px-4 transition focus-within:border-eneba/70 focus-within:bg-white/[0.1]">
        <svg
          className="size-5 shrink-0 text-lavender"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search games, DLCs, gift cards, software..."
          className="w-full bg-transparent text-sm font-semibold text-white placeholder:text-lavender/70 outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setCorrected("");
            }}
            className="rounded-md px-1.5 py-0.5 text-xs font-bold text-lavender hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="glass absolute top-[calc(100%+10px)] right-0 left-0 z-50 overflow-hidden rounded-2xl border border-white/15 !bg-[#1a083d]/98 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]">
          {corrected && (
            <div className="mb-1.5 flex items-center gap-2 rounded-xl bg-white/[0.05] px-3 py-2 text-xs text-lavender">
              <span>Showing matches for</span>
              <button
                type="button"
                onClick={() => setQuery(corrected)}
                className="font-extrabold text-eneba underline decoration-eneba/50 hover:text-[#ffe03d]"
              >
                {corrected}
              </button>
            </div>
          )}

          {loading ? (
            <div className="px-4 py-6 text-center text-sm font-semibold text-lavender">
              Searching catalog...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm font-semibold text-lavender">
              No matching keys found for &ldquo;{query.trim()}&rdquo;
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map((p) => (
                <li key={p.id}>
                  <a
                    href={productHref(p.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3.5 rounded-xl p-2 transition hover:bg-white/[0.08]"
                  >
                    <img
                      src={p.cover}
                      alt={p.title}
                      style={{ objectPosition: p.coverPosition ?? undefined }}
                      className="h-14 w-11 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold">
                        <HighlightTitle title={p.title} query={corrected || query} />
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <PlatformBadge platform={p.platform} />
                        <RegionTag region={p.region} />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-lavender line-through">{fmt(p.oldPrice)}</div>
                      <div className="text-base font-extrabold text-white">{fmt(p.price)}</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <a href="#/" className={`flex shrink-0 items-center gap-3 ${className}`}>
      <img
        src="/img/eneba-mark.png"
        alt="Eneba"
        className="size-10 shrink-0 object-contain"
      />
      <span className="text-[26px] font-black tracking-[-0.04em] text-white">eneba</span>
    </a>
  );
}

export function Header({ route }: { route: Route }) {
  const { t } = useI18n();
  const { count, setDrawerOpen, user, signOut, orders } = useShop();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#120529]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between gap-8 px-8">
        <Logo />

        <SearchBar />

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Wishlist"
            className="grid size-11 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-white transition hover:border-white/25 hover:bg-white/[0.1]"
          >
            <HeartIcon className="size-5" />
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Shopping cart"
            className="relative grid size-11 place-items-center rounded-xl border border-white/12 bg-white/[0.05] text-white transition hover:border-white/25 hover:bg-white/[0.1]"
          >
            <CartIcon className="size-5" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid min-w-5 place-items-center rounded-full bg-eneba px-1.5 py-0.5 text-[11px] font-extrabold leading-none text-cosmos">
                {count}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2.5 pl-1">
              <a
                href="#/orders"
                className="flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-extrabold transition hover:border-eneba/50 hover:bg-white/[0.1]"
              >
                <span className="grid size-6 place-items-center rounded-full bg-eneba text-xs font-black text-cosmos uppercase">
                  {(user.username || user.email || "U")[0]}
                </span>
                <span>{user.username || user.email}</span>
                {orders.length > 0 && (
                  <span className="rounded-full bg-mint/15 px-2 py-0.5 text-[11px] font-extrabold text-mint">
                    {orders.length}
                  </span>
                )}
              </a>
              <button
                type="button"
                onClick={signOut}
                className="h-11 rounded-xl border border-white/12 bg-white/[0.04] px-3.5 text-xs font-bold text-lavender transition hover:border-white/25 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <a
              href={authHref()}
              className="flex h-11 items-center gap-2 rounded-xl bg-eneba px-5 text-sm font-extrabold text-cosmos transition hover:bg-[#ffe03d]"
            >
              Sign in
            </a>
          )}
        </div>
      </div>

      <nav className="border-t border-white/[0.07] bg-white/[0.02]">
        <div className="mx-auto flex h-11 max-w-[1400px] items-center gap-2 px-8">
          {NAV_ITEMS.map((item) => {
            const active = route.name === "store" && route.cat === item.cat;
            return (
              <a
                key={item.cat}
                href={storeHref(item.cat)}
                className={`flex h-8 items-center rounded-lg px-3.5 text-[13px] font-bold transition ${
                  active
                    ? "bg-eneba text-cosmos"
                    : "text-lavender hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {t(item.key)}
              </a>
            );
          })}
        </div>
      </nav>
    </header>
  );
}