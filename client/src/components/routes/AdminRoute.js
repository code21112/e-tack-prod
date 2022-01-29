import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "./../../functions/authFunctions";

const AdminRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [adminOK, setAdminOK] = useState(undefined);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log("currentAdmin response", res);
          setAdminOK(true);
        })
        .catch((err) => {
          console.log("AdminRoute error", err);
          setAdminOK(false);
        });
    } else {
      setAdminOK(false);
    }
  }, [user]);

  const renderReturn = () => {
    switch (adminOK) {
      case false:
        return <LoadingToRedirect />;
      case true:
        return <Route {...rest} />;
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

  return renderReturn();
};

export default AdminRoute;
