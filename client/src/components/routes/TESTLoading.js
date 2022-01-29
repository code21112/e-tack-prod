import React, { useState, useEffect } from "react";

const Loading = () => {
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
};

export default Loading;
