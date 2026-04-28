import React, {useState, useEffect, useContext} from "react";
import BookingsComp from "@/components/BookingsComp";
import {AuthContext} from "@/context/Auth.context";
import BookingNavbar from "@/components/BookingNavbar";
import {BookingContext} from "@/context/BookingNavbar.context";
import axios from "axios";
import {Loader, Package} from "lucide-react";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import {motion} from "framer-motion";

const Booking = () => {
  const {mistri, mistriLoading, setMistri} = useContext(AuthContext);
  const {setUniversalOrder, universalOrder, activeOrder, setActiveOrder, order, setOrder} = useContext(BookingContext);
  const [loading, setLoading] = useState(true);
  const fetchOrders = async () => {
    if (!mistriLoading && mistri?._id) {
      const Data = {id: mistri._id};
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/order`, Data);
        if (response?.data?.status === "OK" && response?.data?.orders) {
          setOrder(response.data.order); // Directly set orders
          setMistri((prev) => ({
            ...prev,
            orders: response.data.orders,
          }));
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching orders:", error);
      }
    }
  };

  useEffect(() => {
    if (mistri) {
      fetchOrders();
    }
  }, []); // Only re-fetch when `mistri` changes

  return (
    <>
      <div className="w-full h-full overflow-y-auto ">
        <SimplePullToRefresh onRefresh="">
          <BookingNavbar showActive={false} />

          {loading ? (
            <div className="flex flex-col items-center justify-center  ">
              <Loader className="animate-spin slow-spin" />
              <p className="text-gray-600 dark:text-white">Loading...</p>
            </div>
          ) : mistri.orders.length > 0 ? (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.3}}
              className="pb-[200px]">
              <BookingsComp orders={mistri.orders} />
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                transition={{duration: 0.3}}
                className="w-full py-8 sm:py-12 flex flex-col items-center justify-center  ">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-full mb-3 sm:mb-4">
                  <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">No orders found.</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-sm sm:text-base">Accept the received order to see it here.</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 text-center">Check back later or refresh.</p>
              </motion.div>
            </>
          )}
        </SimplePullToRefresh>
      </div>
    </>
  );
};

export default Booking;
