import React, {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
// import mistri from "../user-pages/Mistri.jpg";
import RegisterComp from "../components/Register.component.jsx";
const Register = () => {
  return (
    <>
      
      <div className="flex flex-col items-center justify-center w-full">
        <RegisterComp />
      </div>
    </>
  );
};

export default Register;
