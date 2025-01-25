import React, {useContext, useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {mistriContext} from "../context/Auth.context";

const IsLoggedin = () => {
  const navigate = useNavigate();
  const {mistri, mistriLoading, setMistri} = useContext(mistriContext);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!mistriLoading && !mistri) {
      navigate("/login");
    }
  }, [mistri]);

  if (mistriLoading) {
    return; // You can also customize the loading UI here
  }

  return mistri && mistri !== null ? <Outlet /> : null; // Avoid rendering if mistri is not logged in
};

export default IsLoggedin;
