import { useEffect, useRef, useState, type ReactNode } from "react";
import { apiFetch } from "../api";
import {
  CHEAP_MAX,
  platformLabel,
  type Category,
  type Offer,
  type Platform,
  type Product,
  type Region,
} from "../data";
import { useI18n, type Key } from "../i18n";
import { storeHref } from "../router";
import { CheckIcon, ChevronDown, ChevronLeft, ChevronRight } from "../icons";
import { GameCard } from "./GameCard";

const PLATFORMS_ALL: Platform[] = ["Steam", "PS5", "Xbox", "Switch"];
const REGIONS: Region[] = ["GLOBAL", "EUROPE", "US"];
const SORTS = ["sort.popular", "sort.low", "sort.high", "sort.discount"] as const satisfies readonly Key[];
const CATS: { cat: Category; key: Key }[] = [
  { cat: "all", key: "cat.all" },
  { cat: "cheap", key: "nav.cheap" },
  { cat: "software", key: "nav.software" },
  { cat: "giftcards", key: "nav.giftcards" },
];
const TITLE: Record<Category, Key> = {
  all: "nav.store",
  cheap: "nav.cheap",
  software: "nav.software",
  giftcards: "nav.giftcards",
};
type Sort = (typeof SORTS)[number];
const PAGE_SIZE = 12;
const MAX = 100;

function Section({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
      <div className="border-b border-white/10 py-4 first:pt-0 last:border-0 last:pb-0">
        <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            className="flex w-full items-center justify-between text-left text-[11px] font-extrabold tracking-[0.14em] text-lavender uppercase hover:text-white"
        >
          {title}
          <ChevronDown className={`size-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
        {open && <div className="pt-3">{children}</div>}
      </div>
  );
}

function SortDropdown({ value, onChange }: { value: Sort; onChange: (s: Sort) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const f = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", f);
    return () => document.removeEventListener("mousedown", f);
  }, []);
  return (
      <div ref={ref} className="relative">
        <button
            onClick={() => setOpen(!open)}
            className="flex h-[42px] min-w-[230px] items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/[0.06] px-4 text-sm font-bold backdrop-blur-md transition hover:border-white/30"
        >
        <span>
          <span className="mr-2 font-medium text-lavender">{t("store.sortBy")}</span>
          {t(value)}
        </span>
          <ChevronDown className={`size-4 text-lavender transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && (
            <ul className="glass absolute top-[calc(100%+8px)] right-0 z-30 w-full overflow-hidden rounded-xl p-1.5 !bg-[#1c0a40]/95">
              {SORTS.map((s) => (
                  <li key={s}>
                    <button
                        onClick={() => {
                          onChange(s);
                          setOpen(false);
                        }}
                        className={`flex h-10 w-full items-center justify-between rounded-lg px-3 text-[13px] font-semibold transition hover:bg-white/10 ${s === value ? "text-eneba" : ""}`}
                    >
                      {t(s)}
                      {s === value && <CheckIcon className="size-4" />}
                    </button>
                  </li>
              ))}
            </ul>
        )}
      </div>
  );
}

function PriceRange({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const [lo, hi] = value;
  return (
      <div>
        <div className="relative mx-0.5 h-6">
          <div className="absolute top-1/2 right-0 left-0 h-1.5 -translate-y-1/2 rounded-full bg-white/12" />
          <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-eneba" style={{ left: `${lo}%`, right: `${100 - hi}%` }} />
          <input type="range" min={0} max={MAX} value={lo} className="dual-range" onChange={(e) => onChange([Math.min(+e.target.value, hi - 2), hi])} />
          <input type="range" min={0} max={MAX} value={hi} className="dual-range" onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + 2)])} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-extrabold">
          <span className="rounded-md border border-white/12 bg-white/[0.06] px-2.5 py-1">€{lo}</span>
          <span className="text-lavender">–</span>
          <span className="rounded-md border border-white/12 bg-white/[0.06] px-2.5 py-1">€{hi}</span>
        </div>
      </div>
  );
}

export function StorePage({ cat = "all", onAdd }: { cat?: Category; onAdd: (p: Product, offer?: Offer) => void }) {
  const { t } = useI18n();
  const defaultPrice: [number, number] = cat === "cheap" ? [0, CHEAP_MAX] : [0, MAX];
  const PLATFORMS: Platform[] = cat === "software" ? ["PC"] : PLATFORMS_ALL;
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [price, setPrice] = useState<[number, number]>(defaultPrice);
  const [sort, setSort] = useState<Sort>("sort.popular");
  const [items, setItems] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const dirty = platforms.length > 0 || regions.length > 0 || price[0] !== defaultPrice[0] || price[1] !== defaultPrice[1];

  useEffect(() => {
    const qs = new URLSearchParams({
      cat,
      min_price: String(price[0]),
      max_price: String(price[1]),
      sort,
    });
    if (platforms.length) qs.set("platforms", platforms.join(","));
    if (regions.length) qs.set("regions", regions.join(","));

    apiFetch<Product[]>(`/products?${qs.toString()}`).then(setItems).catch(console.error);
    setPage(1);
  }, [cat, platforms, regions, price, sort]);

  const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const visible = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset = () => {
    setPlatforms([]);
    setRegions([]);
    setPrice(defaultPrice);
  };

  return (
      <div className="mx-auto flex w-full max-w-[1400px] items-start gap-7">
        <aside className="glass sticky top-24 w-[250px] shrink-0 rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[15px] font-extrabold">{t("store.filters")}</span>
            <button
                onClick={reset}
                disabled={!dirty}
                className="rounded-md px-2 py-1 text-xs font-bold text-eneba transition hover:bg-eneba/10 disabled:pointer-events-none disabled:text-lavender/50"
            >
              {t("store.reset")}
            </button>
          </div>
          <Section title={t("store.platform")}>
            <ul className="-mx-1.5 flex flex-col gap-0.5">
              {PLATFORMS.map((p) => {
                const on = platforms.includes(p);
                return (
                    <li key={p}>
                      <label className="flex h-9 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 text-sm font-semibold transition hover:bg-white/[0.06]">
                        <input type="checkbox" checked={on} onChange={() => setPlatforms(toggle(platforms, p))} className="peer sr-only" />
                        <span className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition ${on ? "border-eneba bg-eneba text-cosmos" : "border-white/25 bg-white/[0.03]"}`}>
                      {on && <CheckIcon className="size-3" strokeWidth={3.5} />}
                    </span>
                        {platformLabel[p]}
                      </label>
                    </li>
                );
              })}
            </ul>
          </Section>
          <Section title={t("store.region")}>
            <div className="flex flex-wrap gap-1.5">
              {REGIONS.map((r) => {
                const on = regions.includes(r);
                return (
                    <button
                        key={r}
                        onClick={() => setRegions(toggle(regions, r))}
                        className={`h-8 rounded-full border px-3 text-[11px] font-extrabold tracking-[0.1em] transition ${on ? "border-mint bg-mint text-cosmos" : "border-mint/30 bg-mint/10 text-mint hover:bg-mint/20"}`}
                    >
                      {r}
                    </button>
                );
              })}
            </div>
          </Section>
          <Section title={t("store.price")}>
            <PriceRange value={price} onChange={setPrice} />
          </Section>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <div className="mb-1.5 text-xs font-bold tracking-[0.18em] text-lavender">{t("store.eyebrow")}</div>
              <h1 className="text-[32px] leading-none font-extrabold tracking-[-0.035em]">
                {t(TITLE[cat])}{" "}
                <span className="ml-1 align-middle text-sm font-semibold tracking-normal text-lavender">
                {t("store.results", { n: items.length })}
              </span>
              </h1>
            </div>
            <SortDropdown value={sort} onChange={setSort} />
          </div>

          <div className="mb-5 flex items-center gap-2">
            {CATS.map((c) => (
                <a
                    key={c.cat}
                    href={storeHref(c.cat)}
                    className={`flex h-9 items-center rounded-full border px-4 text-[13px] font-bold whitespace-nowrap transition ${
                        c.cat === cat ? "border-eneba bg-eneba text-cosmos" : "border-white/12 bg-white/[0.05] text-white/80 hover:border-white/25 hover:text-white"
                    }`}
                >
                  {t(c.key)}
                </a>
            ))}
          </div>

          {visible.length === 0 ? (
              <div className="glass grid place-items-center rounded-2xl px-8 py-24 text-center">
                <div className="text-2xl font-extrabold">{t("store.empty")}</div>
                <p className="mt-2 text-lavender">{t("store.emptyHint")}</p>
                <button onClick={reset} className="mt-6 h-[52px] rounded-xl bg-eneba px-8 font-extrabold text-cosmos hover:bg-[#ffe03d]">
                  {t("store.resetFilters")}
                </button>
              </div>
          ) : (
              <div className="grid grid-cols-4 gap-5">
                {visible.map((p) => (
                    <GameCard key={p.id} p={p} onAdd={onAdd} />
                ))}
              </div>
          )}

          {pages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="grid size-[42px] place-items-center rounded-xl border border-white/15 bg-white/[0.05] disabled:opacity-35">
                  <ChevronLeft className="size-5" />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`size-[42px] rounded-xl border text-sm font-extrabold ${n === page ? "border-eneba bg-eneba text-cosmos" : "border-white/15 bg-white/[0.05]"}`}
                    >
                      {n}
                    </button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(page + 1)} className="grid size-[42px] place-items-center rounded-xl border border-white/15 bg-white/[0.05] disabled:opacity-35">
                  <ChevronRight className="size-5" />
                </button>
              </nav>
          )}
        </div>
      </div>
  );
}