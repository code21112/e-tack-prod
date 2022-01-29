import React from "react";

const CategoryForm = ({ handleSubmit, name, setName, placeholder }) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      {/* <label>Name</label> */}
      <input
        type="text"
        className="form-control border-0 box-shadow-none register_input"
        // placeholder="The name of the category"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
        required
      />
    </div>
    <button className="btn btn-outline-primary">Create</button>
  </form>
);

export default CategoryForm;
