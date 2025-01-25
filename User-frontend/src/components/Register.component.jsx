import React, {useState, useContext} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Link, useNavigate} from "react-router-dom";
// import mistri from "../user-pages/Mistri.jpg";
import {userContext} from "../context/Auth.context";

const RegisterComp = () => {
  const navigate = useNavigate();
  const {user, setUser, setUserLoading} = useContext(userContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [inpValue, setInpValue] = useState({
    email: "",
    password: "",
    username: "",
    address: "",
    contactNumber: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${backendUrl}/auth/user/register`, inpValue).then((response) => {
      if (response.data.status === "BAD") {
        toast.error(response.data.message);
      } else if (response.data.status === "OK") {
        setUser(response.data.user);
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    });
  };
  const handleInput = (e) => {
    const {name, value} = e.currentTarget;
    setInpValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const requiredFields = [
    {
      name: "username",
      type: "text",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
      ),
      placeholder: "Username",
    },
    {
      name: "email",
      type: "email",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
      ),
      placeholder: "Email",
    },
    {
      name: "password",
      type: "password",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      placeholder: "Password",
    },
    {
      name: "contactNumber",
      type: "text",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
        </svg>
      ),
      placeholder: "Contact Number",
    },
    {
      name: "address",
      type: "text",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
        </svg>
      ),
      placeholder: "Address",
    },
  ];
  return (
    <>
      <ToastContainer />
      <>
        <div className="w-full h-full flex flex-col items-center justify-center bg-white">
          <h3 className="text-3xl font-bold">Create an account,</h3>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="xl:w-[30%] sm:w-full">
            {requiredFields.map((requiredField, index) => (
              <div
                key={index}
                className="w-full px-2">
                <h3 className="mt-2 text-xl">{requiredField.label}</h3>
                <input
                  onChange={(e) => handleInput(e)}
                  name={requiredField.name}
                  type={requiredField.type}
                  className="p-2 rounded-md border-[2px] w-full border-[#CACFD6] hover:border-black outline-none"
                  placeholder={requiredField.placeholder}
                />
              </div>
            ))}
            <div className=" w-full flex items-center sm:justify-center xl:justify-between">
              <span className="px-1">
                <span>Already have an account? </span>
                <Link
                  className=" text-blue-500"
                  to="/login">
                  login
                </Link>
              </span>

              <Link to="/forgot-password">
                <span className="xl:block sm:hidden text-blue-500">Forgot Password?</span>
              </Link>
            </div>
            <div className=" xl:hidden sm:flex items-center justify-center">
              <Link to="/forgot-password">
                <span className=" text-[#075CE5] ">Forgot Password?</span>
              </Link>
            </div>
            <div className="w-full flex items-center justify-center">
              <button className="bg-black hover:bg-[#00000044] text-white mt-2 px-4 py-4 rounded-xl border-none outline-none w-[98%] text-xl">Sign up</button>
            </div>
          </form>
        </div>
      </>
    </>
  );
};

export default RegisterComp;
