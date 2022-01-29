import React, { useState, useEffect } from "react";
import UserNav from "./../../components/nav/UserNav";
import {
  getWishlist,
  removeFromWishlist,
} from "./../../functions/userFunctions";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import UserWishlistProductCard from "./../../components/cards/UserWishlistProductCard";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    getWishlist(user.token)
      .then((res) => {
        console.log("res within loadWishlist", res);
        setWishlist(res.data.wishlist);
      })
      .catch((err) => console.log(err));
  };

  const handleRemove = (productId) => {
    removeFromWishlist(productId, user.token)
      .then((res) => {
        loadWishlist();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col">
          <h5 className="p-4">Wishlist</h5>
          <div className="row">
            {wishlist.map((p) => (
              // <div key={p._id} className="alert alert-secondary">
              //   <Link to={`/product/${p.slug}`}>{p.title}</Link>
              //   <span
              //     onClick={() => handleRemove(p._id)}
              //     className="btn btn-sm float-right"
              //   >
              //     <DeleteOutlined className="text-danger pb-4" />
              //   </span>
              // </div>
              <div className="col-md-4 pb-3" key={p._id}>
                <UserWishlistProductCard
                  handleRemove={handleRemove}
                  product={p}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
