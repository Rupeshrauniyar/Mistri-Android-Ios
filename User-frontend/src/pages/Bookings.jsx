import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import {userContext} from "../context/Auth.context";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import AcceptedOrder from "@/components/AcceptedOrder";
import Orders from "@/components/Orders";
import {Map, TileLayer} from "leaflet";
import BookingNavbar from "@/components/BookingNavbar";
const Bookings = () => {
  const {user, setUser, userLoading} = useContext(userContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [AcceptedOrders, setAcceptedOrders] = useState([]);
  const [History, setHistory] = useState([]);
  const [UserOrders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    user.acceptedOrder.length > 0 ? setAcceptedOrders(user.acceptedOrder) : setAcceptedOrders([]);
  }, [user]);

  return (
    <>
      <ToastContainer />
      <div className="w-full overflow-y-auto h-full bg-zinc-100 pb-[100px]">
        {userLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="w-full flex flex-col ">
            <BookingNavbar />

            <div className="w-full h-full ">
              {/* <h2 className="text-3xl font-bold">Confirmed Bookings</h2> */}
              {AcceptedOrders.length > 0 ? (
                <div className="w-full h-full">
                  {AcceptedOrders.slice().reverse().map((acceptedOrder) => (
                    <AcceptedOrder
                      acceptedOrder={acceptedOrder}
                      key={acceptedOrder._id}
                    />
                  ))}
                  <h3 className="mt-4 text-center">End of the results.</h3>
                </div>
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center mt-10 text-2xl font-bold">No confirmed bookings</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;
