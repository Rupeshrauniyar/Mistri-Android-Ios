import React, {useState} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Link, useNavigate} from "react-router-dom";
// import mistri from "../user-pages/Mistri.jpg";
import LoginComp from "../components/Login.component";
const Login = () => {
  return (
    <>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center w-full">
        <LoginComp doRedirect={true} setHidden={false} />
      </div>
    </>
  );
};

export default Login;
