import React, {useState, useContext, useEffect} from "react";
import {userContext} from "../context/Auth.context";
import {ToastContainer, toast} from "react-toastify";
import Orders from "@/components/Orders";
import BookingNavbar from "./BookingNavbar";
import {motion, AnimatePresence} from "framer-motion";

const BookingsOther = () => {
  const {user, setUser, userLoading} = useContext(userContext);
  const [UserOrders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const pending = user.orders.filter((order) => order.status === "pending");
    // console.log(pending);
    user.orders.length > 0 ? setOrders(pending) : setOrders([]);
  }, [user]);
  const filteredHistory = UserOrders.filter((order) => {
    const matchesFilter = activeFilter === "all" || order.status.toLowerCase() === activeFilter;
    const matchesSearch =
      searchTerm === "" ||
      order.mistri?.mistriname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.mistri?.profession.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return (
    <>
      <ToastContainer />
      <div className="w-full overflow-y-auto h-full bg-zinc-100 pb-[100px]">
        {userLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="w-full flex flex-col">
            <BookingNavbar />
            <div className="mb-4 mt-4 px-4">
              <input
                type="text"
                placeholder="Search by mistri name or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
         
              <motion.div className="w-full h-full "
               initial={{opacity: 0, y: 20}}
               animate={{opacity: 1, y: 0}}
               exit={{opacity: 0, y: -20}}
               transition={{duration: 0.2}}>
                {/* <h2 className="ml-3 text-xl">Your bookings</h2> */}
                {filteredHistory.length > 0 ? (
                  <>
                    <div
                      className="w-full min-h-[70vh] px-4 xl:py-2 "
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      exit={{opacity: 0, y: -20}}
                      transition={{duration: 0.2}}>
                      {filteredHistory
                        .slice()
                        .reverse()
                        .map((order) => (
                          <Orders
                            order={order}
                            key={order._id}
                          />
                        ))}
                    </div>
                    <h3 className="mt-4 text-center">End of the results.</h3>
                  </>
                ) : (
                  <div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No order history</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || activeFilter !== "all" ? "No orders match your current filters" : "You haven't placed any orders yet"}
                    </p>
                  </div>
                )}
              </ motion.div>
           
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsOther;
