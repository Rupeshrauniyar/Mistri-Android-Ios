import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, IndianRupee, Phone } from "lucide-react";

/**
 * MistriCard component for displaying individual mistri information
 *
 * @param {Object} props
 * @param {Object} props.mistri - The mistri data object
 * @param {boolean} props.showBookingBtns - Whether to show booking buttons
 * @param {boolean} props.isSelected - Whether the card is selected
 * @param {Function} props.onSelect - Function to call when card is selected
 * @param {Object} props.user - Current user data
 */
const MistriCard = ({ mistri, showBookingBtns, isSelected, onSelect, user }) => {
  // Random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);

  return (
    <div
      onClick={() => onSelect(mistri._id)}
      className={`
        relative bg-white rounded-xl overflow-hidden transition-all duration-300
        ${isSelected ? "ring-2 ring-black" : "hover:shadow-lg"}
        sm:w-full xl:w-[280px] xl:h-[300px] cursor-pointer mb-4 xl:mr-4
      `}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={mistri.profileImage}
          alt={mistri.mistriname}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold truncate">{mistri.mistriname}</h3>
          <p className="text-sm opacity-90">{mistri.profession}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Rating and Price */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {/* <span className="font-medium">{rating}</span> */}
          </div>
          <div className="flex items-center text-green-600 font-semibold">
            <IndianRupee className="w-4 h-4 mr-1" />
            <span>{mistri.charges}/hr</span>
          </div>
        </div>

        {/* Location and Experience */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm truncate">{mistri.address}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm">5+ years experience</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm">Available for consultation</span>
          </div>
        </div>

        {/* Booking Button - Desktop */}
        <div className="sm:hidden xl:block">
          {showBookingBtns && (
            <div className="w-full">
              {user && user.orders.some((order) => order.mistri === mistri?._id) ? (
                <Link to="/bookings" className="w-full">
                  <Button 
                    className="w-full bg-gray-900 hover:bg-black text-white transition-colors"
                  >
                    View Booking
                  </Button>
                </Link>
              ) : (
                <Link to={`/book/${mistri._id}`} className="w-full">
                  <Button 
                    className="w-full bg-black hover:bg-gray-900 text-white transition-colors"
                  >
                    Book Now
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {mistri.isVerified && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Verified
          </span>
        )}
        {mistri.isAvailable && (
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Available
          </span>
        )}
      </div>
    </div>
  );
};

export default MistriCard;
