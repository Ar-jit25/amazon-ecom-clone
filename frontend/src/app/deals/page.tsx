import styles from "./page.module.css";
import Link from "next/link";

// Products that are "deals" - IDs divisible by 3 from our DB
// We'll fetch and add deal discounts
async function getDeals() {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?search=deals`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("failed");
    return res.json();
  } catch {
    return [];
  }
}

// Preset deals discounts per category
const DISCOUNTS: Record<string, number> = {
  Electronics: 0.28,
  Beauty: 0.35,
  Fashion: 0.40,
  Home: 0.22,
  Sports: 0.30,
  Groceries: 0.15,
  Digital: 0.20,
};

const DEAL_TAGS = ["Limited time deal", "Lightning deal", "Deal of the Day", "Exclusive offer", "Clearance sale"];

export default async function DealsPage() {
  const products: any[] = await getDeals();

  return (
    <div className={styles.wrap}>
      <div className={styles.dealsHeader}>
        <div className={styles.dealsHeaderInner}>
          <span className={styles.dealsFire}>🔥</span>
          <div>
            <h1 className={styles.dealsTitle}>Today&apos;s Deals</h1>
            <p className={styles.dealsSub}>Limited time offers — don&apos;t miss out!</p>
          </div>
        </div>
      </div>

      <div className={styles.dealsMeta}>
        <span className={styles.dealsCount}>{products.length} deals available</span>
        <span className={styles.dealsEnds}>Deals reset daily at midnight</span>
      </div>

      <div className={styles.dealsGrid}>
        {products.map((product: any, idx: number) => {
          const discountRate = DISCOUNTS[product.category] ?? 0.25;
          const originalPrice = Math.round(product.price / (1 - discountRate));
          const dealTag = DEAL_TAGS[idx % DEAL_TAGS.length];
          const pctOff = Math.round(discountRate * 100);
          const claimedPct = 30 + (product.id % 60); // simulated claim %

          return (
            <Link key={product.id} href={`/product/${product.id}`} className={styles.dealCard}>
              <div className={styles.dealTag}>{dealTag}</div>
              <div className={styles.dealImgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.imageUrl} alt={product.name} className={styles.dealImg} />
                <span className={styles.dealBadge}>-{pctOff}%</span>
              </div>
              <div className={styles.dealBody}>
                <div className={styles.dealPriceRow}>
                  <span className={styles.dealPrice}>₹{product.price.toLocaleString("en-IN")}</span>
                  <span className={styles.dealOriginal}>₹{originalPrice.toLocaleString("en-IN")}</span>
                </div>
                <p className={styles.dealName}>{product.name}</p>

                {/* Claimed bar */}
                <div className={styles.claimWrap}>
                  <div className={styles.claimBar}>
                    <div className={styles.claimFill} style={{ width: `${claimedPct}%` }} />
                  </div>
                  <span className={styles.claimText}>{claimedPct}% claimed</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
