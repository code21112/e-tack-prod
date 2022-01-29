import React, { useEffect, useState } from "react";
import AdminNav from "./../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getCategory,
  updateCategory,
} from "./../../../functions/categoryFunctions";
import CategoryForm from "./../../../components/forms/CategoryForm";

const CategoryUpdate = ({ history, match }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    // console.log("match", match);
    // console.log("match.params.slug", match.params.slug);

    // getCategory(match.params.slug)
    //   .then((res) => {
    //     console.log(res);
    //     setName(res.data.name);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    loadCategory();
    // console.log("name within state in useEffect", { name });
  }, []);

  const loadCategory = () => {
    getCategory(match.params.slug)
      .then((category) => {
        setName(category.data.name);
        setOldName(category.data.name);
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(name);
    updateCategory(match.params.slug, { name }, user.token)
      .then((res) => {
        toast.success(
          `Category "${oldName}" updated successfully to "${name}"!`
        );
        history.push("/admin/categories");
      })
      .catch((err) => console.log(err));
  };

  // const categoryForm = () => (
  //   <form onSubmit={handleSubmit}>
  //     <div className="form-group">
  //       <input
  //         type="text"
  //         className="form-control border-0 box-shadow-none register_input"
  //         placeholder="Change the name of the category"
  //         value={name}
  //         onChange={(e) => setName(e.target.value)}
  //         autoFocus
  //         required
  //       />
  //     </div>
  //     <button className="btn btn-outline-primary">Update</button>
  //   </form>
  // );

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-6 m-4">
          {loading ? <h4>Loading</h4> : <h4>Update the category {oldName}</h4>}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            placeholder="Change the name of the category"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryUpdate;
