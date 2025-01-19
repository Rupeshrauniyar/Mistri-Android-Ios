import BookingNavbar from "@/components/BookingNavbar";
import React, {useContext, useState, useEffect} from "react";
import {BookingContext} from "@/context/BookingNavbar.context";
import {mistriContext} from "@/context/Auth.context";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import BookingsComp from "@/components/BookingsComp";
const UniversalOrder = () => {
  const {setUniversalOrder, universalOrder, activeOrder, setActiveOrder, setOrder} = useContext(BookingContext);
  const {mistri, setMistri, mistriLoading} = useContext(mistriContext);

  const fetchUniversalOrders = async () => {
    if (!mistriLoading && mistri?.profession) {
      const Data = [{profession: mistri.profession}, {rejectedOrders: mistri.rejectedOrders}];
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/universal-order`, Data);
        // console.log("Universal Order Response:", response);

        if (response?.data?.status === "OK" && response?.data?.order?.length > 0) {
          setUniversalOrder(response.data.order);
        } else {
          // console.log("No universal orders found");
          setUniversalOrder([]);
        }
      } catch (error) {
        toast.error("Error fetching universal orders:", error);
      }
    } else {
      console.warn("Mistri is loading or profession is undefined.");
    }
  };

  const fetchActiveOrders = async () => {
    if (!mistriLoading && mistri?._id) {
      const Data = {id: mistri._id};
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/accepted-order`, Data);
        if (response?.data?.status === "OK" && response?.data?.order) {
          setActiveOrder(response.data.order); // Directly set orders
          setMistri((prev) => ({
            ...prev,
            activeOrders: response.data.order,
          }));
        } else {
          console.log("No active orders found");
        }
      } catch (error) {
        console.error("Error fetching active orders:", error);
      }
    }
  };

  const fetchOrders = async () => {
    if (!mistriLoading && mistri?._id) {
      const Data = {id: mistri._id};
      console.log(Data);
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/order`, Data);
        if (response?.data?.status === "OK" && response?.data?.order) {
          setOrder(response.data.order); // Directly set orders
          setMistri((prev) => ({
            ...prev,
            orders: response.data.order,
          }));
        } else {
          console.log("No orders found");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  };

  useEffect(() => {
    if (mistri) {
      fetchUniversalOrders();
      fetchActiveOrders();
      fetchOrders();
    }
  }, []); // Only re-fetch when `mistri` changes

  return (
    <div className="w-full h-full sm:pb-[100px] xl:pb-0">
      <div className="w-full h-full overflow-y-auto noScroll">
        {console.log(universalOrder)}
        <BookingNavbar />
        <BookingsComp orders={universalOrder} />
      </div>
    </div>
  );
};

export default UniversalOrder;
