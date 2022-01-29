// import React from "react";
// import { Route, Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import LoadingToRedirect from "./LoadingToRedirect";

// const UserRoute = ({ children, ...rest }) => {
//   const { user } = useSelector((state) => ({ ...state }));

//   return user && user.token ? <Route {...rest} /> : <LoadingToRedirect />;
// };

// export default UserRoute;

import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentUser } from "./../../functions/authFunctions";

const UserRoute = ({ children, ...rest }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const [userOk, setUserOk] = useState(undefined);

  useEffect(() => {
    if (user && user.token) {
      currentUser(user.token)
        .then((res) => {
          console.log("currentUser response", res);
          setUserOk(true);
        })
        .catch((err) => {
          console.log("UserRoute error", err);
          setUserOk(false);
        });
    } else {
      setUserOk(false);
    }
  }, [user]);

  const renderReturn = () => {
    switch (userOk) {
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

export default UserRoute;
