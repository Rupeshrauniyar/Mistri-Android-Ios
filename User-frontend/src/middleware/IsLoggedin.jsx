import React, {useContext, useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {userContext} from "../context/Auth.context";

const IsLoggedin = () => {
  const navigate = useNavigate();
  const {user, userLoading, setUser} = useContext(userContext);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    if (!userLoading && !user && user === null) {
      navigate("/login");
    }
  }, [user, setUser]);

  if (userLoading) {
    return null; // You can also customize the loading UI here
  }

  return user ? <Outlet /> : null; // Avoid rendering if user is not logged in
};

export default IsLoggedin;
