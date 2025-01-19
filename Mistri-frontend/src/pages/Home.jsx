import React, { useState, useEffect, useContext } from "react";
import Search from "../components/Search";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MistriSkeletonLoading from "../components/Mistri.skeleton.loading";
import { mistriContext } from "../context/Auth.context";
import AcceptedOrdersComp from "../components/AcceptedOrdersComp";
import BookingNavbar from "@/components/BookingNavbar";
import { BookingContext } from "@/context/BookingNavbar.context";
import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const { mistri, setMistri, mistriLoading } = useContext(mistriContext);
  const {
    setUniversalOrder,
    universalOrder,
    activeOrder,
    setActiveOrder,
    setOrder,
  } = useContext(BookingContext);

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
      const Data = { id: mistri._id };
      try {
        const response = await axios.post(
          `${backendURL}/mistri/fetch/accepted-order`,
          Data
        );
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
      const Data = { id: mistri._id };
      try {
        const response = await axios.post(
          `${backendURL}/mistri/fetch/order`,
          Data
        );
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
    <>
      <ToastContainer />
      {/* {console.log("Current Universal Orders:", universalOrder)} */}
      <div className="w-full h-full sm:pb-[120px] xl:pb-0">
        <div className="w-full h-full overflow-y-auto noScroll">
          {mistriLoading ? (
            <MistriSkeletonLoading />
          ) : mistri?.isVerified ? (
            <>
              <BookingNavbar />
              <AcceptedOrdersComp />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h3 className="text-5xl font-bold">You are not verified yet.</h3>
              <p>Please wait for at least 24 hours while we verify you.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
