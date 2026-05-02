# CENTLY — Fine Jewellery E-commerce

## Original problem statement
Build a luxury fine jewellery e-commerce site for **CENTLY — Real Diamonds. Real Gold. Every Day.**
Brand: certified natural diamonds (VVS clarity, E–F colour) set in solid 9ct gold, BIS Hallmarked.
Reference: www.palmonas.com. React + FastAPI + MongoDB. Razorpay integration provision.
User additionally requested an **admin panel with login credentials**.

## Architecture
- **Frontend**: React 19 + react-router 7 + framer-motion + react-fast-marquee + lucide-react + Shadcn UI primitives
- **Backend**: FastAPI 0.110 + Motor (async MongoDB) + Pydantic v2 + bcrypt + PyJWT
- **State**: Cart & Wishlist via localStorage Context. Admin JWT in localStorage.
- **Design system**: `/app/design_guidelines.json` — Cormorant Garamond (display) + Outfit (body), alabaster (#FAF9F5) bg, espresso (#1A1918) text, gold (#B89758) accent, sharp edges (no border radius), generous whitespace.

## User personas
1. **Repeat-buyer Indian woman, 25–45**: wants real, certified, daily-wear jewellery — clear specs, transparency, and trust.
2. **Bridal customer**: needs guided consultation; high-value purchase; wants a complete set.
3. **Gifter**: needs gift-ready packaging, clear price tiers, no jewellery expertise required.
4. **Admin (Cently team)**: views orders, leads (newsletter, contact, consultations), and product catalogue from a single dashboard.

## Core requirements (static)
- Editorial luxury aesthetic
- Detailed product specs (VVS, E–F, carat weight, certification, hallmark)
- Cart + wishlist + mock checkout
- Forms: newsletter, contact, bridal/diamond consultation
- Razorpay-ready checkout (mocked)
- Admin: secure login + read-only dashboards

## Implemented (Feb 2026)
### Iteration 1 — MVP (Feb 2026)
- Storefront, admin panel, mock checkout (see below)

### Iteration 2 — Customer auth + Loyalty + Engraving + Gallery (Feb 2026)
- **Customer auth**: register / login / `/api/account/me` (GET + PATCH) / `/api/account/orders` / `/api/account/loyalty`
- **My Account**: `/account` overview, `/account/orders` with full order detail (items, engraving, points), `/account/profile`, `/account/circle`
- **Cently Circle loyalty**: 1 pt per ₹100 spent, 1 pt = ₹1, max 10% redemption per order. Tiers: Bronze (0–249) · Silver (250–999) · Gold (1000+). Atomic `$inc` on order placement.
- **Engraving**: Auto-enabled for `lockets`, `rings`, `bracelets`, `bridal` categories. Toggle + 20-char input on product page → carries through cart `lineKey` → checkout → `OrderItem.engraving`
- **Multi-image gallery**: 2–3 images per product; thumbnail strip with active state on product page
- **Header**: User icon with auth-state aware link (`/login` or `/account`) + gold dot indicator when signed in
- **Test coverage**: 46/46 pytest cases ✅ (28 regression + 18 iter2)

### Backend (`/app/backend/server.py`)
- 19 seeded products across 8 categories
- Public endpoints: `GET /api/products` (filters: category, bestseller), `GET /api/products/{slug}`, `GET /api/categories`, `GET /api/journal`
- Form endpoints: `POST /api/newsletter`, `POST /api/contact`, `POST /api/consultation`, `POST /api/orders`
- Auth: `POST /api/auth/login` (bcrypt + JWT, 12h), `GET /api/auth/me`
- Admin (Bearer-protected, role=admin): `/api/admin/stats`, `/orders`, `/products`, `/newsletter`, `/contact`, `/consultations`
- Idempotent seed for products + admin (re-hashes if `ADMIN_PASSWORD` changes)

### Frontend
- **Storefront**: Home (hero / belief / 3-step / four pillars bento / bestsellers / complete-the-look / testimonials / trust strip / gift banner / newsletter), Collection list, Product detail, Cart drawer, Wishlist drawer, Checkout, Order Confirmation, About, Our Diamonds, Bridal (with consultation form), Gifting, Contact (with form), FAQ, Journal, Size Guide, Sustainability, Care, Legal, 404
- **Admin**: Login (`/admin/login`), Dashboard (`/admin`), Orders, Products, Newsletter, Messages, Consultations
- Sticky header with 3-column nav layout, animated marquee ticker, stagger-reveal animations on scroll
- Toast notifications via Sonner

### Tests (Feb 2026)
- 28 backend pytest cases — 100% pass
- Frontend Playwright run — 100% of critical flows pass
- Reports: `/app/test_reports/iteration_1.json`

## Admin credentials
- URL: `/admin/login`
- Email: `admin@cently.com`
- Password: `Cently@2026`
- Stored in `/app/memory/test_credentials.md`

## Backlog (P0 → P2)
**P0 — none** (storefront + customer area + admin all functional)

**P1**
- Real Razorpay key integration (replace mock — playbook code already in place at `POST /api/orders` and `Checkout.jsx`)
- Admin: order status edit (`pending_payment` → `paid` → `dispatched` → `delivered`)
- Customer email notifications (Resend/SendGrid) for order confirmation, dispatch, welcome, points-earned receipt
- Admin: product CRUD UI (currently read-only; products are seeded)

**P2 — remaining (Batch B for next iteration)**
- Faceted search (price, metal colour, gem badge, in-stock filters on Collection pages + global search)
- SEO structured data (Product, Organization, FAQ, BreadcrumbList JSON-LD + meta tags)
- Internationalisation (multi-currency: INR / USD / GBP / AED + i18n EN-default scaffolding)

**P2 — done (Batch A, this iteration)**
- ✅ Customer auth + order history
- ✅ Engraving / personalisation flow
- ✅ Multi-image product gallery
- ✅ Cently Circle loyalty

## Notes for next agent
- Razorpay flow is **mocked**: `POST /api/orders` returns `razorpay_order_id: "order_mock_*"`. To wire it up, replace the placeholder in `server.py:create_order` with `razorpay.Client(...).order.create(...)` and in `Checkout.jsx:placeOrder` open `window.Razorpay({key, order_id, ...}).open()` before navigating to confirmation.
- All admin reads exclude `_id` and use `Authorization: Bearer <token>`. Token lifetime is 12h and lives in `localStorage` under `cently_admin_token`.
- Products are seeded once on startup if the collection is empty. Drop the `products` collection to re-seed.
