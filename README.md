# Amazon Clone — Full-Stack E-Commerce Application

A production-ready, full-stack Amazon clone built from scratch as part of an SDE Intern assignment. The application replicates Amazon India's core shopping experience, complete with a real database, RESTful API, live deployment, and genuine INR pricing.

🔗 **Live App**: [Deployed on Vercel]  
🔗 **Backend API**: [Deployed on Render]  
🔗 **Repository**: https://github.com/Ar-jit25/amazon-ecom-clone

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), React, TypeScript |
| **Styling** | Vanilla CSS Modules (zero Tailwind/Bootstrap) |
| **Backend** | Node.js, Express.js |
| **ORM** | Prisma |
| **Database** | PostgreSQL (hosted on Supabase) |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## ✨ Features

### 🏠 Homepage & Navigation
- **Hero Carousel** — Auto-scrolling promotional banners
- **Category Pills** — Filter by Electronics, Beauty, Fashion, Home, Sports, Groceries
- **Sticky Header** — Search bar with category dropdown, cart counter, location (India), user (anon)
- **Functional Navbar** — All bottom-bar links route to real pages (Deals, Prime, Customer Service, New Releases, Gift Cards)
- **Indian Number Formatting** — All prices use `en-IN` locale (₹1,23,456 format)

### 🛍️ Product Experience
- **Product Grid** — Card layout with star ratings, review counts, and Add to Cart
- **Product Detail Page (PDP)** — Image thumbnails, quantity stepper (±), buy box, delivery info, "About this item", and customer reviews
- **Customer Reviews Section** — Static realistic reviews with star ratings and Indian dates
- **Search** — Full-text keyword search across name, description, and category
- **Category Filtering** — Via URL params (`?category=Electronics`)

### 🛒 Cart & Checkout
- **Global Cart** — Real-time synced via `CartContext`, persisted in PostgreSQL
- **Cart Page** — Quantity management, subtotal, item removal
- **Multi-Step Checkout** — Address → Payment → Confirmation, order submitted to DB
- **Buy Now** — Bypasses cart, goes directly to checkout with selected quantity

### 📦 Orders
- **Orders Dashboard** — Lists all past orders with timestamps, items, and totals
- **Buy it Again** — Instantly re-adds previous order items to cart

### 🔥 Today's Deals (`/deals`)
- Dedicated page with real strikethrough prices (e.g. ~~₹1,07,143~~ → ₹74,700)
- Category-smart discount rates (Fashion 40%, Electronics 28%, etc.)
- Deal tags: "Lightning deal", "Deal of the Day", "Limited time offer"
- Orange **claimed %** progress bar per item

### 👑 Amazon Prime (`/prime`)
- Full Prime landing page replicating real Amazon Prime UI
- **Monthly (₹299)** and **Annual (₹1,499)** plan selector
- Feature grid: Delivery, Prime Video, Music, Reading, Gaming, Early Access
- **Functional "Join Prime" button** — adds to cart and routes to checkout
- Cancel anytime messaging, animated hover states

### 🎧 Customer Service (`/customer-service`)
- **FAQ tab** — Accordion-style answers to 6 common questions
- **Contact tab** — Live Chat, Phone (1800-3000-9009), Email cards
- **Problem selector** — Quick-pick common issue buttons

### 🆕 New Releases (`/?search=new`)
- Returns the 10 most recently added products from the database

---

## 💾 Database Schema

```prisma
model Product {
  id          Int         @id @default(autoincrement())
  name        String
  description String
  price       Float       // Stored in INR (realistic Indian pricing)
  imageUrl    String
  category    String
  stock       Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Order {
  id         Int         @id @default(autoincrement())
  total      Float
  address    String
  createdAt  DateTime    @default(now())
  items      OrderItem[]
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Float
  order     Order   @relation(fields: [orderId], references: [id])
}

model CartItem {
  id        Int     @id @default(autoincrement())
  productId Int
  quantity  Int
}
```

---

## 💻 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Supabase)

### 1. Clone & Configure

```bash
git clone https://github.com/Ar-jit25/amazon-ecom-clone.git
cd amazon-ecom-clone
```

Create `backend/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/amazon_clone"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/amazon_clone"
```

### 2. Start Backend

```bash
cd backend
npm install
npx prisma db push        # Sync schema
node importApiProducts.js # Seed products (if DB is empty)
npm run dev               # Starts on http://localhost:5000
```

### 3. Start Frontend

```bash
cd frontend
npm install
# Create frontend/.env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev               # Starts on http://localhost:3000
```

---

## 🌐 Production Deployment

### 1. Database — Supabase
1. Create a new Supabase project and launch a PostgreSQL instance.
2. Go to **Project Settings → Database → Connection Pooling**.
3. Set mode to **Transaction**, copy the pooled string (port `6543`), append `?pgbouncer=true` → this is your `DATABASE_URL`.
4. Copy the direct connection string (port `5432`) → this is your `DIRECT_URL`.

### 2. Backend — Render
1. Create a new **Web Service** on Render, connect your GitHub repo.
2. Set **Root Directory** to `backend`.
3. **Build Command**: `npm install && npx prisma db push`
4. **Start Command**: `node index.js`
5. Add environment variables: `DATABASE_URL`, `DIRECT_URL`
6. Deploy → copy the service URL (e.g. `https://your-app.onrender.com`)

### 3. Frontend — Vercel
1. Import the repo into Vercel, set **Root Directory** to `frontend`.
2. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-app.onrender.com/api`
3. Deploy.

> ⚠️ Never commit `.env` files or expose your database credentials.

---

## 📁 Project Structure

```
amazon-clone/
├── backend/
│   ├── controllers/
│   │   ├── productController.js    # GET /products with search/category/deals/new
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── importApiProducts.js        # Seeds products from kolzsticks API
│   ├── importDummyJson.js          # Seeds from dummyjson.com
│   ├── cleanCategories.js          # Normalizes categories to 6 core groups
│   └── index.js
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx                # Homepage
        │   ├── deals/                  # Today's Deals page
        │   ├── prime/                  # Amazon Prime subscription page
        │   ├── customer-service/       # FAQ + Contact page
        │   ├── new-releases/           # New Releases redirect
        │   ├── product/[id]/           # Product Detail Page
        │   ├── cart/                   # Cart page
        │   ├── checkout/               # Multi-step checkout
        │   └── orders/                 # Orders dashboard
        ├── components/
        │   ├── Header.tsx              # Sticky header with search + nav
        │   ├── ProductCard.tsx         # Product grid card
        │   └── HeroCarousel.tsx        # Auto-scrolling banner
        └── context/
            └── CartContext.tsx         # Global cart state
```

---

## 🔒 Assumptions & Constraints
- Authentication is bypassed — the default user is shown as "**Hello, anon**" to comply with assignment constraints where full auth was out of scope.
- All prices are in **Indian Rupees (₹)** using the `en-IN` number formatting system (Lakhs and Crores).
- Cart is session-agnostic — it persists in the PostgreSQL `CartItem` table rather than localStorage, enabling server-side cart reads.
- Deals, discounts, and "New Releases" labels are algorithmically assigned rather than stored as DB flags, keeping the schema minimal.
