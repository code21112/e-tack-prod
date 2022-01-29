import React, { useEffect, useState } from "react";
import AdminNav from "./../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  createCategory,
  getCategories,
  getCategoriesSortedAlpha,
  removeCategory,
} from "./../../../functions/categoryFunctions";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined, WindowsFilled } from "@ant-design/icons";
import CategoryForm from "./../../../components/forms/CategoryForm";
import LocalSearch from "./../../../components/forms/LocalSearch";

const CategoryCreate = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  // searching/filtering
  const [keyword, setKeyword] = useState("");

  useEffect(async () => {
    // let categoriesArray = [];
    // const currentCategories = await getCategories();
    // categoriesArray.push(currentCategories);
    // setCategories(categoriesArray);
    loadCategories();
  }, []);

  // const loadCategories = (categories) =>
  //   categories.map((category, i) => {
  //     return <p key={i}>category</p>;
  //   });

  const loadCategories = () =>
    getCategoriesSortedAlpha()
      .then((res) => setCategories(res.data))
      // .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));

  // const showCategories = (categories) =>
  //   categories &&
  //   categories.map((category, i) => {
  //     <p key={i}>{category.name}</p>;
  //   });

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("name", name);
  //   setLoading(true);
  //   createCategory({ name }, user.token)
  //     .then((res) => {
  //       setLoading(false);
  //       setName("");
  //       toast.success(
  //         `The category "${res.data.name}" has been successfully created.`
  //       );
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setLoading(false);
  //       if (err.response.status === 400) toast.error(err.response.data);
  //     });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    setLoading(true);
    createCategory({ name }, user.token)
      .then((res) => {
        // console.log(res)
        setName("");
        toast.success(`The category "${res.data.name}" has been created.`);
        setTimeout(() => {
          setLoading(false);
        }, 500);
        loadCategories();
      })
      .catch((err) => {
        console.log("err in handleSubmit CategoryCreate", err);
        setLoading(false);
        if (err.response.status === 400) toast.error(err.response.data);
      });
  };

  const handleRemove = async (slug) => {
    if (window.confirm("Deleting this category?")) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((res) => {
          setLoading(false);
          toast.success(`"${res.data.name}" deleted.`);
          loadCategories();
        })
        .catch((err) => {
          if (err.status.code === 400) {
            setLoading(false);
            toast.error(err.response.data);
          } else {
            toast.error("Category deletion failed.");
          }
        });
    }
  };

  const searched = (keyword) => (category) =>
    category.name.toLowerCase().includes(keyword.trim());

  // return (
  //   <div className="container-fluid">
  //     <div className="row">
  //       <div className="col-md-2">
  //         <AdminNav />
  //       </div>
  //       <div className="col-md-6 m-4">
  //         {loading ? <h4>Loading</h4> : <h4>Create a new category</h4>}

  //         {categoryForm()}
  //         {categories.map((category) => (
  //           <div
  //             key={category._id}
  //             className="alert alert-secondary category_name"
  //           >
  //             {category.name}
  //             <span>
  //               <DeleteOutlined className="category_icon_delete" />
  //             </span>
  //             <Link to={`/admin/category/${category.slug}`}>
  //               <EditOutlined className="category_icon_edit" />
  //             </Link>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-6 m-4">
          {loading ? <h4>Loading</h4> : <h4>Create a new category</h4>}

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            placeholder="The name of the category"
          />

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          {/* <div className="row"> */}
          {categories.filter(searched(keyword)).map((category) => (
            <div
              key={category._id}
              className="alert alert-secondary category_name"
            >
              {category.name}
              <span
                onClick={() => handleRemove(category.slug)}
                className="btn btn-sm float-right category_icon_delete"
              >
                <DeleteOutlined className="text-danger" />
              </span>
              <Link to={`/admin/category/${category.slug}`}>
                <span className="btn btn-sm float-right category_icon_edit">
                  <EditOutlined className="text-primary" />
                </span>
              </Link>
            </div>
          ))}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default CategoryCreate;
