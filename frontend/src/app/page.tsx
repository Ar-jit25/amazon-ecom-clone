import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import styles from "./page.module.css";
import Link from 'next/link';

async function getProducts(search?: string, category?: string) {
  try {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "All") params.set("category", category);
    
    // Server-side fetch to backend running locally
    const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products${params.toString() ? "?" + params.toString() : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    return res.json();
  } catch (err) {
    console.error("Products error", err);
    return [];
  }
}

const CATEGORIES = [
  { name: "Electronics", icon: "💻" },
  { name: "Beauty", icon: "💄" },
  { name: "Fashion", icon: "👗" },
  { name: "Home", icon: "🏠" },
  { name: "Sports", icon: "💪" },
  { name: "Groceries", icon: "🛒" },
];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }> | { search?: string; category?: string };
}) {
  const resolved = await Promise.resolve(searchParams);
  const { search, category } = resolved;
  const products = await getProducts(search, category);

  return (
    <div>
      {/* Hero Banner */}
      {!search && !category && <HeroCarousel />}

      <div className={styles.wrap}>
        {/* Category Pills */}
        {!search && (
          <div className={styles.pills}>
            <Link
              href="/"
              className={`${styles.pill} ${!category ? styles.pillActive : ""}`}
            >
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/?category=${c.name}`}
                className={`${styles.pill} ${category === c.name ? styles.pillActive : ""}`}
              >
                <span>{c.icon}</span>
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Results heading */}
        <div className={styles.heading}>
          <div>
            {search ? (
              <h1 className={styles.headingTitle}>
                Results for &quot;{search}&quot;
              </h1>
            ) : category ? (
              <h1 className={styles.headingTitle}>{category}</h1>
            ) : (
              <h1 className={styles.headingTitle}>Best Sellers & More</h1>
            )}
          </div>
          <div className={styles.headingCount}>
            {products.length} product{products.length !== 1 ? "s" : ""}
          </div>
        </div>

        {products.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔍</div>
            <h2 className={styles.emptyTitle}>No results found</h2>
            <p className={styles.emptyText}>Try different keywords or browse our categories</p>
            <Link href="/" className={styles.emptyBtn}>
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
