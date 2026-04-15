"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const FEATURES = [
  { icon: "🚀", title: "FREE & Fast Delivery", desc: "Unlimited FREE One-Day and Two-Day delivery on millions of items." },
  { icon: "🎬", title: "Prime Video", desc: "Watch thousands of movies, TV shows and Amazon Originals." },
  { icon: "🎵", title: "Prime Music", desc: "Ad-free access to 100 million songs and podcasts." },
  { icon: "📚", title: "Prime Reading", desc: "Borrow from thousands of books, magazines & comics." },
  { icon: "🎮", title: "Prime Gaming", desc: "Free games, in-game content and Twitch channel subscription." },
  { icon: "🔔", title: "Early Access Deals", desc: "Get 30 minutes early access to Lightning Deals." },
];

const PLANS = [
  { name: "Monthly", price: 299, period: "/month", tag: "" },
  { name: "Annual", price: 1499, period: "/year", tag: "SAVE 58%" },
];

export default function PrimePage() {
  const { addToCart, cartItems } = useCart();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState(1);
  const [joining, setJoining] = useState(false);

  const handleJoinPrime = async () => {
    setJoining(true);
    await addToCart(999);
    setTimeout(() => router.push("/checkout"), 400);
  };

  return (
    <div className={styles.wrap}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Amazon_Prime_logo_%282024%29.svg" alt="Prime" className={styles.primeLogo} />
          <h1 className={styles.heroTitle}>All the things you love. All in one place.</h1>
          <p className={styles.heroSub}>Shop, stream, play — Prime has it all. Join 200 million members worldwide.</p>

          {/* Plan selector */}
          <div className={styles.plans}>
            {PLANS.map((plan, i) => (
              <button key={i} onClick={() => setSelectedPlan(i)} className={`${styles.planCard} ${selectedPlan === i ? styles.planActive : ""}`}>
                {plan.tag && <span className={styles.planTag}>{plan.tag}</span>}
                <div className={styles.planName}>{plan.name}</div>
                <div className={styles.planPrice}>
                  <span className={styles.planCurr}>₹</span>
                  <span className={styles.planAmt}>{plan.price.toLocaleString("en-IN")}</span>
                  <span className={styles.planPer}>{plan.period}</span>
                </div>
              </button>
            ))}
          </div>

          <button className={styles.joinBtn} onClick={handleJoinPrime} disabled={joining}>
            {joining ? "Adding to cart..." : `Try Prime ${PLANS[selectedPlan].name} — ₹${PLANS[selectedPlan].price.toLocaleString("en-IN")}${PLANS[selectedPlan].period}`}
          </button>
          <p className={styles.heroNote}>Cancel anytime. No questions asked.</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className={styles.featuresSection}>
        <h2 className={styles.featuresTitle}>Everything included with Prime</h2>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureName}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA bottom */}
      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to get Prime?</h2>
        <p className={styles.ctaSub}>Join Prime today and start enjoying all its benefits.</p>
        <button className={styles.joinBtn} onClick={handleJoinPrime}>
          Get Started with Prime
        </button>
      </div>
    </div>
  );
}
