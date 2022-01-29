import {
  AlertTwoTone,
  CheckSquareTwoTone,
  HistoryOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCardInCheckout from "./../components/cards/ProductCardInCheckout";
import { userCart } from "./../functions/userFunctions";

const Cart = ({ history }) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const showCartLength = () => {
    if (cart.length === 1) {
      return "Cart / 1 product";
    } else if (cart.length === 0) {
      return "Cart";
    } else {
      return `Cart / ${cart.length} products`;
    }
  };

  const showCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr className="text-center">
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Quantity</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
      {cart.map((p) => (
        <ProductCardInCheckout key={p._id} p={p} />
      ))}
    </table>
  );

  const showTextProductBasedOnCartlength = () => {
    if (cart.length === 1) {
      return "Product";
    } else if (cart.length === 0) {
      return "No product.";
    } else {
      return "Products";
    }
  };

  const getTotal = () => {
    return cart.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.count * currentValue.price;
    }, 0);
  };

  const saveOrderToDb = () => {
    dispatch({
      type: "CASH_ON_DELIVERY_CLICKED",
      payload: false,
    });
    userCart(cart, user.token)
      .then((res) => {
        console.log("res within saveOrderToDb", res);
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => console.log("error in saveOrderToDb", err));
  };

  const saveCashOrderToDb = () => {
    dispatch({
      type: "CASH_ON_DELIVERY_CLICKED",
      payload: true,
    });
    userCart(cart, user.token)
      .then((res) => {
        console.log("res within saveCashOrderToDb", res);
        if (res.data.ok) {
          history.push("/checkout");
        }
      })
      .catch((err) => console.log("error in saveCashOrderToDb", err));
  };

  return (
    <div className="container-fluid p-4">
      <div className="row">
        <div className="col-md-8">
          {cart ? <h4>{showCartLength()}</h4> : "No cart has been found"}
          {!cart.length ? (
            <p>
              No product in cart.{" "}
              <Link
                to="/shop"
                style={{ textDecoration: "none", color: "#1890ff" }}
              >
                Start shopping!
              </Link>
            </p>
          ) : (
            showCartItems()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order summary</h4>
          <hr />
          {showTextProductBasedOnCartlength()}
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count} = {c.price * c.count} €
              </p>
            </div>
          ))}
          <hr />
          Total: <b>{getTotal()} €</b>
          <hr />
          {user ? (
            <>
              {/* <button className="btn btn-sm btn-primary mt-2"> */}
              <button
                className="btn btn-raised mt-3"
                onClick={saveOrderToDb}
                disabled={!cart.length}
              >
                Proceed to checkout
              </button>
              <br />
              <button
                className="btn btn-raised mt-3 text-primary"
                onClick={saveCashOrderToDb}
                disabled={!cart.length}
              >
                Pay Cash on delivery
              </button>
            </>
          ) : (
            <Link to={{ pathname: "/login", state: { from: "cart" } }}>
              <button
                className="btn btn-raised mt-3"
                // className="btn btn-sm btn-primary mt-2"
                disabled={!cart.length}
              >
                Login to checkout
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
