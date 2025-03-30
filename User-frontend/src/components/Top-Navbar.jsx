import React, {useContext, useState} from "react";
import {userContext} from "../context/Auth.context";
import {Link} from "react-router-dom";
import {Search, Menu, Bell, User, LogOut, Settings} from "lucide-react";

const TopNavbar = () => {
  const {user} = useContext(userContext);

  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-white z-[999] shadow-md rounded-b-2xl">
        <div className="max-w-full ">
          <div className="flex items-center justify-between py-3 xl:px-6 sm:px-2">
            {/* Left side - User info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {user ? (
                  <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <></>
                )}
                {user ? (
                  <>
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex flex-col">
                {user ? (
                  <>
                    <p className="font-medium text-gray-800">{user.username}</p>
                  </>
                ) : (
                  <Link to="/login">
                    <button className="font-medium text-white-500 bg-black text-white px-4 py-2 rounded-full">Login</button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              <Link
                to="/search"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
                <Search className="w-5 h-5 text-gray-700" />
              </Link>

              <Link
                to="/notifications"
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200 relative">
                <Bell className="w-5 h-5 text-gray-700" />
                {user && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
              </Link>

             

              <Link
                to={"/settings"}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200">
                <Menu className="w-5 h-5 text-gray-700" />
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
