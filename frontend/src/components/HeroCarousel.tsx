"use client";

import { useState, useEffect } from "react";
import styles from "./HeroCarousel.module.css";

const BANNERS = [
  "https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg", // Original Toys
  "https://m.media-amazon.com/images/I/71tIrZqybrL._SX3000_.jpg", // Generic
  "https://m.media-amazon.com/images/I/71Ie3JXGfVL._SX3000_.jpg", // Electronics
  "https://m.media-amazon.com/images/I/61CiqVTRBEL._SX3000_.jpg", // Kitchen
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % BANNERS.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + BANNERS.length) % BANNERS.length);

  return (
    <div className={styles.carousel}>
      {BANNERS.map((banner, index) => (
        <div 
          key={index} 
          className={`${styles.imageContainer} ${index === currentSlide ? styles.active : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={banner} alt={`Offer ${index + 1}`} className={styles.image} />
        </div>
      ))}
      
      <div className={styles.gradient} />

      <button onClick={prevSlide} className={styles.prevBtn}>
        <svg fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={nextSlide} className={styles.nextBtn}>
        <svg fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
