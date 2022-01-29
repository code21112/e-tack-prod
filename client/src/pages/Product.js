import React, { useState, useEffect } from "react";
import {
  getProduct,
  productStar,
  getRelated,
} from "./../functions/productFunctions";
import SingleProduct from "./../components/cards/SingleProduct3";
import ProductCard from "./../components/cards/ProductCard";
import LoadingCard from "./../components/cards/LoadingCard";

import { useSelector } from "react-redux";

const Product = ({ match }) => {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (element) => element.postedBy.toString() === user._id.toString()
      );
      console.log(
        "existingRatingObject within Product.js",
        existingRatingObject
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  });

  const onStarClick = (newRating, name) => {
    console.table("newRating", newRating, "name", name);
    setStar(newRating);
    productStar(name, newRating, user.token)
      .then((res) => {
        console.log("rating star clicked", res.data);
        loadSingleProduct();
      })
      .catch((err) => console.log(err));
  };

  const loadSingleProduct = () => {
    getProduct(slug)
      .then((res) => {
        console.log("res.data within loadSingleProduct", res.data);
        setProduct(res.data);
        setLoading(false);
        getRelated(res.data._id)
          .then((res) => {
            console.log("res.data within getRelated", res.data);
            setRelated(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
          loading={loading}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {related.length ? (
          related.map((r) => (
            <div key={r._id} className="col-md-4">
              <ProductCard product={r} />
            </div>
          ))
        ) : (
          <div className="text-center col">No related product found.</div>
        )}
      </div>
    </div>
  );
};

export default Product;
