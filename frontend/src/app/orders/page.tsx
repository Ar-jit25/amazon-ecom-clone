"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const API = "http://localhost:5000/api";

type OrderItem = {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    category: string;
  };
};

type Order = {
  id: number;
  totalAmount: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${API}/orders`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleBuyAgain = async (productId: number) => {
    await addToCart(productId);
    router.push("/cart");
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className={styles.wrap}>
      <nav className={styles.breadcrumb}>
        <Link href="/" className="amz-link">Your Account</Link>
        <span>›</span>
        <span style={{ color: "var(--amz-text)" }}>Your Orders</span>
      </nav>

      <div className={styles.titleRow}>
        <h1 className={styles.title}>Your Orders</h1>
      </div>

      <div className={styles.tabRow}>
        <div className={`${styles.tab} ${styles.tabActive}`}>Orders</div>
        <div className={styles.tab}>Buy Again</div>
        <div className={styles.tab}>Not Yet Shipped</div>
        <div className={styles.tab}>Cancelled Orders</div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No orders found</h2>
          <p style={{ marginTop: "10px", color: "var(--amz-muted)", marginBottom: "20px" }}>
            Looks like you haven&apos;t placed any orders yet.
          </p>
          <Link href="/" className="btn-yellow" style={{ padding: "10px 20px" }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.layout}>
          {orders.map((order) => {
            const formattedId = `AMZ-${String(order.id).padStart(9, "0")}`;
            return (
              <div key={order.id} className={styles.orderCard}>
                
                {/* Order Header */}
                <div className={styles.orderHeader}>
                  <div style={{ display: "flex", gap: "32px" }}>
                    <div className={styles.headerCol}>
                      <span className={styles.headerLabel}>Order Placed</span>
                      <span className={styles.headerValue}>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className={styles.headerCol}>
                      <span className={styles.headerLabel}>Total</span>
                      <span className={styles.headerValue}>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className={styles.headerCol}>
                      <span className={styles.headerLabel}>Ship To</span>
                      <span className={styles.orderId} title={order.shippingAddress}>
                        {order.shippingAddress.split(",")[0]}
                      </span>
                    </div>
                  </div>
                  <div className={`${styles.headerCol} ${styles.headerRight}`}>
                    <span className={styles.headerLabel}>Order # {formattedId}</span>
                    <span className={styles.orderId}>View order details</span>
                  </div>
                </div>

                {/* Order Body */}
                <div className={styles.orderBody}>
                  <div className={styles.statusText}>
                    Arriving Tomorrow by 8 PM
                  </div>

                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <Link href={`/product/${item.productId}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.imageUrl} alt={item.product.name} className={styles.itemImg} />
                      </Link>
                      
                      <div className={styles.itemInfo}>
                        <Link href={`/product/${item.productId}`} className={styles.itemName}>
                          {item.product.name}
                        </Link>
                        {item.quantity > 1 && <div style={{ fontSize: "13px", color: "var(--amz-muted)" }}>Qty: {item.quantity}</div>}
                        <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "4px" }}>
                          ${item.price.toFixed(2)}
                        </div>

                        <div className={styles.itemReturn}>
                          Return window closed on {formatDate(new Date(new Date(order.createdAt).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString())}
                        </div>

                        <button
                          onClick={() => handleBuyAgain(item.productId)}
                          className={styles.buyAgainBtn}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Buy it again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
