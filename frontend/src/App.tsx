import { useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { BestSellers, FlashDeals } from "./components/Sections";
import { StorePage } from "./components/StorePage";
import { ProductPage } from "./components/ProductPage";
import { AuthPage } from "./components/AuthPage";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutPage } from "./components/CheckoutPage";
import { OrderCompletePage, OrdersPage } from "./components/OrderPages";
import { authHref, navigate, useRoute } from "./router";
import { ShopProvider, useShop } from "./shop";
import { I18nProvider } from "./i18n";

export default function App() {
    return (
        <I18nProvider>
            <ShopProvider>
                <Shell />
            </ShopProvider>
        </I18nProvider>
    );
}

const PROTECTED = { checkout: "checkout", orders: "orders", order: "orders" } as const;

function Shell() {
    const { user, add } = useShop();
    const route = useRoute();
    const gate =
        route.name in PROTECTED && !user ? PROTECTED[route.name as keyof typeof PROTECTED] : null;

    useEffect(() => {
        if (gate) navigate(authHref(gate));
    }, [gate]);

    return (
        <div className="relative isolate min-h-screen min-w-[1280px] overflow-x-clip">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1400px] bg-[radial-gradient(45%_40%_at_75%_12%,rgb(157_37_216/0.15),transparent_70%),radial-gradient(55%_45%_at_15%_20%,rgb(78_27_217/0.4),transparent_70%),radial-gradient(70%_50%_at_50%_60%,rgb(36_11_82/0.9),transparent_75%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-[1500px] -z-10 h-[1200px] bg-[radial-gradient(50%_45%_at_85%_50%,rgb(78_27_217/0.3),transparent_70%),radial-gradient(40%_40%_at_10%_70%,rgb(157_37_216/0.15),transparent_70%)]" />

            <Header route={route} />
            <CartDrawer />

            <main className="mx-auto flex max-w-[1400px] flex-col gap-20 px-8 pt-8 pb-28">
                {gate ? null : route.name === "store" ? (
                    <StorePage key={route.cat} cat={route.cat} onAdd={add} />
                ) : route.name === "product" ? (
                    <ProductPage key={route.id} productId={route.id} onAdd={add} />
                ) : route.name === "auth" ? (
                    <AuthPage key={route.next ?? ""} next={route.next} />
                ) : route.name === "checkout" ? (
                    <CheckoutPage />
                ) : route.name === "order" ? (
                    <OrderCompletePage id={route.id} />
                ) : route.name === "orders" ? (
                    <OrdersPage />
                ) : (
                    <>
                        <Hero onBuy={add} />
                        <BestSellers onAdd={add} />
                        <FlashDeals onAdd={add} />
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}