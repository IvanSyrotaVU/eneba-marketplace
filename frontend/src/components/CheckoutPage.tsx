import { useState } from "react";
import { fmt, platformLabel } from "../data";
import { navigate } from "../router";
import { useShop, type PayMethod } from "../shop";

export function CheckoutPage() {
  const { cart, subtotal, placeOrder } = useShop();
  const [method, setMethod] = useState<PayMethod>("card");
  const [holder, setHolder] = useState("Alex Morgan");
  const [cardNumber, setCardNumber] = useState("4242  4242  4242  4242");
  const [expiry, setExpiry] = useState("12  /  28");
  const [cvc, setCvc] = useState("123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0) {
    return (
        <div className="glass grid place-items-center rounded-2xl py-24 text-center">
          <div className="text-2xl font-extrabold">Your cart is empty</div>
          <a
              href="#/store"
              className="mt-6 grid h-[52px] place-items-center rounded-xl bg-eneba px-8 font-extrabold text-cosmos"
          >
            Browse Store
          </a>
        </div>
    );
  }

  const totalSaved = cart.reduce(
      (sum, i) => sum + Math.max(0, (i.product.oldPrice - i.price) * i.qty),
      0,
  );

  const pay = async () => {
    setError("");
    setSubmitting(true);
    try {
      const order = await placeOrder(method);
      if (order) navigate(`#/order/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="mx-auto w-full max-w-[1220px]">
        <h1 className="mb-7 text-[40px] leading-none font-extrabold tracking-[-0.035em]">
          Payment
        </h1>

        <div className="grid grid-cols-[1fr_380px] items-start gap-7">
          {/* Left Payment Module */}
          <div className="glass rounded-3xl border border-white/12 p-7">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold">Payment method</h2>
              <span className="inline-flex items-center gap-2 rounded-full border border-mint/35 bg-mint/12 px-3.5 py-1.5 text-xs font-extrabold text-mint">
              <span className="size-2 rounded-full bg-mint" />
              Sandbox Test Mode — No real money is charged
            </span>
            </div>

            {error && (
                <div className="mt-5 rounded-xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200">
                  {error}
                </div>
            )}

            {/* 3 Method Selector Cards */}
            <div className="mt-6 grid grid-cols-3 gap-3.5">
              {(
                  [
                    {
                      id: "card" as const,
                      title: "Credit / Debit Card",
                      sub: "Visa, Mastercard, Amex",
                      icon: (
                          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                            <rect x="2" y="5" width="20" height="14" rx="3" />
                            <path d="M2 10h20" />
                          </svg>
                      ),
                    },
                    {
                      id: "apple" as const,
                      title: "Apple Pay",
                      sub: "Touch ID or Face ID",
                      icon: (
                          <svg className="size-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
                          </svg>
                      ),
                    },
                    {
                      id: "crypto" as const,
                      title: "Crypto",
                      sub: "BTC, ETH, USDC",
                      icon: (
                          <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                            <circle cx="12" cy="12" r="9" />
                            <path d="M9.5 8h4a2 2 0 0 1 0 4h-4h4.5a2 2 0 0 1 0 4h-4.5M11 6.5v11M13 6.5v11" strokeLinecap="round" />
                          </svg>
                      ),
                    },
                  ]
              ).map((m) => {
                const active = method === m.id;
                return (
                    <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition ${
                            active
                                ? "border-eneba bg-eneba/[0.08] shadow-[0_0_0_1px_rgb(250_211_24/0.4)]"
                                : "border-white/12 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                        }`}
                    >
                      <div className="flex items-start justify-between">
                    <span
                        className={`grid size-10 place-items-center rounded-xl ${
                            active ? "bg-eneba text-cosmos" : "bg-white/10 text-white"
                        }`}
                    >
                      {m.icon}
                    </span>
                        <span
                            className={`grid size-5 place-items-center rounded-full border ${
                                active ? "border-eneba bg-eneba text-cosmos" : "border-white/25"
                            }`}
                        >
                      {active && (
                          <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5}>
                            <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                      )}
                    </span>
                      </div>
                      <div className="mt-4">
                        <div className="text-[15px] font-extrabold text-white">{m.title}</div>
                        <div className="mt-0.5 text-xs text-lavender">{m.sub}</div>
                      </div>
                    </button>
                );
              })}
            </div>

            {/* Method Details Box */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-[#120529]/55 p-6">
              {method === "card" ? (
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2 text-xs font-bold text-lavender">
                      Cardholder name
                      <input
                          type="text"
                          value={holder}
                          onChange={(e) => setHolder(e.target.value)}
                          className="h-12 rounded-xl border border-white/12 bg-white/[0.06] px-4 text-sm font-bold text-white outline-none focus:border-eneba"
                      />
                    </label>

                    <label className="flex flex-col gap-2 text-xs font-bold text-lavender">
                      Card number
                      <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="h-12 rounded-xl border border-white/12 bg-white/[0.06] px-4 text-sm font-bold tracking-wider text-white outline-none focus:border-eneba"
                      />
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2 text-xs font-bold text-lavender">
                        Expiry
                        <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            className="h-12 rounded-xl border border-white/12 bg-white/[0.06] px-4 text-sm font-bold text-white outline-none focus:border-eneba"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-xs font-bold text-lavender">
                        CVC
                        <input
                            type="text"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            className="h-12 rounded-xl border border-white/12 bg-white/[0.06] px-4 text-sm font-bold text-white outline-none focus:border-eneba"
                        />
                      </label>
                    </div>
                  </div>
              ) : method === "apple" ? (
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-base font-extrabold text-white">Apple Pay Express</div>
                      <p className="mt-1 text-xs text-lavender">
                        Confirm sandbox biometric authorization when clicking Pay Now below.
                      </p>
                    </div>
                    <span className="rounded-xl border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-extrabold text-mint">
                  Ready
                </span>
                  </div>
              ) : (
                  <div className="flex items-center justify-between gap-4 py-2">
                    <div>
                      <div className="text-base font-extrabold text-white">Instant Web3 Settlement (USDC / BTC / ETH)</div>
                      <p className="mt-1 font-mono text-xs text-lavender">
                        0x71C...9A4E • Polygon / Ethereum Sandbox Network
                      </p>
                    </div>
                    <span className="rounded-xl border border-mint/30 bg-mint/10 px-3.5 py-2 text-xs font-extrabold text-mint">
                  0% Network Fee
                </span>
                  </div>
              )}
            </div>

            <button
                type="button"
                disabled={submitting}
                onClick={pay}
                className="mt-6 flex h-[56px] w-full items-center justify-center gap-2.5 rounded-2xl bg-eneba text-base font-extrabold text-cosmos shadow-[0_14px_36px_-10px_rgb(250_211_24/0.75)] transition hover:-translate-y-0.5 hover:bg-[#ffe03d] disabled:opacity-50"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              {submitting ? "Processing..." : `Pay Now · ${fmt(subtotal)}`}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-lavender">
              <svg className="size-4 text-mint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
              256-bit encrypted · Keys delivered instantly after payment
            </div>
          </div>

          {/* Right Order Summary */}
          <div className="glass sticky top-24 rounded-3xl border border-white/12 p-6">
            <h2 className="text-xl font-extrabold">Order Summary</h2>

            <ul className="mt-5 flex flex-col gap-3.5 border-b border-white/10 pb-5">
              {cart.map((i) => (
                  <li key={i.key} className="flex items-center gap-3.5">
                    <img
                        src={i.product.cover}
                        alt={i.product.title}
                        className="h-14 w-11 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold">{i.product.title}</div>
                      <div className="text-xs text-lavender">
                        {platformLabel[i.product.platform]} · {i.seller} × {i.qty}
                      </div>
                    </div>
                    <div className="text-sm font-extrabold">{fmt(i.price * i.qty)}</div>
                  </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-col gap-2.5 border-b border-white/10 pb-4 text-sm">
              <div className="flex items-center justify-between text-lavender">
                <span>Subtotal</span>
                <span className="font-bold text-white">{fmt(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-lavender">
                <span>Service Fee</span>
                <span className="font-bold text-mint">Free</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xl font-extrabold">
              <span>Total</span>
              <span>{fmt(subtotal)}</span>
            </div>

            {totalSaved > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-mint/30 bg-mint/12 px-4 py-2.5 text-xs font-extrabold text-mint">
                  <span>✦</span>
                  <span>You&apos;re saving {fmt(totalSaved)}</span>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}