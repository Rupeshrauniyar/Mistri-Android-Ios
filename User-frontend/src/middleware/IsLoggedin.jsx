import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../context/Auth.context";

const IsLoggedin = () => {
  const navigate = useNavigate();
  const { user, userLoading, isOffline } = useContext(userContext);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!userLoading) {
      if (!token || !user) {
        navigate("/login");
      }
    }
  }, [user, userLoading, navigate]);

  // Show nothing while checking authentication
  if (userLoading) {
    return null;
  }

  // If we have a user (either online or offline), show the protected route
  return user ? <Outlet /> : null;
};

export default IsLoggedin;
