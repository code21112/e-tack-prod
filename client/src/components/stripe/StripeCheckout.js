import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { createPaymentIntent } from "./../../functions/stripeFunctions";
import { getFirstNameTrimmedCapitalizedLimitedTo14Chars } from "./../../functions/utilFunctions";
import { createOrder, emptyUserCart } from "./../../functions/userFunctions";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { EuroOutlined, CheckOutlined } from "@ant-design/icons";
import defaultImage from "./../../images/default-image.png";
import { loadStripe } from "@stripe/stripe-js";

const StripeCheckout = ({ history, setPaymentStatus }) => {
  const dispatch = useDispatch();
  const { user, coupon } = useSelector((state) => ({ ...state }));

  const userFirstname = getFirstNameTrimmedCapitalizedLimitedTo14Chars(
    user.name
  );

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");

  const [payable, setPayable] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent(user.token, coupon)
      .then((res) => {
        console.log("res within createPaymentIntent function", res.data);
        setClientSecret(res.data.clientSecret);

        // Additionnal information received from backend when successfull payment
        setCartTotal(res.data.cartTotal);
        setTotalAfterDiscount(res.data.totalAfterDiscount);
        setPayable(res.data.payable);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: e.target.name.value,
        },
      },
    });
    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      // Getting result after successfull payment
      // Creating the order and saving it in database ==> for admin user to process
      createOrder(payload, user.token)
        .then((res) =>
          // console.log("res witin createOrder StripeCheckout", res.data)
          {
            if (res.data.ok) {
              // Emptying the user's cart from localstorage
              if (typeof window !== "undefined")
                localStorage.removeItem("cart");
              // Emptying the user's cart from redux state and localstorage
              dispatch({
                type: "ADD_TO_CART",
                payload: [],
              });

              // Resetting coupon to false in the redux state
              dispatch({
                type: "COUPON_APPLIED",
                payload: false,
              });
              // Emptying the user's cart from the database
              emptyUserCart(user.token);

              // Resetting the state variables
              setPayable(0);
              // setCartTotal(0);
              // setTotalAfterDiscount(0);
            }
          }
        )
        .catch((err) => console.log(err));
      console.log(JSON.stringify(payload, null, 4));
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      // Changing paymentStatus for the parent component Payment
      setPaymentStatus("done");
      loadStripeForm();
    }
  };

  const handleChange = async (e) => {
    // Listen for changes within CardElement
    // Display any error found when the user types his/hers card details
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  const loadStripeForm = () => (
    <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
      <CardElement
        id="card-element"
        options={cartStyle}
        onChange={handleChange}
      />
      <button
        className="stripe-button"
        disabled={disabled || processing || succeeded}
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            // `Pay ${payable / 100} €`
            "Pay"
          )}
        </span>
      </button>
      <br />
      {error && (
        <div className="card-error" role="alert">
          {error} ?
        </div>
      )}
      <br />
      <p className={succeeded ? "result-message" : "result-image hidden"}>
        Payment succeeded <Link to="/user/history">Your purchase history</Link>
      </p>
    </form>
  );

  const cartStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <>
      {!succeeded && (
        <div>
          {coupon && totalAfterDiscount !== undefined ? (
            <p className="text-white payment_message p-3 mt-4">
              {`Your discount is: ${
                cartTotal - totalAfterDiscount
              } €. Great job ${userFirstname} !`}
            </p>
          ) : (
            <p className="alert alert-info">
              We use Stripe, everything is secured.
            </p>
          )}
        </div>
      )}
      {/* {succeeded ? (
        <div className="text-center">
          <Card
            cover={
              <img
                src={defaultImage}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "-50px",
                }}
              />
            }
          />
        </div>
      ) : (
        <div className="text-center">
          <Card
            cover={
              <img
                src={defaultImage}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  marginBottom: "-50px",
                }}
              />
            }
            actions={[
              <>
                <EuroOutlined className={!succeeded ? "text-info" : "d-none"} />
                <br />
                <div className={!succeeded ? "mt-1" : "d-none"}>
                  Total: {cartTotal.toFixed(2)} €
                </div>
              </>,

              <>
                <CheckOutlined
                  className={!succeeded ? "text-info" : "d-none"}
                />
                <br />
                <div className={!succeeded ? "mt-1" : "d-none"}>
                  Total payable: {(payable / 100).toFixed(2)} €
                </div>
              </>,
            ]}
          />
        </div>
      )} */}

      <div className="text-center">
        <Card
          cover={
            <img
              src={defaultImage}
              style={{
                height: "200px",
                objectFit: "cover",
                marginBottom: "-50px",
              }}
            />
          }
          actions={[
            <>
              <EuroOutlined className={!succeeded ? "text-info" : "d-none"} />
              <br />
              <div className={!succeeded ? "mt-1" : "d-none"}>
                Total: {cartTotal.toFixed(2)} €
              </div>
            </>,

            <>
              <CheckOutlined className={!succeeded ? "text-info" : "d-none"} />
              <br />
              <div className={!succeeded ? "mt-1" : "d-none"}>
                Total payable: {(payable / 100).toFixed(2)} €
              </div>
            </>,
          ]}
        />
      </div>

      {loadStripeForm()}
      {/* <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
        <CardElement
          id="card-element"
          options={cartStyle}
          onChange={handleChange}
        />
        <button
          className="stripe-button"
          disabled={disabled || processing || succeeded}
        >
          <span id="button-text">
            {processing ? (
              <div className="spinner" id="spinner"></div>
            ) : (
              `Pay ${payable / 100} €`
            )}
          </span>
        </button>
        <br />
        {error && (
          <div className="card-error" role="alert">
            {error}
          </div>
        )}
        <br />
        <p className={succeeded ? "result-message" : "result-image hidden"}>
          Payment succeeded{" "}
          <Link to="/user/history">Your purchase history</Link>
        </p>
      </form> */}
    </>
  );
};

export default StripeCheckout;
