import React from "react";
import Jumbotron from "./../components/cards/Jumbotron";
import NewArrivals from "./../components/home/NewArrivals";
import BestSellers from "./../components/home/BestSellers";
import CategoriesList from "./../components/category/CategoriesList";
import SubcategoriesList from "./../components/subcategory/SubcategoriesList";

const Home = () => {
  return (
    <>
      <div className="jumbotron h1 text-weight-bold text-danger text-center">
        <Jumbotron
          text={["The best products", "At the best price.", "SalesGood"]}
        />
      </div>
      <h4 className="text-center p-3 mt-5 mb-5 display-6 jumbotron">
        New Arrivals
      </h4>
      <NewArrivals />
      <h4 className="text-center p-3 mt-5 mb-5 display-6 jumbotron">
        Best sellers
      </h4>
      <BestSellers />
      <br />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-6 jumbotron">
        Categories
      </h4>
      <CategoriesList />
      <br />
      <br />
      <h4 className="text-center p-3 mt-5 mb-5 display-6 jumbotron">
        Subcategories
      </h4>
      <SubcategoriesList />
    </>
  );
};

export default Home;
