// src/pages/shop/paypal-cancel.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaypalCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: show toast / message
    // Optional: call backend to cancel pending order

    // Redirect user back to cart
    navigate("/shop/checkout");
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Payment cancelled</h2>
      <p>Redirecting you back to your cart…</p>
    </div>
  );
};

export default PaypalCancel;
