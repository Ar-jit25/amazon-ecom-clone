"use client";

import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.backToTop} onClick={scrollToTop}>
        Back to top
      </div>

      <div className={styles.links}>
        <div className={styles.col}>
          <h3>Get to Know Us</h3>
          <ul>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">About Amazon</a></li>
            <li><a href="#">Investor Relations</a></li>
            <li><a href="#">Amazon Devices</a></li>
            <li><a href="#">Amazon Science</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Make Money with Us</h3>
          <ul>
            <li><a href="#">Sell products on Amazon</a></li>
            <li><a href="#">Sell on Amazon Business</a></li>
            <li><a href="#">Sell apps on Amazon</a></li>
            <li><a href="#">Become an Affiliate</a></li>
            <li><a href="#">Advertise Your Products</a></li>
            <li><a href="#">Self-Publish with Us</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Amazon Payment Products</h3>
          <ul>
            <li><a href="#">Amazon Business Card</a></li>
            <li><a href="#">Shop with Points</a></li>
            <li><a href="#">Reload Your Balance</a></li>
            <li><a href="#">Amazon Currency Converter</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Let Us Help You</h3>
          <ul>
            <li><a href="#">Amazon and COVID-19</a></li>
            <li><a href="#">Your Account</a></li>
            <li><a href="#">Your Orders</a></li>
            <li><a href="#">Shipping Rates & Policies</a></li>
            <li><a href="#">Returns & Replacements</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon Logo" style={{ width: '80px', filter: 'brightness(0) invert(1)' }} />
        </Link>
        <div className={styles.terms}>
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Consumer Health Data Privacy Disclosure</a>
          <a href="#">Your Ads Privacy Choices</a>
        </div>
        <div className={styles.copyright}>
          © 1996-2026, Amazon.com, Inc. or its affiliates
        </div>
      </div>
    </footer>
  );
}
