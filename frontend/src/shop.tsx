import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiFetch } from "./api";
import type { Offer, Product } from "./data";

export interface CartItem {
  key: string;
  offerId: number;
  product: Product;
  seller: string;
  price: number;
  qty: number;
}
export type PayMethod = "card" | "apple" | "crypto";
export interface OrderLine {
  product: Product;
  seller: string;
  price: number;
  qty: number;
  keys: string[];
}
export interface Order {
  id: string;
  date: string;
  method: PayMethod;
  lines: OrderLine[];
  total: number;
}
export interface User {
  id: number;
  username: string;
  email: string;
}

const LS = { cart: "eneba.cart", user: "eneba.user", token: "eneba.token" };
const load = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const save = (k: string, v: unknown) => {
  try {
    if (v == null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const roundEUR = (n: number) => Math.round(n * 100) / 100;
const linesTotal = (l: { price: number; qty: number }[]) =>
    roundEUR(l.reduce((s, i) => s + i.price * i.qty, 0));

interface Shop {
  cart: CartItem[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  add: (p: Product, offer?: Offer) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  user: User | null;
  authenticate: (mode: "signin" | "register" | "demo", email?: string, password?: string) => Promise<void>;
  signOut: () => void;
  orders: Order[];
  placeOrder: (method: PayMethod) => Promise<Order | null>;
}

const Ctx = createContext<Shop | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() =>
      load<CartItem[]>(LS.cart, []).filter((i) => i && typeof i.offerId === "number" && i.product),
  );
  const [user, setUser] = useState<User | null>(() => {
    const u = load<User | null>(LS.user, null);
    return u && (typeof u.username === "string" || typeof u.email === "string") && localStorage.getItem(LS.token)
        ? u
        : null;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => save(LS.cart, cart), [cart]);
  useEffect(() => save(LS.user, user), [user]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }
    apiFetch<Order[]>("/orders")
        .then(setOrders)
        .catch(() => {
          localStorage.removeItem(LS.token);
          setUser(null);
          setOrders([]);
        });
  }, [user]);

  const add = useCallback((p: Product, offer?: Offer) => {
    const offerId = offer?.id ?? p.featuredOffer?.id ?? p.featuredOfferId ?? 1;
    const seller = offer?.seller ?? p.featuredOffer?.seller ?? "StarKeys Official";
    const price = offer?.price ?? p.price;
    const key = `${p.id}|${offerId}`;
    setCart((c) => {
      const hit = c.find((i) => i.key === key);
      return hit
          ? c.map((i) => (i.key === key ? { ...i, qty: Math.min(i.qty + 1, 10) } : i))
          : [...c, { key, offerId, product: p, seller, price, qty: 1 }];
    });
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((c) =>
        qty < 1
            ? c.filter((i) => i.key !== key)
            : c.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, 10) } : i)),
    );
  }, []);

  const remove = useCallback((key: string) => setCart((c) => c.filter((i) => i.key !== key)), []);

  const authenticate = useCallback(
      async (mode: "signin" | "register" | "demo", email = "", password = "") => {
        const endpoint =
            mode === "demo" ? "/auth/demo" : mode === "register" ? "/auth/register" : "/auth/login";
        const res = await apiFetch<{ token: string; user: User }>(endpoint, {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem(LS.token, res.token);
        setUser(res.user);
      },
      [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(LS.token);
    setUser(null);
    setOrders([]);
  }, []);

  const placeOrder = useCallback(
      async (method: PayMethod): Promise<Order | null> => {
        if (!user || cart.length === 0) return null;
        const order = await apiFetch<Order>("/checkout", {
          method: "POST",
          body: JSON.stringify({
            method,
            items: cart.map((i) => ({ offer_id: i.offerId, qty: i.qty })),
          }),
        });
        setOrders((prev) => [order, ...prev]);
        setCart([]);
        return order;
      },
      [user, cart],
  );

  return (
      <Ctx.Provider
          value={{
            cart,
            count: cart.reduce((s, i) => s + i.qty, 0),
            subtotal: linesTotal(cart),
            drawerOpen,
            setDrawerOpen,
            add,
            setQty,
            remove,
            user,
            authenticate,
            signOut,
            orders,
            placeOrder,
          }}
      >
        {children}
      </Ctx.Provider>
  );
}

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShop must be used inside ShopProvider");
  return v;
}