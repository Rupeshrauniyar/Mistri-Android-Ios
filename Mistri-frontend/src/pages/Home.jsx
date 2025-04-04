"use client";

import {useContext, useState, useEffect} from "react";
import axios from "axios";
import {BookingContext} from "../context/BookingNavbar.context";
import {AuthContext} from "../context/Auth.context";
import BookingNavbar from "../components/BookingNavbar";
import Orders from "../components/Orders";
import {RefreshCw, CheckCircle, AlertCircle, Package, X, Clock, Filter, Loader} from "lucide-react";
import {motion} from "framer-motion";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
const Home = () => {
  const {activeOrder, setActiveOrder, setOrder} = useContext(BookingContext);
  const {mistri, setMistri, mistriLoading} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({universal: "", active: "", orders: ""});
  const [notification, setNotification] = useState({show: false, message: "", type: ""});
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [fetched, isFetched] = useState(false);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [selected, setSelected] = useState();
  const fetchActiveOrders = async () => {
    if (!mistriLoading && mistri?._id) {
      setError((prev) => ({...prev, active: ""}));

      const Data = {id: mistri._id};
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/accepted-order`, Data);
        if (response?.data?.status === "OK" && response?.data?.activeOrders) {
          setActiveOrder(response.data.activeOrders);
          setMistri((prev) => ({
            ...prev,
            activeOrders: response.data.activeOrders,
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

  const refreshData = async () => {
    await fetchActiveOrders();
  };

  useEffect(() => {
    if (!fetched) {
      fetchActiveOrders();
      isFetched(true);
    }
  }, [fetched]);

  const handleClick = (SelectedId) => {
    setSelected(SelectedId);
  };
  return (
    <>
      <div className="">
        <SimplePullToRefresh onRefresh={refreshData}>
          <BookingNavbar showBookingsAndForyouFilter={false} />
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="animate-spin slow-spin" />
              <p className="text-gray-600 dark:text-white">Loading...</p>
            </div>
          ) : mistri?.activeOrders?.length > 0 ? (
            <div className="px-2 w-full min-h-[100vh] pb-[200px]">
              {mistri.activeOrders
                ?.slice()
                .reverse()
                .map((order, i) => (
                  <motion.div
                    key={i}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}
                    className={`rounded-lg ${selected ? (selected === order._id ? "ring-2 ring-black" : "ring-0 ") : ""}`}
                    onClick={() => handleClick(order._id)}>
                    <Orders order={order} />
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="w-full py-8 sm:py-12 flex flex-col items-center justify-center">
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

      {selected ? (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3}}
          className="xl:w-[83%] fixed z-[999] xl:bottom-0 sm:bottom-[65px] w-full right-0">
          <Link to={`/active/${selected}`}>
            <Button className="w-full py-6">Continue</Button>
          </Link>
        </motion.div>
      ) : null}
    </>
  );
};

export default Home;
