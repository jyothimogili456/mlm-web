import React, { useState } from "react";
import "./Checkout.css";
import { useNavigate } from 'react-router-dom';

// Payment logos from Google
const phonepeLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/PhonePe_Logo.svg/2560px-PhonePe_Logo.svg.png";
const upiLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png";
const gpayLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Google_Pay_logo.svg/2560px-Google_Pay_logo.svg.png";
const paytmLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png";

const mockOrder = [
  {
    id: 1,
    name: "Vestige Glucosamine",
    price: 740,
    qty: 2,
  },
  {
    id: 2,
    name: "Vestige Prime Energy Booster.",
    price: 1270,
    qty: 1,
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [showPayment, setShowPayment] = useState(false);
  const total = mockOrder.reduce((sum, item) => sum + item.price * item.qty, 0);
  const [selected, setSelected] = useState("payOnline");
  const [expanded, setExpanded] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPayment(true);
  };

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>
      {showPayment ? (
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#fff' }}>
          {/* Stepper */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2rem 0' }}>
            {['Cart', 'Review', 'Payment'].map((step, idx) => (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: idx === 2 ? '#7c3aed' : '#22c55e',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.1rem'
                  }}>{idx + 1}</div>
                  <div style={{ marginTop: 8, fontWeight: 600, color: idx === 2 ? '#7c3aed' : '#232220' }}>{step}</div>
                </div>
                {idx < 2 && <div style={{ width: 40, height: 2, background: '#e5e7eb', margin: '0 8px' }} />}
              </React.Fragment>
            ))}
          </div>
          {/* Payment Method Selection */}
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', padding: '2rem', maxWidth: 500, margin: '0 auto', width: '100%' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.5rem' }}>Select payment method</h2>
            {/* Pay Online Card */}
            <div
              style={{
                border: selected === "payOnline" ? "2px solid #a21caf" : "1.5px solid #e5e7eb",
                borderRadius: 12,
                padding: "1.2rem",
                marginBottom: "1.2rem",
                background: selected === "payOnline" ? "#f3e8ff" : "#fff",
                position: "relative",
              }}
              onClick={() => setSelected("payOnline")}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#7c3aed" }}>
                    ₹{total - 40} <span style={{ color: "#232220", fontWeight: 500, fontSize: "1rem", textDecoration: "line-through", marginLeft: 8 }}>₹{total}</span>
                  </div>
                  <div style={{ color: "#059669", fontWeight: 600, fontSize: "1rem" }}>Save ₹40</div>
                </div>
                <input type="radio" checked={selected === "payOnline"} readOnly />
              </div>
              <div style={{ marginTop: 8, fontWeight: 700 }}>Pay Online</div>
              <div style={{ color: "#059669", fontSize: "0.95rem" }}>Extra discount with bank offers <button type="button" style={{ color: "#059669", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}>View Offers</button></div>
            </div>

            {/* Last Used */}
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Last Used</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "1rem" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <img src={phonepeLogo} alt="PhonePe" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'contain', background: '#fff' }} />
                  <span style={{ fontWeight: 700, color: "#7c3aed" }}>PhonePe</span>
                  <div style={{ fontSize: "0.95rem", color: "#059669" }}>Assured cashback up to 100 on paying via RuPay Credit Card on UPI using PhonePe</div>
                  <div style={{ fontSize: "0.95rem", color: "#ef4444" }}>Add items worth Rs.13.00 to avail offer</div>
                </div>
                <input type="radio" checked={selected === "phonepe"} onChange={() => setSelected("phonepe")}/>
              </div>
            </div>

            {/* Expandable Payment Methods */}
            {[
              { key: "upi", label: (<span><img src={upiLogo} alt="UPI" style={{ width: 56, height: 56, verticalAlign: 'middle', marginRight: 8, objectFit: 'contain', background: '#fff' }} />Pay by any UPI App</span>) },
              { key: "wallet", label: "Wallet" },
              { key: "card", label: "Debit/Credit Cards" },
              { key: "netbanking", label: "Net Banking" },
            ].map(method => (
              <div key={method.key} style={{ marginBottom: "1.2rem" }}>
                <div
                  style={{ cursor: "pointer", fontWeight: 700, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "1rem", background: "#f9fafb" }}
                  onClick={() => setExpanded(expanded === method.key ? "" : method.key)}
                >
                  {method.label} 
                  <span style={{ float: "right" }}>{expanded === method.key ? "▲" : "▼"}</span>
                  {method.key === "upi" && <span style={{ fontSize: "0.8rem", color: "#059669", marginLeft: "8px" }}>● Offers Available</span>}
                </div>
                {expanded === method.key && method.key === "upi" && (
                  <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                    {/* PhonePe Option */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: "1rem" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                        <div style={{ width: 40, height: 40, background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>पे</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>PhonePe</div>
                          <div style={{ fontSize: "0.85rem", color: "#059669", marginBottom: '0.3rem' }}>
                            Assured cashback up to 100 on paying via RuPay Credit Card on UPI using PhonePe
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#ef4444" }}>
                            Add items worth Rs.10.00 to avail offer
                          </div>
                        </div>
                      </div>
                      <input type="radio" checked={selected === "phonepe"} onChange={() => setSelected("phonepe")} />
                    </div>
                    
                    {/* GPay Option */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: "1rem" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                        <img src={gpayLogo} alt="Google Pay" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#fff' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>GPay</div>
                          <div style={{ fontSize: "0.85rem", color: "#059669" }}>
                            Fast and secure payments
                          </div>
                        </div>
                      </div>
                      <input type="radio" checked={selected === "gpay"} onChange={() => setSelected("gpay")} />
                    </div>
                    
                    {/* Paytm Option */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: 8, marginBottom: "1rem" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                        <img src={paytmLogo} alt="Paytm" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'contain', background: '#fff' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Paytm</div>
                          <div style={{ fontSize: "0.85rem", color: "#059669" }}>
                            Get cashback on payments
                          </div>
                        </div>
                      </div>
                      <input type="radio" checked={selected === "paytm"} onChange={() => setSelected("paytm")} />
                    </div>
                    
                    {/* UPI Action Buttons */}
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                      <button style={{
                        flex: 1, padding: "0.8rem", border: "1px solid #7c3aed", borderRadius: 6, 
                        background: "#fff", color: "#7c3aed", fontWeight: 600, cursor: "pointer"
                      }}>
                        ADD UPI ID +
                      </button>
                      <button style={{
                        flex: 1, padding: "0.8rem", border: "none", borderRadius: 6, 
                        background: "#7c3aed", color: "#fff", fontWeight: 600, cursor: "pointer"
                      }}>
                        PAY BY ANY UPI APP &gt;
                      </button>
                    </div>
                  </div>
                )}
                {expanded === method.key && method.key === "card" && (
                  <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "1rem", 
                      border: "1px solid #e5e7eb", 
                      borderRadius: 8, 
                      marginBottom: "1rem",
                      cursor: "pointer"
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                        <div style={{ width: 40, height: 40, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', fontWeight: 'bold', fontSize: '1.2rem' }}>💳</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, marginBottom: '0.3rem', color: '#7c3aed' }}>
                            ADD NEW CARD +
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#6b7280" }}>
                            Add a new debit or credit card
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {expanded === method.key && method.key === "netbanking" && (
                  <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                    {/* Search Bar */}
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      border: "1px solid #e5e7eb", 
                      borderRadius: 8, 
                      padding: "0.8rem", 
                      marginBottom: "1rem",
                      background: "#f9fafb"
                    }}>
                      <span style={{ marginRight: "0.5rem", color: "#6b7280" }}>🔍</span>
                      <input 
                        type="text" 
                        placeholder="Search by your bank name" 
                        style={{ 
                          border: "none", 
                          outline: "none", 
                          background: "transparent", 
                          flex: 1,
                          fontSize: "0.9rem"
                        }}
                      />
                    </div>
                    
                    {/* Bank List */}
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {[
                        { name: "State Bank of India", logo: "🏦" },
                        { name: "HDFC Bank", logo: "🏛" },
                        { name: "ICICI Netbanking", logo: "🏢" },
                        { name: "Axis Bank", logo: "🏦" },
                        { name: "Airtel Payments Bank", logo: "📱" },
                        { name: "Allahabad Bank", logo: "🏛" },
                        { name: "Andhra Bank", logo: "🏦" },
                        { name: "Bank of Bahrain and Kuwait", logo: "🏛" },
                        { name: "Bank of Baroda", logo: "🏦" },
                        { name: "Bank of India", logo: "🏛" },
                        { name: "Bank of Maharashtra", logo: "🏦" },
                        { name: "Bharat Bank", logo: "🏛" },
                        { name: "Canara Bank", logo: "🏦" }
                      ].map((bank, index) => (
                        <div key={index} style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between", 
                          padding: "1rem", 
                          border: "1px solid #e5e7eb", 
                          borderRadius: 8, 
                          marginBottom: "0.5rem",
                          cursor: "pointer",
                          background: selected === `bank-${index}` ? "#f3e8ff" : "#fff"
                        }}
                        onClick={() => setSelected(`bank-${index}`)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1 }}>
                            <div style={{ 
                              width: 40, 
                              height: 40, 
                              background: '#f3f4f6', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              color: '#374151', 
                              fontWeight: 'bold', 
                              fontSize: '1.2rem' 
                            }}>
                              {bank.logo}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: '#232220' }}>
                                {bank.name}
                              </div>
                            </div>
                          </div>
                          <input 
                            type="radio" 
                            checked={selected === `bank-${index}`} 
                            onChange={() => setSelected(`bank-${index}`)}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Select Button */}
                    <button style={{
                      width: '100%', 
                      background: '#7c3aed', 
                      color: '#fff', 
                      fontWeight: 600,
                      border: 'none', 
                      borderRadius: 8, 
                      padding: '1rem', 
                      fontSize: '1rem', 
                      marginTop: '1rem', 
                      cursor: 'pointer'
                    }}>
                      Select
                    </button>
                  </div>
                )}
                {expanded === method.key && method.key !== "upi" && method.key !== "card" && method.key !== "netbanking" && (
                  <div style={{ padding: "1rem", background: "#fff" }}>
                    Offers Available
                  </div>
                )}
              </div>
            ))}
            <button
              style={{
                width: '100%', background: '#7c3aed', color: '#fff', fontWeight: 700,
                border: 'none', borderRadius: 8, padding: '1rem', fontSize: '1.1rem', marginTop: '2rem', cursor: 'pointer'
              }}
              onClick={() => navigate('/thank-you')}
            >
              Place Order
            </button>
          </div>
          <div style={{ marginTop: '2.5rem', fontSize: '0.98rem', color: '#bbb', textAlign: 'center' }}>© {new Date().getFullYear()}</div>
        </div>
      ) : (
        <form className="checkout-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="checkout-section">
            <h2>Billing & Shipping Details</h2>
            <div className="checkout-fields">
              <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
              <textarea name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
              <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} required />
              <input type="text" name="state" placeholder="State" value={form.state} onChange={handleChange} required />
              <input type="text" name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} required />
            </div>
          </div>
          <div className="checkout-section order-summary">
            <h2>Order Summary</h2>
            <ul className="order-list">
              {mockOrder.map(item => (
                <li key={item.id} className="order-item">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>
            <div className="order-total-row">
              <span>Total:</span>
              <span className="order-total">₹{total}</span>
            </div>
          </div>
          <button className="checkout-confirm-btn" type="submit">Proceed to Payment</button>
        </form>
      )}
    </div>
  );
}