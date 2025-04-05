import React, {useContext, useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/Auth.context";
import MistriLogin from "@/pages/Mistri.login";
import { Package } from "lucide-react";
const IsLoggedin = () => {
  const navigate = useNavigate();
  const {mistri, mistriLoading, setMistri} = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (mistriLoading) {
    return; // You can also customize the loading UI here
  }

  return mistri ? (
    mistri !== null ? (
      mistri.isVerified ? (
        <Outlet />
      ) : (
        <div className="w-full py-8 sm:py-12 flex flex-col items-center justify-center  ">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-full mb-3 sm:mb-4">
            <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">You are not verified yet!</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-sm sm:text-base">Please wait 24 Hours till we verify you.</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 text-center">Check back later or refresh.</p>
        </div>
      )
    ) : (
      <MistriLogin />
    )
  ) : (
    <MistriLogin />
  ); // Avoid rendering if mistri is not logged in
};

export default IsLoggedin;
