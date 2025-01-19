import React, {useState, useContext} from "react";
import {NavLink} from "react-router-dom";
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

  return (
    <div className="w-full h-[70px] bg-white  left-0 flex items-center justify-start px-1">
      {tabs.map((tab, i) => (
        <div key={i} className="relative mx-1">
          <NavLink
            key={i}
            to={tab.path}
            end={tab.path === "/bookings"}
            className=" rounded-full bg-[#ECECEC] p-2 cursor-pointer text-black ml-1">
            <span>{tab.label}</span>
          </NavLink>
          <span className="absolute top-[-15px] right-[-10px] bg-red-500 px-2 py-[2px] rounded-full text-white text-xs">
            {tab.length()} {/* Dynamic length */}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BookingNavbar;
