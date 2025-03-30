import React, {useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
// import mistri from "../user-pages/Mistri.jpg";
import RegisterComp from "../components/Register.component.jsx";
const Register = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full flex flex-col item-center justify-center mt-16 dark:bg-zinc-900 bbg-white dark:text-black">
        <RegisterComp />
      </div>
    </>
  );
};

export default Register;
