import React, { useState } from "react";
import UserNav from "./../../components/nav/UserNav";
import { auth } from "./../../firebase";
import { toast } from "react-toastify";
// import { Button } from "antd";

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await auth.currentUser
      .updatePassword(newPassword)
      .then(() => {
        toast.success("Your password has been changed.");
        setNewPassword("");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
        setLoading(false);
      });
  };

  //   const passwordUpdateForm = () => (
  //     <form onSubmit={handleSubmit}>
  //       <div className="form-group">
  //         <label>Your password</label>
  //         <input
  //           type="password"
  //           className="form-control border-0 box-shadow-none register_input"
  //           placeholder="Your new password"
  //           value={newPassword}
  //           onChange={(e) => setNewPassword(e.target.value)}
  //         />
  //       </div>
  //       <Button
  //         onClick={handleSubmit}
  //         type="primary"
  //         shape="round"
  //         // icon={<MailOutlined />}
  //         size="large"
  //         className="mb-3 btn_login"
  //         block
  //         disabled={newPassword.length < 6}
  //         loading={loading}
  //       >
  //         Login with Email/Password
  //       </Button>
  //     </form>
  //   );

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="password"
          className="form-control border-0 box-shadow-none register_input"
          placeholder="Your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={loading}
          autoFocus
        />
      </div>
      <button
        className="btn btn-outline-primary border-0 box-shadow-none"
        disabled={!newPassword || newPassword.length < 6 || loading}
      >
        Submit
      </button>
    </form>
  );

  //   return (
  //     <div className="container-fluid">
  //       <div className="row"></div>
  //       <div className="row">
  //         <div className="col-md-2">
  //           <UserNav />
  //         </div>
  //         <div className="col-md-6">
  //           {loading ? (
  //             <h4 className="text-primary">Loading...</h4>
  //           ) : (
  //             <h4>Password update</h4>
  //           )}
  //           {passwordUpdateForm()}
  //         </div>
  //       </div>
  //     </div>
  //   );

  return (
    <div className="container-fluid">
      <div className="row"></div>
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col-md-5 m-3">
          {loading ? (
            <h4 className="text-primary">Loading...</h4>
          ) : (
            <h4>Password update</h4>
          )}
          {passwordUpdateForm()}
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
