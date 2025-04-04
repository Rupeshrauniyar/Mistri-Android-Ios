import React, { useState } from "react";

const MistriSkeletonLoading = () => {
  const [mistrisLoadingArray] = useState([{}, {}, {}, {}, {}, {}, {}, {}]);

  return (
    <>
      {mistrisLoadingArray.map((_, i) => (
        <div
          key={i}
          className="relative dark:bg-zinc-900 bg-white rounded-xl overflow-hidden transition-all duration-300 sm:w-full xl:w-[280px] xl:h-[300px] mb-4 xl:mr-4"
        >
          {/* Image Section with Gradient Overlay */}
          <div className="relative h-48 overflow-hidden">
            <div className="w-full h-full bg-gray-200 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Name and Profession Skeleton */}
              <div className="h-6 w-32 bg-gray-300 rounded-md mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-300 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4">
            {/* Rating and Price */}
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 w-12 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse" />
            </div>

            {/* Location and Experience */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-2/3 bg-gray-200 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Booking Button Skeleton - Desktop */}
            <div className="sm:hidden xl:block">
              <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>

          {/* Tags */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
};

export default MistriSkeletonLoading;
