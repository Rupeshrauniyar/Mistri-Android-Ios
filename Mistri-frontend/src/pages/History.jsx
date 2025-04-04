import {AuthContext} from "@/context/Auth.context";
import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {motion} from "framer-motion";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import Orders from "@/components/Orders";
import {Loader, Package} from "lucide-react";
import BookingNavbar from "@/components/BookingNavbar";
const backendURL = import.meta.env.VITE_BACKEND_URL;

const Bookings = () => {
  const [fetched, isFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const {mistri, setMistri, mistriLoading} = useContext(AuthContext);
  const fetchOrder = async () => {
    if (!mistriLoading && mistri?._id) {
      // setError((prev) => ({...prev, active: ""}));

      const Data = {id: mistri._id};
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/history`, Data);
        if (response?.data?.status === "OK" && response?.data?.history) {
          setHistory(response.data.history);
          setLoading(false);
        } else {
          console.log("No active orders found");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching active orders:", error);
        // setError((prev) => ({...prev, active: "Failed to fetch active orders"}));
        // showNotification("Failed to fetch active orders", "error");
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };
  const refreshData = () => {};
  useEffect(() => {
    if (!fetched) {
      fetchOrder();
      isFetched(true);
    }
  }, [fetched]);
  return (
    <>
      <div className="">
        <SimplePullToRefresh onRefresh={refreshData}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="animate-spin slow-spin" />
              <p className="text-gray-600 dark:text-white">Loading...</p>
            </div>
          ) : history?.length > 0 ? (
            <div className="px-2 w-full min-h-[100vh] pb-[200px]">
              {history
                ?.slice()
                .reverse()
                .map((order, i) => (
                  <motion.div
                    key={i}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.3}}>
                    <Orders order={order} />
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="w-full py-8 sm:py-12 flex flex-col items-center justify-center">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-full mb-3 sm:mb-4">
                <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">No history available</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-sm sm:text-base">There are currently no available history.</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 text-center">Accept orders to display history.</p>
            </div>
          )}
        </SimplePullToRefresh>
      </div>
    </>
  );
};

export default Bookings;
