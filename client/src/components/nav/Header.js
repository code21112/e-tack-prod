import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import { Link } from "react-router-dom";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Search from "./../forms/Search";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");

  let dispatch = useDispatch();
  let { user, cart } = useSelector((state) => ({ ...state }));
  let history = useHistory();

  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: "LOGOUT_USER",
      payload: null,
    });
    history.push("/login");
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item icon={<HomeOutlined />} key="home" className="item_header">
        <Link to="/" style={{ textDecoration: "none" }}>
          {/* Home - {JSON.stringify(user)} */}
          Home
        </Link>
      </Item>
      <Item
        icon={<ShoppingOutlined />}
        key="shop"
        className="menu_item_left_1 item_header"
      >
        <Link to="/shop" style={{ textDecoration: "none" }}>
          Shop
        </Link>
      </Item>
      <Item
        key="cart"
        icon={<ShoppingCartOutlined />}
        className="menu_item_left_2 item_header"
        style={{ marginLeft: "auto" }}
      >
        <Link to="/cart" style={{ textDecoration: "none" }}>
          <Badge
            count={cart.length}
            offset={[5, -3]}
            style={{ backgroundColor: "#f44336" }}
          >
            Cart
          </Badge>
        </Link>
      </Item>

      {!user && (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Item
              key="search"
              className="menu_item_right_3 item_header"
              style={{ marginRight: "auto" }}
            >
              <Search />
            </Item>
          </div>

          <Item
            key="register"
            icon={<UserAddOutlined />}
            className="menu_item_right_1 item_header"
            style={{ marginLeft: "auto" }}
          >
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </Item>
          {/* <Item
            key="search"
            className="menu_item_right_3 item_header"
            style={{ marginRight: "auto" }}
          >
            <Search />
          </Item>
          <Item
            key="register"
            icon={<UserAddOutlined />}
            className="menu_item_right_1 item_header"
            style={{ marginLeft: "auto" }}
          >
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </Item> */}
        </>
      )}
      {!user && (
        <Item
          key="login"
          icon={<UserOutlined />}
          className="menu_item_right_2 item_header"
        >
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </Item>
      )}
      {user && (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Item
              key="search"
              className="menu_item_right_3 item_header"
              style={{ marginRight: "auto" }}
            >
              <Search />
            </Item>
          </div>

          <div style={{ width: "100%" }}>
            {/* <Item key="search" className="menu_item_right_3">
              <Search />
            </Item> */}
            <SubMenu
              icon={<SettingOutlined />}
              title={user.email && user.email.split("@")[0]}
              key="submenu"
              // className="ml-auto"
              className="float-right menu_item_right_1"
            >
              {user && user.role === "subscriber" && (
                <Item key="dashboard">
                  <Link to="/user/history" />
                  Dashboard
                </Item>
              )}

              {user && user.role === "admin" && (
                <Item key="dashboard">
                  <Link to="/admin/dashboard" />
                  Dashboard
                </Item>
              )}
              <Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={logout}
                className="item_submenu_header"
              >
                Logout
              </Item>
            </SubMenu>
            {console.log("user", user)}
          </div>
        </>
      )}
      {/* <Item key="search" className="menu_item_right_3">
          <Search />
        </Item> */}
    </Menu>
  );
};

export default Header;

// ////////////////////////////////////////
//   return (
//     <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
//       <Item key="home" icon={<AppstoreOutlined />}>
//         <Link to="/">Home</Link>
//       </Item>

//       {!user && (
//         <Item key="register" icon={<UserAddOutlined />} className="float-right">
//           <Link to="/register">Register</Link>
//         </Item>
//       )}

//       {!user && (
//         <Item key="login" icon={<UserOutlined />} className="float-right">
//           <Link to="/login">Login</Link>
//         </Item>
//       )}

//       {user && (
//         <SubMenu
//           icon={<SettingOutlined />}
//           title={user.email && user.email.split("@")[0]}
//           className="float-right"
//         >
//           {user && user.role === "subscriber" && (
//             <Item>
//               <Link to="/user/history">Dashboard</Link>
//             </Item>
//           )}

//           {user && user.role === "admin" && (
//             <Item>
//               <Link to="/admin/dashboard">Dashboard</Link>
//             </Item>
//           )}

//           <Item icon={<LogoutOutlined />} onClick={logout}>
//             Logout
//           </Item>
//         </SubMenu>
//       )}

//       <span className="float-right p-1">
//         <Search />
//       </span>
//     </Menu>
//   );
// };

// export default Header;
