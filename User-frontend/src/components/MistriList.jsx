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
 * @param {Function} props.onSelectMistri - Callback when a mistri is selected
 */
const MistriList = ({ mistris, showBookingBtns, onSelectMistri }) => {
  
  const { user } = useContext(userContext);
  const [selectedMistriId, setSelectedMistriId] = useState(null);

  const handleSelectMistri = (mistriId) => {
    const newSelectedId = selectedMistriId === mistriId ? null : mistriId;
    setSelectedMistriId(newSelectedId);
    if (onSelectMistri) {
      onSelectMistri(newSelectedId);
    }
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
    </div>
  );
};

export default MistriList; 