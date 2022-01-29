import React from "react";
import { Select } from "antd";

const { Option } = Select;

const ProductCreateForm = ({
  handleSubmit,
  sortByAlpha,
  values,
  setValues,
  handleChange,
  handleCategoryChange,
  subcategoriesOptions,
  showSubcategories,
}) => {
  const {
    title,
    description,
    price,
    categories,
    category,
    subcategories,
    shipping,
    images,
    quantity,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="mt-1">Title</label>
        <input
          type="text"
          name="title"
          className="form-control border-0 box-shadow-none register_input"
          value={title}
          onChange={handleChange}
          placeholder="Product title"
        />
      </div>
      <div className="form-group">
        <label className="mt-2 mb-0">Description</label>
        <input
          type="text"
          name="description"
          className="form-control border-0 box-shadow-none register_input"
          value={description}
          onChange={handleChange}
          placeholder="Product description"
        />
      </div>
      <div className="form-group">
        <label className="mt-2 mb-0">Price</label>
        <input
          type="number"
          name="price"
          className="form-control border-0 box-shadow-none register_input"
          value={price}
          onChange={handleChange}
          placeholder="Product price"
        />
      </div>
      <div className="form-group">
        <label className="mt-2 mb-0">Shipping</label>
        <select
          name="shipping"
          className="form-control border-0 box-shadow-none register_input select_option"
          id="select_price"
          placeholder="Please select"
          onChange={handleChange}
        >
          {/* <option className="select_option">Shipping</option> */}

          <option>Please select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="form-group">
        <label className="mt-3 mb-0">Quantity</label>
        <input
          type="number"
          name="quantity"
          className="form-control border-0 box-shadow-none register_input"
          value={quantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
      </div>
      <div className="form-group">
        <label className="mt-2 mb-0">Color</label>
        <select
          name="color"
          className="form-control border-0 box-shadow-none register_input"
          id="select_color"
          onChange={handleChange}
        >
          <option>Please select</option>

          {sortByAlpha(colors).map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="mt-2 mb-0">Brand</label>
        <select
          name="brand"
          className="form-control border-0 box-shadow-none register_input"
          id="select_brand"
          onChange={handleChange}
        >
          <option>Please select</option>

          {sortByAlpha(brands).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <div className="form-group">
          <label className="mt-4 mb-0">Category</label>
          <select
            name="category"
            className="form-control border-0 box-shadow-none register_input select_option"
            id="select_category"
            placeholder="Please select"
            onChange={handleCategoryChange}
          >
            <option>Please select</option>
            {categories.length > 0 &&
              categories.map((c) => (
                <option value={c._id} key={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>
        {showSubcategories && (
          <div>
            <label>Sub categories</label>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Please select"
              value={subcategories}
              onChange={(value) => {
                setValues({ ...values, subcategories: value });
              }}
            >
              {subcategoriesOptions.length &&
                subcategoriesOptions.map((s) => (
                  <Option value={s._id} key={s._id}>
                    {s.name}
                  </Option>
                ))}
            </Select>
          </div>
        )}
      </div>
      <br />
      <button className="btn btn-outline-primary">Create</button>
    </form>
  );
};

export default ProductCreateForm;
