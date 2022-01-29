import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  getCategoriesSortedAlpha,
} from "./../../functions/categoryFunctions.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategoriesSortedAlpha()
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const showCategories = () =>
    categories.length &&
    categories.map((c) => (
      <Link
        to={`/category/${c.slug}`}
        style={{ textDecoration: "none", color: "#1890ff" }}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
        key={c._id}
      >
        {/* <div
        className="btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
        > */}
        {c.name}
        {/* </div> */}
      </Link>
    ));

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <Row>
            <Col span={12} offset={10}>
              <LoadingOutlined className="h1" />
            </Col>
          </Row>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoriesList;
