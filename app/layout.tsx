import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description:
    "Browse the top cryptocurrencies by market cap—live prices, sorting, filtering, and detailed views.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
