import React, {useState, useEffect, useContext} from "react";
import BookingsComp from "@/components/BookingsComp";
import {AuthContext} from "@/context/Auth.context";
import BookingNavbar from "@/components/BookingNavbar";
import {BookingContext} from "@/context/BookingNavbar.context";
import axios from "axios";
import {Loader} from "lucide-react";
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
          console.log("No orders found");
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
      <div className="w-full h-full overflow-y-auto  xl:pb-0 noScroll px-2">
        <SimplePullToRefresh onRefresh="">
          <BookingNavbar showActive={false} />

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader className="animate-spin slow-spin" />
              <p className="text-gray-600 dark:text-white">Loading...</p>
            </div>
          ) : (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -20}}
              transition={{duration: 0.3}}
              className="pb-[200px]">
              <BookingsComp orders={mistri.orders} />
            </motion.div>
          )}
        </SimplePullToRefresh>
      </div>
    </>
  );
};

export default Booking;
