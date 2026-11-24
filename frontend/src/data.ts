export type Platform = "Steam" | "PS5" | "Xbox" | "Switch" | "PC";
export type Region = "GLOBAL" | "EUROPE" | "US";
export type Category = "all" | "cheap" | "software" | "giftcards";

export interface Offer {
  id: number;
  seller: string;
  price: number;
  rating: string;
  sales: string;
  hue: number;
}

export interface Product {
  id: string;
  title: string;
  edition?: string | null;
  type: "Game" | "DLC" | "Edition" | "Software" | "Gift Card";
  preorder?: boolean;
  description?: string;
  cover: string;
  coverPosition?: string | null;
  platform: Platform;
  region: Region;
  price: number;
  oldPrice: number;
  cashback?: number | null;
  claimed?: number | null;
  featuredOfferId?: number | null;
  featuredOffer?: Offer | null;
  otherOffers?: Offer[];
}

export const fmt = (n: number) => `€${Number(n).toFixed(2)}`;
export const discount = (p: Product) => Math.round((1 - p.price / p.oldPrice) * 100);
export const isGame = (p: Product) => p.type !== "Software" && p.type !== "Gift Card";
export const CHEAP_MAX = 20;
export const GTA6_ID = "gta6-ps";
export const MATCH = 0.68;

export const inCategory = (p: Product, c: Category) =>
    c === "software" ? p.type === "Software" : c === "giftcards" ? p.type === "Gift Card" : isGame(p);

export const platformLabel: Record<Platform, string> = {
  Steam: "Steam",
  PS5: "PlayStation 5",
  Xbox: "Xbox Series X|S",
  Switch: "Nintendo Switch",
  PC: "Windows PC",
};

function lev(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

export function tokenSim(q: string, t: string) {
  if (!q || !t) return 0;
  if (t.startsWith(q)) return 1;
  const prefix = t.slice(0, q.length);
  const full = 1 - lev(q, t) / Math.max(q.length, t.length);
  const pre = 1 - lev(q, prefix) / Math.max(q.length, prefix.length);
  return Math.max(full, q.length >= 4 ? pre : 0);
}

export function reviewOf(p: Product) {
  const h = [...p.id].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  const score = 8.4 + (h % 15) / 10;
  return {
    score: score.toFixed(1),
    label: score >= 9 ? "Overwhelmingly Positive" : "Very Positive",
    count: `${(4 + (h % 38) / 2).toFixed(1)}k reviews`,
  };
}

// Compatibility fallbacks for any untouched UI subcomponents
export const bestSellers: Product[] = [];
export const flashDeals: Product[] = [];
export const searchCatalog: Product[] = [];
export const storeCatalog: Product[] = [];
export const findProduct = (_id: string): Product | undefined => undefined;
export const descriptionOf = (p: Product) => p.description ?? "";
export const sellersFor = (p: Product) => ({
  featured: p.featuredOffer ?? { id: 1, seller: "StarKeys Official", price: p.price, rating: "99.8", sales: "42k sales", hue: 48 },
  others: p.otherOffers ?? [],
});
export const fuzzySearch = (_q: string) => ({ results: [] as Product[], corrected: "" });