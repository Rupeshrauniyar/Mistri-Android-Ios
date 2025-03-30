import React, { useState, useEffect, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, History, PlusCircle, Book, User, LogOut, Settings } from "lucide-react";
import { mistriContext } from "../context/Auth.context";

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");
  const { mistri } = useContext(mistriContext);
  
  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location]);

  const navLinks = [
    {
      path: "/",
      name: "Home",
      icon: Home,
    },
    {
      path: "/foryou",
      name: "For You",
      icon: PlusCircle,
    },
    {
      path: "/bookings",
      name: "Bookings",
      icon: Book,
    },
    {
      path: "/history",
      name: "History",
      icon: History,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: User,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden xl:block fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-md z-40 pt-16">
        <div className="flex flex-col h-full p-4">
          {navLinks.map((navLink, index) => (
            <NavLink
              key={index}
              to={navLink.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <navLink.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{navLink.name}</span>
            </NavLink>
          ))}
          
          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          
          {/* Settings Link */}
          <NavLink
            to="/settings"
            className={({ isActive }) => `
              flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-primary text-white' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            <Settings className="w-5 h-5 mr-3" />
            <span className="font-medium">Settings</span>
          </NavLink>
          
          {/* Logout Link */}
          <NavLink
            to="/logout"
            className={({ isActive }) => `
              flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-error text-white' 
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </NavLink>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((navLink, index) => (
            <NavLink
              key={index}
              to={navLink.path}
              className="flex flex-col items-center justify-center px-2 py-1 rounded-md"
            >
              <div 
                className={`
                  flex flex-col items-center justify-center relative p-1 rounded-full
                  ${activeTab === navLink.path 
                    ? 'bg-primary text-white' 
                    : 'text-gray-500 dark:text-gray-400'}
                `}
              >
                <navLink.icon className={`
                  w-5 h-5 transition-all duration-200
                  ${activeTab === navLink.path ? 'text-white' : ''}
                `} />
                <span className={`text-xs font-medium mt-1
                  ${activeTab === navLink.path 
                    ? 'text-primary-700 dark:text-primary-300' 
                    : 'text-gray-500 dark:text-gray-400'}
                `}>
                  {navLink.name}
                </span>
              </div>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content Spacer for Desktop */}
      <div className="hidden xl:block w-64"></div>
      
      {/* Content Spacer for Mobile */}
      <div className="xl:hidden h-16"></div>
    </>
  );
};

export default Navbar;
