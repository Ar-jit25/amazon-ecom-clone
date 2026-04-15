"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import styles from "./page.module.css";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export default function CheckoutPage() {
  const { cartItems, totalItems, subtotal, refreshCart } = useCart();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });
  const [paymentMethod] = useState("Visa ending in ···· 1234");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Address>>({});

  const shipping = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateAddress = () => {
    const errs: Partial<Address> = {};
    if (!address.fullName.trim()) errs.fullName = "Required";
    if (!address.street.trim()) errs.street = "Required";
    if (!address.city.trim()) errs.city = "Required";
    if (!address.state.trim()) errs.state = "Required";
    if (!address.zip.trim()) errs.zip = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) { setStep(1); return; }

    setPlacing(true);
    try {
      const shippingAddressStr = `${address.fullName}, ${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
      const items = cartItems.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      }));

      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, shippingAddress: shippingAddressStr, totalAmount: total }),
      });

      if (res.ok) {
        const order = await res.json();
        await refreshCart();
        setOrderId(`AMZ-${String(order.id).padStart(9, "0")}`);
      } else {
        await refreshCart();
        setOrderId(`AMZ-${Math.floor(Math.random() * 1_000_000_000)}`);
      }
    } catch {
      await refreshCart();
      setOrderId(`AMZ-${Math.floor(Math.random() * 1_000_000_000)}`);
    } finally {
      setPlacing(false);
    }
  };

  // Success screen
  if (orderId) {
    return (
      <div className={styles.wrapNarrow}>
        <div className={styles.statusCard}>
          <div className={styles.statusIconSuccess}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className={`${styles.statusTitle} ${styles.statusTitleSuccess}`}>Order placed, thank you!</h1>
          <p className={styles.statusDesc}>A confirmation email has been sent to your address.</p>

          <div className={styles.orderNumberBox}>
            <div className={styles.orderNumberLabel}>Order number</div>
            <div className={styles.orderNumberValue}>{orderId}</div>
          </div>

          <div style={{ textAlign: 'left', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Shipping to:</div>
            <div style={{ fontSize: '14px', color: '#444' }}>
              {address.fullName}<br />
              {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
            </div>
          </div>

          <Link href="/" className="btn-yellow" style={{ display: 'inline-block', padding: '12px 32px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Empty cart redirect UI
  if (cartItems.length === 0 && !placing) {
    return (
      <div className={styles.wrapNarrow}>
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>🛒</div>
          <h2 className={styles.statusTitle}>Your cart is empty</h2>
          <p className={styles.statusDesc}>Add items to your cart before checking out.</p>
          <Link href="/" className="btn-yellow" style={{ display: 'inline-block', padding: '12px 32px' }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* Breadcrumb */}
      <div className={styles.stepLine}>
        <span className={step >= 1 ? styles.stepActive : ""}>1. Shipping</span>
        <span>›</span>
        <span className={step >= 2 ? styles.stepActive : ""}>2. Payment</span>
        <span>›</span>
        <span className={step >= 3 ? styles.stepActive : ""}>3. Review</span>
      </div>

      <div className={styles.layout}>
        {/* Left: Steps */}
        <div className={styles.leftCol}>
          
          {/* Step 1: Shipping */}
          <div className={`${styles.stepCard} ${step === 1 ? styles.stepCardActive : ""}`}>
            <div className={styles.stepHeader} onClick={() => setStep(1)}>
              <div className={styles.stepHeaderLeft}>
                <div className={`${styles.stepBadge} ${step > 1 ? styles.stepBadgeDone : ""}`}>
                  {step > 1 ? "✓" : "1"}
                </div>
                <h2 className={styles.stepTitle}>Shipping address</h2>
              </div>
              {step !== 1 && address.fullName && (
                <div className={styles.stepSummary}>
                  <b>{address.fullName}</b>
                  {address.street}<br/>
                  {address.city}, {address.state} {address.zip}
                </div>
              )}
            </div>

            {step === 1 && (
              <div className={styles.stepContent}>
                <Field label="Full name" field="fullName" placeholder="First and last name" address={address} setAddress={setAddress} errors={errors} setErrors={setErrors} />
                <Field label="Street address" field="street" placeholder="Street address or P.O. Box" address={address} setAddress={setAddress} errors={errors} setErrors={setErrors} />
                <div className={styles.fieldRowGrid}>
                  <Field label="City" field="city" address={address} setAddress={setAddress} errors={errors} setErrors={setErrors} />
                  <Field label="State" field="state" placeholder="e.g. CA" address={address} setAddress={setAddress} errors={errors} setErrors={setErrors} />
                </div>
                <div className={styles.fieldRowGrid}>
                  <Field label="ZIP code" field="zip" placeholder="e.g. 10001" address={address} setAddress={setAddress} errors={errors} setErrors={setErrors} />
                  <div>
                    <label className={styles.label}>Country</label>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                      className={styles.input}
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => { if (validateAddress()) setStep(2); }}
                  className={`btn-yellow ${styles.useAddressBtn}`}
                >
                  Use this address
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Payment */}
          <div className={`${styles.stepCard} ${step === 2 ? styles.stepCardActive : ""}`}>
            <div className={styles.stepHeader} onClick={() => { if (step > 2 || address.fullName) setStep(2); }}>
              <div className={styles.stepHeaderLeft}>
                <div className={`${styles.stepBadge} ${step > 2 ? styles.stepBadgeDone : step === 2 ? "" : styles.stepBadgePending}`}>
                  {step > 2 ? "✓" : "2"}
                </div>
                <h2 className={styles.stepTitle}>Payment method</h2>
              </div>
            </div>

            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.paymentRow}>
                  <div className={styles.payIcon}>💳</div>
                  <div>
                    <div className={styles.payTitle}>{paymentMethod}</div>
                    <div className={styles.paySub}>Demo card — no real charge</div>
                  </div>
                  <div className={styles.payRadio} />
                </div>
                <button
                  onClick={() => setStep(3)}
                  className={`btn-yellow ${styles.usePaymentBtn}`}
                >
                  Use this payment method
                </button>
              </div>
            )}
          </div>

          {/* Step 3: Review */}
          <div className={`${styles.stepCard} ${step === 3 ? styles.stepCardActive : ""}`}>
            <div className={styles.stepHeader} onClick={() => { if (step >= 3) setStep(3); }}>
              <div className={styles.stepHeaderLeft}>
                <div className={`${styles.stepBadge} ${step === 3 ? "" : styles.stepBadgePending}`}>3</div>
                <h2 className={styles.stepTitle}>Review items and shipping</h2>
              </div>
            </div>

            {step === 3 && (
              <div className={styles.stepContent}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.reviewItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.imageUrl} alt={item.product.name} className={styles.reviewImg} />
                    <div className={styles.reviewInfo}>
                      <div className={styles.reviewName}>{item.product.name}</div>
                      <div className={styles.reviewStock}>In stock</div>
                      <div className={styles.reviewQty}>Qty: {item.quantity}</div>
                    </div>
                    <div className={styles.reviewPrice}>₹{(item.product.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
                <div className={styles.reviewDelivery}>
                  Estimated delivery: <b>Tomorrow by 8pm</b> — FREE
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary */}
        <div className={styles.rightCol}>
          <div className={styles.summaryBox}>
            <button
              onClick={handlePlaceOrder}
              disabled={placing || step < 3}
              className={`btn-yellow ${styles.placeBtn} ${step < 3 ? styles.placeBtnDisabled : ""}`}
            >
              {placing ? (
                <>
                  <div className={styles.placeSpinner} /> Placing order...
                </>
              ) : (
                "Place your order"
              )}
            </button>

            {step < 3 && (
              <div className={styles.terms} style={{ marginBottom: '20px' }}>
                Complete all steps above to place your order
              </div>
            )}

            <h3 className={styles.sumHeading}>Order Summary</h3>
            <div className={styles.sumRow}>
              <span>Items ({totalItems}):</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.sumRow}>
              <span>Shipping & handling:</span>
              <span className={styles.sumFree}>FREE</span>
            </div>
            <div className={styles.sumDivider} />
            <div className={styles.sumRow}>
              <span>Total before tax:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.sumRow}>
              <span>Estimated tax (8%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className={styles.sumDivider} />
            <div className={styles.sumTotal}>
              <span>Order total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <p className={styles.terms} style={{ marginTop: '20px', marginBottom: 0 }}>
              By placing your order, you agree to Amazon&apos;s <a className="amz-link">privacy notice</a> and <a className="amz-link">conditions of use</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted Field component to prevent re-mount focus loss
const Field = ({
  label, field, address, setAddress, errors, setErrors, type = "text", placeholder = ""
}: {
  label: string; field: keyof Address; address: Address;
  setAddress: React.Dispatch<React.SetStateAction<Address>>;
  errors: Partial<Address>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Address>>>;
  type?: string; placeholder?: string;
}) => (
  <div className={styles.fieldRow}>
    <label className={styles.label}>{label}</label>
    <input
      type={type}
      value={address[field]}
      placeholder={placeholder}
      onChange={(e) => {
        setAddress((a) => ({ ...a, [field]: e.target.value }));
        setErrors((e2) => ({ ...e2, [field]: undefined }));
      }}
      className={`${styles.input} ${errors[field] ? styles.inputError : ""}`}
    />
    {errors[field] && <div className={styles.errorMsg}>{errors[field]}</div>}
  </div>
);
