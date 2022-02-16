import "./App.css";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./components/PaymentForm";

const PUBLIC_KEY =
  "pk_live_51JgfV5KEZyhei0VR7szmBQOYR33g54LxRPXsDHsYk7TmnnfZwrZZaOwnXtciKlV0TwxaaIf6gBVzYLM2YBPNRCxM00o3QbSlAn";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}

export default App;
