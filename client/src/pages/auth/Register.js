import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Register = ({ history }) => {
  const [email, setEmail] = useState("");

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (user && user.token) history.push("/");
  }, [user, history]);

  const returnForm = () => (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        className="form-control border-0 box-shadow-none register_input"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <button type="submit" className="btn btn-raised mt-3">
        Register
      </button>
    </form>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };
    await auth.sendSignInLinkToEmail(email, config);
    toast.success(
      `An email has been sent to ${email}. Click on the link to complete your registration.`
    );

    // Saving the email within localStorage
    window.localStorage.setItem("emailForRegistration", email);

    // Clearing the state
    setEmail("");
  };

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register</h4>
          <p>Enter your email address. Get our confirmation link.</p>
          {returnForm()}
        </div>
      </div>
    </div>
  );
};

export default Register;
