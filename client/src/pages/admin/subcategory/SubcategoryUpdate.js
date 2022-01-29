// import React, { useEffect, useState } from "react";
// import AdminNav from "./../../../components/nav/AdminNav";
// import { toast } from "react-toastify";
// import { useSelector } from "react-redux";
// import {
//   getSubcategory,
//   updateSubcategory,
// } from "./../../../functions/subcategoryFunctions";
// import CategoryForm from "./../../../components/forms/CategoryForm";

// const SubcategoryUpdate = ({ history, match }) => {
//   const { user } = useSelector((state) => ({ ...state }));
//   const [name, setName] = useState("");
//   const [oldName, setOldName] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(async () => {
//     loadSubcategory();
//   }, []);

//   const loadSubcategory = () => {
//     getSubcategory(match.params.slug)
//       .then((category) => {
//         setName(category.data.name);
//         setOldName(category.data.name);
//       })
//       .catch((err) => console.log(err));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // console.log(name);
//     updateSubcategory(match.params.slug, { name }, user.token)
//       .then((res) => {
//         toast.success(
//           `Subcategory "${oldName}" updated successfully to "${name}"!`
//         );
//         history.push("/admin/subcategories");
//       })
//       .catch((err) => console.log(err));
//   };

//   // const categoryForm = () => (
//   //   <form onSubmit={handleSubmit}>
//   //     <div className="form-group">
//   //       <input
//   //         type="text"
//   //         className="form-control border-0 box-shadow-none register_input"
//   //         placeholder="Change the name of the category"
//   //         value={name}
//   //         onChange={(e) => setName(e.target.value)}
//   //         autoFocus
//   //         required
//   //       />
//   //     </div>
//   //     <button className="btn btn-outline-primary">Update</button>
//   //   </form>
//   // );

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-2">
//           <AdminNav />
//         </div>
//         <div className="col-md-6 m-4">
//           {loading ? (
//             <h4>Loading</h4>
//           ) : (
//             <h4>Update the subcategory {oldName}</h4>
//           )}
//           <CategoryForm
//             handleSubmit={handleSubmit}
//             name={name}
//             setName={setName}
//             placeholder="Change the name of the subcategory"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SubcategoryUpdate;

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
import { getCategories } from "../../../functions/categoryFunctions";
import {
  getSubcategory,
  updateSubcategory,
} from "../../../functions/subcategoryFunctions";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";

import Alert from "react-bootstrap/Alert";

const SubcategoryUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubcategory] = useState([]);

  useEffect(() => {
    // setLoading(true);
    loadCategories();
    loadSubcategory();
    // setTimeout(() => {
    //   setLoading(false);
    // }, 100);
  }, []);

  const loadCategories = () =>
    getCategories().then((c) => setCategories(c.data));

  const loadSubcategory = () =>
    getSubcategory(match.params.slug)
      .then((s) => {
        console.log("s within loadSubcategory", s);
        setName(s.data.name);
        setCategory(s.data.parent);
      })
      .catch((err) => console.log(err));

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    if (!category) {
      toast.error("You need to select a category");
    } else if (name.length < 3) {
      toast.error("The subcategory name must be 3 characters at least.");
    } else if (name.length > 32) {
      toast.error("The subcategory name must be 32 characters at the most.");
    } else {
      setLoading(true);
      updateSubcategory(
        match.params.slug,
        { name, parent: category },
        user.token
      )
        .then((res) => {
          // console.log(res);
          setLoading(false);
          setName("");
          toast.success(`"${res.data.name}" is updated`);
          setLoading(false);
          loadSubcategory(category);
          history.push("/admin/subcategories");
          // setTimeout(() => {
          //   setLoading(false);
          //   loadSubcategoriesByCategorySortedAlpha(category);
          // }, 500);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          // if (err.response.status === 400) toast.error(err.response.data);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {/* {loading ? (
            <h4 className="text-danger">Loading..</h4>
          ) : (
            <h4>Create sub category</h4>
          )} */}
          <h4>Update the subcategory</h4>

          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control border-0 box-shadow-none register_input"
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option>Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                    selected={c._id === category}
                  >
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            // placeholder="The name of the subcategory"
          />
        </div>
      </div>
    </div>
  );
};

export default SubcategoryUpdate;
