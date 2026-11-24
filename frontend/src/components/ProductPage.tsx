import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { discount, fmt, platformLabel, reviewOf, type Offer, type Product } from "../data";
import { BoltIcon, CartIcon, ChevronLeft, ShieldIcon, StarIcon } from "../icons";
import { DiscountPill, PlatformBadge } from "./Badges";
import { useI18n } from "../i18n";

const SHOTS = ["12% 18%", "88% 40%", "50% 92%"];

function Spec({ k, v, mint }: { k: string; v: string; mint?: boolean }) {
  return (
      <div className="flex items-center justify-between border-b border-white/10 py-3 last:border-0">
        <span className="text-sm font-medium text-lavender">{k}</span>
        <span className={`text-sm font-extrabold ${mint ? "tracking-[0.1em] text-mint" : ""}`}>
        {v}
      </span>
      </div>
  );
}

export function ProductPage({
                              productId,
                              onAdd,
                            }: {
  productId: string;
  onAdd: (p: Product, offer?: Offer) => void;
}) {
  const { t } = useI18n();
  const [p, setP] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch<Product>(`/products/${encodeURIComponent(productId)}`)
        .then(setP)
        .catch(() => setP(null))
        .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <div className="glass h-[540px] animate-pulse rounded-2xl" />;
  if (!p)
    return (
        <div className="glass grid place-items-center rounded-2xl py-28 text-center">
          <div className="text-3xl font-extrabold">Game not found</div>
          <a
              href="#/store"
              className="mt-6 grid h-[52px] place-items-center rounded-xl bg-eneba px-8 font-extrabold text-cosmos"
          >
            {t("product.back")}
          </a>
        </div>
    );

  const review = reviewOf(p);
  const featured = p.featuredOffer;
  const others = p.otherOffers ?? [];

  return (
      <div className="flex flex-col gap-14">
        <section>
          <a
              href="#/store"
              className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold text-lavender transition hover:text-white"
          >
            <ChevronLeft className="size-4" /> {t("product.back")}
          </a>

          <div className="grid grid-cols-[300px_minmax(0,1fr)_360px] items-start gap-9">
            <div>
              <div className="relative isolate">
                <div
                    className="absolute -inset-8 -z-10 rounded-full opacity-60 blur-3xl"
                    style={{
                      background:
                          "radial-gradient(closest-side, rgb(157 37 216 / 0.55), rgb(78 27 217 / 0.3) 55%, transparent)",
                    }}
                />
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_70px_-30px_rgb(78_27_217/0.9)]">
                  <img
                      src={p.cover}
                      alt={`${p.title} cover art`}
                      style={{ objectPosition: p.coverPosition ?? undefined }}
                      className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_70%,rgb(18_5_41/0.6))]" />
                  <DiscountPill value={discount(p)} className="absolute top-3 left-3" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2.5">
                {SHOTS.map((pos, i) => (
                    <div
                        key={i}
                        className="relative aspect-video overflow-hidden rounded-lg border border-white/15"
                    >
                      <img
                          src={p.cover}
                          alt=""
                          style={{ objectPosition: pos }}
                          className="size-full scale-[2.2] object-cover"
                      />
                    </div>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-4 flex items-center gap-3">
                <PlatformBadge platform={p.platform} size="md" />
                <span className="text-sm font-bold tracking-wide text-lavender uppercase">
                {p.type}
              </span>
              </div>
              <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.035em]">
                {p.title}
              </h1>

              <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] py-2 pr-5 pl-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-sm font-extrabold text-cosmos">
                <StarIcon className="size-3.5" />
                {review.score}
              </span>
                <span className="text-sm font-bold">{review.label}</span>
                <span className="text-sm text-lavender">· {review.count}</span>
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-5">
                <Spec k="Platform" v={platformLabel[p.platform]} />
                <Spec k="Region" v={p.region} mint />
                <Spec k={t("product.delivery")} v={t("product.instant")} />
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-lavender">{p.description}</p>
            </div>

            <div className="glass sticky top-24 overflow-hidden rounded-2xl border-eneba/40 p-6 shadow-[0_0_0_1px_rgb(250_211_24/0.25),0_30px_80px_-30px_rgb(250_211_24/0.35)]">
              <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-eneba/15 px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-eneba">
                <BoltIcon className="size-3.5" /> {t("product.featured")}
              </span>
                <span className="text-xs font-bold text-mint">{t("product.lowest")}</span>
              </div>
              <div className="relative mt-5 flex items-end justify-between">
                <div>
                  <div className="text-sm text-lavender line-through">{fmt(p.oldPrice)}</div>
                  <div className="text-[40px] leading-none font-extrabold tracking-[-0.035em]">
                    {fmt(featured?.price ?? p.price)}
                  </div>
                  {p.cashback && (
                      <div className="mt-2 text-sm font-bold text-mint">
                        Cashback: {fmt(p.cashback)}
                      </div>
                  )}
                </div>
                {featured && (
                    <div className="text-right">
                      <div className="text-xs text-lavender">{t("product.soldBy")}</div>
                      <div className="flex items-center justify-end gap-1.5 text-[15px] font-extrabold">
                        <ShieldIcon className="size-4 text-mint" />
                        {featured.seller}
                      </div>
                      <div className="text-xs font-semibold text-lavender">
                        {featured.rating}% positive • {featured.sales}
                      </div>
                    </div>
                )}
              </div>
              <button
                  onClick={() => onAdd(p, featured ?? undefined)}
                  className="relative mt-6 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-eneba text-base font-extrabold text-cosmos shadow-[0_14px_36px_-12px_rgb(250_211_24/0.8)] transition hover:-translate-y-0.5 hover:bg-[#ffe03d]"
              >
                <CartIcon className="size-5" strokeWidth={2.5} />
                {t("product.addToCart")}
              </button>
            </div>
          </div>
        </section>

        {others.length > 0 && (
            <section>
              <div className="mb-5">
                <div className="mb-2 text-xs font-bold tracking-[0.18em] text-lavender">
                  {t("product.compare", { n: others.length })}
                </div>
                <h2 className="text-[28px] leading-none font-extrabold tracking-[-0.035em]">
                  {t("product.others")}
                </h2>
              </div>
              <ul className="flex flex-col gap-2.5">
                {others.map((o) => (
                    <li
                        key={o.id}
                        className="glass grid grid-cols-[1.6fr_1.2fr_auto_auto_auto] items-center gap-6 rounded-xl px-5 py-3 transition hover:border-white/25"
                    >
                      <div className="flex items-center gap-4">
                  <span
                      className="grid size-9 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white"
                      style={{
                        background: `linear-gradient(135deg, hsl(${o.hue} 75% 55%), hsl(${(o.hue + 50) % 360} 70% 38%))`,
                      }}
                  >
                    {o.seller[0]}
                  </span>
                        <span className="text-[15px] font-extrabold">{o.seller}</span>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-mint/12 px-3 py-1 text-xs font-bold text-mint">
                  <span className="size-1.5 rounded-full bg-mint" />
                        {o.rating}% positive • {o.sales}
                </span>
                      <span className="inline-flex h-7 items-center rounded-full border border-mint/30 bg-mint/10 px-3 text-[11px] font-extrabold tracking-[0.12em] text-mint">
                  {p.region}
                </span>
                      <span className="min-w-[90px] text-right text-xl font-extrabold tracking-[-0.03em]">
                  {fmt(o.price)}
                </span>
                      <button
                          onClick={() => onAdd(p, o)}
                          className="h-[42px] rounded-xl bg-eneba px-6 text-sm font-extrabold text-cosmos transition hover:-translate-y-0.5 hover:bg-[#ffe03d]"
                      >
                        {t("product.addToCart")}
                      </button>
                    </li>
                ))}
              </ul>
            </section>
        )}
      </div>
  );
}