"use client";
import { createContext, useState, useContext, ReactNode } from "react";

const CurrencyContext = createContext<{
  currency: string;
  setCurrency: (cur: string) => void;
}>({ currency: "USD", setCurrency: () => {} });

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState("USD");
  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
