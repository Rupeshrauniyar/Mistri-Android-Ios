import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { userContext } from "@/context/Auth.context";
import MistriCard from "./ui/MistriCard";

/**
 * MistriList component for displaying a list of mistris
 * 
 * @param {Object} props
 * @param {Array} props.mistris - Array of mistri objects
 * @param {boolean} props.showBookingBtns - Whether to show booking buttons
 */
const MistriList = ({ mistris, showBookingBtns }) => {
  const { user } = useContext(userContext);
  const [selectedMistriId, setSelectedMistriId] = useState(null);

  const handleSelectMistri = (mistriId) => {
    setSelectedMistriId(prevId => prevId === mistriId ? null : mistriId);
  };

  if (!mistris || mistris.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h3 className="xl:text-5xl sm:text-2xl font-bold">No mistri available.</h3>
        <p className="text-lg">
          Either, you can create an order.
          <Link className="text-blue-500 ml-1" to="/create">
            Create
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="noScroll w-full h-full flex flex-wrap sm:pb-10">
      {mistris.slice().reverse().map((mistri, index) => (
        <MistriCard
          key={index}
          mistri={mistri}
          showBookingBtns={showBookingBtns}
          isSelected={selectedMistriId === mistri._id}
          onSelect={handleSelectMistri}
          user={user}
        />
      ))}
      
      {/* Mobile continue button */}
      <div className="  fixed xl:bottom-0 sm:bottom-[70px] right-0 xl:w-[80%] sm:w-full rounded-lg overflow-hidden">
        {showBookingBtns && selectedMistriId && (
          <div className="opacity-100 flex w-full items-center justify-center transition-all">
            <Link to={`/book/${selectedMistriId}`} className="w-full">
              <Button className="w-full bg-black py-6">Continue</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MistriList; 