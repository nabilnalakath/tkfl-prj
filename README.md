---
# Crypto Dashboard Web App

This is a Next.js project built with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app), TypeScript, and Tailwind CSS. The app is a cryptocurrency dashboard that allows users to search and view detailed information about cryptocurrencies. It supports dynamic currency conversion and includes a provider‑switching architecture.

> **Note:** In this deployed version, only CoinMarketCap is fully implemented because I was unable to obtain API keys for CoinPaprika and CoinGecko. The other providers are available as placeholders in the code and can be enabled by providing the proper API keys and implementing the required API calls.
---

## Features

- **Top 50 Cryptocurrency Listings**  
  The home page displays a table of the top 50 cryptocurrencies (by market cap) including:

  - **Coin name and symbol**
  - **Current price** (by default in USD; currency can be switched)
  - **Market Cap**
  - **24h Price Change Percentage**

- **Coin Detail View**  
  Clicking a coin navigates to a detailed page that shows:

  - Extended coin information (price, market cap, 24h change, description, etc.)
  - The coin is automatically added to the "recently viewed" list

- **Dynamic Currency Support**  
  A dropdown allows users to switch between supported fiat currencies (USD, EUR, CHF, GBP, INR), updating all coin prices on the fly.

- **Search with Suggestions**  
  A search bar with real‑time suggestions (using a debouncing mechanism) lets users quickly filter the coin list.

  - Clicking a suggestion shows only that coin; otherwise, all matching coins are listed.

- **Sorting for Each Column**  
  Clickable table headers enable sorting by:

  - **Coin Name** (click only on the "Coin" column—row numbers remain static)
  - **Price**
  - **Market Cap**
  - **24h Change**  
    The default sort is by **Price** (ascending by default), and clicking a header toggles the sort direction, displaying a small arrow (▲ for ascending, ▼ for descending).

- **Recent Coins Section**  
  A horizontally scrolling (wrapping if needed) "Recently Viewed Coins" card is displayed near the top of the page, allowing quick navigation to coins that were viewed recently.

- **Refresh Button**  
  A refresh button is built into the Navbar. When clicked, it clears the current cached data and revalidates the coin list—showing a skeleton loader while new data is fetched.

- **Skeleton Loader Animation**  
  While data loads (or during a refresh), animated skeleton rows (using Tailwind’s `animate-pulse` class) are displayed to give users a smooth loading experience.

- **Error Handling with Detailed Messages**  
  If an API error occurs (for example, if CoinMarketCap returns a rate‑limit error), a nicely styled error card is displayed with the exact error message (e.g. "You've exceeded your API Key's HTTP request rate limit. Rate limits reset every minute.") along with a Retry button.

- **Provider Switching**  
  The app supports a provider abstraction:

  - **CoinMarketCap (default)** – Fully implemented for live data.
  - **CoinPaprika and CoinGecko** – Placeholder methods are in place; these can be enabled by implementing the proper API calls and adding API keys in your environment.

  Use the Provider Selector dropdown (in `components/ProviderSelector.tsx`) to switch the active provider (currently, only CoinMarketCap is enabled).

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
│   │         └─ page.tsx       // Detailed coin page (client component)
│   └─ page.tsx                // Home/Listing page (client component)
├─ components/
│   ├─ Navbar.tsx              // Search bar with suggestions + refresh button
│   ├─ ProviderSelector.tsx    // Provider switching dropdown
│   ├─ RecentCoins.tsx         // Recently viewed coins card (horizontal, wraps)
│   └─ ErrorCard.tsx           // Common error card component
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

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app in action.

---

## Environment Variables

Create an **.env.local** file in the project root with your API keys and base URLs:

```env
# CoinMarketCap (Default Provider)
COINMARKETCAP_BASE_URL=https://pro-api.coinmarketcap.com/v1
COINMARKETCAP_API_KEY=OUR_COINMARKETCAP_API_KEY

# COINGECKO API (or alternative providers; used as placeholders)
COINGECKO_BASE_URL=https://api.freecryptoapi.com/v1
COINGECKO_API_KEY=OUR_COINGECKO_CRYPTO_API_KEY
```

**Note:** Currently, only CoinMarketCap is active. API keys for CoinPaprika and CoinGecko were not implemented as I could not get valid keys. Their functionality can be enabled later by updating the API calls in `lib/providers/coinPaprika.ts` and `lib/providers/coinGecko.ts`.

---

## Switching API Providers

The app uses a provider transformer (in `lib/providers/transformer.ts`) to choose the API based on the selected provider. In the UI, the **ProviderSelector** component (in `components/ProviderSelector.tsx`) shows a dropdown. Only CoinMarketCap is enabled by default; the other options are currently disabled. Once you have valid API keys and implementations for the other providers, simply remove the `disabled` attribute in that component.

```tsx
<select
  value={provider}
  onChange={handleChange}
  className="px-2 py-1 border rounded"
>
  <option value="coinmarketcap">CoinMarketCap</option>
  <option value="coinpaprika" disabled>
    CoinPaprika
  </option>
  <option value="coingecko" disabled>
    CoinGecko
  </option>
</select>
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
- **Detailed coin views**
- **Dynamic currency switching**
- **Client‑side sorting on each column**
- **Recent coins section on top**
- **Refresh functionality**
- **Error handling and rate limit messages**
- **Provider‑switching architecture** (currently, only CoinMarketCap is active)

Future improvements could include implementing the API calls for CoinPaprika and CoinGecko.

--
