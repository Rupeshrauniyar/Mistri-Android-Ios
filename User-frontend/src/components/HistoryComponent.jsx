import React, { useState, useEffect, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { userContext } from "@/context/Auth.context";
import BookingNavbar from "./BookingNavbar";

import HistoryFilters from "./ui/HistoryFilters";
import { motion, AnimatePresence } from "framer-motion";
import Orders from "./Orders";

/**
 * HistoryComponent for displaying user's order history
 * 
 * @param {Object} props
 * @param {boolean} props.showNavbar - Whether to show the booking navbar
 */
const HistoryComponent = ({ showNavbar }) => {
  const { user, userLoading } = useContext(userContext);
  const [history, setHistory] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.history) {
      setHistory(user.history);
    }
  }, [user]);

  const filteredHistory = history.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status.toLowerCase() === activeFilter;
    const matchesSearch = searchTerm === '' || 
      order.mistri?.mistriname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mistri?.profession.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (userLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto pb-20 ">
      {showNavbar && <BookingNavbar />}
      <ToastContainer />

      <div className="w-full mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-4 mt-4">
          <input
            type="text"
            placeholder="Search by mistri name or profession..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Filters */}
        <HistoryFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* History List */}
        <AnimatePresence>
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.slice().reverse().map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Orders order={order} />
                </motion.div>
              ))}
              <p className="text-center text-gray-500 py-4">End of history</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No order history</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || activeFilter !== 'all'
                  ? "No orders match your current filters"
                  : "You haven't placed any orders yet"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistoryComponent;
