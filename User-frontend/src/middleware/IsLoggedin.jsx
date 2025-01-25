import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../context/Auth.context";

const IsLoggedin = () => {
  const navigate = useNavigate();
  const { user, userLoading, setUser } = useContext(userContext);
  const token = localStorage.getItem("token");
  const [isChecking, setIsChecking] = useState(true); // Track the loading state of the check

  useEffect(() => {
    if (!token) {
      navigate("/login");
      setIsChecking(false);
    } else {
      // Perform the check if token exists
      // You can add your logic here to verify token with the backend
      // Once the check is done, set the isChecking state to false
      if (!userLoading && !user) {
        // If the user is not logged in after the check, redirect
        navigate("/login");
      } else {
        // User is logged in
        setIsChecking(false);
      }
    }
  }, [user, userLoading, token, navigate]);

  if (userLoading || isChecking) {
    return null; // Prevent rendering the private routes during the loading period
  }

  return user ? <Outlet /> : null; // Render the private routes if the user is logged in
};

export default IsLoggedin;
