import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import defaultImage from "./../../images/default-image.png";

const SideDrawer = ({ children }) => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));

  const showCartLength = () => {
    if (cart.length === 1) {
      return "Cart / 1 product";
    } else {
      return `Cart / ${cart.length} products`;
    }
  };

  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={showCartLength()}
      placement="right"
      closable={false}
      onClose={() =>
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        })
      }
      visible={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <>
                <img src={defaultImage} />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      {/* <Link
        to="/cart"
        onClick={() => dispatch({ type: "SET_VISIBLE", payload: false })}
        className="btn btn-raised btn-block text-center"
      >
        Go to cart
      </Link> */}
      <Link to="/cart">
        <button
          onClick={() => dispatch({ type: "SET_VISIBLE", payload: false })}
          className="btn btn-raised btn-block text-center"
        >
          {" "}
          Go to cart
        </button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
