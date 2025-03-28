import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, History, PlusCircle, Book, User } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");
  
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
      path: "/history",
      name: "History",
      icon: History,
    },
    {
      path: "/create",
      name: "Create",
      icon: PlusCircle,
    },
    {
      path: "/bookings",
      name: "Bookings",
      icon: Book,
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
      <div className="hidden xl:block fixed left-0 top-0 h-full w-64 bg-white shadow-md z-40 pt-16">
        <div className="flex flex-col h-full p-4">
          {navLinks.map((navLink, index) => (
            <NavLink
              key={index}
              to={navLink.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 my-1 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-black text-white' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <navLink.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{navLink.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((navLink, index) => (
            <NavLink
              key={index}
              to={navLink.path}
              className="flex flex-col items-center justify-center px-4 py-2 rounded-md w-[80px]"
            >
              <div 
                className={`
                  flex flex-col items-center justify-center relative
                  ${activeTab === navLink.path ? 'text-black' : 'text-gray-500'}
                `}
              >
                <navLink.icon className={`
                  w-5 h-5 transition-all duration-200
                  ${activeTab === navLink.path ? 'scale-110 text-white' : 'scale-100'}
                `} />
                <span className={`text-xs font-medium ${activeTab === navLink.path ? 'text-white' : 'text-gray-500'}`}>{navLink.name}</span>
                

              
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
