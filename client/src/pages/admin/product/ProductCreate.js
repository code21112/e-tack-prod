import React, { useEffect, useState } from "react";
import AdminNav from "./../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createProduct,
  listProducts,
} from "./../../../functions/productFunctions";
import {
  getCategories,
  getCategoriesSortedAlpha,
  getCategorySubcategories,
} from "./../../../functions/categoryFunctions";
import ProductCreateForm from "./../../../components/forms/ProductCreateForm";
import FileUpload from "./../../../components/forms/FileUpload";

// const initialState = {
//   title: "Zenbook UX313",
//   description: "A great ultra notebook",
//   price: "799",
//   categories: [],
//   category: "",
//   subcategories: [],
//   shipping: "Yes",
//   images: [],
//   quantity: "10",
//   colors: ["Black", "Blue", "Brown", "Silver", "White"],
//   brands: ["Apple", "Samsung", "Lenovo", "Microsoft", "Asus"],
//   color: "Blue",
//   brand: "Asus",
// };

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
  category: "",
  subcategories: [],
  shipping: "",
  images: [],
  quantity: "",
  colors: ["Black", "Blue", "Brown", "Silver", "White"],
  brands: ["Apple", "Samsung", "Lenovo", "Microsoft", "Asus"],
  color: "",
  brand: "",
};

const ProductCreate = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [values, setValues] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagesSent, setImagesSent] = useState(false);
  const [newUploadedImages, setNewUploadedImages] = useState([]);

  useEffect(() => {
    setImagesSent(true);
    setValues({ ...values, images: [] });
    loadProducts();
    loadCategories();
    // console.log("uploadedImages within useEffect", uploadedImages);
  }, []);

  const loadProducts = () => {
    listProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  };

  const loadCategories = () => {
    getCategoriesSortedAlpha()
      .then((res) => {
        setValues({ ...values, categories: res.data });
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("e within handleSubmit ProductCreate", e);
    console.log("newUploadedImages within handleSubmit", newUploadedImages);
    setValues({ ...values, images: newUploadedImages });
    console.log(
      "values.images within handleSubmit ProductCreate",
      values.images
    );
    // console.log(values.uploadedImages);

    createProduct(values, user.token)
      .then((res) => {
        console.log("res within handleSubmit in ProductCreate", res);
        // window.alert(`${res.data.title} has been created`);
        toast.success(`The product "${res.data.title}" has been created!`);
        // setTimeout(() => {
        //   setValues(initialState);
        //   // window.location.reload();
        // }, 400);
        loadProducts();
        setImagesSent(true);
        setNewUploadedImages([]);
        setValues({ ...values, images: [] });
        // history.push("/admin/products");
        setTimeout(() => {
          history.push("/admin/products");
        }, 200);
      })
      .catch((err) => {
        console.log("err within handleSubmit ProductCreate", err);
        toast.error(err.response.data.err);
        // if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleChange = (e) => {
    // console.log("e.target.name", e.target.name);
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
    // console.log(e.target.name, "-----", e.target.value);
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    // console.log("e.target.value within handleCategoryChange", e.target.value);
    // console.log(`option selected within ${e.target.name} ===>`, e.target.value);
    setValues({ ...values, subcategories: [], category: e.target.value });
    if (e.target.value !== "Please select") {
      getCategorySubcategories(e.target.value)
        .then((res) => {
          // console.log("res within handleCategoryChange", res);
          setSubcategoriesOptions(res.data);
        })
        .catch((err) => console.log(err));
      setShowSubcategories(true);
    } else {
      setShowSubcategories(false);
    }
  };

  const sortByAlpha = (array) => {
    array.sort(function (a, b) {
      let elementA = a.toUpperCase();
      let elementB = b.toUpperCase();

      if (elementA < elementB) {
        return -1; //nameA comes first
      }
      if (elementA > elementB) {
        return 1; // nameB comes first
      }
      return 0; // names must be equal
    });
    return array;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-6 m-4">
          <h4>Create a product</h4>
          {/* <br /> */}
          <hr />
          {/* {JSON.stringify(values)} */}
          {/* {JSON.stringify(values.images)} */}
          <div className="pt-3 pb-3 col-md-8">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
              imagesSent={imagesSent}
              setImagesSent={setImagesSent}
              newUploadedImages={newUploadedImages}
              setNewUploadedImages={setNewUploadedImages}
            />
          </div>
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            sortByAlpha={sortByAlpha}
            values={values}
            setValues={setValues}
            subcategoriesOptions={subcategoriesOptions}
            showSubcategories={showSubcategories}
          />
          {/* {JSON.stringify(products)}
          {JSON.stringify(values.categories)} */}
          {/* {JSON.stringify(subcategoriesOptions)} */}
          {/* {JSON.stringify(values.subcategories)} */}
          {JSON.stringify(values.images)}
          <hr />
          {JSON.stringify(newUploadedImages)}
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
