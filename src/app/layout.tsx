import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.scss";
import Navbar from "@/components/Navbar/Navbar";
import Sitebar from "@/components/Sitebar/Sitebar.components";
import Footer from "@/components/Footer/Footer.components";
import Provider from "@/components/Helps/Provider";
import React from "react";
import { Toaster } from "react-hot-toast";
import { GlobalContextProvider } from "@/components/Helps/GlobalBasket";
import { CustomProvider } from "rsuite";
const montserrat = Montserrat({ subsets: ["latin"] });
import "primeicons/primeicons.css";
import ru_RU from "rsuite/locales/ru_RU";

export const metadata: Metadata = {
    title: "Quick Shop",
    description:
        "Лучший маркетплейс, который предлагает широкий ассортимент продуктов и товаров, быструю доставку и удобную систему оплаты, а также возможность стать продавцом.",
    icons: {
        icon: "/qs.svg",
    },
    robots: "index, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={montserrat.className}>
                <GlobalContextProvider>
                    <CustomProvider locale={ru_RU}>
                        <Provider>
                            <Toaster position="bottom-right" reverseOrder={false} />
                            <header>
                                <Navbar />
                            </header>
                            {/* Сменил justify-between на justify-center */}
                            <main className="flex justify-center">
                                {/* <Sitebar/> */}
                                {children}
                            </main>
                            <Footer />
                        </Provider>
                    </CustomProvider>
                </GlobalContextProvider>
            </body>
        </html>
    );
}
