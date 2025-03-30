import React, {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
// import mistri from "../user-pages/Mistri.jpg";
import LoginComp from "../components/Login.component";
const Login = () => {
  return (
    <>
      
      <div className="flex flex-col items-center justify-center w-full h-full">
        <LoginComp doRedirect={true} setHidden={false} />
      </div>
    </>
  );
};

export default Login;
