"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function CartPage() {
  const { cartItems, totalItems, subtotal, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const estimatedTax = subtotal * 0.08;

  if (cartItems.length === 0) {
    return (
      <div className={styles.wrap}>
        <div className={styles.emptyCard}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2 className={styles.emptyTitle}>Your Amazon Cart is empty</h2>
          <p className={styles.emptyText}>
            Your shopping cart lives here. Add items and they&apos;ll show up here.
          </p>
          <Link href="/" className="btn-yellow">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        {/* Left: Cart Items */}
        <div className={styles.leftCol}>
          <div className={styles.headerRow}>Price</div>

          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              {/* Image */}
              <Link href={`/product/${item.product.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.product.imageUrl} alt={item.product.name} className={styles.itemImg} />
              </Link>

              {/* Info */}
              <div className={styles.itemInfo}>
                <Link href={`/product/${item.product.id}`} className={`amz-link ${styles.itemName}`}>
                  {item.product.name}
                </Link>
                <div className={styles.itemStock}>In stock</div>
                <div className={styles.itemEligible}>Eligible for FREE Shipping</div>

                {/* Actions */}
                <div className={styles.actions}>
                  <div className={styles.qtyCtrl}>
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.product.id, item.quantity - 1)
                          : removeFromCart(item.product.id)
                      }
                      className={styles.qtyBtn}
                    >
                      −
                    </button>
                    <span className={styles.qtyVal}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.actionPipe} />
                  <button onClick={() => removeFromCart(item.product.id)} className={styles.actionBtn}>
                    Delete
                  </button>
                  <div className={styles.actionPipe} />
                  <button className={styles.actionBtn}>Save for later</button>
                  <div className={styles.actionPipe} />
                  <button className={styles.actionBtn}>See more like this</button>
                </div>
              </div>

              {/* Price */}
              <div className={styles.itemPrice}>
                ₹{(item.product.price * item.quantity).toLocaleString("en-IN", {maximumFractionDigits: 0})}
              </div>
            </div>
          ))}

          {/* Subtotal bottom */}
          <div className={styles.subtotalBot}>
            Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}):{" "}
            <span className={styles.subtotalBold}>₹{subtotal.toLocaleString("en-IN", {maximumFractionDigits: 0})}</span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className={styles.rightCol}>
          <div className={styles.freeShip}>
            <svg className={styles.freeShipIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your order qualifies for FREE Delivery
          </div>

          <div className={styles.sumSubtotal}>
            Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""}):{" "}
            <span className={styles.subtotalBold}>₹{subtotal.toLocaleString("en-IN", {maximumFractionDigits: 0})}</span>
          </div>
          <div className={styles.sumTax}>
            + Est. tax: ₹{estimatedTax.toLocaleString("en-IN", {maximumFractionDigits: 0})}
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className={`btn-yellow ${styles.checkoutBtn}`}
          >
            Proceed to checkout ({totalItems})
          </button>
        </div>
      </div>
    </div>
  );
}
