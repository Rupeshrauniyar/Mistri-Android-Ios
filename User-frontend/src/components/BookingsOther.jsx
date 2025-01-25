import React, {useState, useContext, useEffect} from "react";
import {userContext} from "../context/Auth.context";
import {ToastContainer, toast} from "react-toastify";
import Orders from "@/components/Orders";
import BookingNavbar from "./BookingNavbar";
const BookingsOther = () => {
  const {user, setUser, userLoading} = useContext(userContext);
  const [UserOrders, setOrders] = useState([]);

  useEffect(() => {
    const pending = user.orders.filter((order) => order.status === "pending");
    // console.log(pending);
    user.orders.length > 0 ? setOrders(pending) : setOrders([]);
  }, [user]);
  return (
    <>
      <ToastContainer />
      <div className="w-full overflow-y-auto h-full bg-zinc-100 pb-[100px]">
        {userLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="w-full flex flex-col">
            <BookingNavbar />
            <div className="w-full h-full ">
              {/* <h2 className="ml-3 text-xl">Your bookings</h2> */}
              {UserOrders.length > 0 ? (
                <>
                  <div className="w-full min-h-[70vh] px-2 xl:py-2 flex xl:flex-row sm:flex-col flex-wrap">
                    {UserOrders.slice().reverse().map((order) => (
                      <Orders
                        orders={order}
                        key={order._id}
                      />
                    ))}
                  </div>
                  <h3 className="mt-4 text-center">End of the results.</h3>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center mt-8 text-2xl font-bold">No any bookings</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BookingsOther;
