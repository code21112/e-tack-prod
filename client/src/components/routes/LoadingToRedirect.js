import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

const renderReturn = (count) => {
  if (count > 1) {
    return (
      <div className="container p-5 container-loading-to-redirect">
        <div className="rows-loading-to-redirect">
          <div className="row row-loading-to-redirect">
            You cannot access this ressource.
          </div>
          <div className="row row-loading-to-redirect">
            Redirecting in {count} seconds.
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container p-5 container-loading-to-redirect">
        <div className="rows-loading-to-redirect">
          <div className="row row-loading-to-redirect">
            You cannot access this ressource.
          </div>
          <div className="row row-loading-to-redirect">
            Redirecting in {count} second.
          </div>
        </div>
      </div>
    );
  }
};

const LoadingToRedirect = () => {
  const [count, setcount] = useState(5);
  let history = useHistory();

  useEffect(() => {
    let interval = setInterval(() => {
      setcount((currentCount) => --currentCount);
    }, 1000);
    count === 0 && history.push("/");

    return () => clearInterval(interval);
  }, [count, history]);
  return renderReturn(count);
};

export default LoadingToRedirect;
