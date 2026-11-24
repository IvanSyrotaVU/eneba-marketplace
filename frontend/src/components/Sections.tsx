import { useEffect, useRef, useState, type ReactNode } from "react";
import { apiFetch } from "../api";
import type { Offer, Product } from "../data";
import { ArrowRight, BoltIcon, ChevronLeft, ChevronRight } from "../icons";
import { GameCard } from "./GameCard";
import { useI18n } from "../i18n";

function SectionHead({
                         eyebrow,
                         title,
                         children,
                     }: {
    eyebrow: string;
    title: string;
    children?: ReactNode;
}) {
    return (
        <div className="mb-6 flex items-end justify-between gap-6">
            <div>
                <div className="mb-2 text-xs font-bold tracking-[0.18em] text-lavender">{eyebrow}</div>
                <h2 className="text-[34px] leading-none font-extrabold tracking-[-0.035em]">{title}</h2>
            </div>
            <div className="flex items-center gap-3">{children}</div>
        </div>
    );
}

function SeeAll() {
    const { t } = useI18n();
    return (
        <a
            href="#/store"
            className="flex h-[52px] items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 text-[15px] font-bold transition hover:border-white/30 hover:bg-white/[0.1]"
        >
            {t("sec.seeAll")} <ArrowRight className="size-4" />
        </a>
    );
}

export function BestSellers({ onAdd }: { onAdd: (p: Product, offer?: Offer) => void }) {
    const { t } = useI18n();
    const [items, setItems] = useState<Product[]>([]);
    const track = useRef<HTMLDivElement>(null);

    useEffect(() => {
        apiFetch<Product[]>("/homepage/bestsellers").then(setItems).catch(console.error);
    }, []);

    const scroll = (dir: number) => {
        const el = track.current;
        const card = el?.firstElementChild as HTMLElement | null;
        el?.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 20), behavior: "smooth" });
    };

    return (
        <section>
            <SectionHead eyebrow={t("sec.best.eyebrow")} title={t("sec.best.title")}>
                {[ChevronLeft, ChevronRight].map((Icon, i) => (
                    <button
                        key={i}
                        onClick={() => scroll(i ? 1 : -1)}
                        className="grid size-[52px] place-items-center rounded-xl border border-white/15 bg-white/[0.05] transition hover:bg-white/[0.12]"
                        aria-label={i ? "Next" : "Previous"}
                    >
                        <Icon className="size-5" />
                    </button>
                ))}
                <SeeAll />
            </SectionHead>
            <div
                ref={track}
                className="no-scrollbar -m-4 grid snap-x snap-mandatory auto-cols-[calc((100%-60px)/4)] grid-flow-col gap-5 overflow-x-auto p-4"
                style={{ scrollPaddingInline: 16 }}
            >
                {items.map((p) => (
                    <div key={p.id} className="snap-start">
                        <GameCard p={p} onAdd={onAdd} />
                    </div>
                ))}
            </div>
        </section>
    );
}

function useCountdown(seconds: number) {
    const [left, setLeft] = useState(seconds);
    useEffect(() => {
        const id = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : seconds)), 1000);
        return () => clearInterval(id);
    }, [seconds]);
    return [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60].map((n) =>
        String(n).padStart(2, "0"),
    );
}

export function FlashDeals({ onAdd }: { onAdd: (p: Product, offer?: Offer) => void }) {
    const { t } = useI18n();
    const [items, setItems] = useState<Product[]>([]);
    const time = useCountdown(5 * 3600 + 42 * 60 + 17);

    useEffect(() => {
        apiFetch<Product[]>("/homepage/deals").then(setItems).catch(console.error);
    }, []);

    return (
        <section className="relative isolate overflow-hidden rounded-[28px] border border-white/10 p-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_0%_0%,rgb(78_27_217/0.55),transparent_70%),radial-gradient(50%_70%_at_100%_100%,rgb(157_37_216/0.3),transparent_70%),linear-gradient(180deg,#240B52,#1a0840)]" />
            <SectionHead eyebrow={t("sec.flash.eyebrow")} title={t("sec.flash.title")}>
        <span className="mr-1 flex items-center gap-2 text-sm font-bold text-eneba">
          <BoltIcon className="size-5" />
            {t("sec.endsIn")}
        </span>
                {time.map((v, i) => (
                    <div
                        key={i}
                        className="glass grid h-[52px] w-[60px] place-items-center rounded-xl text-[22px] font-extrabold tabular-nums"
                    >
                        {v}
                    </div>
                ))}
                <span className="w-2" />
                <SeeAll />
            </SectionHead>
            <div className="grid grid-cols-4 gap-5">
                {items.map((p) => (
                    <GameCard key={p.id} p={p} onAdd={onAdd} />
                ))}
            </div>
        </section>
    );
}