import React, {useState} from "react";

const MistriSkeletonLoading = () => {
  const [mistrisLoadingArray, setMistrisLoadingArray] = useState([{}, {}, {}, {}, {}, {}, {}, {}]);

  return (
    <div className="noScroll w-full h-full overflow-y-auto flex flex-wrap">
      {mistrisLoadingArray.map((a, index) => (
        <div
          key={index}
          className="xl:w-[280px] sm:w-full xl:h-[370px] sm:h-[440px] bg-white rounded-md overflow-hidden m-2">
          <div className="w-full h-[50%] overflow-hidden animate-pulse bg-zinc-200"></div>
          <div className="flex items-center justify-between ">
            <span></span>

            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Settings"
                className="p-1"
                fill="currentColor"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24">
                <path d="M12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502V15.968ZM12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
              </svg>
            </span>
          </div>
          <div className="w-full flex items-center justify-center p-1 ">
            <div className="overflow-hidden truncate w-[80%] h-[10px] rounded-md animate-pulse bg-zinc-200"></div>
          </div>
          <div className="flex flex-col items-center justify-center p-1 ">
            <div className="overflow-hidden truncate w-[40%] h-[10px] rounded-md animate-pulse bg-zinc-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MistriSkeletonLoading;
