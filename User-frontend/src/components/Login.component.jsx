import React, {useState, useContext} from "react";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {userContext} from "../context/Auth.context";
import { Loader2 } from "lucide-react";

const LoginComp = (props) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {user, setUser, setUserLoading} = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [inpValue, setInpValue] = useState({
    email: "",
    password: "",
  });
  const {state} = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/auth/user/login`, inpValue);
      if (response.data.status === "BAD") {
        toast.error(response.data.message);
      } else if (response.data.status === "OK") {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
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
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
      label: "Email",
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
      placeholder: "Enter your email address",
    },
    {
      name: "password",
      label: "Password",
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
      placeholder: "Enter your password",
    },
  ];

  if (props.setHidden) {
    return null;
  }

  return (
    <div className="w-full    flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full h-full">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {requiredFields.map((field, index) => (
              <div key={index}>
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {field.svg}
                  </div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    onChange={handleInput}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-all duration-200"
                    placeholder={field.placeholder}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-gray-600">Create an account? </span>
              <Link to="/register" className="font-medium text-black hover:text-gray-800 transition-colors">
                Sign up
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-black hover:text-gray-800 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginComp;
