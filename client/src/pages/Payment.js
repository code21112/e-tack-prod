// import { entries } from "lodash";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "./../components/stripe/StripeCheckout";
import "./../stripe.css";
import { useSelector } from "react-redux";

// Loading Sripe outside of the component's renders ==> avoiding creating a Stripe object on every render
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = ({ history }) => {
  const [paymentStatus, setPaymentStatus] = useState("");

  const { path } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (!path) {
      history.push("/cart");
    }
  }, []);

  // useEffect(() => {
  //   if (paymentStatus === "" || paymentStatus === "done") {
  //     console.log("within if statement useEffect");
  //     console.log("paymentStatus", paymentStatus);

  //     // const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  //     loadStripeCheckout();
  //   }
  // }, []);

  // const loadStripeCheckout = () => {
  //   const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
  //   return (
  //     <Elements stripe={promise}>
  //       <div className="col-md-8 offset-md-2">
  //         <StripeCheckout
  //           setPaymentStatus={setPaymentStatus}
  //           // paymentStatus={paymentStatus}
  //         />
  //       </div>
  //     </Elements>
  //   );
  // };

  return (
    <div className="container p-5 text-center">
      {paymentStatus !== "" ? (
        <h4 className="mb-4">Thank you!</h4>
      ) : (
        <h4 className="mb-4">Complete your purchase</h4>
      )}
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <StripeCheckout setPaymentStatus={setPaymentStatus} />
        </div>
      </Elements>
    </div>
  );
};

export default Payment;
