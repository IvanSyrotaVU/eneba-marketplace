# Eneba Digital Marketplace Clone

A full-stack digital game key, software license, and gift card marketplace built with **React + TypeScript (Vite)** and a modular **PHP 8 + MySQL** REST API.

All homepage sections, catalog listings, multi-seller comparisons, typo-tolerant search queries, authentication sessions, and checkout orders are dynamically served from MySQL—zero catalog data is hardcoded on the frontend.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Backend:** PHP 8.1+ (strict types, native PDO prepared statements, custom front-controller router)
- **Database:** MySQL 8+ / MariaDB (`utf8mb4`, relational schema with transactional row locking)

---

## Project Architecture

```text
eneba-marketplace/
├── backend/
│   ├── public/
│   │   └── index.php            # Front-controller router, JSON responses & CORS headers
│   ├── src/
│   │   ├── Database.php         # PDO singleton with automatic schema.sql bootstrap
│   │   ├── Auth.php             # HMAC-SHA256 bearer token auth & password hashing
│   │   ├── HomepageService.php  # Dedicated endpoints per homepage section
│   │   ├── ProductService.php   # Filtering, sorting, multi-seller offers & fuzzy search
│   │   └── OrderService.php     # Transactional checkout & activation key generation
│   └── schema.sql               # Database schema & 35-product / 116-offer seed dataset
├── frontend/
│   ├── public/img/              # Brand assets & promotional artwork
│   ├── src/
│   │   ├── api.ts               # Authenticated API client & asset normalizer
│   │   ├── shop.tsx             # Global cart, auth session & order state context
│   │   ├── data.ts              # Shared TypeScript interfaces & formatting helpers
│   │   ├── router.ts            # Hash-based client router with protected routes
│   │   └── components/          # Hero, Sections, StorePage, ProductPage, CheckoutPage, Orders
│   └── start-dev.mjs            # Unified launcher for PHP API (:8000) and Vite (:8443)
├── package.json                 # Root setup & start scripts
└── README.md
