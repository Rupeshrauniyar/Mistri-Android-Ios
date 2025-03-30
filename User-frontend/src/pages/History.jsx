import React from "react";
import HistoryComponent from "@/components/HistoryComponent";
import PageHeader from "@/components/ui/PageHeader";

/**
 * History page component
 */
const History = () => {
  return (
    <div className="w-full h-full ">
      <HistoryComponent showNavbar={false} />
    </div>
  );
};

export default History;
