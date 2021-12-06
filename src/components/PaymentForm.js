import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Modal, Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import CurrencyInput from "react-currency-input-field";
import db from "../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import PulseLoader from "react-spinners/ClipLoader";
import SuccessPage from "./SuccessPage";
import { updateDoc, doc } from "firebase/firestore";

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
  const [currentUser, setCurrentUser] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [paymentStart, setPaymentStart] = useState(false);
  const [email, setEmail] = useState("");
  const [currentEmailError, setCurrentEmailError] = useState("");
  const [hardCodedCharity, setHardCodedCharity] = useState("");
  const [customDonation, setCustomDonation] = useState(false);
  const [radioValue, setRadioValue] = useState("");
  const [userProfilePic, setUserProfilePic] = useState("");
  const radios = [
    { name: "$25", value: "25" },
    { name: "$50", value: "50" },
    { name: "$100", value: "100" },
    { name: "Custom", value: "custom" },
  ];
  const stripe = useStripe();
  const elements = useElements();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleToggle = (value) => {
    setRadioValue(value);
    if (value === "custom") {
      setCustomDonation(true);
    } else {
      setCustomDonation(false);
      donationValue = parseInt(value);
    }
  };
  const params = new URLSearchParams(window.location.search);
  const formCharity = params.get("Charity");
  const category = params.get("Category");
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
    if (validateEmail(users, e.target.value)) {
      setCurrentEmailError("");
    } else {
      setCurrentEmailError("If visible after entering please");
    }
  };

  const handleCharityChange = (e) => {
    setHardCodedCharity(e.target.value);
  };

  function validateEmail(users, email) {
    for (var user in users) {
      var Givr = users[user];
      if (
        Givr.email != null &&
        email.toLowerCase() === Givr.email.toLowerCase()
      ) {
        setCurrentUser(Givr.id);
        setUserProfilePic(Givr.imageStorage);
        return true;
      }
    }
    return false;
  }

  function addDonationToUserAccount(users, email) {
    for (var user in users) {
      var Givr = users[user];
      if (
        Givr.email != null &&
        email.toLowerCase() === Givr.email.toLowerCase()
      ) {
        var currentDonations = Givr.donationHistory;
        var newDonation = {
          amount: parseInt(donationValue),
          category: category,
          datetime: new Date(),
          name: formCharity !== "" ? formCharity : hardCodedCharity,
        };
        currentDonations.push(newDonation);
        const currentUser = doc(db, "Givr", Givr.id);
        updateDoc(currentUser, {
          donationHistory: currentDonations,
        });
      }
    }
  }

  const handleSubmit = async (e) => {
    setPaymentStart(true);
    e.preventDefault();
    if (validateEmail(users, email)) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      if (!error && donationValue !== 0) {
        try {
          const { id } = paymentMethod;
          const response = await axios.post(
            "https://givr-server.herokuapp.com/donate",
            {
              amount: parseFloat(donationValue) * 100,
              describe:
                "Please donate this to " +
                (formCharity !== "" ? formCharity : hardCodedCharity),
              id: id,
            }
          );

          if (response.data.success) {
            addDonationToUserAccount(users, email);
            setSuccess(true);
            setPaymentStart(false);
          }
        } catch (error) {
          setErrorMessage(error);
          setPaymentStart(false);
        }
      } else {
        if (donationValue === 0) {
          setErrorMessage({ message: "Must Select A Donation Value" });
        } else {
          setErrorMessage(error);
        }
        setPaymentStart(false);
      }
    } else {
      // setErrorMessage({ message: "Email does not match our records" });
      // setPaymentStart(false);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      if (!error && donationValue !== 0) {
        try {
          const { id } = paymentMethod;
          const response = await axios.post(
            "https://givr-server.herokuapp.com/donate",
            {
              amount: parseFloat(donationValue) * 100,
              describe: "Please donate this to " + hardCodedCharity,
              id: id,
            }
          );

          if (response.data.success) {
            setSuccess(true);
            setPaymentStart(false);
          }
        } catch (error) {
          setErrorMessage(error);
          setPaymentStart(false);
        }
      } else {
        if (donationValue === 0) {
          setErrorMessage({ message: "Must Select A Donation Value" });
        } else {
          setErrorMessage(error);
        }
        setPaymentStart(false);
      }
    }
  };

  return (
    <>
      {!success ? (
        <div className="Main-outter-wrapper">
          <div className="inner-form-wrapper">
            <div className="img-wrapper">
              <img
                src={require("../images/givr_reversed.jpeg").default}
                alt="Givr"
                width="200"
                height="200"
              ></img>
            </div>
            <form className="donationForm" onSubmit={handleSubmit}>
              <div className="firstName">
                <label className="first-name-label" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="first-name-input"
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  required
                ></input>
              </div>
              <div className="lastName">
                <label className="last-name-label" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="last-name-input"
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  required
                ></input>
              </div>
              <div className="email">
                <label className="email-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="email-input"
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={handleChange}
                  required
                ></input>
                {currentEmailError !== "" ? (
                  <span>
                    {" "}
                    {currentEmailError}{" "}
                    <a
                      onClick={handleShow}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      click Here!
                    </a>
                  </span>
                ) : null}
              </div>
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    Email not recognized by our system!!
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  If you have an account please double check your email. If you
                  do not have a givr account set up, No Worries. Your donation
                  will still go through but please consider downloading our
                  application on the app store!
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
              <div className="charity">
                <label className="charity-name-label" htmlFor="charity">
                  Charity
                </label>
                {formCharity !== null ? (
                  <input
                    className="charity-name-input"
                    type="text"
                    placeholder="Charity"
                    name="charity"
                    id="charity"
                    value={formCharity}
                    required
                  ></input>
                ) : (
                  <input
                    className="charity-name-input"
                    type="text"
                    placeholder="Charity"
                    name="charity"
                    id="charity"
                    onChange={(e) => handleCharityChange(e)}
                    required
                  ></input>
                )}
              </div>
              <div className="donation-amount">
                <label
                  className="donation-amount-label"
                  htmlFor="donation-amount"
                >
                  Donation Amount
                </label>
                <ButtonGroup>
                  {radios.map((radio, idx) => (
                    <ToggleButton
                      className={
                        radioValue === radio.value
                          ? "toggle-btn-on"
                          : "toggle-btn-off"
                      }
                      key={idx}
                      id={`radio-${idx}`}
                      type="radio"
                      variant={"toggle-btn"}
                      name="radio"
                      value={radio.value}
                      checked={radioValue === radio.value}
                      onChange={(e) => handleToggle(e.currentTarget.value)}
                    >
                      {radio.name}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
                {customDonation ? (
                  <CurrencyInput
                    className="charity-name-input"
                    placeholder="Amount"
                    allowDecimals={false}
                    onValueChange={validateValue}
                    prefix={"$"}
                    step={10}
                    required
                  />
                ) : null}
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
        <SuccessPage value={userProfilePic} />
      )}
    </>
  );
}

export default PaymentForm;
