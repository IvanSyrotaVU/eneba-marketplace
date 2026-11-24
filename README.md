# Eneba Digital Marketplace Clone

A full-stack digital game key, software, and gift card marketplace inspired by **Eneba**, built with **React 19 + TypeScript + Vite**, a modular **PHP 8.3 REST API**, and a **TiDB Cloud Serverless (MySQL-compatible)** database.

## Live Links

- **Live Storefront (Vercel):** https://eneba-marketplace-chi.vercel.app/
- **Live Backend API (Render):** https://eneba-marketplace-jpsp.onrender.com/api/homepage/hero
- **GitHub Repository:** https://github.com/IvanSyrotaVU/eneba-marketplace

> **Note for Evaluators:** The backend is hosted on Render's free tier. If the API has been idle for more than 15 minutes, the initial request takes ~30–50 seconds to wake the container; all subsequent browsing, filtering, and checkout actions respond immediately.

---

## Tech Stack & Architecture

| Layer | Technology | Hosting & Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 | Deployed on **Vercel** (`frontend/` root directory) |
| **Backend API** | PHP 8.3 (`PDO`, custom front-controller router) | Containerized via `Dockerfile` on **Render** (Frankfurt) |
| **Database** | MySQL 8 / TiDB Cloud Serverless | Hosted on **TiDB Cloud** (`eu-central-1`, TLS/SSL port `4000`) |
| **UI Prototyping** | Figma / Figma Make | Initial design system and component layout |

---

## Key Features

- **Dynamic Storefront:** Hero drop carousel with *Up Next* queue, *Best Sellers*, *Flash Deals* with live countdown timers, and dedicated *Software* & *Gift Cards* sections.
- **Multi-Seller Marketplace:** Each product aggregates competing seller offers with seller ratings, region tags (`GLOBAL`, `EUROPE`, `US`), platform badges (`Steam`, `PS5`, `Xbox`, `Nintendo`), and cashback rewards.
- **Live Search & Faceted Catalog:** Instant header search dropdown plus multi-filter catalog browsing (category, platform, region, price range, stock/pre-order status, and sorting).
- **Authentication & Instant Demo Account:** One-click **Instant Demo Account** login (alongside standard registration and sign-in) with persistent session state.
- **Cart, Wishlist & Instant Key Delivery:** Full checkout flow supporting Eneba Wallet cashback balance, promo codes, and immediate activation key generation in order history.
- **Zero-Config Database Bootstrapping:** `Database.php` automatically initializes tables and seeds **35 products**, **5 sellers**, and **116 offers** on first connection to an empty database.

---

## Evaluator Quick-Test Guide

1. **Open the Live Storefront** on Vercel and verify that the hero banner, *Best Sellers*, and *Flash Deals* load from the live Render + TiDB Cloud API.
2. **Browse & Filter:** Switch between *Store*, *Cheap Games*, *Software*, and *Gift Cards*, or filter by platform and region in the catalog.
3. **Compare Seller Offers:** Open any product page to view multiple seller offers and add an item to your cart.
4. **Sign In & Checkout:** Click **Sign in** → **Instant Demo Account**, proceed to **Checkout**, complete an order, and view the generated digital activation key.

---

## Local Development Setup

### 1. Database
Import `backend/schema.sql` into a local MySQL 8 / MariaDB instance (or configure environment variables for a cloud MySQL database):
- `DB_HOST` (default: `127.0.0.1`)
- `DB_PORT` (default: `3306`)
- `DB_NAME` (default: `eneba_clone`)
- `DB_USER` (default: `root`)
- `DB_PASS` (default: empty)

### 2. Backend API (PHP 8.1+)
```bash
php -S 127.0.0.1:8000 -t backend/public backend/public/index.php
```

### 3. Frontend (Node.js 20+)
```bash
cd frontend
npm install
npm run dev
```
