import React from "react";
import { Button } from "@/components/ui/button";

/**
 * HistoryFilters component for filtering order history
 * 
 * @param {Object} props
 * @param {string} props.activeFilter - Currently active filter
 * @param {Function} props.onFilterChange - Function to call when filter changes
 */
const HistoryFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'accepted', label: 'Completed' },
    { id: 'rejected', label: 'Cancelled' },
  ];

  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 no-scrollbar ">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          variant={activeFilter === filter.id ? "default" : "outline"}
          className={`whitespace-nowrap ${
            activeFilter === filter.id 
              ? "bg-black text-white" 
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default HistoryFilters; 