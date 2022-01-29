import React from "react";
import { Link } from "react-router-dom";

const AdminNav = () => (
  <nav>
    <ul className="nav flex-column">
      <li className="nav-item">
        <Link to="/admin/dashboard" className="nav-link nav-link-user-history">
          Dashboard
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/product" className="nav-link nav-link-user-history">
          Product
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/products" className="nav-link nav-link-user-history">
          Products
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/categories" className="nav-link nav-link-user-history">
          Categories
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/admin/subcategories"
          className="nav-link nav-link-user-history"
        >
          Subcategories
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/coupon" className="nav-link nav-link-user-history">
          Coupon
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/user/password" className="nav-link nav-link-user-history">
          Password
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/admin/wishlist" className="nav-link nav-link-user-history">
          Wishlist
        </Link>
      </li>
    </ul>
  </nav>
);

export default AdminNav;
