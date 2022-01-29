import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "./../../functions/authFunctions";

const Login = ({ history }) => {
  const [email, setEmail] = useState("christophe.bensmaine@laposte.net");
  const [correctEmail, setCorrectEmail] = useState(false);
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  let dispatch = useDispatch();

  const { user } = useSelector((state) => ({ ...state }));

  const roleBasedRedirect = (res) => {
    console.log("history", history);
    console.log("history.location", history.location);

    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/admin/dashboard");
      } else {
        history.push("/user/history");
      }
    }
  };

  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
  }, [user, history]);

  const checkingEmail = (e) => {
    const regex = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    setEmail(e);
    if (regex.test(e)) {
      setCorrectEmail(true);
      setEmail(e);
    } else {
      setCorrectEmail(false);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          className="form-control border-0 box-shadow-none register_input"
          placeholder="Your email address"
          value={email}
          // onChange={(e) => setEmail(e.target.value)}
          onChange={(e) => checkingEmail(e.target.value)}
          // autoFocus
          rules={[
            {
              type: "email",
            },
          ]}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control border-0 box-shadow-none register_input"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        onClick={handleSubmit}
        type="primary"
        shape="round"
        icon={<MailOutlined />}
        size="large"
        className="mb-3 btn_login"
        block
        disabled={!correctEmail || password.length < 6}
        loading={loading}
      >
        Login with Email/Password
      </Button>
    </form>
  );

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        console.log("result", result);
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();

        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                role: res.data.role,
                email: res.data.email,
                token: idTokenResult.token,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res);
          })
          .catch((err) => console.log(err));
        history.push("/");
      })
      .catch((error) => {
        console.log(error);
        if (error.code !== "auth/popup-closed-by-user") {
          toast.error(error.message);
        }
        setTimeout(() => {
          setLoadingGoogle(false);
        }, 300);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.table(email, password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      // console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
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
          roleBasedRedirect(res);
        })
        .catch((err) => console.log(err));

      // history.push("/");
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Check your email address and password.");
      } else {
        toast.error(error.message);
      }
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   // console.table(email, password);
  //   // setLoading(true);
  //   try {
  //     // setLoading(true);
  //     const result = await auth.signInWithEmailAndPassword(email, password);
  //     console.log("result", result);
  //     const { user } = result;
  //     const idTokenResult = await user.getIdTokenResult();

  //     createOrUpdateUser(idTokenResult.token)
  //       .then((res) => {
  //         dispatch({
  //           type: "LOGGED_IN_USER",
  //           payload: {
  //             name: res.data.name,
  //             role: res.data.role,
  //             email: res.data.email,
  //             token: idTokenResult.token,
  //             _id: res.data._id,
  //           },
  //         }),
  //           roleBasedRedirect(res);
  //       })
  //       .catch((err) => console.log(err));
  //     // history.push("/");
  //   } catch (error) {
  //     console.log(error);
  //     setTimeout(() => {
  //       setLoading(false);
  //     }, 500);
  //     if (error.code === "auth/user-not-found") {
  //       toast.error("Check your email address and password.");
  //     } else {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  // return (
  //   <div className="container p-5">
  //     <div className="row">
  //       <div className="col-md-6 offset-md-3">
  //         {loading ? (
  //           <h4 className="text-primary">Loading...</h4>
  //         ) : (
  //           <h4>Login</h4>
  //         )}
  //         {loginForm()}
  //         <Button
  //           onClick={handleGoogleLogin}
  //           type="danger"
  //           shape="round"
  //           icon={<GoogleOutlined />}
  //           size="large"
  //           block
  //           className="mb-3 btn_login"
  //           loading={loadingGoogle}
  //         >
  //           Login with Google
  //         </Button>
  //         <Link
  //           to="/forgot/password"
  //           className="link_forgot_password text-danger"
  //         >
  //           Forgot password
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  const renderReturn = () => {
    switch (loading) {
      case false:
        return (
          <div className="container p-5">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                {loading ? (
                  <h4 className="text-primary">Loading...</h4>
                ) : (
                  <h4>Login</h4>
                )}
                {loginForm()}
                <Button
                  onClick={handleGoogleLogin}
                  type="danger"
                  shape="round"
                  icon={<GoogleOutlined />}
                  size="large"
                  block
                  className="mb-3 btn_login"
                  loading={loadingGoogle}
                >
                  Login with Google
                </Button>
                <Link
                  to="/forgot/password"
                  className="link_forgot_password text-danger"
                >
                  Forgot password
                </Link>
              </div>
            </div>
          </div>
        );
      case true:
        return (
          <div className="container p-5">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <ul className="loading_ul">
                  <li>L</li>
                  <li>O</li>
                  <li>A</li>
                  <li>D</li>
                  <li>I</li>
                  <li>N</li>
                  <li>G</li>
                </ul>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="container p-5">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <ul className="loading_ul">
                  <li>L</li>
                  <li>O</li>
                  <li>A</li>
                  <li>D</li>
                  <li>I</li>
                  <li>N</li>
                  <li>G</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };
  return <div>{renderReturn()}</div>;
};

export default Login;
