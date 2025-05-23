import React from "react";

const Search = () => {
  return (
    <div className="flex w-full h-[10%]">
      <div className="flex items-center justify-start  w-full  h-full">
        <label className="input  input-bordered flex items-center gap-2 w-[50%] h-[40px] px-2 bg-white  rounded-md overflow-hidden">
          <input
            type="text"
            className="grow h-full border-none outline-none "
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
    </div>
  );
};

export default Search;
