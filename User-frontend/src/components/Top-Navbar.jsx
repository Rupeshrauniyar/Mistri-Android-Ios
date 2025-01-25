import React, {useContext} from "react";
import {userContext} from "../context/Auth.context";
import { Link } from "react-router-dom";
const TopNavbar = () => {
  const {user} = useContext(userContext);
  return (
    <>
      {/* {console.log(user)} */}
      <div className="flex items-center justify-between fixed top-0 left-0 w-full bg-white z-[999] shadow-sm xl:p-[6px] sm:p-3 xl:px-4 sm:px-[6px]">
        <div className="flex items-center justify-center">
          <img
            src={
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMmE0IDQgMCAxIDAgMCA4IDQgNCAwIDAgMCAwLThaTTcgNmEzIDMgMCAxIDEgNiAwIDMgMyAwIDAgMS02IDBabS0yIDVhMiAyIDAgMCAwLTIgMmMwIDEuNy44MyAyLjk3IDIuMTMgMy44QTkuMTQgOS4xNCAwIDAgMCAxMCAxOGMxLjg1IDAgMy41OC0uMzkgNC44Ny0xLjJBNC4zNSA0LjM1IDAgMCAwIDE3IDEzYTIgMiAwIDAgMC0yLTJINVptLTEgMmExIDEgMCAwIDEgMS0xaDEwYTEgMSAwIDAgMSAxIDFjMCAxLjMtLjYyIDIuMjgtMS42NyAyLjk1QTguMTYgOC4xNiAwIDAgMSAxMCAxN2E4LjE2IDguMTYgMCAwIDEtNC4zMy0xLjA1QTMuMzYgMy4zNiAwIDAgMSA0IDEzWiIvPjwvc3ZnPg=="
            }
            className="xl:ml-1 mr-2 p-1 rounded-full object-cover bg-zinc-200 border-2 xl:w-10 xl:h-10 sm:w-8 sm:h-8 cursor-pointer"
            alt=""
          />
          {user ? <p>{user.username}</p> : <p className="text-red-500">Guest</p>}
        </div>

        <div className="flex items-center justify-center">
          <Link to="/search" className="flex">
            <span className="bg-zinc-100 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Link>

          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
          </svg>
        </div>
      </div>
    </>
  );
};

export default TopNavbar;
