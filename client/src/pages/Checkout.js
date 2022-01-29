import React, { useState, useEffect } from "react";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderFunction,
} from "./../functions/userFunctions";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState("");

  const [messageCouponApplied, setMessageCouponApplied] = useState("");
  const [currentDiscount, setCurrentDiscount] = useState(0);

  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user, cashOnDelivery } = useSelector((state) => ({ ...state }));
  const couponBoolean = useSelector((state) => state.coupon);

  useEffect(() => {
    // getUserCart(user.token)
    //   .then((res) => {
    //     console.log(
    //       "res.data within getUserCart",
    //       JSON.stringify(res.data, null, 4)
    //     );
    //     setProducts(res.data.products);
    //     setCartTotal(res.data.cartTotal);
    //   })
    //   .catch((err) => console.log(err));
    loadProducts();
  }, []);

  const loadProducts = () => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        getUserCart(user.token)
          .then((res) => {
            console.log(
              "res.data within getUserCart",
              JSON.stringify(res.data, null, 4)
            );
            setProducts(res.data.products);
            setCartTotal(res.data.cartTotal);
          })
          .catch((err) => console.log(err));
      } else {
        history.push("/cart");
      }
    }
  };

  const saveAddressToDb = () => {
    // console.log("address", address);
    saveUserAddress(address, user.token)
      .then((res) => {
        if (res.data.ok) {
          setAddressSaved(true);
          toast.success("Delivery address saved successfully.", {
            position: "top-left",
            autoClose: 2000,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const showNumberOfProductsInCart = () => {
    if (products.length === 1) {
      return "1 Product:";
    } else if (!products.length) {
      return;
    } else {
      return `${products.length} Products:`;
    }
  };

  const handleEmptyCart = async () => {
    // Removing from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // Removing from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    // Removing fron the backend
    emptyUserCart(user.token)
      .then((res) => {
        setProducts([]);
        setCartTotal(0);
        setTotalAfterDiscount(0);
        setCoupon("");
        setMessageCouponApplied("");
        setCurrentDiscount(0);
        toast.success("Your cart is now empty.");
      })
      .catch((err) => console.log(err));
  };

  // const applyDiscountCoupon = () => {
  //   console.log("coupon before sending to backend", coupon);
  //   applyCoupon(coupon, user.token).then((res) => {
  //     console.log("res within applyDiscountCoupon", res.data);
  //     if (res.data) {
  //       setTotalAfterDiscount(res.data);
  //       setMessageCouponApplied(`Coupon applied successfully!`);
  //       // Updating the redux state
  //     }
  //     if (res.data.err) {
  //       setDiscountError(res.data.err);
  //       // Updating the redux state
  //     }
  //   });
  // };

  const applyDiscountCoupon = () => {
    console.log("coupon before sending to backend", coupon);
    applyCoupon(coupon, user.token).then((res) => {
      console.log("res within applyDiscountCoupon", res.data);
      if (res.data.totalAfterDiscount) {
        setTotalAfterDiscount(res.data.totalAfterDiscount);
        // setCurrentDiscount(res.data.currentDiscount);
        setMessageCouponApplied(
          `Coupon applied successfully: -${res.data.currentDiscount} %.`
        );

        // Updating the redux state
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }
      if (res.data.err) {
        setDiscountError(res.data.err);
        setTotalAfterDiscount("");
        setMessageCouponApplied("");
        // Updating the redux state
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill
        theme="bubble"
        value={address}
        onChange={setAddress}
        placeholder={"Type your delivery address"}
        style={{ backgroundColor: "rgba(23, 139, 255, 0.04)" }}
        className="striped"
      />
      <button onClick={saveAddressToDb} className="btn btn-raised mt-2 ml-3">
        Save
      </button>
    </>
  );

  const showOrderSummary = () => (
    <>
      {products.map((p, i) => (
        <div key={i}>
          {p.product.title} ({p.color}) x {p.count} ={" "}
          {p.product.price * p.count} €
        </div>
      ))}
    </>
  );

  const showApplyCoupon = () => (
    <>
      <input
        type="text"
        className="form-control border-0 box-shadow-none register_input"
        style={{ width: "40%" }}
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
          setMessageCouponApplied("");
        }}
        value={coupon}
        placeholder="Type your coupon"
      />
      <button
        onClick={applyDiscountCoupon}
        className="btn btn-raised mt-3 ml-3"
      >
        Apply
      </button>
    </>
  );

  const createCashOrder = () => {
    createCashOrderFunction(user.token, cashOnDelivery, couponBoolean).then(
      (res) => {
        console.log("res within createCashOrder", res);
        if (res.data.ok) {
          // Emptying the cart within localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("cart");
          }
          // Emptying the cart within redux state
          dispatch({
            type: "ADD_TO_CART",
            payload: [],
          });
          // Resetting coupon within redux state
          dispatch({
            type: "COUPON_APPLIED",
            payload: false,
          });
          // Resetting cashOnDelivery within redux state
          dispatch({
            type: "CASH_ON_DELIVERY_CLICKED",
            payload: false,
          });
          // Emptying the cart in the database
          emptyUserCart(user.token);
          // Displaying a toast success message
          toast.success("Your order has been created successfully. Thanks.", {
            autoClose: 2000,
          });
          // Redirecting the user
          setTimeout(() => {
            history.push("/user/history");
          }, 2000);
        }
      }
    );
  };

  return (
    <div className="row p-4">
      <div className="col-md-6">
        <h4>Delivery address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got a coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && (
          <p className="bg-danger text-white p-2 mt-3">{discountError}</p>
        )}
        {messageCouponApplied !== "" && (
          // <p className="bg-success text-white p-2 mt-3">
          <p className="text-white p-2 mt-3 checkout_message">
            {messageCouponApplied}
          </p>
        )}
      </div>
      <div className="col-md-6">
        <h4>Order summary</h4>
        {products.length >= 1 && <hr />}

        <p>{showNumberOfProductsInCart()}</p>
        {showOrderSummary()}
        <hr />
        <p>Cart total: {cartTotal} €</p>
        {totalAfterDiscount > 0 && (
          // <p className="bg-success text-white p-2">
          <p className="text-white p-2 checkout_message">
            New Cart total: {totalAfterDiscount} €
          </p>
        )}
        <div className="row">
          <div className="col-md-6">
            {cashOnDelivery ? (
              <button
                disabled={!products.length || !addressSaved}
                className="btn btn-raised"
                // onClick={() => {
                //   dispatch({
                //     type: "PLACE_ORDER_CLICKED",
                //     payload: true,
                //   });
                // }}
                onClick={createCashOrder}
              >
                Place order
              </button>
            ) : (
              <button
                disabled={!products.length || !addressSaved}
                className="btn btn-raised"
                onClick={() => {
                  dispatch({
                    type: "PLACE_ORDER_CLICKED",
                    payload: true,
                  });
                  history.push("/payment");
                }}
              >
                Place order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={handleEmptyCart}
              className="btn btn-raised"
            >
              Empty cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
