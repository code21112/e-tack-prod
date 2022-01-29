import React, { useEffect, useState } from "react";
import { Card, Tabs, Tooltip, Image } from "antd";
import { Link } from "react-router-dom";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  StarOutlined,
} from "@ant-design/icons";
// import { Carousel } from "react-responsive-carousel";
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import defaultImage from "./../../images/default-image.png";
import ProductListInfos from "./ProductListInfos";
import StarRatings from "react-star-ratings";
import RatingModal from "./../modal/RatingModal";
import { showAverage } from "./../../functions/ratingFunctions";
import { isObjectDuplicateBasedOnId } from "./../../functions/utilFunctions";
import { useDispatch, useSelector } from "react-redux";

import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

const { TabPane } = Tabs;

const SingleProduct = ({ product, onStarClick, star, loading }) => {
  const { title, images, description, _id } = product;

  const [toolTip, setToolTip] = useState("Click to add");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [featured, setFeatured] = useState();
  const [modal, setModal] = useState(false);
  const [items, setItems] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const { user, cart } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    // setFeatured(images[0]);
    setItems(images);
  }, []);

  let dispatch = useDispatch();

  const changeTab = (key) => {
    console.log(key);
  };

  const handleDragStart = (e) => e.preventDefault();

  //   const items = [
  //     <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
  //     <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
  //     <img src="path-to-img" onDragStart={handleDragStart} role="presentation" />,
  //   ];

  const Modal = ({
    modal,
    images,
    handleModalFalse,
    currentIndex,
    featured,
  }) => {
    return (
      <div className={modal ? "modal" : "hide"} onClick={handleModalFalse}>
        <div className="wrapper">
          <img src={items[currentIndex]} />
        </div>
      </div>
    );
  };

  const slideTo = (i) => {
    console.log("clicked") || setCurrentIndex(i);
  };

  const onSlideChanged = (e) => {
    setCurrentIndex(e.item);
  };

  const slideNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const slidePrev = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleEnlargeClick = () => {
    setModal(true);
  };

  const handleModalFalse = () => {
    setModal(false);
  };

  const handleAddToCart = () => {
    // Creating cart array
    let cart = [];
    // Checking that we have access to the window object
    if (typeof window !== "undefined") {
      // if cart is iin localStorage ==> GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      let productDuplicate = isObjectDuplicateBasedOnId(cart, product);
      console.log("productDuplicate", productDuplicate);

      // // removing the potential duplicates
      // let unique = _.uniqWith(cart, _.isEqual);
      // console.log("unique", unique);
      // console.log("typeof unique", typeof unique);

      console.log("cart", cart);
      console.log("typeof cart", typeof cart);

      if (!productDuplicate) {
        // pushing the product to cart
        cart.push({
          ...product,
          count: 1,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
      }

      // Changing the toolTip text
      setToolTip("Added");

      // Adding to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <>
      <div className="col-md-7">
        {/* <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          // transitionTime={1000}
          //   dynamicHeight={false}
        >
          {images && images.length ? (
            images.map((image) => (
              <div key={image.public_id}>
                <img src={image.url} />
              </div>
            ))
          ) : (
            <Card
              //   cover={<img style={{ height: 600 }} src={defaultImage} />}
              cover={
                <img
                  className="mb-3 card_product_default-image"
                  src={defaultImage}
                />
              }
            ></Card>
          )}
        </Carousel> */}
        {/* //////////////////////////////////////////// */}
        {/* <Modal
          modal={modal}
          items={items}
          handleModalFalse={handleModalFalse}
          currentIndex={currentIndex}
          featured={featured}
        /> */}
        <AliceCarousel
          mouseTracking
          items={items}
          animationDuration="4000"
          autoPlay="true"
          infinite="true"
          autoWidth="true"
          animationEasingFunction
          autoPlayStrategy
          paddingLeft="200"
          paddingRight="200"
        >
          {images && images.length ? (
            images.map((image) => (
              // <div key={image.public_id}>
              //   <img src={image.url} />
              // </div>
              <>
                <Image
                  preview={{ modalVisible: false }}
                  width="auto"
                  src={image.url}
                  onClick={() => setModalVisible(true)}
                />
                {/* <div style={{ display: "none" }}>
                  <Image.PreviewGroup
                    preview={{
                      modalVisible,
                      onVisibleChange: (vis) => setModalVisible(vis),
                    }}
                  >
                    <Image src={image.url} />
                  </Image.PreviewGroup>
                </div> */}
              </>
            ))
          ) : (
            <Card
              cover={
                <img
                  className="mb-3 card_product_default-image"
                  src={defaultImage}
                />
              }
            ></Card>
          )}
        </AliceCarousel>
        {/* //////////////////////////////////////////// */}
        {/* <Modal
          modal={modal}
          items={items}
          handleModalFalse={handleModalFalse}
          currentIndex={currentIndex}
          featured={featured}
        />
        <AliceCarousel
          //   items={images}
          //   responsive={responsive}
          onSlideChanged={onSlideChanged}
          currentIndex={currentIndex}
        />
        <button onClick={() => handleEnlargeClick()}>click to enlarge</button> */}
        {/* <RenderThumbs
          items={images}
          slideNext={slideNext}
          slidePrev={slidePrev}
          slideTo={slideTo}
          responsive={responsive}
        /> */}
        {/* //////////////////////////////////////////// */}
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="Description" key="1">
            {description}
          </TabPane>
          <TabPane tab="More" key="2">
            Need advice to choose? Call us!
          </TabPane>
        </Tabs>
        {/* <Tabs type="card">
          <TabPane tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Need advice to choose? Call us!
          </TabPane>
        </Tabs> */}
      </div>
      <div className="col-md-5">
        {/* <h1 className="bg-info p-3">{title}</h1> */}
        <h1 className="single_product_title p-3">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-3 pb-2">
            <h6>No rating yet</h6>
          </div>
        )}
        <Card
          actions={[
            <>
              <Tooltip title={toolTip}>
                <a onClick={handleAddToCart}>
                  <ShoppingCartOutlined className="text-success" />
                  <br />
                  Add to Cart
                </a>
              </Tooltip>
            </>,
            <Link to="/" className="card_product_icon-and-text">
              <HeartOutlined className="text-info" />
              <br />
              Add to Wishlist
            </Link>,
            // <>
            //   <StarOutlined className="text-danger" />
            //   <br />
            //   Leave a rating
            // </>,
            <RatingModal>
              <StarRatings
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
                // starRatedColor="#1890ff"
              />
            </RatingModal>,
          ]}
        >
          <ProductListInfos product={product} loading={loading} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
