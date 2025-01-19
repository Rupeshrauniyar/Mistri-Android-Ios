import React, {useContext, useState} from "react";
import {userContext} from "../context/Auth.context";
import {NavLink} from "react-router-dom";
import mistri from "../public/Mistri.jpg";
const Navbar = () => {
  const Navlinks = [
    {
      path: "/",
      name: "Home",
      svg: (
        <svg
          aria-label="Home"
          className="xl:mr-2 xl:ml-5"
          fill="currentColor"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24">
          <title>Home</title>
          <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
        </svg>
      ),
    },

    {
      path: "/history",
      name: "History",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-label="History"
          className="xl:mr-2 xl:ml-5"
          fill="currentColor"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24">
          <title>History</title>
          <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12H4C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.25022 4 6.82447 5.38734 5.38451 7.50024L8 7.5V9.5H2V3.5H4L3.99989 5.99918C5.82434 3.57075 8.72873 2 12 2ZM13 7L12.9998 11.585L16.2426 14.8284L14.8284 16.2426L10.9998 12.413L11 7H13Z"></path>
        </svg>
      ),
    },
    {
      path: "/create",
      name: "Create",
      svg: (
        <svg
          aria-label="Create"
          className="xl:mr-2 xl:ml-5"
          fill="currentColor"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24">
          <title>Create</title>

          <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
        </svg>
      ),
    },
    {
      path: "/bookings",
      name: "Bookings",
      svg: (
        <svg
          aria-label="Bookings"
          className="xl:mr-2 xl:ml-5"
          fill="currentColor"
          height="24"
          role="img"
          viewBox="0 0 24 24"
          width="24">
          <title>Bookings</title>

          <path d="M3 18.5V5C3 3.34315 4.34315 2 6 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22H6.5C4.567 22 3 20.433 3 18.5ZM19 20V17H6.5C5.67157 17 5 17.6716 5 18.5C5 19.3284 5.67157 20 6.5 20H19ZM5 15.3368C5.45463 15.1208 5.9632 15 6.5 15H19V4H6C5.44772 4 5 4.44772 5 5V15.3368Z"></path>
        </svg>
      ),
    },
  ];
  const {user, setUser} = useContext(userContext);
  return (
    <>
      <div className="mt-[33px] z-[999] left-bar xl:w-1/5 shadow-2xl  xl:h-screen sm:h-[80px] dark:bg-black xl:border-r xl:border-r-1 bg-white xl:border-r-zinc-300 xl:dark:border-r-zinc-800 ">
        <div className="functionsCont flex xl:flex-col xl:w-full  sm:w-full sm:h-[70px] xl:p-4  justify-between items-center sm:fixed xl:relative sm:bottom-0 bg-white dark:text-white  sm:bg-white sm:dark:bg-black xl:dark:bg-transparent sm:border-b xl:border-b-0  sm:border-b-1 sm:border-b-zinc-300  sm:dark:border-b-zinc-800  xl:bg-transparent z-20 ">
          {Navlinks.map((Navlink, index) => (
            <NavLink
              key={index}
              className="xl:w-full transition-all  xl:hover:bg-zinc-200  xl:hover:text-black xl:dark:hover:bg-zinc-800 xl:dark:hover:text-white mt-2 rounded-xl py-3 font-bold flex items-start justify-start sm:px-5 xl:px-0  mx-1 first-of-type:ml-2 last-of-type:mr-2"
              to={Navlink.path}>
              {Navlink.svg}
              <h3 className="sm:hidden xl:block">{Navlink.name}</h3>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
