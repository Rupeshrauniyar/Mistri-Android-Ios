import React from "react";
import {NavLink, Link} from "react-router-dom";
const PageNotFound = () => {
  return (
    <div>
      This page is not available.
      <span className="flex">
        <h3 className="mr-1">Return to</h3>
        <Link className="text-blue-500" to="/">Home</Link>
      </span>
    </div>
  );
};

export default PageNotFound;
