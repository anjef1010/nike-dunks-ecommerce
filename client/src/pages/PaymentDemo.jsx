import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PaymentDemo = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [khaltiReady, setKhaltiReady] = useState(false);

  useEffect(() => {
    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!pendingOrder || !userInfo) return navigate("/checkout");

    setLoading(true);

    fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        ...pendingOrder,
        userEmail: pendingOrder.user?.email || userInfo.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => setOrder({ ...pendingOrder, _id: data._id }))
      .catch(() => toast.error("Failed to create order."))
      .finally(() => setLoading(false));

    // Load Khalti script dynamically
    const script = document.createElement("script");
    script.src = "https://khalti.com/static/khalti-checkout.js";
    script.async = true;
    script.onload = () => setKhaltiReady(true);
    script.onerror = () => toast.error("Failed to load Khalti script.");
    document.body.appendChild(script);
  }, [navigate]);

  if (!order) return <p>Loading order...</p>;
  const totalAmount = order.totalPrice || order.itemsPrice + order.shippingPrice;

  // --- eSewa Payment ---
  const handleEsewaPayment = async () => {
    setLoading(true);
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    try {
      const res = await fetch("http://localhost:5001/api/payment/esewa/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ orderId: order._id }),
      });

      const data = await res.json();
      if (data.esewaUrl) window.location.href = data.esewaUrl;
      else toast.error("Failed to initiate eSewa payment.");
    } catch {
      toast.error("Payment error.");
    } finally {
      setLoading(false);
    }
  };

  // --- Khalti Payment ---
  const handleKhaltiPayment = () => {
    if (!khaltiReady || !window.KhaltiCheckout) {
      toast.error("Khalti script not loaded yet.");
      return;
    }

    const config = {
      publicKey: "test_public_key_xxxxx", // replace with actual test key
      productIdentity: order._id,
      productName: "Order Payment",
      productUrl: "http://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          setLoading(true);
          fetch("http://localhost:5001/api/payment/khalti/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${JSON.parse(localStorage.getItem("userInfo")).token}` },
            body: JSON.stringify({
              token: payload.token,
              amount: payload.amount,
              orderId: order._id,
            }),
          })
            .then((res) => res.json())
            .then(() => {
              toast.success("Khalti payment successful!");
              navigate("/payment-success?method=Khalti");
            })
            .catch(() => {
              toast.error("Khalti payment verification failed.");
              navigate("/payment-failed?method=Khalti");
            })
            .finally(() => setLoading(false));
        },
        onError(error) {
          console.error(error);
          toast.error("Khalti payment error.");
          navigate("/payment-failed?method=Khalti");
        },
        onClose() {
          console.log("Khalti widget closed");
        },
      },
    };

    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount: totalAmount * 100 });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Payment Demo</h2>
      <p>Order Total: Rs. {totalAmount.toFixed(2)}</p>

      {order.paymentMethod === "eSewa" && (
        <button onClick={handleEsewaPayment} disabled={loading}>
          {loading ? "Processing..." : "Pay with eSewa"}
        </button>
      )}

      {order.paymentMethod === "Khalti" && (
        <button onClick={handleKhaltiPayment} disabled={!khaltiReady || loading}>
          {loading ? "Processing..." : !khaltiReady ? "Loading Khalti..." : "Pay with Khalti"}
        </button>
      )}
    </div>
  );
};

export default PaymentDemo;
