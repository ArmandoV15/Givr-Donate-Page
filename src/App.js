import "./App.css";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./components/PaymentForm";

const PUBLIC_KEY =
  "pk_test_51JgfV5KEZyhei0VRXMcr92O7d9fxYtKD2hk20EfYByHdtLV15LOSjoMPIWAI0AuT55uZuSP9E3Xdcf17fbOwxbEm004dQgAc8g";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}

export default App;
