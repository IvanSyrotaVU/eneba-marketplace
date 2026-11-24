import { fmt } from "../data";
import { CheckIcon, ReceiptIcon } from "../icons";
import { productHref } from "../router";
import { useShop, type Order } from "../shop";
import { PlatformBadge } from "./Badges";
import { KeyBox, KeyInline } from "./KeyBox";

const METHOD_LABEL = { card: "Card", apple: "Apple Pay", crypto: "Crypto" } as const;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function OrderCompletePage({ id }: { id: string }) {
  const { orders } = useShop();
  const order = orders.find((o) => o.id === id);
  if (!order)
    return (
      <div className="glass mx-auto grid w-full max-w-[560px] place-items-center rounded-3xl px-8 py-20 text-center">
        <div className="text-2xl font-extrabold">Order not found</div>
        <a
          href="#/orders"
          className="mt-6 grid h-[52px] place-items-center rounded-xl bg-eneba px-8 font-extrabold text-cosmos"
        >
          View Order History
        </a>
      </div>
    );

  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_224_143/0.16),rgb(78_27_217/0.25)_50%,transparent)] blur-2xl" />
      <div className="glass rounded-3xl p-8">
        <div className="text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-mint text-cosmos shadow-[0_0_0_8px_rgb(0_224_143/0.14),0_0_50px_rgb(0_224_143/0.45)]">
            <CheckIcon className="size-8" strokeWidth={3} />
          </div>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/12 px-3 py-1 text-[11px] font-extrabold tracking-[0.14em] text-mint">
            PAYMENT SUCCESSFUL
          </span>
          <h1 className="mt-3 text-[34px] leading-tight font-extrabold tracking-[-0.035em]">
            Your keys are ready
          </h1>
          <p className="mt-1 text-sm text-lavender">
            Order <span className="font-mono font-bold text-white">#{order.id}</span> ·{" "}
            {fmtDate(order.date)} · Paid {fmt(order.total)} via {METHOD_LABEL[order.method]}
          </p>
        </div>

        <ul className="mt-8 space-y-5">
          {order.lines.map((l, idx) => (
            <li key={idx}>
              <div className="mb-2.5 flex items-center gap-3">
                <img
                  src={l.product.cover}
                  alt=""
                  style={{ objectPosition: l.product.coverPosition }}
                  className="h-12 w-9 shrink-0 rounded-md object-cover ring-1 ring-white/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-bold">{l.product.title}</div>
                  <div className="flex items-center gap-2 text-[11px] text-lavender">
                    <PlatformBadge platform={l.product.platform} />
                    <span className="font-extrabold tracking-[0.12em] text-mint">
                      {l.product.region}
                    </span>
                    · {l.seller}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {l.keys.map((k) => (
                  <KeyBox key={k} value={k} />
                ))}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-xs text-lavender">
          Redeem each key in your{" "}
          {[...new Set(order.lines.map((l) => l.product.platform))].join(" / ")} client. Keys are
          saved to your Order History.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <a
            href="#/orders"
            className="flex h-[52px] items-center justify-center gap-2 rounded-xl bg-eneba text-[15px] font-extrabold text-cosmos shadow-[0_12px_36px_-12px_rgb(250_211_24/0.75)] transition hover:-translate-y-0.5 hover:bg-[#ffe03d]"
          >
            <ReceiptIcon className="size-[18px]" strokeWidth={2.25} />
            View Order History
          </a>
          <a
            href="#/store"
            className="grid h-[52px] place-items-center rounded-xl border border-white/15 bg-white/[0.05] text-[15px] font-bold transition hover:bg-white/[0.1]"
          >
            Keep Shopping
          </a>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="glass overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
        <div className="flex items-center gap-5 text-sm">
          <span className="font-mono font-bold">#{order.id}</span>
          <span className="text-lavender">{fmtDate(order.date)}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/12 px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-mint">
            <CheckIcon className="size-3" strokeWidth={3.5} /> COMPLETED
          </span>
        </div>
        <div className="text-sm text-lavender">
          {METHOD_LABEL[order.method]} ·{" "}
          <span className="text-base font-extrabold text-white">{fmt(order.total)}</span>
        </div>
      </header>
      <ul className="divide-y divide-white/[0.07]">
        {order.lines.map((l, idx) => (
          <li
            key={idx}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 px-5 py-4"
          >
            <a href={productHref(l.product.id)} className="group flex min-w-0 items-center gap-4">
              <img
                src={l.product.cover}
                alt=""
                style={{ objectPosition: l.product.coverPosition }}
                className="h-16 w-12 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0">
                <div className="truncate text-[15px] font-bold group-hover:text-eneba">
                  {l.product.title}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <PlatformBadge platform={l.product.platform} />
                  <span className="text-[10px] font-extrabold tracking-[0.12em] text-mint">
                    {l.product.region}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-lavender">
                  Sold by <span className="font-semibold text-white/85">{l.seller}</span> ·{" "}
                  {fmt(l.price)}
                  {l.qty > 1 && ` × ${l.qty}`}
                </div>
              </div>
            </a>
            <div className="flex flex-col items-end gap-1.5">
              {l.keys.map((k) => (
                <KeyInline key={k} value={k} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function OrdersPage() {
  const { orders, user } = useShop();
  const keyCount = orders.reduce((s, o) => s + o.lines.reduce((t, l) => t + l.keys.length, 0), 0);
  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <div className="mb-1.5 text-xs font-bold tracking-[0.18em] text-lavender">
            MY ACCOUNT · {user?.email.toUpperCase()}
          </div>
          <h1 className="text-[32px] leading-none font-extrabold tracking-[-0.035em]">
            Order History
          </h1>
        </div>
        <div className="flex gap-3">
          {[
            ["Orders", orders.length],
            ["Keys", keyCount],
            ["Spent", fmt(orders.reduce((s, o) => s + o.total, 0))],
          ].map(([k, v]) => (
            <div key={k} className="glass rounded-xl px-4 py-2.5 text-right">
              <div className="text-[10px] font-bold tracking-[0.14em] text-lavender uppercase">
                {k}
              </div>
              <div className="text-lg leading-tight font-extrabold">{v}</div>
            </div>
          ))}
        </div>
      </div>
      {orders.length === 0 ? (
        <div className="glass grid place-items-center rounded-2xl py-20 text-center">
          <div className="text-xl font-extrabold">No orders yet</div>
          <a
            href="#/store"
            className="mt-5 grid h-[52px] place-items-center rounded-xl bg-eneba px-8 font-extrabold text-cosmos"
          >
            Browse Store
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
