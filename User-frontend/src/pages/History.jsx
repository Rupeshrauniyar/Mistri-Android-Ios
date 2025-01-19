import React from "react";
import HistoryComponent from "@/components/HistoryComponent";
const History = () => {
  return (
    <div className="w-full h-full overflow-y-auto">
        <h3 className=" px-2 mt-1 text-2xl font-bold">Your History</h3>
      <HistoryComponent showNavbar={false} className="" />
    </div>
  );
};

export default History;
