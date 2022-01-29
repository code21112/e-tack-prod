import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
  const showOrderStatus = (order) => {
    if (order.orderStatus === "Cancelled") {
      return (
        <span className="badge bg-danger text-white">
          {order.orderStatus.toUpperCase()}
        </span>
      );
    } else if (order.orderStatus === "Processing") {
      return (
        <span className="badge bg-info text-white">
          {order.orderStatus.toUpperCase()}
        </span>
      );
    } else if (order.orderStatus === "Completed") {
      return (
        <span className="badge bg-success text-white">
          {order.orderStatus.toUpperCase()}
        </span>
      );
    } else if (order.orderStatus === "Dispatched") {
      return (
        <span className="badge bg-primary text-white">
          {order.orderStatus.toUpperCase()}
        </span>
      );
    } else if (order.orderStatus === "Cash on delivery") {
      return (
        <span className="badge bg-warning text-white">
          {order.orderStatus.toUpperCase()}
        </span>
      );
    } else {
      return (
        <span className="badge bg-secondary text-white">
          {order.orderStatus.toUpperCase()}
        </span>
      );
    }
  };

  const showPaymentInfoInTable = (order) => (
    <>
      <table className="table table-bordered">
        <thead className="bg-light">
          <tr>
            <td scope="col">Payment</td>
            <td scope="col">Amount</td>
            <td scope="col">Method</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="min2">{order.paymentIntent.status.toUpperCase()}</td>
            <td className="min2">
              {(order.paymentIntent.amount /= 100).toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </td>
            <td className="min2">
              {order.paymentIntent.payment_method_types[0].toUpperCase()}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="table table-bordered">
        <thead className="bg-light">
          <tr>
            <td scope="col">Order id</td>
            <td scope="col">Ordered on</td>
            <td scope="col">Status</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="min2">{order.paymentIntent.id}</td>
            <td className="min2">
              {new Date(order.paymentIntent.created * 1000).toDateString()}
            </td>
            {/* <td className="min2">
              {showStatus && (
                <span className="badge bg-primary text-white">
                  {order.orderStatus.toUpperCase()}
                </span>
              )}
            </td> */}
            <td className="min2">{showOrderStatus(order)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );

  return <div>{showPaymentInfoInTable(order)}</div>;

  // <div>
  //   <p>
  //     <span>Order id: {order.paymentIntent.id}</span>
  //     {" / "}
  //     <span>
  //       Amount:{" "}
  //       {(order.paymentIntent.amount /= 100).toLocaleString("fr-FR", {
  //         style: "currency",
  //         currency: "EUR",
  //       })}
  //     </span>{" "}
  //     <span>Currency: {order.paymentIntent.currency.toUpperCase()}</span>{" "}
  //     <span>
  //       Method: {order.paymentIntent.payment_method_types[0].toUpperCase()}
  //     </span>{" "}
  //     <span>Payment: {order.paymentIntent.status.toUpperCase()}</span>{" "}
  //     <span>
  //       Ordered on:{" "}
  //       {Date(order.paymentIntent.created * 1000).toLocaleString()}
  //     </span>{" "}
  //     <span>
  //       Status:{" "}
  //       <span className="badge bg-primary text-white">
  //         {order.orderStatus.toUpperCase()}
  //       </span>
  //     </span>{" "}
  //   </p>
  // </div>
};

export default ShowPaymentInfo;
