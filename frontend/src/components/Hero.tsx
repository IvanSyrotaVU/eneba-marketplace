import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { discount, fmt, type Offer, type Product } from "../data";
import { productHref } from "../router";
import { DiscountPill, PlatformBadge, RegionTag } from "./Badges";
import { HeartIcon, SparkIcon } from "../icons";
import { useI18n } from "../i18n";

export function Hero({ onBuy }: { onBuy: (p: Product, offer?: Offer) => void }) {
  const { t } = useI18n();
  const [hero, setHero] = useState<Product | null>(null);
  const [upNext, setUpNext] = useState<Product[]>([]);

  useEffect(() => {
    apiFetch<{ hero: Product; upNext: Product[] }>("/homepage/hero")
        .then((res) => {
          setHero(res.hero);
          setUpNext(res.upNext);
        })
        .catch(console.error);
  }, []);

  if (!hero) return <div className="glass h-[560px] animate-pulse rounded-[24px]" />;

  return (
      <section className="relative">
        <div className="pointer-events-none absolute -inset-x-20 -inset-y-24 -z-10 bg-[radial-gradient(50%_60%_at_70%_40%,rgb(157_37_216/0.28),transparent_70%),radial-gradient(40%_60%_at_15%_60%,rgb(78_27_217/0.45),transparent_70%)] blur-2xl" />
        <div className="relative h-[560px] overflow-hidden rounded-[24px] border border-white/12 shadow-[0_40px_120px_-40px_rgb(78_27_217/0.8)]">
          <img
              src={hero.cover}
              alt={hero.title}
              className="absolute inset-0 size-full object-cover object-[70%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#120529_0%,rgb(18_5_41/0.92)_28%,rgb(18_5_41/0.35)_58%,transparent_80%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(18_5_41/0.85)_0%,transparent_40%)]" />

          <div className="relative flex h-full max-w-[660px] flex-col justify-center pl-16">
            <div className="mb-6 flex items-center gap-2 text-[13px] font-bold tracking-[0.18em] text-eneba">
              <SparkIcon className="size-4" />
              {t("hero.eyebrow")}
            </div>
            <h1 className="text-[78px] leading-[0.94] font-extrabold tracking-[-0.045em]">
              {hero.title.split(":")[0]}
              {hero.title.includes(":") && (
                  <span className="mt-1 block bg-gradient-to-r from-white via-[#e6d7ff] to-[#c9a7ff] bg-clip-text pb-1 text-[52px] tracking-[-0.03em] text-transparent">
                {hero.title.split(":")[1].trim()}
              </span>
              )}
            </h1>
            <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-lavender">
              {hero.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <PlatformBadge platform="Steam" size="md" />
              <PlatformBadge platform="PS5" size="md" />
              <PlatformBadge platform="Xbox" size="md" />
              <RegionTag region={hero.region} pill />
            </div>
            <div className="mt-9 flex items-center gap-6">
              <div>
                <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-lavender line-through">
                  {fmt(hero.oldPrice)}
                </span>
                  <DiscountPill value={discount(hero)} />
                </div>
                <div className="mt-1 text-[44px] leading-none font-extrabold tracking-[-0.03em]">
                  {fmt(hero.price)}
                </div>
              </div>
              <button
                  onClick={() => onBuy(hero)}
                  className="h-[52px] rounded-xl bg-eneba px-10 text-base font-extrabold text-cosmos shadow-[0_12px_40px_-8px_rgb(250_211_24/0.55)] transition hover:-translate-y-0.5 hover:bg-[#ffe03d]"
              >
                {t("hero.buy")}
              </button>
              <button
                  className="grid size-[52px] place-items-center rounded-xl border border-white/15 bg-white/[0.08] backdrop-blur-md transition hover:bg-white/[0.15]"
                  aria-label="Add to wishlist"
              >
                <HeartIcon className="size-5" />
              </button>
            </div>
          </div>

          <div className="glass absolute right-8 bottom-8 w-[320px] rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between px-1 text-xs font-bold tracking-[0.14em] text-lavender">
              {t("hero.upNext")}
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-6 rounded-full bg-eneba" />
                {[0, 1, 2].map((i) => (
                    <span key={i} className="size-1.5 rounded-full bg-white/30" />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {upNext.map((u) => (
                  <a
                      key={u.id}
                      href={productHref(u.id)}
                      className="flex items-center gap-3 rounded-xl p-1.5 transition hover:bg-white/[0.07]"
                  >
                    <img src={u.cover} alt="" className="h-12 w-10 rounded-lg object-cover" />
                    <span className="flex-1 truncate text-sm font-bold">{u.title}</span>
                    <span className="text-sm font-extrabold">{fmt(u.price)}</span>
                  </a>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}