import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./functions/authFunctions";
import { LoadingOutlined } from "@ant-design/icons";

// USING LAZY
const Login = lazy(() => import("./pages/auth/Login"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const Home = lazy(() => import("./pages/Home"));

const Header = lazy(() => import("./components/nav/Header"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));

const History = lazy(() => import("./pages/user/History"));
const UpdatePassword = lazy(() => import("./pages/user/UpdatePassword"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));

const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubcategoryCreate = lazy(() =>
  import("./pages/admin/subcategory/SubcategoryCreate")
);
const SubcategoryUpdate = lazy(() =>
  import("./pages/admin/subcategory/SubcategoryUpdate")
);
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const CouponCreate = lazy(() => import("./pages/admin/coupon/CouponCreate"));

const Product = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));

const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubcategoryHome = lazy(() =>
  import("./pages/subcategory/SubcategoryHome")
);

const SideDrawer = lazy(() => import("./components/drawer/SideDrawer"));

const App = () => {
  const dispatch = useDispatch();

  // Checking Firebase auth state
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(async (user) => {
  //     if (user) {
  //       console.log(user);
  //       const idTokenResult = await user.getIdTokenResult();
  //       console.log(idTokenResult);
  //       currentUser(idTokenResult.token)
  //         .then((res) =>
  //           dispatch({
  //             type: "LOGGED_IN_USER",
  //             payload: {
  //               name: res.data.name,
  //               role: res.data.role,
  //               email: res.data.email,
  //               token: idTokenResult.token,
  //               _id: res.data._id,
  //             },
  //           })
  //         )
  //         .catch((err) => console.log(err));
  //     }
  //   });
  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user);

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    // cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div
          className="col text-center p-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span> __ TANAGRA L</span>
          <LoadingOutlined />
          <span>ADING __</span>
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer limit={3} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgot/password" component={ForgotPassword} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={UpdatePassword} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <UserRoute exact path="/checkout" component={Checkout} />
        <UserRoute exact path="/payment" component={Payment} />

        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/categories" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/subcategories"
          component={SubcategoryCreate}
        />
        <AdminRoute
          exact
          path="/admin/subcategories/category/:categoryId"
          component={SubcategoryCreate}
        />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute
          exact
          path="/admin/subcategory/:slug"
          component={SubcategoryUpdate}
        />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate}
        />

        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute exact path="/admin/coupon" component={CouponCreate} />

        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/subcategory/:slug" component={SubcategoryHome} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
      </Switch>
    </Suspense>
  );
};
export default App;
