"use client";

import {useContext, useState, useEffect} from "react";
import axios from "axios";
import {BookingContext} from "../context/BookingNavbar.context";
import {AuthContext} from "../context/Auth.context";
import BookingNavbar from "../components/BookingNavbar";
import BookingsComp from "../components/BookingsComp";
import {RefreshCw, CheckCircle, AlertCircle, Package, X, Clock, Filter, Loader} from "lucide-react";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
import {motion} from "framer-motion";
const UniversalOrder = () => {
  const {setUniversalOrder, universalOrder, activeOrder, setActiveOrder, setOrder} = useContext(BookingContext);
  const {mistri, setMistri, mistriLoading} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({universal: "", active: "", orders: ""});
  const [notification, setNotification] = useState({show: false, message: "", type: ""});
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [fetched, isFetched] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const fetchUniversalOrders = async () => {
    if (!mistriLoading && mistri?.profession) {
      setLoading(true);
      setError((prev) => ({...prev, universal: ""}));

      const Data = [{profession: mistri.profession}, {rejectedOrders: mistri.rejectedOrders}];
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/universal-order`, Data);

        if (response?.data?.status === "OK" && response?.data?.order?.length > 0) {
          setUniversalOrder(response.data.order);
          setLoading(false);

          showNotification(`${response.data.order.length} orders found`, "success");
        } else {
          setUniversalOrder([]);
          showNotification("No universal orders available", "info");
        }
      } catch (error) {
        console.error("Error fetching universal orders:", error);
        setError((prev) => ({...prev, universal: "Failed to fetch universal orders"}));
        showNotification("Failed to fetch universal orders", "error");
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("Mistri is loading or profession is undefined.");
    }
  };

  const fetchActiveOrders = async () => {
    if (!mistriLoading && mistri?._id) {
      setError((prev) => ({...prev, active: ""}));

      const Data = {id: mistri._id};
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/accepted-order`, Data);
        if (response?.data?.status === "OK" && response?.data?.order) {
          setActiveOrder(response.data.order);
          setMistri((prev) => ({
            ...prev,
            activeOrders: response.data.order,
          }));
        } else {
          console.log("No active orders found");
        }
      } catch (error) {
        console.error("Error fetching active orders:", error);
        setError((prev) => ({...prev, active: "Failed to fetch active orders"}));
        showNotification("Failed to fetch active orders", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const showNotification = (message, type) => {
    setNotification({show: true, message, type});

    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setNotification((prev) => ({...prev, show: false}));
    }, 4000);
  };

  const refreshData = () => {
    setLastRefresh(new Date());
    fetchUniversalOrders();
    fetchActiveOrders();
    showNotification("Refreshing orders...", "info");
  };

  useEffect(() => {
    if (!fetched) {
      fetchUniversalOrders();
      fetchActiveOrders();
      isFetched(true);
    }
  }, [fetched]);

  return (
    <div className="UniversalOrder w-full h-full px-2 sm:pb-[150px]">
      <SimplePullToRefresh onRefresh="">
        <BookingNavbar showActive={false} />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full ">
            <Loader className="animate-spin slow-spin" />

            <p className="text-gray-600 dark:text-white">Loading...</p>
          </div>
        ) : universalOrder?.length > 0 ? (
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3}}
            className="pb-[200px]">
            {universalOrder.map((order, i) => (
              <BookingsComp
                key={i}
                orders={[order]}
              />
            ))}
          </motion.div>
        ) : (
          <div className="w-full py-8 sm:py-12 flex flex-col items-center justify-center  ">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-full mb-3 sm:mb-4">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">No orders available</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-sm sm:text-base">
              There are currently no available orders matching your profession.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 text-center">Check back later or refresh to see new orders</p>
          </div>
        )}
      </SimplePullToRefresh>
    </div>
  );
};

export default UniversalOrder;
