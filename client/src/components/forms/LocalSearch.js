import React from "react";

const LocalSearch = ({ keyword, setKeyword }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <input
      type="search"
      placeholder="Filter"
      value={keyword}
      onChange={handleSearch}
      className="form-control border-0 box-shadow-none register_input mb-4"
    />
  );
};

export default LocalSearch;
