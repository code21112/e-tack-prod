import React from "react";
import { Card } from "antd";
import defaultImage from "./../../images/default-image.png";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Meta } = Card;

const UserWishlistProductCard = ({ product, handleRemove }) => {
  const { title, description, images, slug } = product;
  return (
    <Card
      style={{
        height: "350px",
        // width: 300,
        objectFit: "cover",
      }}
      // className="m-2"
      className="p-1"
      cover={
        <img
          style={{ height: 200 }}
          src={images && images.length ? images[0].url : defaultImage}
        />
      }
      actions={[
        // <Link to={`/admin/product/${slug}`}>
        //   <EditOutlined className="text-dark" />
        // </Link>,
        <DeleteOutlined
          className="text-danger"
          onClick={() => handleRemove(product._id)}
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 23)}...`}
      />
    </Card>
  );
};

export default UserWishlistProductCard;
