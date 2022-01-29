// import React, { useEffect, useState } from "react";
// import AdminNav from "./../../components/nav/AdminNav";
// import { getProductsByCount } from "./../../functions/productFunctions";
// import { LoadingOutlined } from "@ant-design/icons";
// import AdminProductCard from "./../../components/cards/AdminProductCard";

// const AdminDashboard = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadAllProducts(10);
//   }, []);

//   const loadAllProducts = (count) => {
//     setLoading(true);
//     getProductsByCount(count)
//       .then((res) => {
//         console.log(res);
//         setProducts(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-2">
//           <AdminNav />
//         </div>
//         {loading ? (
//           <div className="col-md-10">
//             <h4>All products</h4>
//             <h5 className="text-danger">Loading...</h5>
//             <LoadingOutlined />
//           </div>
//         ) : (
//           <div className="col">
//             <h4>All products</h4>
//             <div className="row">
//               {products.map((product) => (
//                 <div className="col-md-4" key={product._id}>
//                   <AdminProductCard product={product} />
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from "react";
import AdminNav from "./../../components/nav/AdminNav";
import { getOrders, updateOrderStatus } from "./../../functions/adminFunctions";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Orders from "./../../components/orders/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getOrders(user.token)
      .then((res) => {
        // console.log("res.data within loadOrders", res.data);
        console.log(
          "res.data within loadOrders",
          JSON.stringify(res.data, null, 4)
        );
        setOrders(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleStatusChange = (orderId, orderStatus) => {
    updateOrderStatus(orderId, orderStatus, user.token)
      .then((res) => {
        toast.success("Status updated");
        loadOrders();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
