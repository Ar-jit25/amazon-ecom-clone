"use client";
import { useState } from "react";
import styles from "./page.module.css";

const FAQS = [
  { q: "How do I track my order?", a: "Go to 'Returns & Orders' in the top navigation. All your orders will be listed with their current delivery status and tracking information." },
  { q: "What is Amazon's return policy?", a: "Most items sold on Amazon can be returned within 30 days of receipt. Some items like electronics have a 10-day return window. Returns are FREE for Prime members." },
  { q: "How do I cancel an order?", a: "Orders can be cancelled from the 'Returns & Orders' page before the item ships. Once shipped, you'll need to initiate a return after delivery." },
  { q: "Why was my payment declined?", a: "Check that your card details are entered correctly, billing address matches your card records, and your card has sufficient funds. Contact your bank if the issue persists." },
  { q: "How do I change my delivery address?", a: "You can update your default delivery address in Account & Lists → Manage Addresses. For pending orders, this may or may not be possible depending on dispatch status." },
  { q: "What is Amazon Prime?", a: "Amazon Prime is a subscription service offering FREE unlimited delivery, exclusive deals, Prime Video streaming, Prime Music, and much more for ₹1,499/year." },
];

export default function CustomerServicePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");

  return (
    <div className={styles.wrap}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Customer Service</h1>
        <p className={styles.pageSub}>We&apos;re here to help. Browse FAQs or contact us directly.</p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === "faq" ? styles.tabActive : ""}`} onClick={() => setActiveTab("faq")}>
          📋 FAQs
        </button>
        <button className={`${styles.tab} ${activeTab === "contact" ? styles.tabActive : ""}`} onClick={() => setActiveTab("contact")}>
          📞 Contact Us
        </button>
      </div>

      {activeTab === "faq" && (
        <div className={styles.faqSection}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {FAQS.map((item, i) => (
              <div key={i} className={styles.faqItem}>
                <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span className={styles.faqChevron}>{openFaq === i ? "▲" : "▼"}</span>
                </button>
                {openFaq === i && (
                  <div className={styles.faqAnswer}>{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className={styles.contactSection}>
          <h2 className={styles.sectionTitle}>Contact Customer Support</h2>
          <div className={styles.contactGrid}>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>💬</div>
              <h3>Live Chat</h3>
              <p>Chat with a support agent in real time. Available 24/7.</p>
              <button className={styles.contactBtn}>Start Chat</button>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📞</div>
              <h3>Phone Support</h3>
              <p>Call us at <strong>1800-3000-9009</strong> (Free, 24/7)</p>
              <button className={styles.contactBtn}>Request Call</button>
            </div>
            <div className={styles.contactCard}>
              <div className={styles.contactIcon}>📧</div>
              <h3>Email</h3>
              <p>Send us a message and we&apos;ll respond within 24 hours.</p>
              <button className={styles.contactBtn}>Send Email</button>
            </div>
          </div>

          <div className={styles.problemSection}>
            <h3 className={styles.sectionTitle}>What can we help you with?</h3>
            <div className={styles.problemGrid}>
              {["My order hasn't arrived", "I need to return an item", "My item arrived damaged","I want to cancel my order", "Problem with payment", "Something else"].map((p) => (
                <button key={p} className={styles.problemBtn}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
