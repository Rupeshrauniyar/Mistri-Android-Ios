import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
const BACKEDNURL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import AcceptedOrderComp from "@/components/AcceptedOrdersComp";
import {Loader, Package} from "lucide-react";
const AcceptedOrder = () => {
  const URL = useParams();
  const [fetched, setFetched] = useState(false);
  const [acceptedOrder, setAcceptedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const GetAcceptedOrder = async () => {
    const id = URL.id;
    const Data = {
      id,
    };
    await axios.post(`${BACKEDNURL}/mistri/fetch/particular-accepted-order`, Data).then(function (res) {
      if (res.data.status === "OK" && res.data.order) {
        setAcceptedOrder([]);
        setAcceptedOrder(res.data.order);
        setLoading(false);
      } else {
        setAcceptedOrder([]);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    if (URL) {
      try {
        GetAcceptedOrder();
      } catch (err) {}
    }
  }, []);
  return (
    <div className="w-full h-full">
      {loading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin slow-spin" />
        </div>
      ) : acceptedOrder?._id ? (
        <>
          <AcceptedOrderComp acceptedOrder={acceptedOrder} />
        </>
      ) : (
        <>
          {" "}
          <div className="w-full py-8 sm:py-12 flex flex-col items-center justify-center  ">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 sm:p-6 rounded-full mb-3 sm:mb-4">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 text-center">No active orders found.</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md text-sm sm:text-base">Accept the received order to see it here.</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-2 text-center">Check back later or refresh.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default AcceptedOrder;
