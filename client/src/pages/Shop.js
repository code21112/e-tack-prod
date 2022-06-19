import React, { useState, useEffect } from "react";
import {
  getProductsByCount,
  fetchProductsByFilter,
} from "./../functions/productFunctions";
import {
  getCategories,
  getCategoriesSortedAlpha,
} from "./../functions/categoryFunctions";
import { getSubcategoriesSortedAlpha } from "./../functions/subcategoryFunctions";
import { sortByAlphabeticalOrder } from "./../functions/utilFunctions";
import { useSelector, useDispatch, createSelectorHook } from "react-redux";
import ProductCard from "./../components/cards/ProductCard";
import {
  LoadingOutlined,
  EuroOutlined,
  UnorderedListOutlined,
  StarOutlined,
  TagsOutlined,
  TagFilled,
  BgColorsOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { Row, Col } from "antd";
import { Menu, Slider, Checkbox } from "antd";
import Star from "./../components/forms/Star";

import { Button, Radio, Space } from "antd";

const { SubMenu, ItemGroup } = Menu;

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 4999]);
  const [queryText, setQueryText] = useState("");

  const [ok, setOk] = useState(false);
  const [okPrice, setOkPrice] = useState(false);
  const [okText, setOkText] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesChecked, setCategoriesChecked] = useState([]);
  const [categoryRadioSelected, setCategoryRadioSelected] = useState("");
  const [star, setStar] = useState("");

  const [subcategories, setSubcategories] = useState([]);
  const [subcategory, setSubcategory] = useState("");
  const [subcategoriesSelected, setSubcategoriesSelected] = useState([]);

  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Lenovo",
    "Microsoft",
    "Asus",
  ]);
  const [brand, setBrand] = useState("");

  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);
  const [color, setColor] = useState("");

  const [shipping, setShipping] = useState("");

  let dispatch = useDispatch();
  let { search } = useSelector((state) => ({ ...state }));
  const { text } = search;

  useEffect(() => {
    setLoading(true);
    loadAllProducts();
    getCategoriesSortedAlpha().then((res) => setCategories(res.data));
    getSubcategoriesSortedAlpha().then((res) => setSubcategories(res.data));
  }, []);

  const fetchProducts = (arg) => {
    // setLoading(true);
    fetchProductsByFilter(arg)
      .then((res) => {
        console.log("res.data within fetchProductsByFilter", res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // // 1. Loading ßproducts whent the component mounts
  const loadAllProducts = () => {
    getProductsByCount(9)
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  // // 2. Loading products on the user' search input
  useEffect(() => {
    const delayed = setTimeout(() => {
      fetchProducts({
        query: text,
        price,
        category: categoryRadioSelected,
        stars: star,
      });
    }, 400);
    return () => clearTimeout(delayed);
  }, [text]);

  // // 3. Loading products based on price range
  useEffect(() => {
    console.log("ok to request");
    fetchProducts({
      price,
      query: text,
      category: categoryRadioSelected,
      stars: star,
    });
  }, [okPrice]);

  const handleSlider = (value) => {
    if (arrayEquals(value, [0, 4999])) {
      console.log("price value resetted", value);
      setStar("");
      setSubcategoriesSelected([]);
    }
    setPrice(value);
    setTimeout(() => {
      setOkPrice(!okPrice);
    }, 300);
  };

  const showCategories = () => (
    <Radio.Group defaultValue="" buttonStyle="solid">
      <Space direction="vertical">
        <Radio
          value={""}
          className="pb-1 pr-4 pl-4 pt-1"
          onChange={handleRadioSelect}
        >
          No selection
        </Radio>
        {categories.map((c) => (
          <div key={c._id}>
            <Radio
              value={c._id}
              className="pb-1 pr-4 pl-4 pt-1"
              name="category"
              size="large"
              onChange={handleRadioSelect}
            >
              {c.name}
            </Radio>
          </div>
        ))}
      </Space>
    </Radio.Group>
  );

  const handleRadioSelect = (e) => {
    // setStar("");
    // setSubcategory("");
    // setSubcategoriesSelected([]);
    console.log("e.target.value within handleCheck", e.target.value);
    console.log(
      "typeof e.target.value within handleCheck",
      typeof e.target.value
    );

    // let inTheState = [...categoryRadioSelected];
    let justRadioSelected = e.target.value;
    // let foundInTheState = inTheState.indexOf(justRadioSelected);

    console.log("justRadioSelected", justRadioSelected);
    console.log("typeof justRadioSelected", typeof justRadioSelected);

    // if (foundInTheState === -1) {
    //   inTheState.push(justRadioSelected);
    // } else {
    //   inTheState.splice(justRadioSelected, 1);
    // }
    setCategoryRadioSelected(justRadioSelected);
    // console.log("inTheState", inTheState);
    // console.log("categoriesChecked", categoriesChecked);

    fetchProducts({
      query: text,
      price,
      category: justRadioSelected,
      stars: star,
      sub: subcategoriesSelected,
    });
  };

  // // 5. Loading products based on the rating
  const showStars = () => (
    <div className="pl-4 pr-4 pb-2">
      <Star starClick={handleStarClick} numberOfStars={5} />
      <Star starClick={handleStarClick} numberOfStars={4} />
      <Star starClick={handleStarClick} numberOfStars={3} />
      <Star starClick={handleStarClick} numberOfStars={2} />
      <Star starClick={handleStarClick} numberOfStars={1} />
    </div>
  );

  const handleStarClick = (num) => {
    // console.log("num in handleStarClick", num);
    // setPrice([0, 4999]);
    // setCategoriesChecked([]);
    setStar(num);
    fetchProducts({
      query: text,
      price,
      category: categoryRadioSelected,
      stars: num,
    });
    // dispatch({
    //   type: "SEARCH_QUERY",
    //   payload: { text: " " },
    // });
  };

  const showSubcategories = () =>
    subcategories.map((s) => (
      <Button
        key={s._id}
        onClick={(e) => {
          // handleSubcategories(s);
          handleToggle(e);
          handleSelected(s);
        }}
        // onClic={handleSelected}
        className="p-2 m-1 badge badge-secondary"
        style={{
          cursor: "pointer",
          // margin: "3px",
          color: "black",
          border: "1px solid black",
        }}
        // type="default"
      >
        {s.name}
      </Button>
    ));

 
  const arrayEquals = (a, b) => {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index])
    );
  };


  const handleSelected = (sub) => {
    // console.log("e.target.value handleSelected", e.target.value);
    console.log("sub within handleSelected", sub);

    let inTheState = [...subcategoriesSelected];
    // let justSelected = e.target.value;
    let justSelected = sub;
    let foundInTheState = inTheState.indexOf(justSelected);
    console.log("foundInTheState", foundInTheState);

    if (foundInTheState === -1) {
      inTheState.push(justSelected);
    } else {
      inTheState.splice(foundInTheState, 1);
    }
    setSubcategoriesSelected(inTheState);

    fetchProducts({
      query: text,
      price,
      category: categoryRadioSelected,
      stars: star,
      sub: inTheState,
    });
  };

  const handleToggle = (e) => {
    e.currentTarget.classList.toggle("selected");
  };

  const showBrands = () => {
    let newBrands = sortByAlphabeticalOrder(brands);
    return (
      <Radio.Group defaultValue="" buttonStyle="solid">
        {/* <Space direction="vertical"> */}
        <Radio
          value={""}
          className="pb-1 pr-4 pl-4 pt-1"
          onChange={handleRadioSelectBrand}
        >
          No selection
        </Radio>
        {newBrands.map((b, i) => (
          <div key={i}>
            <Radio
              value={b}
              className="pb-1 pr-4 pl-4 pt-1"
              name="brand"
              size="large"
              onChange={handleRadioSelectBrand}
            >
              {b}
            </Radio>
          </div>
        ))}
        {/* </Space> */}
      </Radio.Group>
    );
  };

  const handleRadioSelectBrand = (e) => {
    // Resetting the other values
    setSubcategoriesSelected([]);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 4999]);
    setStar("");
    setCategoryRadioSelected("");

    setBrand(e.target.value);

    if (e.target.value !== "") {
      fetchProducts({ brand: e.target.value });
    } else {
      loadAllProducts();
    }
  };

  //// 8. Loading products based on the color
  const showColors = () => {
    let newColors = sortByAlphabeticalOrder(colors);
    return (
      <Radio.Group defaultValue="" buttonStyle="solid">
        {/* <Space direction="vertical"> */}
        <Radio
          value={""}
          className="pb-1 pr-4 pl-4 pt-1"
          onChange={handleRadioSelectColor}
        >
          No selection
        </Radio>
        {newColors.map((c, i) => (
          <div key={i}>
            <Radio
              value={c}
              className="pb-1 pr-4 pl-4 pt-1"
              name="color"
              size="large"
              onChange={handleRadioSelectColor}
            >
              {c}
            </Radio>
          </div>
        ))}
        {/* </Space> */}
      </Radio.Group>
    );
  };

  const handleRadioSelectColor = (e) => {
    // Resetting the other values
    setSubcategoriesSelected([]);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 4999]);
    setStar("");
    setCategoryRadioSelected("");

    setColor(e.target.value);

    if (e.target.value !== "") {
      fetchProducts({ color: e.target.value });
    } else {
      loadAllProducts();
    }
  };

  //// 9. Loading products based on the shipping
  const showShipping = () => (
    <Radio.Group defaultValue="" buttonStyle="solid">
      <Space direction="vertical">
        <Radio
          value={""}
          className="pb-1 pr-4 pl-4 pt-1"
          onChange={handleRadioSelectShipping}
        >
          No selection
        </Radio>
        <Radio
          value={"Yes"}
          className="pb-1 pr-4 pl-4 pt-1"
          onChange={handleRadioSelectShipping}
        >
          Yes
        </Radio>
        <Radio
          value={"No"}
          className="pb-1 pr-4 pl-4 pt-1"
          onChange={handleRadioSelectShipping}
        >
          No
        </Radio>
      </Space>
    </Radio.Group>
  );

  const handleRadioSelectShipping = (e) => {
    // Resetting the other values
    setSubcategoriesSelected([]);
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, 4999]);
    setStar("");
    setCategoryRadioSelected("");

    setShipping(e.target.value);

    if (e.target.value !== "") {
      fetchProducts({ shipping: e.target.value });
    } else {
      loadAllProducts();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          {JSON.stringify(text)}
          <br />
          {JSON.stringify(price)}
          <br />
          {JSON.stringify(categoryRadioSelected)}
          <br />
          {JSON.stringify(star)}
          <br />
          {JSON.stringify(subcategoriesSelected)}
          <br />
          {brands}
          <h5 className="p-4">Filters</h5>
          <hr />
          <Menu mode="inline" defaultOpenKeys={["1", "2", "3", "5"]}>
            {/* Price SubMenu */}
            <SubMenu
              key={"1"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <EuroOutlined className="mr-2" />
                  Price
                </span>
              }
            >
              <div>
                <Slider
                  className="mr-4 ml-4"
                  tipFormatter={(value) => `$${value}`}
                  range
                  value={price}
                  onChange={handleSlider}
                  max="4999"
                  key="slider"
                />
              </div>
            </SubMenu>
            {/* Categories SubMenu */}
            <SubMenu
              key={"2"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <UnorderedListOutlined className="mr-2" />
                  Category
                </span>
              }
            >
              <div style={{ height: "200px", overflow: "scroll" }}>
                {showCategories()}
              </div>
            </SubMenu>

            {/* Stars SubMenu */}
            <SubMenu
              key={"3"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <StarOutlined className="mr-2" />
                  Rating
                </span>
              }
            >
              {/* <div style={{ height: "100px", overflow: "scroll" }}> */}
              <div>{showStars()}</div>
            </SubMenu>
            {/* Subcategories SubMenu */}
            <SubMenu
              key={"4"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <TagsOutlined className="mr-2" />
                  Subcategories
                </span>
              }
            >
              <div>{showSubcategories()}</div>
            </SubMenu>

            {/* Brands SubMenu */}
            <SubMenu
              key={"5"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <TagFilled className="mr-2" />
                  Brand
                </span>
              }
            >
              <div>
                {/* <div style={{ marginTop: "-10px" }} className="pl-4 pr-4"> */}
                {showBrands(brands)}
              </div>
            </SubMenu>

            {/* Colors SubMenu */}
            <SubMenu
              key={"6"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <BgColorsOutlined className="mr-2" />
                  Color
                </span>
              }
            >
              <div>
                {/* <div style={{ marginTop: "-10px" }} className="pl-4 pr-4"> */}
                {showColors()}
              </div>
            </SubMenu>

            {/* Shipping SubMenu */}
            <SubMenu
              key={"7"}
              title={
                <span
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                  className="h6"
                  key="span"
                >
                  <RocketOutlined className="mr-2" />
                  Shipping
                </span>
              }
            >
              <div>
                {/* <div style={{ marginTop: "-10px" }} className="pl-4 pr-4"> */}
                {showShipping()}
              </div>
            </SubMenu>
          </Menu>
        </div>
        <div
          className="col-md-9"
          style={{
            position: "relative",
            // backgroundColor: "red",
            height: "100vh",
          }}
        >
          {loading ? (
            <>
              <h5 className="text-danger p-4">Loading...</h5>
              <Row
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%",
                }}
              >
                <Col span={12} offset={10}>
                  <LoadingOutlined className="h1" />
                </Col>
              </Row>
            </>
          ) : (
            <>
              <h5 className="p-4">Products</h5>
            </>
          )}
          {!loading && products && products.length === 0 && (
            <p className="pl-4">No product found.</p>
          )}

          <div className="row pb-5">
            {products.map((p) => (
              <div className="col-md-4 mt-4" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
