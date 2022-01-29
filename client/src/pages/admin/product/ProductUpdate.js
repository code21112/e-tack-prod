import React, { useState, useEffect } from "react";
import AdminNav from "./../../../components/nav/AdminNav";
import { useSelector } from "react-redux";
import {
  getProduct,
  updateProduct,
} from "./../../../functions/productFunctions";
import {
  getCategories,
  getCategoriesSortedAlpha,
  getCategorySubcategories,
} from "./../../../functions/categoryFunctions";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "./../../../components/forms/ProductUpdateForm";
import FileUpload from "./../../../components/forms/FileUpload";
import { toast } from "react-toastify";

const initialState = {
  title: "",
  description: "",
  price: "",
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

const ProductUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [values, setValues] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategoriesOptions, setSubcategoriesOptions] = useState([]);
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [arrayOfSubcategoriesIds, setArrayOfSubcategoriesIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imagesSent, setImagesSent] = useState(true);
  const [newUploadedImages, setNewUploadedImages] = useState([]);
  const [updatingImages, setUpdatingImages] = useState(true);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    loadProduct();
    loadCategories();
  }, []);

  //   const loadProduct = () => {
  //     getProduct(slug)
  //       .then((p) => {
  //         console.log("product within getProduct", p);
  //         // 1) Load the single product
  //         setValues({ ...values, ...p.data });
  //         // 2) Load the subcategories of the single product's category
  //         getCategorySubcategories(p.data.category._id)
  //           .then((s) => {
  //             setLoading(false);
  //             console.log(
  //               "s.data within getCategorySubcategories in loadProduct",
  //               s.data
  //             );
  //             setSubcategoriesOptions(s.data);
  //           })
  //           .catch((err) => console.log(err));
  //         //   3) Prepare the array of subcategories' ids to dispaly as default values
  //         let array = [];
  //         p.data.subcategories.map((s) => {
  //           array.push(s._id);
  //         });
  //         console.log("array of subcategories id", array)
  //       })
  //       .catch((err) => console.log(err));
  //   };

  //   const loadProduct = () => {
  //     getProduct(slug).then((p) => {
  //       console.log("product within getProduct", p);
  //       // 1) Load the single product
  //       setValues({ ...values, ...p.data });
  //       // 2) Load the subcategories of the single product's category
  //       getCategorySubcategories(p.data.category._id).then((s) => {
  //         setLoading(false);
  //         console.log(
  //           "s.data within getCategorySubcategories in loadProduct",
  //           s.data
  //         );
  //         setSubcategoriesOptions(s.data);
  //       });
  //       //   3) Prepare the array of subcategories' ids to dispaly as default values
  //       let array = [];
  //       p.data.subcategories.map((s) => {
  //         console.log("s within .map in getCategorySubcategories", s);
  //         array.push(s._id);
  //       });
  //       console.log("array of subcategories id", array);
  //       setValues({ ...values, ...p.data, subcategories: array });
  //     });
  //   };

  const loadProduct = () => {
    getProduct(slug).then((p) => {
      // console.log("product within getProduct", p);
      // 1) Load the single product
      setValues({ ...values, ...p.data });
      // 2) Load the subcategories of the single product's category
      getCategorySubcategories(p.data.category._id).then((s) => {
        setLoading(false);
        // console.log(
        //   "s.data within getCategorySubcategories in loadProduct",
        //   s.data
        // );
        setSubcategoriesOptions(s.data);
      });
      //   3) Prepare the array of subcategories' ids to dispaly as default values
      let array = [];
      p.data.subcategories.map((s) => {
        // console.log("s within .map in getCategorySubcategories", s);
        array.push(s._id);
      });
      // console.log("array of subcategories id", array);
      setArrayOfSubcategoriesIds((prev) => array);
    });
  };

  const loadCategories = () => {
    getCategoriesSortedAlpha()
      .then((res) => {
        // console.log(
        //   "res.data within loadCategories in ProductUpdate",
        //   res.data
        // );
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    values.subcategories = arrayOfSubcategoriesIds;
    values.category = selectedCategory ? selectedCategory : values.category;
    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`The product "${res.data.title}" has been updated!`);
        history.push("/admin/products");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
  };

  const handleChange = (e) => {
    // console.log("e.target.name", e.target.name);
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("e.target.value within handleCategoryChange", e.target.value);
    console.log(
      "e.target.value._id within handleCategoryChange",
      e.target.value._id
    );

    // console.log(`option selected within ${e.target.name} ===>`, e.target.value);
    setValues({ ...values, subcategories: [] });
    setSelectedCategory(e.target.value);
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
    if (values.category._id === e.target.value) {
      loadProduct();
    }
    setArrayOfSubcategoriesIds([]);
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

  //   return (
  //     <div className="container-fluid">
  //       <div className="row">
  //         <div className="col-md-2">
  //           <AdminNav />
  //         </div>
  //         {loading ? (
  //           <div className="col m-4">
  //             <h4>Product update</h4>
  //             <LoadingOutlined />
  //           </div>
  //         ) : (
  //           <div className="col m-4">
  //             <h4>Product update</h4>
  //             {/* {JSON.stringify(values)} */}
  //             <div className="pt-3 pb-3 col-md-8">
  //               <FileUpload
  //                 values={values}
  //                 setValues={setValues}
  //                 setLoading={setLoading}
  //                 newUploadedImages={values.images}
  //                 imagesSent={imagesSent}
  //                 setImagesSent={setImagesSent}
  //                 newUploadedImages={values.images}
  //                 setNewUploadedImages={setNewUploadedImages}
  //                 updatingImages={updatingImages}
  //               />
  //             </div>
  //             <ProductUpdateForm
  //               handleSubmit={handleSubmit}
  //               handleChange={handleChange}
  //               values={values}
  //               setValues={setValues}
  //               sortByAlpha={sortByAlpha}
  //               handleCategoryChange={handleCategoryChange}
  //               subcategoriesOptions={subcategoriesOptions}
  //               showSubcategories={showSubcategories}
  //               categories={categories}
  //               arrayOfSubcategoriesIds={arrayOfSubcategoriesIds}
  //               setArrayOfSubcategoriesIds={setArrayOfSubcategoriesIds}
  //               selectedCategory={selectedCategory}
  //             />
  //           </div>
  //         )}
  //       </div>
  //       {JSON.stringify(values.images)}
  //       <hr />
  //       {JSON.stringify(newUploadedImages)}
  //     </div>
  //   );
  // };

  // export default ProductUpdate;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col m-4">
          <h4>Product update</h4>
          {loading ? (
            <LoadingOutlined />
          ) : (
            <div className="pt-3 pb-3 col-md-8">
              <FileUpload
                values={values}
                setValues={setValues}
                setLoading={setLoading}
                newUploadedImages={values.images}
                imagesSent={imagesSent}
                setImagesSent={setImagesSent}
                newUploadedImages={values.images}
                setNewUploadedImages={setNewUploadedImages}
                updatingImages={updatingImages}
              />
            </div>
          )}

          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            sortByAlpha={sortByAlpha}
            handleCategoryChange={handleCategoryChange}
            subcategoriesOptions={subcategoriesOptions}
            showSubcategories={showSubcategories}
            categories={categories}
            arrayOfSubcategoriesIds={arrayOfSubcategoriesIds}
            setArrayOfSubcategoriesIds={setArrayOfSubcategoriesIds}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
      {/* {JSON.stringify(values.images)} */}
    </div>
  );
};

export default ProductUpdate;
