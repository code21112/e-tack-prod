import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [correctEmail, setCorrectEmail] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const checkingEmail = (e) => {
    const regex = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    );
    setEmail(e);
    if (regex.test(e)) {
      setCorrectEmail(true);
      //   setEmail(e);
    } else {
      setCorrectEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailKept = email;
    console.log(process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT);
    setLoading(true);

    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success(
          `An email has been sent to ${emailKept}. Click on the link to reset your password.`
        );
      })
      .catch((error) => {
        setLoading(false);
        if (error.code === "auth/user-not-found") {
          toast.error("Please, check your email. Or, register an account!");
        } else {
          toast.error(error.message);
        }
        console.log("ERROR MSG IN FORGOT PASSWORD", error);
      });
  };

  return (
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? (
        <h4 className="text-danger">Loading</h4>
      ) : (
        <h4>Forgot Password</h4>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control border-0 box-shadow-none register_input"
          value={email}
          onChange={(e) => checkingEmail(e.target.value)}
          placeholder="Enter your email"
          autoFocus
        />
        <br />
        <button className="btn btn-raised" disabled={!correctEmail}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
