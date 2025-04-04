import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import {AuthContext} from "@/context/Auth.context";
import {BookingContext} from "@/context/BookingNavbar.context";

const BookingNavbar = (props) => {
  const {mistri} = useContext(AuthContext);
  const {universalOrder, setUniversalOrder, acceptedOrder, order} = useContext(BookingContext);

  const tabs = [
    {
      label: "Active",
      path: "/",
      length: () => mistri?.acceptedOrder?.length || 0,
    },
    {
      label: "For you",
      path: "/bookings/foryou",
      length: () => universalOrder?.length || 0,
    },
    {
      label: "Bookings",
      path: "/bookings",
      length: () => mistri?.orders?.filter((order) => order.status === "pending").length || 0,
    },
  ];
  const RemoveBookingstabs = [
    {
      label: "Active",
      path: "/",
      length: () => mistri?.acceptedOrder?.length || 0,
    },
  ];
  const RemoveActivetabs = [
    {
      label: "Bookings",
      path: "/bookings",
      length: () => mistri?.orders?.filter((order) => order.status === "pending").length || 0,
    },
    {
      label: "For you",
      path: "/bookings/foryou",
      length: () => universalOrder?.length || 0,
    },
  ];

  return (
    <div className="w-full h-[70px]  left-0 flex items-center justify-start px-1 overflow-x-auto">
      {(props.showBookingsAndForyouFilter === false ? RemoveBookingstabs : props.showActive === false ? RemoveActivetabs : tabs)
        .reverse()
        .slice()
        .reverse()
        .map((tab, i) => (
          <div
            key={i}
            className="relative mx-1">
            <NavLink
              to={tab.path}
              end={tab.path === "/bookings"}
              className="rounded-md bg-white  text-black p-2 cursor-pointer ml-1">
              <span className="shrink-9">{tab.label}</span>
            </NavLink>
            <span className="absolute top-[-15px] right-[-10px] bg-red-500 px-2 py-[2px] rounded-full text-white text-xs">
              {tab.length()} {/* Dynamically update */}
            </span>
          </div>
        ))}
    </div>
  );
};

export default BookingNavbar;
