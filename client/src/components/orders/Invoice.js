import React from "react";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  DataTableCell,
} from "@david.kucsai/react-pdf-table";
import { HashRouter } from "react-router-dom";

const Invoice = ({ order }) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.header} fixed>
        -- {new Date().toDateString()} --
      </Text>
      <Text style={styles.title}>Tanagra</Text>
      <Text style={styles.author}>Order invoice</Text>
      <Text style={styles.subtitle}>Order summary</Text>
      <Table>
        <TableHeader>
          <TableCell style={styles.bgColoredAndCenteredAndTextWhite}>
            Title
          </TableCell>
          <TableCell style={styles.bgColoredAndCenteredAndTextWhite}>
            Price
          </TableCell>
          <TableCell style={styles.bgColoredAndCenteredAndTextWhite}>
            Quantity
          </TableCell>
          <TableCell style={styles.bgColoredAndCenteredAndTextWhite}>
            Brand
          </TableCell>
          <TableCell style={styles.bgColoredAndCenteredAndTextWhite}>
            Color
          </TableCell>
        </TableHeader>
      </Table>

      <Table data={order.products}>
        <TableBody>
          <DataTableCell
            style={styles.dataCell}
            getContent={(x) => x.product.title}
          />
          <DataTableCell
            style={styles.dataCell}
            getContent={(x) => `${x.product.price} €`}
          />
          <DataTableCell style={styles.dataCell} getContent={(x) => x.count} />
          <DataTableCell
            style={styles.dataCell}
            getContent={(x) => x.product.brand}
          />
          <DataTableCell style={styles.dataCell} getContent={(x) => x.color} />
        </TableBody>
      </Table>

      <Text style={styles.text}>
        <Text style={styles.textLine}>Order id: {order.paymentIntent.id}</Text>
        {"\n"}
        <Text style={styles.textLine}>Order status: {order.orderStatus}</Text>
        {"\n"}
        <Text style={styles.textLine}>
          Date: {new Date(order.paymentIntent.created * 1000).toDateString()}
        </Text>
        {"\n"}
        <Text style={styles.textLine}>
          Total paid: {order.paymentIntent.amount} €
        </Text>
      </Text>

      <Text style={styles.footer}>-- Thank you for shopping with us --</Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    // color: "red",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  footer: {
    // padding: "100px",
    fontSize: 12,
    // marginBottom: 20,
    textAlign: "center",
    color: "grey",
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  centered: {
    textAlign: "center",
  },
  bgColoredAndCenteredAndTextWhite: {
    backgroundColor: "#1890ff",
    textAlign: "center",
    color: "white",
    padding: 5,
    fontSize: 10,
  },
  dataCell: {
    fontSize: 11,
    padding: 5,
    textAlign: "center",
  },
  textLine: {
    fontSize: 11,
    padding: 5,
  },
});

export default Invoice;
