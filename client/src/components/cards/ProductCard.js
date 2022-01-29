import React, { Fragment, useState } from "react";
import { Card, Tooltip } from "antd";
import defaultImage from "./../../images/default-image.png";
import { Link } from "react-router-dom";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { showAverage } from "./../../functions/ratingFunctions";
import {
  // isObjectDuplicate,
  isObjectDuplicateBasedOnId,
} from "./../../functions/utilFunctions";

import { useDispatch } from "react-redux";

const { Meta } = Card;

const ProductCard = ({ product, loading }) => {
  const { title, description, images, slug, price } = product;

  const [toolTip, setToolTip] = useState("Click to add");

  let dispatch = useDispatch();

  // const handleProductUnique = async (array, product) => {
  //   let productUnique = await isObjectDuplicate(array, product);
  //   console.log("productUnique", productUnique);
  //   if (productUnique) {
  //     console.log("in if statement productUnique");
  //     localStorage.setItem("cart", JSON.stringify(array));
  //   }
  // };

  const handleAddToCart = () => {
    // Creating cart array
    let cart = [];
    // Checking that we have access to the window object
    if (typeof window !== "undefined") {
      // if cart is iin localStorage ==> GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
        // console.log("cart within if statement", cart);
        // console.log("typeof cart within if statement", typeof cart);
      }
      let productDuplicate = isObjectDuplicateBasedOnId(cart, product);
      console.log("productDuplicate", productDuplicate);

      // // removing the potential duplicates
      // let unique = _.uniqWith(cart, _.isEqual);
      // console.log("unique", unique);
      // console.log("typeof unique", typeof unique);

      // localStorage.setItem("cart", JSON.stringify(unique));

      // Changing the toolTip text
      // setToolTip("Added");

      // dispatch({
      //   type: "ADD_TO_CART",
      //   payload: cart,
      // });

      console.log("cart", cart);
      console.log("typeof cart", typeof cart);

      if (!productDuplicate) {
        // pushing the product to cart
        cart.push({
          ...product,
          count: 1,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      // Changing the toolTip text
      setToolTip("Added");
      // // saving the cart in localStorage
      // localStorage.setItem("cart", JSON.stringify(unique));

      // Adding to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });

      // Showing the cart items within the side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  return (
    <>
      {/* {JSON.stringify(loading)} */}
      {product && product.ratings && product.ratings.length > 0 ? (
        showAverage(product)
      ) : (
        <div className="text-center pt-3 pb-3 product_card_no_rating">
          No rating yet
        </div>
      )}
      <Card
        style={{
          height: "390px",
          // width: 300,
          objectFit: "cover",
        }}
        // className="m-2"
        className="p-1"
        cover={
          <img
            style={{ height: 200 }}
            src={images && images.length ? images[0].url : defaultImage}
            alt="Product"
          />
        }
        actions={[
          <Link
            to={`/product/${slug}`}
            // style={{ textDecoration: "none" }}
            className="card_product_icon-and-text"
          >
            {/* <EyeOutlined className="text-dark" /> */}
            <EyeOutlined className="text-primary" />
            <br />
            {/* <p className="card_product_icon-text">View Product</p> */}
            View Product
          </Link>,
          <div className="card_product_icon-and-text">
            {product.quantity > 1 ? (
              <Tooltip title={toolTip}>
                <a onClick={handleAddToCart}>
                  <ShoppingCartOutlined
                    className="text-success"
                    // onClick={() => handleRemove(slug)}
                  />
                  <br />
                  Add to Cart
                </a>
              </Tooltip>
            ) : (
              <Tooltip title={"Coming back soon..."}>
                <a onClick={handleAddToCart} disabled={true}>
                  <ShoppingCartOutlined
                    className="text-secondary"
                    // onClick={() => handleRemove(slug)}
                  />
                  <br />
                  <span className="text-warning">Out of stock</span>
                </a>
              </Tooltip>
            )}
          </div>,
        ]}
      >
        <Meta
          title={
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <h5>{title}</h5>
              <h5>{price} €</h5>
            </span>
          }
          description={`${description && description.substring(0, 23)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
