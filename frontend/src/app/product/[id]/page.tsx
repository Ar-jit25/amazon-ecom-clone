"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  stock: number;
  category: string;
}

function StarRating({ stars, count }: { stars: number; count: number }) {
  return (
    <div className={styles.starsRow}>
      <div className={styles.starsIcons}>
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} className={styles.starSvg} viewBox="0 0 24 24" fill={i <= Math.floor(stars) ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span className={styles.reviewCt}>{count.toLocaleString()} ratings</span>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  const stars = 3.5 + (parseInt(id) % 15) * 0.1;
  const reviews = 100 + parseInt(id) * 137;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        setProduct(await res.json());
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.centerCard}>
        <div className={styles.spinner} />
        <p style={{ color: "var(--amz-muted)" }}>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.centerCard}>
        <div className={styles.emojiBig}>😕</div>
        <h1 className={styles.errorTitle}>Product not found</h1>
        <Link href="/" className="btn-yellow" style={{ padding: "12px 32px", display: "inline-block" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
        await addToCart(product.id);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const thumbnails = [product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className={styles.wrap}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/" className="amz-link">Home</Link>
        <span>›</span>
        <Link href={`/?category=${product.category}`} className="amz-link">{product.category}</Link>
        <span>›</span>
        <span className={styles.bcText}>{product.name}</span>
      </nav>

      <div className={styles.layout}>
        {/* Left: Images */}
        <div className={styles.imgLeft}>
          <div className={styles.thumbList}>
            {thumbnails.map((img, i) => (
              <button
                key={i}
                className={`${styles.thumbBtn} ${i === selectedImage ? styles.thumbBtnActive : ""}`}
                onClick={() => setSelectedImage(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`View ${i + 1}`} className={styles.thumbImg} />
              </button>
            ))}
          </div>
          <div className={styles.mainImgBox}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnails[selectedImage]} alt={product.name} className={styles.mainImg} />
          </div>
        </div>

        {/* Middle: Info */}
        <div className={styles.infoMid}>
          <span className={styles.badge}>{product.category}</span>
          <h1 className={styles.title}>{product.name}</h1>

          <StarRating stars={stars} count={reviews} />

          <div className={styles.divider} />

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.priceDiscount}>-15%</span>
            <span className={styles.priceCurr}>$</span>
            <span className={styles.priceWhole}>{Math.floor(product.price)}</span>
            <span className={styles.priceFrac}>{(product.price % 1).toFixed(2).substring(1)}</span>
          </div>
          <div className={styles.listPrice}>
            List Price: <s>${(product.price * 1.18).toFixed(2)}</s>
          </div>
          <div className={styles.returns}>
            FREE Returns &nbsp;|&nbsp; FREE delivery <b>tomorrow</b>
          </div>

          <div className={styles.divider} />
          <h3 className={styles.aboutTitle}>About this item</h3>
          <ul className={styles.aboutList}>
            {product.description.split(". ").filter(Boolean).map((s, i) => (
              <li key={i}>{s.trim()}</li>
            ))}
          </ul>
        </div>

        {/* Right: Buy Box */}
        <div className={styles.buyRight}>
          <div className={styles.buyBox}>
            <div className={styles.buyPriceRow}>
              <span className={styles.buyPriceCurr}>$</span>
              <span className={styles.buyPriceWhole}>{Math.floor(product.price)}</span>
              <span className={styles.buyPriceFrac}>{(product.price % 1).toFixed(2).substring(1)}</span>
            </div>

            <div className={styles.buyDelivery}>FREE delivery <b>Tomorrow</b></div>

            <div className={`${styles.stockAlert} ${product.stock > 0 ? styles.stockIn : styles.stockOut}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </div>

            {/* Quantity */}
            <div className={styles.qtyWrap}>
              <label className={styles.qtyLabel}>Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className={styles.qtySelect}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>Qty: {n}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn-yellow ${styles.addBtn} ${added ? styles.addBtnAdded : ""}`}
            >
              {added ? "✓ Added to Cart!" : "Add to Cart"}
            </button>

            <button
              onClick={() => {
                addToCart(product.id);
                setTimeout(() => router.push("/checkout"), 300);
              }}
              className={`btn-orange ${styles.buyNowBtn}`}
            >
              Buy Now
            </button>

            <div className={styles.metaList}>
              <div className={styles.metaRow}>
                <span>Ships from</span>
                <span className={styles.metaVal}>Amazon.com</span>
              </div>
              <div className={styles.metaRow}>
                <span>Sold by</span>
                <span className={styles.metaLink}>Amazon.com</span>
              </div>
              <div className={styles.metaRow}>
                <span>Returns</span>
                <span className={styles.metaLink}>Eligible for Return</span>
              </div>
            </div>

            <div className={styles.secureLine}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure transaction
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
