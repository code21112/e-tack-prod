import React, { useState, useEffect } from "react";
import UserNav from "./../../components/nav/UserNav";
import { getUserOrders } from "./../../functions/userFunctions";
import { getFirstNameTrimmedCapitalizedLimitedTo14Chars } from "./../../functions/utilFunctions";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import ShowPaymentInfo from "./../../components/orders/ShowPaymentInfo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Invoice from "./../../components/orders/Invoice";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  const userFirstNameMod = getFirstNameTrimmedCapitalizedLimitedTo14Chars(
    user.name
  );

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () => {
    setLoading(true);
    getUserOrders(user.token)
      .then((res) => {
        // console.log(
        //   "res.data within loadUserOrders",
        //   JSON.stringify(res.data, null, 4)
        // );
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // const showDownloadLink = (order) => (
  //   <PDFDownloadLink
  //     document={
  //       <Document>
  //         <Page size="A4">
  //           <View>
  //             <Text>Section #1</Text>
  //             <Text>
  //               <p> {order.color}</p>
  //             </Text>

  //             <Text>Section #2</Text>
  //           </View>
  //         </Page>
  //       </Document>
  //     }
  //     // className="btn btn-sm btn-block btn-outline-primary"
  //     // className="btn btn-outline-primary"
  //     className="btn btn-raised mt-2 ml-3"
  //     fileName="invoice.pdf"
  //   >
  //     Download pdf
  //   </PDFDownloadLink>
  // );

  const showDownloadLink = (order) => (
    <PDFDownloadLink
      document={<Invoice order={order} />}
      className="btn btn-raised mt-2 ml-3"
      fileName="invoice.pdf"
    >
      Download pdf
    </PDFDownloadLink>
  );

  const showUserOrders = () =>
    orders.reverse().map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order} />
        {showOrderInTable(order)}
        <div className="row">
          <div className="col">{showDownloadLink(order)}</div>
        </div>
      </div>
    ));

  // const showOrderInTable = (order) => (
  //   <table className="table table-bordered">
  //     <thead className="thead-light">
  //       <tr>
  //         <td scope="col">Title</td>
  //         <td scope="col">Price</td>
  //         <td scope="col">Brand</td>
  //         <td scope="col">Color</td>
  //         <td scope="col">Count</td>
  //         <td scope="col">Shipping</td>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {order.products.map((p, i) => (
  //         <tr key={i}>
  //           <td>
  //             <b>{p.product.title}</b>
  //           </td>
  //           <td>{p.product.price}</td>
  //           <td>{p.product.brand}</td>
  //           <td>{p.product.color}</td>
  //           <td>{p.count}</td>
  //           <td>
  //             {p.product.shipping === "Yes" ? (
  //               <CheckCircleOutlined style={{ color: "green" }} />
  //             ) : (
  //               <CloseCircleOutlined style={{ color: "red" }} />
  //             )}
  //           </td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // );

  const showOrderInTable = (order) => (
    <Table bordered hover>
      <thead className="text-light table_orders">
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          {loading ? (
            <h4 className="p-4">Loading...</h4>
          ) : (
            <>
              <h4 className="p-4">
                {orders.length ? "Your orders:" : "No purchase order."}
              </h4>
              {showUserOrders()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
