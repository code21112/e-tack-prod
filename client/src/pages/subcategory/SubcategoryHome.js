import React, { useState, useEffect } from "react";
import { getSubcategory } from "./../../functions/subcategoryFunctions";
import { Link } from "react-router-dom";
import ProductCard from "./../../components/cards/ProductCard";
import { LoadingOutlined } from "@ant-design/icons";

const SubcategoryHome = ({ match }) => {
  const [subcategory, setSubcategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getSubcategory(slug)
      .then((res) => {
        // console.log(JSON.stringify(c.data, null, 4));
        console.log(JSON.stringify(res.data.subcategory, null, 4));
        console.log(JSON.stringify(res.data.products, null, 4));

        setSubcategory(res.data.subcategory);
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const showProducts = () =>
    products.map((p) => (
      <div className="col-md-3" key={p._id}>
        <ProductCard product={p} />
      </div>
    ));

  const showTitle = () => {
    if (products.length == 0) {
      return (
        <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
          No product yet in "{subcategory.name}" subcategory.
        </h4>
      );
    } else if (products.length == 1) {
      return (
        <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
          {products.length} product in "{subcategory.name}" subcategory
        </h4>
      );
    } else {
      return (
        <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
          {products.length} products in "{subcategory.name}" subcategory
        </h4>
      );
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {loading ? (
            <div className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              <LoadingOutlined className="h1" />
            </div>
          ) : (
            showTitle()
          )}
        </div>
      </div>
      <div className="row">
        {/* <div className="col"> */}
        {loading ? (
          //   <Row>
          // <Col span={12} offset={10}>
          <LoadingOutlined className="h1" />
        ) : (
          // </Col>
          //   </Row>
          showProducts()
        )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default SubcategoryHome;
