import React, {useContext, useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {userContext} from "../context/Auth.context";

const IsLoggedin = () => {
  const navigate = useNavigate();
  const {user, userLoading, LocalUserLoading} = useContext(userContext);
  const token = localStorage.getItem("token");
  const [isChecking, setIsChecking] = useState(true); // Track the loading state of the check

  useEffect(() => {}, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      setIsChecking(false);
    } else {
      if (!userLoading && !user) {
        navigate("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [user, userLoading, token, navigate]);

  if (LocalUserLoading) {
    return null; // Prevent rendering the private routes during the loading period
  }

  return user ? <Outlet /> : null; // Render the private routes if the user is logged in
};

export default IsLoggedin;
