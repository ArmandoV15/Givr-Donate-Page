import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import db from "../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import PulseLoader from "react-spinners/ClipLoader";
import SuccessPage from "./SuccessPage";

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

function validateEmail(users, email) {
  for (var user in users) {
    var Givr = users[user];
    // TODO: Fix this by adding email to firestore!
    if (email === Givr.name) {
      return true;
    }
  }
  return false;
}

function PaymentForm() {
  const [users, setUsers] = useState([]);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [paymentStart, setPaymentStart] = useState(false);
  const [email, setEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  const params = new URLSearchParams(window.location.search);
  const formCharity = params.get("charity");

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

  const handleChange = (e) => {
    setEmail(e.target.value);
    console.log(email);
  };

  const handleSubmit = async (e) => {
    setPaymentStart(true);
    console.log(users);
    e.preventDefault();
    if (validateEmail(users, email)) {
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
              describe: "Please donate this to " + formCharity,
              id: id,
            }
          );

          if (response.data.success) {
            console.log("Successful Payment");
            setSuccess(true);
            setPaymentStart(false);
          }
        } catch (error) {
          console.log(error);
          setErrorMessage(error);
          setPaymentStart(false);
        }
      } else {
        console.log(error);
        setErrorMessage(error);
        setPaymentStart(false);
      }
    } else {
      setErrorMessage({ message: "Email does not match our records" });
      setPaymentStart(false);
    }
  };

  return (
    <>
      {!success ? (
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
                  onChange={handleChange}
                  required
                ></input>
              </div>
              <div className="charity">
                <label htmlFor="charity">Charity</label>
                <input
                  type="text"
                  placeholder="Charity"
                  name="charity"
                  id="charity"
                  value={formCharity}
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
                {!paymentStart ? (
                  <button>Donate</button>
                ) : (
                  <div className="spinner-wrapper">
                    <PulseLoader color={"#009988"} loading={true} size={20} />
                  </div>
                )}
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
      ) : (
        <SuccessPage />
      )}
    </>
  );
}

export default PaymentForm;
