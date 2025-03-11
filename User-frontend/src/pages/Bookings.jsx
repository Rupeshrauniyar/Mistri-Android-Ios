import React, {useEffect, useState, useContext} from "react";
import axios from "axios";
import {userContext} from "../context/Auth.context";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import AcceptedOrder from "@/components/AcceptedOrder";
import ActiveOrdersComp from "@/components/BookingsActive";
import Orders from "@/components/Orders";
import {Map, TileLayer} from "leaflet";
import BookingNavbar from "@/components/BookingNavbar";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";
const Bookings = () => {
  const {user, setUser, userLoading} = useContext(userContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [AcceptedOrders, setAcceptedOrders] = useState([]);
  const [History, setHistory] = useState([]);
  const [UserOrders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    user.acceptedOrder?.length > 0 ? setAcceptedOrders(user.acceptedOrder) : setAcceptedOrders([]);
  }, [user]);
  const filteredHistory = AcceptedOrders.filter((order) => {
    const matchesFilter = activeFilter === "all" || order.status.toLowerCase() === activeFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.mistri?.mistriname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mistri?.profession.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  useEffect(() => {
    if (selectedOrder) {
      setShowButton(true);
      setSelectedLink(selectedOrder);
    }
  }, [selectedOrder]);
  return (
    <>
      <ToastContainer />
      <div className="w-full overflow-y-auto h-full  pb-[100px]">
        {userLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : !user.bookings ? (
          <>
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col ">
            <BookingNavbar />

            <div className="w-full h-full  px-2 pb-[100px] mt-4">
              {/* <h2 className="text-3xl font-bold">Confirmed Bookings</h2> */}
              <div className="mb-4 px-2">
                <input
                  type="text"
                  placeholder="Search by mistri name or profession..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              {filteredHistory?.length > 0 ? (
                <>
                  <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.2}}
                    className=" w-full min-h-[70vh] px-2 xl:py-2  ">
                    {filteredHistory
                      .slice()
                      .reverse()
                      .map((acceptedOrder) => (
                        <div
                          key={acceptedOrder._id}
                          onClick={() => {
                            setSelectedOrder(acceptedOrder._id);
                          }}>
                          <ActiveOrdersComp order={acceptedOrder} />
                        </div>
                      ))}
                  </motion.div>
                  <h3 className="mt-4 text-center">End of the results.</h3>
                </>
              ) : (
                <>
                  <div className="w-full h-full flex items-center justify-center mt-10 text-2xl font-bold">No confirmed bookings</div>
                </>
              )}
            </div>
            {showButton ? (
              <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                className=" sm:w-full xl:w-[80%] fixed xl:bottom-0 sm:bottom-[68px]  right-0 text-2xl font-bold">
                <Link to={`/bookings/active/${selectedLink}`}>
                  <Button className="w-full h-[50px]">Continue</Button>
                </Link>
              </motion.div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Bookings;
