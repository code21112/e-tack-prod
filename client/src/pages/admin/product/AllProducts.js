import React, { useEffect, useState } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import {
  getProductsByCount,
  removeProduct,
} from "../../../functions/productFunctions";
import { LoadingOutlined, WindowsFilled } from "@ant-design/icons";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AllProducts = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllProducts(10);
  }, []);

  const loadAllProducts = (count) => {
    setLoading(true);
    getProductsByCount(count)
      .then((res) => {
        // console.log(res);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleRemove = (slug) => {
    let answer = window.confirm("Delete this product?");
    if (answer) {
      console.log("answer delete", slug);
      removeProduct(slug, user.token)
        .then((res) => {
          loadAllProducts(10);
          toast.success(`The product "${res.data.title}" has been removed.`);
        })
        .catch((err) => {
          if (err.response.status === 400) toast.error(err.response.data);
          console.log(err);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        {loading ? (
          <div className="col m-4">
            <h4>All products</h4>
            <h5 className="text-danger">Loading...</h5>
            <LoadingOutlined />
          </div>
        ) : (
          <div className="col m-4">
            <h4>All products</h4>
            <div className="row">
              {products.map((product) => (
                <div className="col-md-4 pb-3" key={product._id}>
                  <AdminProductCard
                    product={product}
                    handleRemove={handleRemove}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
