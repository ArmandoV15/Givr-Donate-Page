import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import db from "../firebase";
import { collection, onSnapshot } from "@firebase/firestore";

let donationValue = 0;

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      color: "#32325D",
      fontWeight: 500,
      fontFamily: "Inter, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",

      "::placeholder": {
        color: "#009988",
      },
    },
    invalid: {
      color: "#E25950",
    },
  },
};

function PaymentForm() {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [charity, setCharity] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(
    () =>
      onSnapshot(collection(db, "Givr"), (snapshot) =>
        setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  const validateValue = (value) => {
    if (!value) {
      console.log("");
    } else if (Number.isNaN(Number(value))) {
      console.log("invalid");
    } else {
      donationValue = value;
    }
  };

  const handleSubmit = async (e) => {
    console.log(users);
    e.preventDefault();
    console.log(charity);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post(
          "https://givr-server.herokuapp.com/donate",
          {
            amount: parseFloat(donationValue) * 100,
            describe: "Please donate this to " + charity,
            id: id,
          }
        );

        if (response.data.success) {
          console.log("Successful Payment");
          setSuccess(true);
        }
      } catch (error) {
        console.log(error);
        setErrorMessage(error);
      }
    } else {
      console.log(error);
      setErrorMessage(error);
    }
  };

  return (
    <>
      <div className="wrapper">
        <div className="form-wrapper">
          <div className="img-wrapper">
            <img
              src={require("../images/givr_reversed.jpeg").default}
              alt="Givr"
              width="200"
              height="200"
            ></img>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="firstName">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                required
              ></input>
            </div>
            <div className="lastName">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required
              ></input>
            </div>
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                required
              ></input>
            </div>
            <div className="charity">
              <label htmlFor="charity">Charity</label>
              <input
                type="text"
                placeholder="Charity"
                name="charity"
                onChange={(event) => setCharity(event.target.value)}
                required
              ></input>
            </div>
            <div className="donation-amount">
              <label htmlFor="donation-amount">Donation Amount</label>
              <CurrencyInput
                placeholder="Amount"
                allowDecimals={false}
                onValueChange={validateValue}
                prefix={"$"}
                step={10}
                required
              />
            </div>
            <div className="payment-box">
              <CardElement options={CARD_OPTIONS} />
            </div>
            <div className="donate">
              <button>Donate</button>
            </div>
            <div className="status-messages">
              {success ? (
                <div className="donate-success-message">
                  <p>Payment was successful</p>
                </div>
              ) : (
                <div className="donate-error-message">
                  <p>{errorMessage.message}</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PaymentForm;
