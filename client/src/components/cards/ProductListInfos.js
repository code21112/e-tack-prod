import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import { LoadingOutlined } from "@ant-design/icons";

const ProductListInfos = ({ product, loading }) => {
  const {
    price,
    category,
    subcategories,
    brand,
    color,
    shipping,
    quantity,
    sold,
  } = product;

  return (
    <>
      {loading ? (
        // <LoadingCard count={1} />
        <div
          style={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LoadingOutlined className="h1" />
        </div>
      ) : (
        <ul className="list-group">
          <li className="list-group-item border-bottom-0 pt-5 pl-5 pr-5">
            Price
            <span className="float-end m-0">$ {product.price}</span>
          </li>
          <li className="list-group-item border-bottom-0 pt-3 pl-5 pr-5">
            Brand
            <span className="float-end m-0"> {brand}</span>
          </li>
          {category && (
            <li className="category_container border-bottom-0 border-top-0 pt-3 pl-5 pr-5">
              Category
              <Badge className="category_badge border-bottom-0 pb-2 pt-2">
                <Link to={`/category/${category.slug}`} className="m-0">
                  <span className="category_link">{category.name}</span>
                </Link>
              </Badge>
            </li>
          )}
          {subcategories && (
            <li className="subcategories_container border-bottom-0 border-top-0 pt-3 pl-5 pr-5">
              <span className="subcategories_text">Subcategories</span>
              <span className="subcategories_badges_container">
                {subcategories.map((s) => (
                  <Badge
                    className="subcategories_badge border-bottom-0 pt-2 pb-2 mb-2"
                    key={s._id}
                  >
                    <Link to={`/subcategory/${s.slug}`}>{s.name}</Link>
                  </Badge>
                ))}
              </span>
            </li>
          )}
          <li className="list-group-item border-bottom-0 border-top-0 pt-3 pl-5 pr-5">
            Color
            <span className="float-end m-0"> {color}</span>
          </li>
          <li className="list-group-item border-bottom-0 pt-3 pl-5 pr-5">
            Available
            <span className="float-end m-0 border-bottom-0">{quantity}</span>
          </li>
          <li className="list-group-item border-bottom-0 pt-3 pl-5 pr-5">
            Sold
            <span className="float-end m-0">{sold}</span>
          </li>
          <li className="list-group-item pt-3 pl-5 pr-5 pb-5">
            Shipping
            <span className="float-end m-0">{shipping}</span>
          </li>
        </ul>
      )}
    </>
  );
};

export default ProductListInfos;
