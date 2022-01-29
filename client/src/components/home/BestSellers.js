import React, { useState, useEffect } from "react";
import {
  getProducts,
  getProductsTotal,
} from "./../../functions/productFunctions";
import ProductCard from "./../cards/ProductCard";
import LoadingCard from "./../cards/LoadingCard";
import { Pagination } from "antd";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    loadProducts();
  }, [pageNumber]);

  useEffect(() => {
    getProductsTotal()
      .then((res) => {
        setProductsCount(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const loadProducts = () => {
    setLoading(true);
    getProducts("sold", "desc", pageNumber)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("err within loadProducts in Home.js", err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <LoadingCard count={6} />
        ) : (
          <div className="row">
            {products.map((p) => (
              <div className="col-md-4" key={p._id}>
                <ProductCard product={p} loading={loading} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          {/* <nav className="col-md-4 offset-md-4 text-center pt-5 p-3"> */}
          <Pagination
            current={pageNumber}
            total={(productsCount / 3) * 10}
            onChange={(value) => setPageNumber(value)}
          />
        </nav>
      </div>
    </>
  );
};

export default BestSellers;
