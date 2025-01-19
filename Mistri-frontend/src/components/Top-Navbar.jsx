import React, {useContext} from "react";
import {mistriContext} from "../context/Auth.context";
const TopNavbar = () => {
  const {mistri} = useContext(mistriContext);
  return (
    <>
      {/* {console.log(mistri)} */}
      <div className="flex items-center justify-between fixed top-0 left-0 w-full bg-white z-[999] shadow-sm xl:p-[6px] sm:p-3 xl:px-4 sm:px-[6px]">
        <div className="flex items-center justify-center">
          <img
            src={
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAgMmE0IDQgMCAxIDAgMCA4IDQgNCAwIDAgMCAwLThaTTcgNmEzIDMgMCAxIDEgNiAwIDMgMyAwIDAgMS02IDBabS0yIDVhMiAyIDAgMCAwLTIgMmMwIDEuNy44MyAyLjk3IDIuMTMgMy44QTkuMTQgOS4xNCAwIDAgMCAxMCAxOGMxLjg1IDAgMy41OC0uMzkgNC44Ny0xLjJBNC4zNSA0LjM1IDAgMCAwIDE3IDEzYTIgMiAwIDAgMC0yLTJINVptLTEgMmExIDEgMCAwIDEgMS0xaDEwYTEgMSAwIDAgMSAxIDFjMCAxLjMtLjYyIDIuMjgtMS42NyAyLjk1QTguMTYgOC4xNiAwIDAgMSAxMCAxN2E4LjE2IDguMTYgMCAwIDEtNC4zMy0xLjA1QTMuMzYgMy4zNiAwIDAgMSA0IDEzWiIvPjwvc3ZnPg=="
            }
            className="xl:ml-1 mr-2 p-1 rounded-full object-cover bg-zinc-200 border-2 xl:w-10 xl:h-10 sm:w-8 sm:h-8 cursor-pointer"
            alt=""
          />
          {mistri ? <p>{mistri.mistriname}</p> : <p>loading...</p>}
        </div>

        <svg
          className="w-8 h-8 cursor-pointer"
          focusable="false"
          aria-hidden="true"
          viewBox="0 0 24 24"
          data-testid="MenuOpenRoundedIcon">
          <path d="M4 18h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h8c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h11c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1m17.3 7.88L17.42 12l2.88-2.88c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0L15.3 11.3c-.39.39-.39 1.02 0 1.41l3.59 3.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42"></path>
        </svg>
      </div>
    </>
  );
};

export default TopNavbar;
