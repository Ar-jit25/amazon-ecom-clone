"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useState, useCallback } from "react";
import styles from "./ProductCard.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock?: number;
}

function getRating(id: number) {
  return {
    stars: parseFloat((3.5 + (id % 15) * 0.1).toFixed(1)),
    count: 100 + id * 137,
  };
}

function Stars({ stars }: { stars: number }) {
  const full = Math.floor(stars);
  return (
    <div className={styles.starsIcons}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={styles.starSvg} viewBox="0 0 24 24"
          fill={i <= full ? "#f90" : "none"} stroke="#f90" strokeWidth={1.5}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, loading } = useCart();
  const [added, setAdded] = useState(false);
  const { stars, count } = getRating(product.id);

  const handleAdd = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [addToCart, product.id]);

  const dollars = Math.floor(product.price).toLocaleString("en-IN");
  const cents = (product.price % 1).toFixed(2).slice(1);

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.id}`} className={styles.imageLink}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl} alt={product.name} className={styles.image} />
        <span className={styles.badge}>{product.category}</span>
      </Link>

      <div className={styles.body}>
        <Link href={`/product/${product.id}`} className={styles.titleLink}>
          <h2 className={styles.title}>{product.name}</h2>
        </Link>

        <div className={styles.stars}>
          <Stars stars={stars} />
          <span className={styles.reviewCt}>{count.toLocaleString()}</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.priceCurr}>₹</span>
          <span className={styles.priceWhole}>{dollars}</span>
          <span className={styles.priceFrac}>{cents}</span>
        </div>

        <div className={styles.delivery}>FREE delivery on eligible orders</div>
        <div className={styles.inStock}>In Stock</div>

        <button
          onClick={handleAdd}
          disabled={loading}
          className={`${styles.addBtn} ${added ? styles.addBtnAdded : ""}`}
        >
          {added ? "✓ Added to Cart!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
