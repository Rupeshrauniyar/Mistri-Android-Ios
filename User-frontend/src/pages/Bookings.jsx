import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import {userContext} from "../context/Auth.context";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import AcceptedOrder from "@/components/AcceptedOrder";
import ActiveOrdersComp from "@/components/BookingsActive";
import Orders from "@/components/Orders";
import {Map, TileLayer} from "leaflet";
import BookingNavbar from "@/components/BookingNavbar";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
import SimplePullToRefresh from "../components/SimplePullToRefresh";

const Bookings = () => {
  const {user, setUser, userLoading, CheckUser} = useContext(userContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [AcceptedOrders, setAcceptedOrders] = useState([]);
  const [History, setHistory] = useState([]);
  const [UserOrders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    user.acceptedOrder?.length > 0 ? setAcceptedOrders(user.acceptedOrder) : setAcceptedOrders([]);
  }, [user]);

  const filteredHistory = AcceptedOrders.filter((order) => {
    const matchesFilter = activeFilter === "all" || order.status.toLowerCase() === activeFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.mistri?.mistriname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mistri?.profession.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    if (selectedOrder) {
      setShowButton(true);
      setSelectedLink(selectedOrder);
    }
  }, [selectedOrder]);

  const handleRefresh = async () => {
    try {
      await CheckUser();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };

  return (
    <>
      <div className="w-full overflow-y-auto h-full pb-[100px]">
        <SimplePullToRefresh onRefresh={handleRefresh}>
          {userLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : !user.orders ? (
            <>
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col">
              <BookingNavbar />

              <div className="w-full h-full px-2 pb-[100px] mt-4">
                {/* <h2 className="text-3xl font-bold">Confirmed Bookings</h2> */}
                <div className="mb-4 px-2">
                  <input
                    type="text"
                    placeholder="Search by mistri name or profession..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:bg-black dark:text-white"
                  />
                </div>
                {filteredHistory?.length > 0 ? (
                  <>
                    <motion.div
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: -20}}
                      transition={{duration: 0.2}}
                      className="w-full min-h-[70vh] px-2 xl:py-2">
                      {filteredHistory
                        .slice()
                        .reverse()
                        .map((acceptedOrder) => (
                          <div
                            key={acceptedOrder._id}
                            className={`${selectedOrder === acceptedOrder._id ? "ring-2 ring-black" : ""} rounded-md  transition-all `}
                            onClick={() => {
                              setSelectedOrder(acceptedOrder._id);
                            }}>
                            <ActiveOrdersComp order={acceptedOrder} />
                          </div>
                        ))}
                    </motion.div>
                    <h3 className="mt-4 text-center">End of the results.</h3>
                  </>
                ) : (
                  <>
                    <motion.div
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No order history</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || activeFilter !== "all" ? "No orders match your current filters" : "You haven't placed any orders yet"}
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          )}
        </SimplePullToRefresh>
      </div>
      {/* </SimplePullToRefresh> */}

      {/* Continue button - moved outside SimplePullToRefresh */}
      {showButton && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          className="sm:w-full xl:w-[81%] fixed xl:bottom-0 sm:bottom-[60px] right-0 text-2xl font-bold z-50">
          <Link to={`/bookings/active/${selectedLink}`}>
            <Button className="w-full h-[50px]">Continue</Button>
          </Link>
        </motion.div>
      )}
    </>
  );
};

export default Bookings;
