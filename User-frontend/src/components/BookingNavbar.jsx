import React, {useState, useContext} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {userContext} from "@/context/Auth.context";
const BookingNavbar = () => {
  const {user, setUser, userLoading} = useContext(userContext);

  const [tabs] = useState([
    {
      label: "Active",
      path: "/bookings",
      length: () => user?.acceptedOrder?.length || 0,
    },
    {
      label: "Bookings",
      path: "/bookings/other",
      length: () => user?.orders?.filter((order) => order.status === "pending").length || 0,
    },
    {
      label: "History",
      path: "/bookings/history",
      length: () => user?.history?.length || 0,
    },
  ]);
  const location = useLocation();
  return (
    <div className="w-full   left-0 flex items-center justify-start px-3 mt-10">
     
      {tabs.map((tab, i) => (
        <div
          key={i}
          className="relative mx-1">
          <NavLink
            to={tab.path}
            end={tab.path === "/bookings"}
            className={` rounded-md ${
              location.pathname === tab.path
                ? "dark:bg-zinc-900 dark:text-green-300 bg-black text-white"
                : "dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-700 hover:bg-gray-100 bg-white text-black"
            }  shadow-md  p-2 cursor-pointer ml-1`}>
            <span>{tab.label}</span>
            <span className="absolute top-[-15px] right-[-10px] bg-red-500 px-2 py-[2px] rounded-full text-white text-xs">
              {tab.length()} {/* Dynamic length */}
            </span>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default BookingNavbar;
