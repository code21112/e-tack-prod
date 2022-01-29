// import React, { useEffect, useState } from "react";
// import AdminNav from "./../../../components/nav/AdminNav";
// import { getCategoriesSortedAlpha } from "./../../../functions/categoryFunctions";

// const SubcategoryCreate = () => {
//   const [categories, setCategories] = useState([]);

//   useEffect(async () => {
//     loadCategories();
//   }, []);

//   const loadCategories = () =>
//     getCategoriesSortedAlpha()
//       .then((res) => setCategories(res.data))
//       .catch((err) => console.log(err));

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-2">
//           <AdminNav />
//         </div>
//         <div className="col-md-10">Subcategory create page</div>
//         <div>
//           {categories.map((category) => (
//             <div
//               key={category._id}
//               className="alert alert-secondary category_name"
//             >
//               {category.name}
//               <span
//                 // onClick={() => handleRemove(category.slug)}
//                 className="btn btn-sm float-right category_icon_delete"
//               ></span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubcategoryCreate;

// import React, { useEffect, useState } from "react";
// import AdminNav from "./../../../components/nav/AdminNav";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import { getCategoriesSortedAlpha } from "./../../../functions/categoryFunctions";
// import {
//   createSubcategory,
//   getSubcategoriesSortedAlpha,
//   removeSubcategory,
// } from "./../../../functions/subcategoryFunctions";
// import { Link } from "react-router-dom";
// import { EditOutlined, DeleteOutlined, WindowsFilled } from "@ant-design/icons";
// import CategoryForm from "./../../../components/forms/CategoryForm";
// import LocalSearch from "./../../../components/forms/LocalSearch";

// const SubcategoryCreate = () => {
//   const { user } = useSelector((state) => ({ ...state }));
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [category, setCategory] = useState("");

//   const [subCategories, setSubCategories] = useState([]);

//   // searching/filtering
//   const [keyword, setKeyword] = useState("");

//   useEffect(async () => {
//     loadCategories();
//   }, []);

//   const loadCategories = () =>
//     getCategoriesSortedAlpha()
//       .then((res) => setCategories(res.data))
//       .catch((err) => console.log(err));

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   createSubcategory({ name, parent: category }, user.token)
//   //     .then((res) => {
//   //       setName("");
//   //       toast.success(`The subcategory"${res.data.name}" has been created.`);
//   //       setTimeout(() => {
//   //         setLoading(false);
//   //       }, 500);
//   //       // loadSubcategories();
//   //     })
//   //     .catch((err) => {
//   //       console.log("err in handleSubmit SubcategoryCreate", err);
//   //       setLoading(false);
//   //       // if (err.response.status === 400) toast.error(err.response.data);
//   //     });
//   // };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // console.log(name);
//     setLoading(true);
//     createSubcategory({ name, parent: category }, user.token)
//       .then((res) => {
//         // console.log(res)
//         setLoading(false);
//         setName("");
//         toast.success(`"${res.data.name}" is created`);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//         // if (err.response.status === 400) toast.error(err.response.data);
//       });
//   };

//   const handleRemove = async (slug) => {
//     if (window.confirm("Deleting this category?")) {
//       setLoading(true);
//       removeSubcategory(slug, user.token)
//         .then((res) => {
//           setLoading(false);
//           toast.success(`"${res.data.name}" deleted.`);
//           // loadSubcategories();
//         })
//         .catch((err) => {
//           if (err.status.code === 400) {
//             setLoading(false);
//             toast.error(err.response.data);
//           } else {
//             toast.error("Subcategory deletion failed.");
//           }
//         });
//     }
//   };

//   const searched = (keyword) => (subcategory) =>
//     subcategory.name.toLowerCase().includes(keyword.trim());

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-2">
//           <AdminNav />
//         </div>
//         <div className="col-md-6 m-4">
//           {loading ? <h4>Loading</h4> : <h4>Create a new subcategory</h4>}
//           <div className="form-group">
//             {/* <label>Category</label> */}
//             <select
//               name="category"
//               className="form-control border-0 box-shadow-none register_input"
//               onChange={(e) => setCategory(e.target.value)}
//             >
//               <option>Select a category</option>
//               {categories.length > 0 &&
//                 categories.map((category, i) => (
//                   <option value={category._id} key={i}>
//                     {category.name}
//                   </option>
//                 ))}
//               {/* {categories.length > 0 &&
//                 categories.map((c) => (
//                   <option value={c._id} key={c._id}>
//                     {c.name}
//                   </option>
//                 ))} */}
//             </select>
//           </div>

//           {/* {category}
//           {JSON.stringify(category)} */}

//           <CategoryForm
//             handleSubmit={handleSubmit}
//             name={name}
//             setName={setName}
//             placeholder="The name of the subcategory"
//           />

//           {/* <LocalSearch keyword={keyword} setKeyword={setKeyword} /> */}

//           {/* {categories.filter(searched(keyword)).map((category) => (
//             <div
//               key={category._id}
//               className="alert alert-secondary category_name"
//             >
//               {category.name}
//               <span
//                 onClick={() => handleRemove(category.slug)}
//                 className="btn btn-sm float-right category_icon_delete"
//               >
//                 <DeleteOutlined className="text-danger" />
//               </span>
//               <Link to={`/admin/subcategory/${category.slug}`}>
//                 <span className="btn btn-sm float-right category_icon_edit">
//                   <EditOutlined className="text-primary" />
//                 </span>
//               </Link>
//             </div>
//           ))} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubcategoryCreate;

import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getCategories,
  getCategoriesSortedAlpha,
} from "../../../functions/categoryFunctions";
import {
  createSubcategory,
  getSubcategories,
  getSubcategoriesSortedAlpha,
  getSubcategoriesByCategorySortedAlpha,
  getSubcategory,
  removeSubcategory,
} from "../../../functions/subcategoryFunctions";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

import Alert from "react-bootstrap/Alert";

const SubCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  // step 1
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    setLoading(true);
    loadCategories();
    loadSubcategories();
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const loadCategories = () =>
    getCategoriesSortedAlpha().then((c) => setCategories(c.data));

  const loadSubcategories = () =>
    getSubcategoriesSortedAlpha().then((s) => {
      // console.log("s within getSubCategories");
      setSubCategories(s.data);
    });

  const loadSubcategoriesByCategorySortedAlpha = (categoryId) =>
    getSubcategoriesByCategorySortedAlpha(categoryId)
      .then((s) => {
        // console.log("s within getSubCategoriesByCategorySortedAlpha");
        setSubCategories(s.data);
      })
      .catch((err) => console.log(err));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    if (category === "") {
      toast.error("You need to select a category");
    } else if (name.length < 3) {
      toast.error("The subcategory name must be 3 characters at least.");
    } else if (name.length > 32) {
      toast.error("The subcategory name must be 32 characters at the most.");
    } else {
      setLoading(true);
      createSubcategory({ name, parent: category }, user.token)
        .then((res) => {
          // console.log(res);
          setLoading(false);
          setName("");
          toast.success(`"${res.data.name}" is created`);
          setLoading(false);
          loadSubcategoriesByCategorySortedAlpha(category);
          // setTimeout(() => {
          //   setLoading(false);
          //   loadSubcategoriesByCategorySortedAlpha(category);
          // }, 500);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          if (err.response.status === 400) toast.error(err.response.data);
        });
    }
  };

  const handleRemove = async (slug) => {
    // let answer = window.confirm("Delete?");
    // console.log(answer, slug);
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeSubcategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.error(`${res.data.name} deleted.`);
          loadSubcategories();
          // loadSubcategoriesByCategorySortedAlpha(category);
        })
        .catch((err) => {
          if (err.response.status === 400) {
            setLoading(false);
            toast.error(err.response.data);
          }
        });
    }
  };

  // step 4
  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col m-4">
          {/* {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Create sub category</h4>
          )} */}
          <h4>Create sub category</h4>

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control border-0 box-shadow-none register_input"
              onChange={(e) => {
                setCategory(e.target.value);
                // loadSubcategoriesByCategorySortedAlpha(category);
                loadSubcategoriesByCategorySortedAlpha(e.target.value);
                if (e.target.value === "Please select") {
                  loadSubcategories();
                }
              }}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>

            {/* {categories.length > 0 && (
              <Select
                options={options}
                value={options.value}
                defaultValue={"Please select"}
              >
                {categories.map(
                  (c, i) => (
                    // <option key={c._id} value={c._id}>
                    //   {c.name}
                    // </option>
                    {options.value = {c._id}, options.label = {c.name}}
                    // <>
                    //   value={c._id} options={c.name} defaultValue=
                    //   {"Please select"}
                    // </>
                  )
                )}
              </Select>
            )} */}
          </div>

          {/* {JSON.stringify(category)} */}

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            placeholder="The name of the subcategory"
          />

          {/* step 2 and step 3 */}
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {/* step 5 */}
          {subCategories.length > 0 &&
            subCategories.filter(searched(keyword)).map((s) => (
              <div className="alert alert-secondary" key={s._id}>
                {s.name}
                <span
                  onClick={() => handleRemove(s.slug)}
                  className="btn btn-sm float-right"
                >
                  <DeleteOutlined className="text-danger" />
                </span>
                <Link to={`/admin/subcategory/${s.slug}`}>
                  <span className="btn btn-sm float-right">
                    <EditOutlined className="text-warning" />
                  </span>
                </Link>
              </div>
            ))}

          {subCategories.length === 0 && !loading && (
            <Alert variant="danger">No subcategory yet.</Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCreate;
