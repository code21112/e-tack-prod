import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

const Search = () => {
  const dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }));
  const { text } = search;
  const history = useHistory();

  const handleChange = (e) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/shop?${text}`);
  };

  return (
    <form
      className="form-inline my-2 my-lg-0"
      onClick={handleSubmit}
      id="form_search"
    >
      <input
        type="search"
        value={text}
        className="form-control mr-sm-2"
        id="search_input"
        // className="menu_item_right_3 register_input form-control mr-sm-2"
        placeholder="Search"
        onChange={handleChange}
        style={{ fontSize: "12px" }}
      />
      <SearchOutlined
        onClick={handleSubmit}
        style={{ cursor: "pointer" }}
        // bordered={false}
      />
    </form>
  );
};

export default Search;
