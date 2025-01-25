import React, {useState, useEffect, useContext} from "react";
import {useParams} from "react-router-dom";

import AcceptedOrder from "@/components/AcceptedOrder";
import {ActiveOrdersContext} from "@/context/ActiveOrders.context";
import BookingNavbar from "@/components/BookingNavbar";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const ActiveOrders = () => {
  const {activeOrders, setActiveOrders} = useContext(ActiveOrdersContext);
  const {orderId} = useParams();

  useEffect(() => {
    // console.log(activeOrders);
    if (!activeOrders._id) {
      const fetchActiveOrder = async () => {
        console.log(orderId);
        const Data = {
          orderId,
        };
        const response = await axios.post(`${backendUrl}/user/booking//fetch/active`, Data);
        if (response.data.status === "OK" && response.data.order) {
          setActiveOrders(response.data.order);
        } else {
          toast.error("Something went wrong while fetching the order.", response.statusText);
        }
      };
      fetchActiveOrder();
    }
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto noScroll">
      {/* {console.log(activeOrders)}
       */}
      <BookingNavbar />
      {activeOrders._id ? (
        <>
          <div className="w-full h-full pb-[100px] ">
            <AcceptedOrder acceptedOrder={activeOrders}  />
          </div>
        </>
      ) : (
        <div className="w-full text-center">
          <h3 className="font-bold text-2xl">No orders found.</h3>
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
