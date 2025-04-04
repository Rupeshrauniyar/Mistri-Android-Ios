import {useState} from "react";

const OrderSkeletonLoading = () => {
  const [loaders, setLoader] = useState([{}, {}, {}, {}, {}]);

  return (
    <>
      {loaders.map((loader, i) => (
        <div
          key={i}
          className="dark:bg-zinc-900 dark:text-white bg-white rounded-lg shadow-md p-4 mb-4 cursor-pointer">
          {/* Header with profile image and name */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              {/* Profile image skeleton */}
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div>
                {/* Username skeleton */}
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                {/* Profession skeleton */}
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Order details grid */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Date */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Date</div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            {/* Time */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Time</div>
              <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            {/* Charges */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Charges</div>
              <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            {/* Location */}
            <div>
              <div className="text-sm text-gray-500 mb-1">Location</div>
              <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Footer with order ID and timestamp */}
          <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-200 dark:border-gray-700">
            {/* Order ID skeleton */}
            <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            {/* Timestamp skeleton */}
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderSkeletonLoading;
