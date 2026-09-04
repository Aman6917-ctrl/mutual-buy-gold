# Corpus

React frontend for a fund-backed EMI shopping app. Shoppers pick a phone, choose a variant and EMI plan, then confirm the plan. Product names, prices, images, and EMI data come from the backend API and MongoDB — nothing is hardcoded in the UI.

## Stack

- React 19
- TanStack Start / Router / Query
- Tailwind CSS
- Vite

## Setup

Node 22 (`nvm use` if you have [nvm](https://github.com/nvm-sh/nvm)).

```bash
git clone https://github.com/Aman6917-ctrl/mutual-buy-gold.git
cd mutual-buy-gold
npm install
cp .env.example .env
```

`.env`:

```env
VITE_API_BASE=http://localhost:5001/api
```

Point `VITE_API_BASE` at the deployed API when you ship the frontend.

```bash
npm run dev
```

App runs at [http://localhost:8080](http://localhost:8080). The Express API must be running (default `http://localhost:5001`).

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — deals strip, hero tiles, catalogue |
| `/products/:slug` | Product detail — variants, EMI plans, confirmation |

## API used

Configured via `VITE_API_BASE`:

- `GET /products` — catalogue (slug, name, brand, thumbnail, startingPrice, placement)
- `GET /products/deals` — Great Deals carousel
- `GET /products/:slug` — variants, images, nested EMI plans

Backend repo: [1Fi-Assignment](https://github.com/Aman6917-ctrl/1Fi-Assignment).

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the build |
| `npm run lint` | ESLint |
