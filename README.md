---
# Crypto Dashboard Web App

This is a Next.js project built with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app), TypeScript, and Tailwind CSS. The app is a cryptocurrency dashboard that allows users to search and view detailed information about cryptocurrencies. It supports dynamic currency conversion and includes a provider‑switching architecture.

> **Note:** In this deployed version, only CoinMarketCap is fully implemented because I was unable to obtain API keys for CoinPaprika and CoinGecko. The other providers are available as placeholders in the code and can be enabled by providing the proper API keys and implementing the required API calls.
---

## Features

- **Top 50 Cryptocurrency Listings**  
  The home page displays a table of the top 50 cryptocurrencies (by market cap) including:
  - **Coin name and symbol**
  - **Current price** – formatted to show values in the nearest Trillion, Billion, Million, or Thousand (e.g., 7,25B).
  - **Market Cap**
  - **24h Price Change Percentage**

- **Coin Detail View**  
  Clicking on a coin navigates to a detailed page that shows:
  - Extended coin information including the description, launched date, and other relevant links (e.g. Website, Reddit, GitHub, etc.).
  - The coin is automatically added to a "recently viewed" list.

- **Dynamic Currency Support**  
  A dropdown allows users to switch between supported fiat currencies (USD, EUR, CHF, GBP, INR), updating all coin prices on the fly.

- **Provider Switching**  
  The app supports a provider abstraction:
  - **CoinMarketCap (default)** – Fully implemented for live data.
  - **CoinPaprika and CoinGecko** – Placeholder methods are in place; these can be enabled by providing API keys and implementing the required API calls.
  - The ProviderSelector component has been updated to use a common, consistently styled dropdown.

- **Advanced Sorting Options**  
  - **Desktop Table:** Clickable table headers enable sorting by Coin Name, Price, Market Cap, and 24h Change. An arrow icon (▲/▼) indicates the sort direction.  
  - **Mobile View:** On mobile, a card list view is used; sorting options are shown separately in a modern dropdown with a toggle button.

- **Search with Debounced Suggestions**  
  A search bar with real‑time suggestions (using a debouncing mechanism) lets users quickly filter the coin list.
  - Clicking a suggestion shows only that coin; otherwise, all matching coins are listed.

- **Recent Coins Section**  
  A horizontally wrapping "Recently Viewed Coins" card near the top of the home page allows quick navigation back to coins that were viewed recently.

- **Refresh Button**  
  A refresh button is built into the Navbar. When clicked, it clears cached data and revalidates the coin list—showing an animated skeleton loader while new data is fetched.

- **Error Handling with Detailed Messages**  
  If an API error occurs (for example, exceeding CoinMarketCap’s rate limit), an error card is displayed with the exact error message and a Retry button.

- **Minimalistic Styling & Modular Design**  
  - The page has been broken into smaller, reusable components (e.g., Navbar, CoinTable, CoinCardList, CoinFilterControls, MobileSortControl) to improve maintainability.
  - The UI is fully responsive. On mobile devices, a dedicated card list view replaces the table view, and sort controls appear separately from the table header.

---

## Project Structure

```
/crypto-dashboard-app
├─ app/
│   ├─ api/
│   │   ├─ coins/
│   │   │   ├─ route.ts          // Listing endpoint (uses provider switching)
│   │   │   └─ [id]/
│   │   │         └─ route.ts    // Coin detail endpoint
│   ├─ coin/
│   │   └─ [id]/
│   │         └─ page.tsx       // Detailed coin page
│   └─ page.tsx                // Home/Listing page
├─ components/
│   ├─ Navbar.tsx              // Navbar with search, refresh, & suggestions
│   ├─ ProviderSelector.tsx    // Provider switching using a common select component
│   ├─ RecentCoins.tsx         // Recently viewed coins card
│   ├─ ErrorCard.tsx           // Error card with clear retry messaging
│   ├─ CommonSelect.tsx        // Reusable dropdown component
│   ├─ CoinTable.tsx           // Desktop table view of coins 
│   ├─ CoinCardList.tsx        // Mobile card view for coins
│   ├─ MobileSortControl.tsx   // Mobile sorting controls
│   └─ CoinFilterControls.tsx  // Currency and provider selectors
├─ context/
│   └─ CurrencyContext.tsx     // Global currency state management
├─ lib/
│   └─ providers/
│       ├─ coinMarketCap.ts    // CoinMarketCap API methods (fully implemented)
│       ├─ coinPaprika.ts      // CoinPaprika API methods (placeholder/dummy)
│       ├─ coinGecko.ts        // CoinGecko API methods (placeholder/dummy)
│       └─ transformer.ts      // Provider abstraction: routes API calls by provider
├─ types/
│   └─ coins.ts                // StandardCoinData and CoinDetailData interface definitions
├─ .env.local                // Environment variables: API keys and base URLs
├─ README.md
├─ tsconfig.json
└─ package.json
```

---

## Getting Started

1. **Install dependencies and start the development server:**

   ```bash
   npm install
   npm run dev
   # or
   yarn install
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

---

## Environment Variables

Create an **.env.local** file in the project root with your API keys and base URLs:

```env
# CoinMarketCap (Default Provider)
COINMARKETCAP_BASE_URL=https://pro-api.coinmarketcap.com/v1
COINMARKETCAP_API_KEY=YOUR_COINMARKETCAP_API_KEY

# CoinGecko / CoinPaprika (Placeholders)
COINGECKO_BASE_URL=https://api.coingecko.com/api/v3
COINGECKO_API_KEY=YOUR_COINGECKO_API_KEY
```

**Note:** Currently, only CoinMarketCap is active. API keys for CoinPaprika and CoinGecko are placeholders and can be enabled by providing the proper keys and API implementations.

---

## Switching API Providers

The app uses a provider transformer (in `lib/providers/transformer.ts`) to choose the API based on the selected provider. In the UI, the **ProviderSelector** component (in `components/ProviderSelector.tsx`) has a list of provided. Only CoinMarketCap is enabled by default; the other options are currently disabled. Once you have valid API keys and implementations for the other providers, simply remove the `disabled` attribute in for that provider.

```tsx
const providerOptions: Option[] = [
  { value: "coinmarketcap", label: "CoinMarketCap" },
  { value: "coinpaprika", label: "CoinPaprika", disabled: true },
  { value: "coingecko", label: "CoinGecko", disabled: true },
];
```

---

## Application Behavior

- **Rate Limit Errors:**  
  If WE exceed CoinMarketCap’s API rate limit, the error message (e.g., “You've exceeded your API Key's HTTP request rate limit. Rate limits reset every minute.”) is captured and displayed in an error card with a Retry button.

- **Sorting:**  
  Click on the table headers to sort the data by coin name, price, market cap, or 24h change. An arrow (▲ or ▼) appears next to the header to indicate sort direction. The default sort is by **marketCap** (descending by default, but we can change the default in the code).

- **Search:**  
  The search bar supports debounced suggestions. Type a coin name or symbol to filter the listing. If a suggestion is clicked, only that coin will be shown; otherwise, all matching coins appear.

- **Recent Coins:**  
  Most recently viewed coins are tracked (using localStorage) and displayed in a horizontal card near the top of the home page, providing quick access to coins you have looked at previously.

- **Refresh Button:**  
  The Navbar includes a refresh button. Clicking it clears the cached data and forces SWR to revalidate the coin list—displaying an animated skeleton loader while new data loads.

---

## Summary

Key features:

- **Search with debounced suggestions**
- **Caching to show coins viewed once, very quickly the next time**
- **Detailed coin views**
- **Dynamic currency switching**
- **Client‑side sorting on each column**
- **Recent coins section on top**
- **Refresh functionality**
- **Error handling and rate limit messages**
- **Provider‑switching architecture** (currently, only CoinMarketCap is active)

Future improvements could include implementing the API calls for CoinPaprika and CoinGecko.

--
