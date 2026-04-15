"use client";
import Link from "next/link";
import styles from "./page.module.css";

const NEW_PRODUCT_IDS = [62, 63, 64, 65, 66, 67, 58, 59, 60, 61];

// These are hard-coded to match what we know the DB has as "new" items (latest IDs)
// The backend already returns the latest 10 items when search=new

export default function NewReleasesPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "80px 16px", flexDirection: "column", gap: "16px" }}>
      <div style={{ fontSize: "3rem" }}>🆕</div>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>New Releases</h1>
      <p style={{ color: "#666", maxWidth: "400px", textAlign: "center" }}>
        Discover the latest products just added to our catalog.
      </p>
      <Link href="/?search=new" style={{
        background: "#FFD814",
        padding: "12px 32px",
        borderRadius: "20px",
        fontWeight: 700,
        fontSize: "15px",
        textDecoration: "none",
        color: "#0f1111"
      }}>
        Browse New Releases
      </Link>
    </div>
  );
}
