"use client";

import {useContext, useState, useEffect} from "react";
import {formatDistanceToNow} from "date-fns";
import {AuthContext} from "../context/Auth.context";
import {Button} from "../components/ui/button";
import axios from "axios";
import {BookingContext} from "../context/BookingNavbar.context";
import {Check, X, Loader2, User} from "lucide-react";

const BookingsComp = (props) => {
  const {mistri, mistriLoading, setMistri} = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState({});
  const [notification, setNotification] = useState({show: false, message: "", type: ""});
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const {setUniversalOrder, universalOrder, activeOrder, setActiveOrder, order, setOrder} = useContext(BookingContext);

  useEffect(() => {
    if (props?.orders?.length > 0) {
      const pendingOrders = props.orders.filter((order) => order.status === "pending");
      setOrders(pendingOrders);
    }
  }, [props.orders, mistriLoading, mistri]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return formatDistanceToNow(date, {addSuffix: true});
  };

  const showNotification = (message, type) => {
    setNotification({show: true, message, type});
    setTimeout(() => {
      setNotification((prev) => ({...prev, show: false}));
    }, 4000);
  };

  const acceptOrder = (orderId, userId, mistriId) => {
    setLoading((prev) => ({...prev, [orderId]: "accepting"}));

    const Data = {
      userId,
      mistriId,
      orderId,
    };

    axios
      .post(`${backendURL}/mistri/orders/accept`, Data, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "BAD" && response.data.inStatus === false) {
          window.location.href = "/login";
        } else if (response.data.status === "OK") {
          showNotification("Order accepted successfully", "success");
          setMistri((prev) => ({
            ...prev,
            acceptedOrder: [...prev.acceptedOrder, response.data.order],
          }));
          setUniversalOrder((prev) => prev.filter((order) => order._id !== orderId));
          setOrders((prev) => prev.filter((order) => order._id !== orderId));
        } else {
          showNotification("Failed to accept order", "error");
        }
      })
      .catch((error) => {
        console.error("Error accepting order:", error);
        showNotification("An error occurred while accepting the order", "error");
      })
      .finally(() => {
        setLoading((prev) => ({...prev, [orderId]: false}));
      });
  };

  const rejectOrder = (orderId, userId, mistriId) => {
    setLoading((prev) => ({...prev, [orderId]: "rejecting"}));

    const Data = {
      userId,
      mistriId,
      orderId,
    };

    axios
      .post(`${backendURL}/mistri/orders/reject`, Data, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "BAD" && response.data.inStatus === false) {
          window.location.href = "/login";
        } else if (response.data.status === "OK") {
          setMistri((prev) => ({
            ...prev,
            orders: prev.orders.filter((order) => order._id !== orderId),
            rejectedOrders: [...prev.rejectedOrders, orderId],
          }));

          const remainingOrders = orders?.filter((order) => order._id !== orderId);
          if (response.data.type === "universal") {
            setUniversalOrder(remainingOrders);
          }

          setOrders(remainingOrders);
          showNotification("Order rejected successfully", "info");
        } else {
          showNotification("Failed to reject order", "error");
        }
      })
      .catch((error) => {
        console.error("Error rejecting order:", error);
        showNotification("An error occurred while rejecting the order", "error");
      })
      .finally(() => {
        setLoading((prev) => ({...prev, [orderId]: false}));
      });
  };

  // Custom notification component
  const Notification = () => {
    if (!notification.show) return null;

    return (
      <div
        className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-lg shadow-lg border transition-all duration-300 transform translate-y-0 opacity-100 ${
          notification.type === "success"
            ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300"
            : notification.type === "error"
            ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300"
            : "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
        }`}>
        {console.log(props)}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {notification.type === "success" && <Check className="h-5 w-5" />}
            {notification.type === "error" && <X className="h-5 w-5" />}
            <p className="font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification((prev) => ({...prev, show: false}))}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  if (mistriLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      {/* {console.log(orders)} */}

      <Notification />

      <div className="grid grid-cols-1 gap-4 w-full px-2 sm:px-0">
        {orders.map((order, index) => (
          <div
            key={index}
            className="dark:bg-zinc-900 dark:text-white bg-white rounded-lg shadow-md p-3 sm:p-4 mb-2 sm:mb-4 overflow-hidden">
            <div className="flex flex-wrap justify-between items-start mb-3 sm:mb-4 gap-2">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-8 sm:h-8 flex flex-col items-center justify-center shadow-md border border-black rounded-full object-cover flex-shrink-0">
                  <User />
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    {order.user?.username ? (order.user.username.length > 10 ? `${order.user.username.slice(0, 10)}...` : order.user.username) : "User"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{order.user?.profession || "Customer"}</p>
                </div>
              </div>
              <div className="px-2 py-1 sm:px-3 sm:py-1 bg-black text-white text-xs sm:text-sm font-medium rounded-full">₹{order.charges}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4 text-sm">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Date</p>
                <p className="font-medium truncate">{order.orderDate}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Time</p>
                <p className="font-medium truncate">{order.orderTime}</p>
              </div>
              <div className="min-w-0 col-span-2">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium truncate">{order.user?.address}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Status</p>
                <p className="font-medium truncate">{order.status}</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                <p className="font-medium truncate">{order._id.slice(-8)}...</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
              <p className="text-gray-500 dark:text-gray-400 mb-2 sm:mb-0">{formatDate(order.createdAt)}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => acceptOrder(order._id, order.user._id, mistri._id)}
                disabled={loading[order._id]}
                className="bg-black hover:bg-gray-800 text-white w-full sm:flex-1">
                {loading[order._id] === "accepting" ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Check className="w-4 h-4 mr-2" />
                    <span>Accept</span>
                  </div>
                )}
              </Button>

              <Button
                onClick={() => rejectOrder(order._id, order.user._id, mistri._id)}
                disabled={loading[order._id]}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 w-full sm:flex-1">
                {loading[order._id] === "rejecting" ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <X className="w-4 h-4 mr-2" />
                    <span>Reject</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BookingsComp;
