import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  createCoupon,
  getCoupons,
  getCouponsSortedAlpha,
  removeCoupon,
} from "../../../functions/couponFunctions";
import { DeleteOutlined, WindowsFilled } from "@ant-design/icons";
import AdminNav from "./../../../components/nav/AdminNav";

const CouponCreate = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [expiryToDisplay, setExpiryToDisplay] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);

  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = () => {
    setLoading(true);
    getCouponsSortedAlpha()
      .then((res) => {
        setCoupons(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  // const showNumberOfCoupons = () => {
  //   if (coupons.length === 1) {
  //     return "1 coupon:";
  //   } else if (!coupons.length) {
  //     return "No coupon";
  //   } else {
  //     return `${coupons.length} coupons`;
  //   }
  // };

  const showExpiryDate = (date) => {
    setExpiry(date);
    setExpiryToDisplay(date.toLocaleDateString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.table(name, discount, expiry);
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setDiscount("");
        setExpiry("");
        setExpiryToDisplay("");

        toast.success(`Coupon "${res.data.name}" has been created.`);
        loadCoupons();
      })
      .catch((err) => {
        console.log("coupon creation error", err);
        setLoading(false);
        // toast.error(err.response.data.err);
        toast.error(err.response.data);
      });
  };

  // const handleRemove = async (id) => {
  //   removeCoupon(id, user.token)
  //     .then((res) => {
  //       toast.success(`${res.data.name} deleted.`);
  //       loadCoupons();
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error(err.response.data);
  //     });
  // };

  const handleRemove = (couponId) => {
    if (window.confirm("Delete this coupon?")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          loadCoupons();
          setLoading(false);
          toast.success(`Coupon "${res.data.name}" deleted.`);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-6 m-4">
          {/* <h4>{showNumberOfCoupons()}</h4> */}
          {loading ? (
            <h4 className="text-danger"> Loading</h4>
          ) : (
            <h4>Coupon</h4>
          )}
          {/* {JSON.stringify(expiry)}
          {JSON.stringify(coupons.length)} Coupons */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              {/* <label className="text-muted">Name</label> */}
              <input
                placeholder="Name"
                type="text"
                className="form-control border-0 box-shadow-none register_input"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <input
                placeholder="Discount %"
                type="text"
                className="form-control border-0 box-shadow-none register_input"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>

            <div className="form-group">
              <DatePicker
                className="form-control border-0 box-shadow-none register_input"
                placeholderText="Expiry"
                selected={new Date()}
                // onChange={(date) => setExpiry(date)}
                onChange={(date) => showExpiryDate(date)}
                value={expiryToDisplay}
                required
                // dateFormat="dd/MM/yyyy"
                locale="pt-BR"
              />
            </div>
            <button className="btn btn-outline-primary" disabled={loading}>
              Save
            </button>
          </form>
          {coupons.length ? (
            <table className="table table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col" className="text-center">
                    Name
                  </th>
                  <th scope="col" className="text-center">
                    Discount
                  </th>
                  <th scope="col" className="text-center">
                    Expiry
                  </th>
                  <th scope="col" className="text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>{c.name}</td>
                    <td className="text-right">{c.discount} %</td>
                    <td className="text-center">
                      {new Date(c.expiry).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 0,
                        paddinBottom: 0,
                        marginTop: "3px",
                      }}
                    >
                      <DeleteOutlined
                        onClick={(e) => handleRemove(c._id)}
                        className="text-danger pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <h5>No coupon.</h5>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponCreate;
