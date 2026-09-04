# 1Fi SDE1 Assignment

Corpus is a full-stack EMI shopping app (Snapmint-style): shoppers pick a smartphone, choose a variant and a mutual-fund-backed EMI plan, then confirm. Product names, variants, MRP, selling price, images, interest, cashback, and monthly amounts all come from MongoDB through the Express API. The React UI only renders that response.

**Backend:** [github.com/Aman6917-ctrl/1Fi-Assignment](https://github.com/Aman6917-ctrl/1Fi-Assignment)  
**Frontend:** [github.com/Aman6917-ctrl/mutual-buy-gold](https://github.com/Aman6917-ctrl/mutual-buy-gold)

## Features

- Unique product URLs (`/products/iphone-17-pro`, `/products/samsung-galaxy-s24-ultra`, …)
- 8 phones, each with at least 2 variants and 5 EMI tenures
- Great Deals carousel, hero tiles, and catalogue from API `placement`
- Variant switch updates image, MRP, price, and EMI rows
- Best Value badge from total payable (then 0% interest, then longer tenure)
- Proceed + confirmation (product, variant, monthly amount, tenure, interest, cashback, total)
- Studio product photos served by the API, not placeholders

## Tech stack

- React, Vite, Tailwind CSS, TanStack Start / Router / Query
- Node.js, Express, MongoDB, Mongoose
- Render (API), Vercel (frontend)

## Architecture

```
React (Vercel)
  → GET https://<api>/api/products[/:slug|/deals]
Express
  → MongoDB (Product + EMIPlan)
  → GET /images/<file>.jpg  (static studio JPGs)
```

Studio JPG → `Backend/public/images/` → MongoDB `variants[].images` → API JSON → React `<img>`.

## Repositories / folders

| Path | Role |
| --- | --- |
| `mutual-buy-gold/` | This frontend |
| `Backend/` | Express API, Mongoose models, seed, image files |

Frontend layout: `src/routes/` (pages), `src/components/` (UI), `src/lib/api.ts` (API client).

## Local setup

Need Node 22 for the frontend (`nvm use` if you use nvm).

### Backend

```bash
cd Backend
npm install
cp .env.example .env
```

`.env` (never commit this file):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/emi_products
PORT=5001
IMAGE_BASE_URL=http://localhost:5001
```

```bash
npm run seed
npm start
```

`npm run seed` **clears** Product and EMIPlan, then inserts sample data. Run it only by hand. Do not add it to Render Pre-Deploy.

If production still has `http://localhost:5001/images/...` in MongoDB, rewrite hosts without wiping data:

```bash
IMAGE_BASE_URL=https://onefi-assignment-nzq0.onrender.com npm run migrate:images
```

### Frontend

```bash
cd mutual-buy-gold
npm install
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5001
```

(`VITE_API_BASE=http://localhost:5001/api` still works.)

```bash
npm run dev
```

UI: [http://localhost:8080](http://localhost:8080)  
API: [http://localhost:5001](http://localhost:5001)

## Environment variables

**Backend**

| Name | Purpose |
| --- | --- |
| `MONGODB_URI` | Atlas or local Mongo connection |
| `PORT` | HTTP port (Render sets this) |
| `IMAGE_BASE_URL` | Public origin for `/images/...` (no trailing slash) |

**Frontend**

| Name | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API origin, e.g. `http://localhost:5001` or `https://onefi-assignment-nzq0.onrender.com` |

Production frontend builds fall back to the Render API if the env var is missing. `.env` is gitignored.

## Database

### Product

| Field | Type | Notes |
| --- | --- | --- |
| `slug` | String | Unique URL key |
| `name`, `brand` | String | Display |
| `placement` | `deals` \| `hero` \| `catalogue` | Homepage section |
| `dealTag` | String | Great Deals label |
| `variants[]` | Array | At least **two** variants |

### Variant (embedded)

`variantId`, `label`, `mrp`, `price`, `images[]` (absolute URLs).

### EMIPlan (separate collection)

`productSlug` + `variantId` + `tenureMonths` (unique). Fields: `monthlyAmount`, `interestRate`, `cashback`.

Relationship: one Product has many variants; each variant has many EMIPlan rows joined on slug + variantId.

**EMI math (seed):** 3/6/12/24 months at 0% (`price / tenure`); 36 months at 10.5% reducing-balance EMI.

## Image architecture

1. Files live in `Backend/public/images/` (e.g. `iphone-17-pro-silver.jpg`).
2. Express serves `GET /images/<filename>`.
3. Seed writes `${IMAGE_BASE_URL}/images/<filename>` into MongoDB.
4. APIs return those URLs (localhost hosts are rewritten to the public origin).
5. React uses `thumbnail` / `variant.images[0]` from the API.

No Picsum. No frontend product-image lookup table.

## API

Production base: `https://onefi-assignment-nzq0.onrender.com`  
Local base: `http://localhost:5001`

Also: `GET /health` → `{ "status": "ok" }`.

### `GET /api/products`

Catalogue list.

```json
[
  {
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "thumbnail": "https://onefi-assignment-nzq0.onrender.com/images/iphone-17-pro-silver.jpg",
    "startingPrice": 127400,
    "startingEmi": 5308,
    "placement": "deals"
  }
]
```

### `GET /api/products/deals`

Great Deals (`placement: "deals"`). Registered before `/:slug`.

```json
[
  {
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "thumbnail": "https://onefi-assignment-nzq0.onrender.com/images/iphone-17-pro-silver.jpg",
    "startingPrice": 127400,
    "mrp": 134900,
    "discountPercent": 6,
    "dealTag": "Best Seller"
  }
]
```

### `GET /api/products/:slug`

Full product. `404` if the slug is unknown.

```json
{
  "slug": "iphone-17-pro",
  "name": "iPhone 17 Pro",
  "brand": "Apple",
  "variants": [
    {
      "variantId": "256gb-silver",
      "label": "256GB, Silver",
      "mrp": 134900,
      "price": 127400,
      "images": ["https://onefi-assignment-nzq0.onrender.com/images/iphone-17-pro-silver.jpg"],
      "emiPlans": [
        { "tenureMonths": 3, "monthlyAmount": 42467, "interestRate": 0, "cashback": 1000 },
        { "tenureMonths": 6, "monthlyAmount": 21233, "interestRate": 0, "cashback": 2000 },
        { "tenureMonths": 12, "monthlyAmount": 10617, "interestRate": 0, "cashback": 3500 },
        { "tenureMonths": 24, "monthlyAmount": 5308, "interestRate": 0, "cashback": 5000 },
        { "tenureMonths": 36, "monthlyAmount": 4141, "interestRate": 10.5, "cashback": 7500 }
      ]
    }
  ]
}
```

## Deployment

### Backend (Render) — already live

[https://onefi-assignment-nzq0.onrender.com](https://onefi-assignment-nzq0.onrender.com)

Env: `MONGODB_URI`, `IMAGE_BASE_URL=https://onefi-assignment-nzq0.onrender.com`. Start: `npm start`. **Do not** set Pre-Deploy to `npm run seed`. After a deploy that still has localhost image URLs in Mongo, run once in Render Shell: `npm run migrate:images`.

### Frontend (Vercel) — MANUAL

1. Import `Aman6917-ctrl/mutual-buy-gold`.
2. Framework: Vite. Build `npm run build`, output as detected (TanStack Start / Nitro).
3. Env: `VITE_API_BASE_URL=https://onefi-assignment-nzq0.onrender.com`
4. `vercel.json` rewrites unknown paths so `/products/:slug` works on refresh.
5. Put the live URL here after first deploy: **`https://<your-app>.vercel.app`**

## Assignment checklist

- [x] React + Tailwind product UI
- [x] Name, variant, MRP, price, image
- [x] EMI: monthly, tenure, interest, cashback, selectable + Proceed
- [x] Unique `/products/:slug` URLs
- [x] ≥ 3 products, ≥ 2 variants each (8 × 2)
- [x] Express + MongoDB, data not hardcoded in the UI
- [x] Schema + seed + README + API examples in GitHub
- [ ] Deployed frontend URL (Vercel)
- [ ] 2–5 min demo video (`DEMO_SCRIPT.md`)
- [ ] Google Form

## Demo script

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md).
