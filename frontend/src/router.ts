import { useEffect, useState } from "react";
import type { Category } from "./data";

export type Route =
  | { name: "home" }
  | { name: "store"; cat: Category }
  | { name: "product"; id: string }
  | { name: "auth"; next?: string }
  | { name: "checkout" }
  | { name: "order"; id: string }
  | { name: "orders" };

const parse = (): Route => {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [h, qs = ""] = raw.split("?");
  if (h === "store") {
    const c = new URLSearchParams(qs).get("cat");
    return {
      name: "store",
      cat: c === "cheap" || c === "software" || c === "giftcards" ? c : "all",
    };
  }
  if (h === "auth") return { name: "auth", next: new URLSearchParams(qs).get("next") ?? undefined };
  if (h === "checkout") return { name: "checkout" };
  if (h === "orders") return { name: "orders" };
  if (h.startsWith("order/")) return { name: "order", id: decodeURIComponent(h.slice(6)) };
  if (h.startsWith("product/")) return { name: "product", id: decodeURIComponent(h.slice(8)) };
  return { name: "home" };
};

export const productHref = (id: string) => `#/product/${encodeURIComponent(id)}`;
export const storeHref = (cat: Category = "all") =>
  cat === "all" ? "#/store" : `#/store?cat=${cat}`;
export const navigate = (hash: string) => {
  window.location.hash = hash;
};
export const openProduct = (id: string) => navigate(productHref(id));
export const authHref = (next?: string) =>
  next ? `#/auth?next=${encodeURIComponent(next)}` : "#/auth";

export function useRoute() {
  const [route, setRoute] = useState<Route>(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
