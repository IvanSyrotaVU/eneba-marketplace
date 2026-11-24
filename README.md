# Eneba Digital Marketplace Clone

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-8.1%2B-777BB4?logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8%2B-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)

A full-stack digital game key, software license, and gift card marketplace built with **React + TypeScript (Vite)** and a modular **PHP 8 + MySQL** REST API.

Every homepage block, catalog filter, multi-seller offer comparison, typo-tolerant search query, authentication session, and checkout order is dynamically served from MySQL—zero catalog data is hardcoded on the frontend.

---

## Project Architecture

```text
eneba-marketplace/
├── backend/
│   ├── public/
│   │   └── index.php            # Front-controller router, JSON responses & CORS middleware
│   ├── src/
│   │   ├── Database.php         # PDO MySQL singleton with automatic schema.sql bootstrap
│   │   ├── Auth.php             # HMAC-SHA256 bearer token auth & password verification
│   │   ├── HomepageService.php  # Modular endpoints per homepage block
│   │   ├── ProductService.php   # Filtering, sorting, multi-seller offers & fuzzy search
│   │   └── OrderService.php     # Transactional checkout & digital key generation
│   └── schema.sql               # Relational schema & 35-product / 116-offer seed dataset
├── frontend/
│   ├── public/img/              # Brand logo & promotional cover artwork
│   ├── src/
│   │   ├── api.ts               # Authenticated fetch client & media normalizer
│   │   ├── shop.tsx             # Global cart, auth session & order state context
│   │   ├── data.ts              # Shared TypeScript models & formatting utilities
│   │   ├── router.ts            # Hash-based client router with protected routes
│   │   └── components/          # Hero, Sections, StorePage, ProductPage, CheckoutPage, Orders
│   └── start-dev.mjs            # Concurrent launcher for PHP API (:8000) & Vite (:8443)
├── package.json                 # Root setup & start scripts
└── README.md
```

---

## REST API & Core Features

| Module | Endpoint | Description |
| :--- | :--- | :--- |
| **Modular Homepage** | `GET /api/homepage/hero`<br>`GET /api/homepage/bestsellers`<br>`GET /api/homepage/deals` | Dedicated backend service endpoints per homepage section (*Ghostrunner 2* hero banner, *Up Next* queue, *Best Sellers*, and *Flash Deals*). |
| **Catalog Filtering** | `GET /api/products` | Server-side filtering by category (`all`, `cheap`, `software`, `giftcards`), platform (`Steam`, `PS5`, `Xbox`, `Switch`, `PC`), region (`GLOBAL`, `EUROPE`, `US`), price range, and sort order. |
| **Fuzzy Search** | `GET /api/search?q=...` | Server-side Levenshtein similarity matching with automatic *"Showing matches for..."* spelling corrections and highlighted token matches. |
| **Seller Comparison** | `GET /api/products/:id` | Returns product details alongside competing seller offers, ratings, completed sales counts, and live stock. |
| **Authentication** | `POST /api/auth/login`<br>`POST /api/auth/register`<br>`POST /api/auth/demo` | Issues signed bearer tokens for registered accounts or one-click sandbox demo access. |
| **Checkout & Orders** | `POST /api/checkout`<br>`GET /api/orders` | Executes MySQL transactions with `FOR UPDATE` row locking to decrement stock, generate `XXXXX-XXXXX-XXXXX` activation keys, and persist order receipts. |

---

## Quick Start

### Prerequisites
- **PHP 8.1+** with `pdo_mysql` enabled (XAMPP, Laragon, or standalone PHP CLI)
- **MySQL 8+** / MariaDB running locally on `127.0.0.1:3306` *(defaults to user `root` with an empty password; override via `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS` if needed)*
- **Node.js 18+** and `npm`

### 1. Install Dependencies
```bash
npm run setup
```

### 2. Launch Full Stack (API + Frontend)
```bash
npm start
```
This single command starts the **PHP + MySQL REST API** on `http://localhost:8000` and the **Vite dev server** on `http://localhost:8443`.

> **Automatic Database Provisioning:** On the first API request, `Database.php` automatically creates the `eneba_clone` database and imports `backend/schema.sql` if it does not already exist.

Open **`http://localhost:8443/`** in your browser.

---

## Demo Account & Tester Checklist

- **Email:** `demo@eneba.gg`
- **Password:** `demo1234` *(or click **Instant Demo Account** on the Sign In page)*

1. **Modular Homepage:** Confirm the Hero banner, *Up Next* widget, *Best Sellers* carousel, and *Flash Deals* section load dynamically from MySQL.
2. **Typo-Tolerant Search:** Type `cybrpunk` or `eldn` in the top search bar to verify spell-correction suggestions and highlighted results.
3. **Catalog Filters & Sorting:** Switch between **Store**, **Cheap Games**, **Software**, and **Gift Cards**, filter by platform/region/price, and test sorting.
4. **Multi-Seller Offers:** Open any product page and add an offer from a secondary seller under **Other Offers** to verify that the cart captures that seller's exact price.
5. **Transactional Checkout & Persistence:** Sign in with the demo account, complete checkout using **Credit/Debit Card**, **Apple Pay**, or **Crypto**, and refresh **My Orders** (`#/orders`) to verify the generated digital keys persist in MySQL.
