import React, {useState, useContext} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {userContext} from "../context/Auth.context";
const LoginComp = (props) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {user, setUser, setUserLoading} = useContext(userContext);
  const [inpValue, setInpValue] = useState({
    email: "",
    password: "",
  });
  const {state} = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${backendUrl}/auth/user/login`, inpValue).then((response) => {
      if (response.data.status === "BAD") {
        toast.error(response.data.message);
      } else if (response.data.status === "OK") {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        if (props.doRedirect === true) {
          setTimeout(() => {
            if (state) {
              navigate(state);
            } else {
              navigate("/");
            }
          }, 500);
        }
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
  ];
  return (
    <>
      {/* <ToastContainer /> */}
      {props.setHidden ? (
        <></>
      ) : (
        <>
          <div className="h-full flex flex-col items-center justify-center w-full ">
            <div className="xl:w-[40%] sm:w-[85%] xl:h-[30%] bg-white py-4 rounded-md flex items-center justify-center flex-col shadow-xl">
              <div className="w-[90%] h-full ">
                <form onSubmit={(e) => handleSubmit(e)}>
                  {requiredFields.map((requiredField, index) => (
                    <label
                      className="px-2 rounded-lg flex items-center gap-2 w-full  h-[40px] mt-2  border-2 border-zinc-200"
                      key={index}>
                      {requiredField.svg}
                      <input
                        onChange={(e) => handleInput(e)}
                        name={requiredField.name}
                        type={requiredField.type}
                        className="bg-none bg-transparent grow border-none outline-none"
                        placeholder={requiredField.placeholder}
                      />
                    </label>
                  ))}
                  <div className=" w-full flex items-center sm:justify-center xl:justify-between">
                    <span className="px-1">
                      <span>Don't have an account? </span>
                      <Link
                        className=" text-blue-500"
                        to="/register">
                        Register
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
                    <button className="bg-[#075CE5] hover:bg-[#2175d4] text-white mt-2 px-4 py-2 rounded-md border-none outline-none w-[30%] h-[40px]">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginComp;
