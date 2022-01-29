import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
// import { WindowsFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createOrUpdateUser } from "./../../functions/authFunctions";

const RegisterComplete = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFromOtherBrowser, setEmailFromOtherBrowser] = useState("");

  let dispatch = useDispatch();

  // const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const emailFromLocalStorage = window.localStorage.getItem(
      "emailForRegistration"
    );
    console.log(emailFromLocalStorage);
    if (emailFromLocalStorage) setEmail(emailFromLocalStorage);
    // setEmail(emailFromLocalStorage);
  }, [history]);
  //   history.push("/dashboard");

  const completeRegistrationForm = () => {
    if (email.length) {
      console.log("within if email.length");
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control border-0 box-shadow-none register_input"
            placeholder="Email address"
            value={email}
            disabled
          />
          <input
            type="password"
            className="form-control border-0 box-shadow-none register_input"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-raised mt-3">
            Complete
          </button>
        </form>
      );
    } else {
      console.log("within else of if email.length");
      return (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control border-0 box-shadow-none register_input"
            placeholder="Changed browser ? You need to fill in your email address"
            value={emailFromOtherBrowser}
            onChange={(e) => setEmailFromOtherBrowser(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            className="form-control border-0 box-shadow-none register_input"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-raised mt-3">
            Complete
          </button>
        </form>
      );
    }
  };

  //   const completeRegistrationForm = () => (
  //     <form onSubmit={handleSubmit}>
  //       <input
  //         type="email"
  //         className="form-control border-0 box-shadow-none register_input"
  //         placeholder="Email address"
  //         value={email}
  //         autoFocus
  //       />
  //       <input
  //         type="password"
  //         className="form-control border-0 box-shadow-none register_input"
  //         placeholder="Your password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         autoFocus
  //       />
  //       <button type="submit" className="btn btn-raised mt-3">
  //         Complete
  //       </button>
  //     </form>
  //   );

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("email", email);
    console.log("emailFromOtherBrowser", emailFromOtherBrowser);
    console.log("window.location.href", window.location.href);

    // Validation
    if ((!email && !emailFromOtherBrowser) || !password) {
      toast.error("Email and password are required.");
      return;
    }

    if (password < 6) {
      toast.error("Your password needs to be 6 characters long.");
      return;
    }

    let result = {};
    if (password.length >= 6) {
      try {
        if (email.length) {
          result = await auth.signInWithEmailLink(email, window.location.href);
          console.log("result with email", result);
        } else if (emailFromOtherBrowser.length) {
          result = await auth.signInWithEmailLink(
            emailFromOtherBrowser,
            window.location.href
          );
          console.log("result with emailFromOtherBrowser", result);
        }
        if (result.user.emailVerified) {
          console.log("result within if emailVerified", result);
          //   // Removing the user email in localStorage
          window.localStorage.removeItem("emailForRegistration");
          //   //   Getting user id token
          let user = auth.currentUser;
          console.log("user", user);
          await user.updatePassword(password);
          const idTokenResult = await user.getIdTokenResult();
          console.log("idTokenResult", idTokenResult);
          //   //   Populating the user in the redux store
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
            })
            .catch((err) => console.log(err));
          //   //   Redirecting the user
          history.push("/");
          toast.success("Welcome!!", { position: "bottom-right" });
        }
      } catch (error) {
        console.log(error);
        if (error.code === "auth/invalid-email") {
          toast.error(
            "Check your email address. It must match the one used to receive the confirmation link."
          );
        } else if (error.code === "auth/invalid-action-code") {
          toast.error(
            "Your confirmation link has expired. You need to receive a new one."
          );
        } else {
          toast.error(error.message);
        }
      }
    } else {
      toast.error(
        "Please, choose a password. It must be at least 6 characters long."
      );
    }
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Complete your registration</h4>
          <p>Choose a password</p>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;
