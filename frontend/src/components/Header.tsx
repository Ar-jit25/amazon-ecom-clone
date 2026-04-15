"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import styles from "./Header.module.css";

const CATEGORIES = ["All", "Electronics", "Beauty", "Fashion", "Home", "Sports", "Groceries"];
const NAV_ITEMS = ["Today's Deals", "Customer Service", "Registry", "Gift Cards", "Sell", "Prime", "New Releases"];

export default function Header() {
  const { totalItems } = useCart();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (category !== "All") params.set("category", category);
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className={styles.header}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" style={{ width: '100px', filter: 'brightness(0) invert(1)', marginTop: '8px' }} />
        </Link>

        {/* Deliver to */}
        <div className={styles.deliverBox} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: '2px' }}>
          <svg style={{ width: '18px', height: '18px', fill: 'none', stroke: '#fff', strokeWidth: 2, marginBottom: '2px' }} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.deliverTop}>Deliver to</span>
            <span className={styles.deliverBottom}>United States</span>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <select
            className={styles.searchSelect}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Amazon"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchBtn} aria-label="Search">
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <circle cx="11" cy="11" r="7" />
              <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Nav links */}
        <nav className={styles.navLinks}>
          <div className={styles.navItem} style={{ flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" alt="EN" style={{ width: '20px', height: '14px', objectFit: 'cover' }} />
            <span style={{ fontWeight: 700, fontSize: '13px' }}>EN</span>
          </div>
          <div className={styles.navItem}>
            <span className={styles.navTop}>Hello, sign in</span>
            <span className={styles.navBottom}>Account &amp; Lists</span>
          </div>
          <Link href="/orders" className={styles.navItem}>
            <span className={styles.navTop}>Returns</span>
            <span className={styles.navBottom}>&amp; Orders</span>
          </Link>
        </nav>

        {/* Cart */}
        <Link href="/cart" className={styles.cartLink}>
          <div className={styles.cartWrap}>
            <svg className={styles.cartIcon} viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className={styles.cartCount}>{totalItems}</span>
          </div>
          <span className={styles.cartLabel}>Cart</span>
        </Link>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomItem}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          All
        </div>
        {NAV_ITEMS.map((item) => (
          <div key={item} className={styles.bottomItem}>{item}</div>
        ))}
      </div>
    </header>
  );
}
