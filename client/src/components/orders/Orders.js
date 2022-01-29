import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ShowPaymentInfo from "./ShowPaymentInfo";
import Table from "react-bootstrap/Table";

const Orders = ({ orders, handleStatusChange }) => {
  const showOrderInTable = (order) => (
    <Table bordered hover>
      <thead className="text-white table_orders_admin">
        <tr>
          <td scope="col">Title</td>
          <td scope="col">Price</td>
          <td scope="col">Brand</td>
          <td scope="col">Color</td>
          <td scope="col">Quantity</td>
          <td scope="col">Shipping</td>
        </tr>
      </thead>
      <tbody>
        {order.products.map((p, i) => (
          <tr key={i}>
            <td className="min">
              <b>{p.product.title}</b>
            </td>
            <td className="min">{p.product.price} €</td>
            <td className="min">{p.product.brand}</td>
            <td className="min">{p.product.color}</td>
            <td className="min">{p.count}</td>
            <td className="min">
              {p.product.shipping === "Yes" ? (
                <CheckCircleOutlined className="text-success h5" />
              ) : (
                // <CloseCircleOutlined className="text-warning" />
                "Local pickup"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <>
      {orders.map((order) => (
        <div key={order._id} className="row pb-5">
          <div className="btn btn-block bg-light">
            <ShowPaymentInfo order={order} showStatus={true} />

            <div className="row">{showOrderInTable(order)}</div>
            <div className="row">
              <div className="col-md-4 mt-2">Delivery status</div>
              <div className="col-md-8">
                <select
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  // className="form-control"
                  //   className="col-md-3 form-select box-shadow-none register_input border-0 box-shadow-none"
                  //   className="col-md-6 form-select box-shadow-none register_input border-0 box-shadow-none"
                  // className="col-md-4 form-control border-0 box-shadow-none register_input bg-primary text-white text-center"
                  className="col-md-4 form-control border-0 box-shadow-none register_input bg-white text-primary text-center"
                  defaultValue={order.orderStatus}
                  name="status"
                >
                  <option value="Cancelled">Cancelled</option>
                  <option value="Cash on delivery">Cash on delivery</option>
                  <option value="Completed">Completed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Not Processed">Not processed</option>
                  <option value="Processing">Processing</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Orders;
