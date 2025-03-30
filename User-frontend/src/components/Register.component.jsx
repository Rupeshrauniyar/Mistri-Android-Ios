import React, {useState, useContext} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
// import mistri from "../user-pages/Mistri.jpg";
import {userContext} from "../context/Auth.context";
import {Loader2} from "lucide-react";

const RegisterComp = () => {
  const navigate = useNavigate();
  const {user, setUser, setUserLoading, CheckUser} = useContext(userContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
    username: "",
    address: "",
    contactNumber: "",
  });
  const [inpValue, setInpValue] = useState({
    email: "",
    password: "",
    username: "",
    address: "",
    contactNumber: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newFieldErrors = {
      email: "",
      password: "",
      username: "",
      address: "",
      contactNumber: "",
    };

    // Username validation
    if (!inpValue.username) {
      newFieldErrors.username = "Username is required";
      isValid = false;
    } else if (inpValue.username.length < 3) {
      newFieldErrors.username = "Username must be at least 3 characters";
      isValid = false;
    }

    // Email validation
    if (!inpValue.email) {
      newFieldErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(inpValue.email)) {
      newFieldErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Password validation
    if (!inpValue.password) {
      newFieldErrors.password = "Password is required";
      isValid = false;
    } else if (inpValue.password.length < 6) {
      newFieldErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    // Contact number validation
    if (!inpValue.contactNumber) {
      newFieldErrors.contactNumber = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(inpValue.contactNumber)) {
      newFieldErrors.contactNumber = "Please enter a valid 10-digit contact number";
      isValid = false;
    }

    // Address validation
    if (!inpValue.address) {
      newFieldErrors.address = "Address is required";
      isValid = false;
    }

    setFieldErrors(newFieldErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/auth/user/register`, inpValue);
      if (response.data.status === "BAD") {
        setErrorMessage(response.data.message || "Registration failed. Please try again.");
      } else if (response.data.status === "OK") {
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        await CheckUser();

        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
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

    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const requiredFields = [
    {
      name: "username",
      label: "Username",
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
      placeholder: "Enter your username",
    },
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
      placeholder: "Choose a strong password",
    },
    {
      name: "contactNumber",
      label: "Contact Number",
      type: "tel",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 opacity-70">
          <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
        </svg>
      ),
      placeholder: "Enter your contact number",
    },
    {
      name: "address",
      label: "Address",
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
      placeholder: "Enter your address",
    },
  ];

  return (
    <div className="w-full min-h-full  flex items-center justify-center dark:bg-black dark:text-white bg-gray-50 pb-20 py-10  noScroll">
      <div className=" h-full noScroll flex flex-col item-center justify-center ">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold dark:text-white text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-white">Join Mistri to find the best professionals for your needs</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6  h-full w-full noScroll"
          noValidate>
          {errorMessage && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              role="alert">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="space-y-4">
            {requiredFields.map((field, index) => (
              <div key={index}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-white">
                  {field.label}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{field.svg}</div>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    onChange={handleInput}
                    className={`appearance-none dark:bg-black block w-full pl-10 pr-3 py-3 border ${
                      fieldErrors[field.name] ? "border-red-500" : "border-gray-300"
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-all duration-200`}
                    placeholder={field.placeholder}
                  />
                </div>
                {fieldErrors[field.name] && <p className="mt-1 text-sm text-red-600">{fieldErrors[field.name]}</p>}
              </div>
            ))}
          </div>

          <div className="w-full flex items-center justify-between">
            <div className="text-sm flex w-full">
              <span className="text-gray-600 dark:text-white">Already have an account? </span>
              <Link
                to="/login"
                className="font-medium dark:text-zinc-200 ml-2 text-black hover:text-gray-800 transition-colors">
                Sign in
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-black dark:bg-zinc-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterComp;
