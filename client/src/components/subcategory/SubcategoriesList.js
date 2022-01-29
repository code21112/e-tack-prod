import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getSubcategories,
  getSubcategoriesSortedAlpha,
} from "./../../functions/subcategoryFunctions.js";
import { LoadingOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

const SubcategoriesList = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubcategoriesSortedAlpha()
      .then((res) => {
        setSubcategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const showSubcategories = () =>
    subcategories.length &&
    subcategories.map((s) => (
      <Link
        to={`/subcategory/${s.slug}`}
        style={{ textDecoration: "none", color: "#1890ff" }}
        className="col btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
        key={s._id}
      >
        {/* <div
        className="btn btn-outlined-primary btn-lg btn-block btn-raised m-3"
        > */}
        {s.name}
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
          showSubcategories()
        )}
      </div>
    </div>
  );
};

export default SubcategoriesList;
