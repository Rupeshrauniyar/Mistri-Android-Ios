import React, {useContext, useState} from "react";
import {mistriContext} from "../context/Auth.context";
import {Link} from "react-router-dom";
import {Search, Menu, Bell, User, LogOut, Settings} from "lucide-react";

const TopNavbar = () => {
  const {mistri} = useContext(mistriContext);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white dark:bg-gray-800 z-[999] shadow-md rounded-b-2xl">
        <div className="max-w-full">
          <div className="flex items-center justify-between py-3 xl:px-6 sm:px-2">
            {/* Left side - User info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {mistri ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-700 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {mistri?.mistriname?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <></>
                )}
                {mistri ? (
                  <>
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-white dark:border-gray-800"></span>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex flex-col">
                {mistri ? (
                  <>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{mistri.mistriname}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{mistri.profession}</p>
                  </>
                ) : (
                  <Link to="/login">
                    <button className="btn-primary">Login</button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/search"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <Search className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>

              <Link
                to="/notifications"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 relative">
                <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {mistri && <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>}
              </Link>

              <Link
                to={"/settings"}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding behind the navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default TopNavbar;
