# Amazon Clone - SDE Intern Fullstack Assignment

A robust, production-ready full-stack e-commerce web application that closely replicates Amazon's design, taxonomy, and user experience. Built completely from scratch without external component libraries, this project relies on vanilla CSS Modules to demonstrate advanced core styling proficiency while providing a seamless shopping workflow.

## 🚀 Technical Stack
- **Frontend**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Vanilla CSS Modules (Strict adherence to pure CSS, specifically avoiding Tailwind/Bootstrap)
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Assets**: Locally served, high-quality product imagery and dynamically generated placeholders

---

## ✨ Features Implemented

### 1. Robust Core UI & Architecture
- **Authentic Styling**: A meticulously crafted design system utilizing native CSS Variables (`globals.css`) and modular components matching Amazon's UI/UX.
- **Dynamic Header & Footer**: Replicated the real Amazon multi-column footer and implemented a functional sticky header featuring dynamic SVG icons, category filtering, and location pin graphics.
- **Hero Carousel Banner**: Replaced static imagery with an active, auto-scrolling promotional carousel simulating active Amazon discount offers.

### 2. Product Pipeline & Database Engineering
- **Unified External APIs**: Engineered backend scripts (`importApiProducts.js` & `importDummyJson.js`) to scrape, parse, and unify products from two separate open-source JSON APIs. 
- **Dynamic Categorization**: Overhauled the database taxonomy to map incoming disparate items into a polished list of 6 distinct categories (`Electronics`, `Beauty`, `Fashion`, `Home`, `Sports`, `Groceries`) with matching frontend dynamic routing.
- **Local Asset Hosting**: Automated the scraping and local downloading of **70 robust HD product images** into the `.next` server environment to prevent broken external CDN links. Implemented an automatic `Placehold.co` API fallback for any localized missing product tags.

### 3. Shopping Experience
- **Product Listing Page**: Grid layout mimicking Amazon with category-filtered filtering logic.
- **Product Detail Form (PDP)**: Realistic item specifics with "In Stock" indicators, subtotal calculations, simulated delivery windows, and synchronized Add-to-Cart functionality.
- **Global Shopping Cart**: Real-time state-synced cart (powered by `CartContext`) enabling updates to item quantity, accurate localized tax computations, and deletions.

### 4. Checkout & Order Management Workflow
- **Multi-Step Checkout**: Built a responsive, multi-view sequential checkout pipeline. Form state is preserved flawlessly without unmount-focus bugs. Submits finalized payload models accurately back to PostgreSQL.
- **Orders Dashboard**: Added a comprehensive `Orders & Returns` board enabling users to track completed purchases against dynamic timestamps, review simulated subtotal data, and instantly trigger a recursive "Buy it again" cart integration.

---

## 💾 Database Schema (Prisma)
The database uses a robust relational PostgreSQL model:
- `Product`: Catalogs all items (id, name, desc, price, optimized local imageUrl, schema category, stock limit).
- `Order`: Aggregates placed order histories with dynamic shipping destinations.
- `OrderItem`: Granularly links historical prices of items tied to specific orders.
- `CartItem`: Maps real-time tracked session inventories awaiting checkout.

---

## 💻 Local Setup Instructions

### 1. Setup Database
You must have a local PostgreSQL instance running prior to executing.
1. Create a database named `amazon_clone`.
2. Ensure `backend/.env` is hydrated with your valid credentials:
   ```env
   DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/amazon_clone"
   ```

### 2. Run Backend API Environment
```bash
cd backend
npm install

# Force synchronous database schema syncing
npx prisma db push

# Launch the Node.js Express server
npm run dev
```
*(The API listener will securely attach itself to `http://localhost:5000`)*

### 3. Run Frontend Server
In a secondary terminal window:
```bash
cd frontend
npm install

# Force Next.js frontend binding
npm run dev
```
*(The user application will flawlessly compile and launch on `http://localhost:3000`)*

---

## 🔒 Assumptions & Constraints
- Local DB scripts gracefully bypass constraints if run safely in isolation.
- Authentication was bypassed dynamically ("No Login Required") strictly catering to the designated SDE assignment grading constraints. All operations interact directly via the established RESTful pipelines contextually.
