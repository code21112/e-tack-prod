import React, { useState, useEffect } from "react";
import ModalImage from "react-modal-image";
import defaultImage from "./../../images/default-image.png";
import { Image, Transformation, CloudinaryContext } from "cloudinary-react";
import { Link } from "react-router-dom";
import { sortByAlphabeticalOrder } from "./../../functions/utilFunctions";
import { emptyUserCart } from "./../../functions/userFunctions";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
  let imageUrl = p.images[0].url;

  const colors = ["Black", "Brown", "Silver", "White", "Blue"];

  let dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const handleColorChange = (e) => {
    console.log("new color clicked", e.target.value);
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart[i].color = e.target.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleQuantityChange = (e) => {
    let maxQuantity = p.quantity;
    let newQuantity = e.target.value < 1 ? 1 : e.target.value;

    if (newQuantity > maxQuantity) {
      toast.info(
        `You have reached the maximum available quantity: ${maxQuantity} of ${p.title}.`
      );
      return;
    }
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((product, i) => {
        if (product._id === p._id) {
          // cart[i].count = e.target.value;
          cart[i].count = newQuantity;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  // const handleRemove = () => {
  //   // console.log("p._id within handleRemove", p._id);
  //   let cart = [];
  //   if (typeof window !== "undefined") {
  //     if (localStorage.getItem("cart")) {
  //       cart = JSON.parse(localStorage.getItem("cart"));
  //     }
  //     cart.map((product, i) => {
  //       if (product._id === p._id) {
  //         cart.splice(i, 1);
  //       }
  //     });
  //     localStorage.setItem("cart", JSON.stringify(cart));
  //     dispatch({
  //       type: "ADD_TO_CART",
  //       payload: cart,
  //     });
  //   }
  // };

  const handleRemove = () => {
    // console.log("p._id within handleRemove", p._id);
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      if (cart.length > 1) {
        cart.map((product, i) => {
          if (product._id === p._id) {
            cart.splice(i, 1);
          }
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        dispatch({
          type: "ADD_TO_CART",
          payload: cart,
        });
      } else {
        localStorage.removeItem("cart");
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        emptyUserCart(user.token)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", heigth: "auto" }}>
            {p.images.length ? (
              <ModalImage
                small={imageUrl}
                large={imageUrl}
                alt="Product image"
              />
            ) : (
              // transformImage(p.images[0])
              <ModalImage
                small={defaultImage}
                large={defaultImage}
                alt="Product image"
              />
            )}
          </div>
        </td>
        <td className="text-center">
          <Link
            to={`/product/${p.slug}`}
            style={{ textDecoration: "none", color: "#1890ff" }}
          >
            {p.title}
          </Link>
        </td>

        <td className="text-right">{p.price} €</td>
        <td className="text-center">{p.brand}</td>
        <td className="text-center">
          <select
            name="color"
            id=""
            className="form-control select_color border-0 box-shadow-none register_input select_option"
            onChange={handleColorChange}
          >
            {p.color ? (
              <option value={p.color}>{p.color}</option>
            ) : (
              <option>Select</option>
            )}
            {sortByAlphabeticalOrder(colors)
              .filter((c) => c !== p.color)
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </td>
        <td className="text-center" style={{ width: "5%" }}>
          <input
            type="number"
            className="form-control input_quantity border-0 box-shadow-none register_input select_option"
            style={{ paddingBottom: "8.5px" }}
            value={p.count}
            onChange={handleQuantityChange}
          />
        </td>
        <td className="text-center">
          {p.shipping === "Yes" ? (
            // <CheckCircleOutlined style={{ color: "green" }} />
            <CheckCircleOutlined className="text-success" />
          ) : (
            // <CloseCircleOutlined style={{ color: "red" }} />
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className="text-center">
          <CloseOutlined className="text-danger" onClick={handleRemove} />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
