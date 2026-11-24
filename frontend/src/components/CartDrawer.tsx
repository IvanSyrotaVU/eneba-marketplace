import { useEffect } from "react";
import { fmt } from "../data";
import { CartIcon, LockIcon, MinusIcon, PlusIcon, ShieldIcon, TrashIcon, XIcon } from "../icons";
import { authHref, navigate } from "../router";
import { useShop } from "../shop";
import { PlatformBadge } from "./Badges";
import { useI18n } from "../i18n";

export function CartDrawer() {
  const { t } = useI18n();
  const {
    cart,
    count,
    subtotal,
    drawerOpen: open,
    setDrawerOpen,
    setQty,
    remove,
    user,
  } = useShop();
  const close = () => setDrawerOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setDrawerOpen]);

  const checkout = () => {
    close();
    navigate(user ? "#/checkout" : authHref("checkout"));
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={close}
        className={`absolute inset-0 bg-[#08021a]/65 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute top-0 right-0 flex h-full w-[440px] flex-col border-l border-white/12 bg-[linear-gradient(180deg,#220c50_0%,#170638_100%)] shadow-[-40px_0_100px_-20px_rgb(8_2_24/0.9)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-violet-electric/30 blur-3xl" />

        <header className="relative flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold tracking-[-0.02em]">{t("drawer.title")}</h2>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-eneba px-1.5 text-xs font-extrabold text-cosmos">
              {count}
            </span>
          </div>
          <button
            onClick={close}
            aria-label="Close cart"
            className="grid size-[42px] place-items-center rounded-xl border border-white/12 bg-white/[0.06] transition hover:bg-white/[0.12]"
          >
            <XIcon className="size-[18px]" />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="relative flex flex-1 flex-col items-center justify-center px-10 text-center">
            <div className="grid size-16 place-items-center rounded-2xl border border-white/12 bg-white/[0.06]">
              <CartIcon className="size-7 text-lavender" />
            </div>
            <div className="mt-5 text-lg font-extrabold">{t("drawer.empty")}</div>
            <p className="mt-1.5 text-sm text-lavender">{t("drawer.emptyHint")}</p>
            <a
              href="#/store"
              onClick={close}
              className="mt-6 grid h-[52px] place-items-center rounded-xl bg-eneba px-8 text-[15px] font-extrabold text-cosmos transition hover:bg-[#ffe03d]"
            >
              {t("drawer.browse")}
            </a>
          </div>
        ) : (
          <>
            <ul className="relative flex-1 space-y-2.5 overflow-y-auto px-6 py-5">
              {cart.map((i) => (
                <li key={i.key} className="glass flex gap-3.5 rounded-xl p-3">
                  <img
                    src={i.product.cover}
                    alt=""
                    style={{ objectPosition: i.product.coverPosition }}
                    className="h-[88px] w-[66px] shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href={`#/product/${i.product.id}`}
                        onClick={close}
                        className="truncate text-[15px] font-bold hover:text-eneba"
                        title={i.product.title}
                      >
                        {i.product.title}
                      </a>
                      <button
                        onClick={() => remove(i.key)}
                        aria-label={`Remove ${i.product.title}`}
                        className="-mt-0.5 -mr-0.5 grid size-7 shrink-0 place-items-center rounded-lg text-lavender transition hover:bg-white/10 hover:text-[#ff6b8b]"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <PlatformBadge platform={i.product.platform} />
                      <span className="text-[10px] font-extrabold tracking-[0.12em] text-mint">
                        {i.product.region}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-[11px] text-lavender">
                      {t("product.soldBy")}{" "}
                      <span className="font-semibold text-white/85">{i.seller}</span> ·{" "}
                      {fmt(i.price)} {t("drawer.each")}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex h-8 items-center rounded-lg border border-white/12 bg-white/[0.05]">
                        <button
                          onClick={() => setQty(i.key, i.qty - 1)}
                          aria-label="Decrease quantity"
                          className="grid h-full w-8 place-items-center text-lavender hover:text-white"
                        >
                          <MinusIcon className="size-3.5" strokeWidth={2.75} />
                        </button>
                        <span className="w-6 text-center text-sm font-extrabold tabular-nums">
                          {i.qty}
                        </span>
                        <button
                          onClick={() => setQty(i.key, i.qty + 1)}
                          disabled={i.qty >= 10}
                          aria-label="Increase quantity"
                          className="grid h-full w-8 place-items-center text-lavender hover:text-white disabled:opacity-30"
                        >
                          <PlusIcon className="size-3.5" strokeWidth={2.75} />
                        </button>
                      </div>
                      <span className="text-[17px] font-extrabold tracking-[-0.02em]">
                        {fmt(i.price * i.qty)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="relative shrink-0 border-t border-white/10 bg-cosmos/40 px-6 pt-5 pb-6 backdrop-blur-xl">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-lavender">{t("drawer.subtotal")}</dt>
                  <dd className="font-bold">{fmt(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-lavender">{t("drawer.fee")}</dt>
                  <dd className="font-bold text-mint">{fmt(0)}</dd>
                </div>
                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <dt className="text-[15px] font-bold">{t("drawer.total")}</dt>
                  <dd className="text-[30px] leading-none font-extrabold tracking-[-0.03em]">
                    {fmt(subtotal)}
                  </dd>
                </div>
              </dl>
              <button
                onClick={checkout}
                className="mt-5 flex h-[60px] w-full items-center justify-center gap-2.5 rounded-xl bg-eneba text-[17px] font-extrabold text-cosmos shadow-[0_14px_40px_-12px_rgb(250_211_24/0.8)] transition hover:-translate-y-0.5 hover:bg-[#ffe03d]"
              >
                <LockIcon className="size-5" strokeWidth={2.5} />
                {t("drawer.checkout")}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-lavender">
                <ShieldIcon className="size-3.5 text-mint" />
                {t("drawer.trust")}
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
