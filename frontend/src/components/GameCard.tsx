import { openProduct } from "../router";
import { discount, fmt, type Offer, type Product } from "../data";
import { CashbackIcon, HeartIcon, PlatformGlyph, PlusIcon } from "../icons";
import { DiscountPill } from "./Badges";
import { useI18n } from "../i18n";

export function GameCard({ p, onAdd }: { p: Product; onAdd: (p: Product, offer?: Offer) => void }) {
  const { t } = useI18n();
  return (
    <article
      onClick={() => openProduct(p.id)}
      className="group glass relative flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_24px_50px_-24px_rgb(78_27_217/0.9)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={p.cover}
          alt={`${p.title} cover art`}
          loading="lazy"
          style={{ objectPosition: p.coverPosition }}
          className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_70%,rgb(31_12_71/0.85)_100%)]" />
        <DiscountPill
          value={discount(p)}
          className="absolute top-2.5 left-2.5 !px-2 !py-0.5 !text-[11px]"
        />
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 grid size-7 place-items-center rounded-full border border-white/15 bg-cosmos/50 opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:text-eneba"
          aria-label={`Wishlist ${p.title}`}
        >
          <HeartIcon className="size-3.5" />
        </button>
        {p.cashback && (
          <span className="absolute right-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-full bg-cosmos/65 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider text-mint backdrop-blur-md">
            <CashbackIcon className="size-2.5" />
            {t("card.cashback")}
          </span>
        )}
        {p.preorder && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-[linear-gradient(135deg,#ff2d95,#ff6a3d)] px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-white">
            {t("card.preorder")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pt-3 pb-3.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-lavender">
          <PlatformGlyph platform={p.platform} className="size-3" />
          {p.platform}
        </div>
        <h3
          className="mt-1 truncate text-[15px] leading-snug font-bold tracking-[-0.01em]"
          title={p.title}
        >
          {p.title}
        </h3>
        <span className="mt-0.5 text-[10px] font-extrabold tracking-[0.12em] text-mint">
          {p.region}
        </span>

        {typeof p.claimed === "number" && (
          <div className="mt-2.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-eneba to-[#ff9d2e]"
                style={{ width: `${p.claimed}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-lavender">
              {t("card.claimed", { n: p.claimed })}
            </span>
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-white/10 pt-2.5">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-lavender">
              {t("card.from")} <span className="line-through opacity-70">{fmt(p.oldPrice)}</span>
            </div>
            <div className="text-lg leading-tight font-extrabold tracking-[-0.02em]">
              {fmt(p.price)}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(p);
            }}
            className="grid size-9 shrink-0 place-items-center rounded-lg bg-eneba text-cosmos transition hover:-translate-y-0.5 hover:bg-[#ffe03d]"
            aria-label={`Add ${p.title} to cart`}
          >
            <PlusIcon className="size-[18px]" strokeWidth={2.75} />
          </button>
        </div>
      </div>
    </article>
  );
}