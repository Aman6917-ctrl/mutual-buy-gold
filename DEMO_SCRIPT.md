# Demo script (2–5 minutes)

Talk to the camera or share the screen. Keep a browser tab on the live site, one on the API, and Compass/Atlas open.

### 0:00–0:20 — Intro

“This is Corpus, a 1Fi assignment: buy phones on EMI backed by mutual funds. React frontend, Express API, MongoDB. Nothing product-related is hardcoded in the UI.”

### 0:20–1:20 — Home

Open the deployed frontend (or `http://localhost:8080`).

- Scroll **Great Deals** (API `/api/products/deals`).
- Click a card — it should open `/products/...`.
- Go back. Show hero phones and catalogue. Mention they load from `/api/products` with `placement`.

### 1:20–2:10 — Product URL + variants

Open `/products/iphone-17-pro` (refresh the URL so they see it is a real route).

- Name, brand, image, MRP, selling price.
- Switch Silver → Orange: image and (if different) price/EMI update. Same for Galaxy colour/storage.

### 2:10–2:50 — EMI + proceed

- Point at monthly amount, tenure, interest, cashback.
- Mention **Best Value** is the lowest total payable, not a hardcoded 24-month plan.
- Select a plan → **Proceed with this plan** → confirmation (product, variant, monthly, tenure, interest, cashback, total).

### 2:50–3:30 — API

Browser or Postman:

- `GET https://onefi-assignment-nzq0.onrender.com/api/products`
- `GET .../api/products/iphone-17-pro`
- Optional: `GET .../api/products/deals` and `GET .../images/iphone-17-pro-silver.jpg`

### 3:30–4:00 — Database

Atlas or Compass: `products` (slug, variants, image URLs) and `emiplans` (tenure, monthlyAmount, interestRate, cashback). Same numbers as the UI.

### 4:00–4:30 — Architecture

“React talks only to Express. Express reads Mongo. Photos are files on the server, URLs stored in Mongo, returned by the API.” Stop. Do not go past 5:00.
