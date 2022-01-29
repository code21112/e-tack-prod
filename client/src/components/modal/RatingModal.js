import React, { useState } from "react";
import { Modal, Button } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import { useHistory, useParams } from "react-router-dom";

const RatingModal = ({ children }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [modalVisible, setModalVisible] = useState(false);

  let history = useHistory();
  let { slug } = useParams();

  // console.log("params", params);

  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      history.push({
        pathname: "/login",
        state: { from: `/product/${slug}` },
      });
    }
  };

  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined
          className="text-danger pt-1 mt-1"
          style={{ display: "block" }}
        />
        <span className="pt-3">
          {user ? "Leave a rating" : "Log in to leave a rating"}
        </span>
      </div>
      <Modal
        title="Leave your rating"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("Thanks!");
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        {children}
      </Modal>
    </>
  );
};
export default RatingModal;
