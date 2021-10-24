import './App.css';
import React from "react";
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import PaymentForm from './components/PaymentForm';





const PUBLIC_KEY = 'pk_test_51JgF9BCDmCaQpeqp1eV2eopbWwlqZ6OnPWJQNoCV2DeZDyYp0Nu1kFQn9fz0ncMuJgNaluBozb3sxxb9C787sTZd00QzOUMzWn'
const stripeTestPromise = loadStripe(PUBLIC_KEY)

  function App(){
    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm />
        </Elements>
    );
  }


export default App;
