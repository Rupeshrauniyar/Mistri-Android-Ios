import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AcceptedOrder from "@/components/AcceptedOrder";
import { ActiveOrdersContext } from "@/context/ActiveOrders.context";
import BookingNavbar from "@/components/BookingNavbar";
import { Loader2, MapPin, AlertCircle } from "lucide-react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ActiveOrders = () => {
  const { activeOrders, setActiveOrders } = useContext(ActiveOrdersContext);
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveOrder = async () => {
      if (!activeOrders._id) {
        try {
          setLoading(true);
          setError(null);
          
          const response = await axios.post(`${backendUrl}/user/booking//fetch/active`, { orderId });
          
          if (response.data.status === "OK" && response.data.order) {
            setActiveOrders(response.data.order);
          } else {
            setError("No active order found");
            toast.error("No active order found");
          }
        } catch (error) {
          console.error("Error fetching order:", error);
          setError("Failed to fetch order details");
          toast.error("Something went wrong while fetching the order");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchActiveOrder();
  }, [orderId, activeOrders._id, setActiveOrders]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
          <Loader2 className="w-10 h-10 text-black animate-spin" />
          <p className="text-gray-600">Loading your active order...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4 px-4">
          <div className="w-full bg-red-50 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      );
    }

    if (!activeOrders._id) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4 px-4">
          <div className="w-full bg-gray-50 p-6 text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Orders</h3>
            <p className="text-gray-600">You don't have any active orders at the moment.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <AcceptedOrder acceptedOrder={activeOrders} />
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <BookingNavbar />
      <div className="w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default ActiveOrders;
