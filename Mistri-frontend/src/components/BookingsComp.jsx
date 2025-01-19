import React, {useContext, useState, useEffect} from "react";
import {mistriContext} from "@/context/Auth.context";
// import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import {BookingContext} from "@/context/BookingNavbar.context";
const BookingsComp = (props) => {
  const {mistri, mistriLoading, setMistri} = useContext(mistriContext);
  const [orders, setOrders] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const {setUniversalOrder, universalOrder, activeOrder, setActiveOrder, order, setOrder} = useContext(BookingContext);

  useEffect(() => {
    if (!mistriLoading && mistri && props?.orders?.length > 0) {
      const pendingOrders = props.orders.filter((order) => order.status === "pending");
      setOrders(pendingOrders);
    }
  }, [props.orders,]);
  const acceptOrder = (orderId, userId, mistriId) => {
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
          navigate("/login");
        } else if (response.data.status === "OK") {
          toast.success("Order accepted successfully");

          // Update mistri state
          setMistri((prev) => ({
            ...prev,
            acceptedOrder: [...prev.acceptedOrder, response.data.order],
          }));
setUniversalOrder((prev) => prev.filter((order)=> order._id !== orderId))
          // Update orders state
          setOrders((prev) => prev.filter((order) => order._id !== orderId));
        } else {
          toast.error("Failed to accept order");
        }
      })
      .catch((error) => {
        console.error("Error accepting order:", error);
        toast.error("An error occurred while accepting the order.");
      });
  };

  const rejectOrder = (orderId, userId, mistriId) => {
    // console.log("clicked");
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
          navigate("/login");
        } else if (response.data.status === "OK") {
          // Update mistri state
          setMistri((prev) => ({
            ...prev,
            orders: prev.orders.filter((order) => order._id !== orderId),
            rejectedOrders:[...prev.rejectedOrders,orderId]
          }));
          const remainingOrders = orders?.filter((order) => order._id !== orderId);
          if (response.data.type === "universal") {
            setUniversalOrder(remainingOrders);
          }
          // console.log(remainingOrders);
          setOrders(remainingOrders);
          toast.info("Order rejected successfully");
        } else {
          toast.error("Failed to reject order");
        }
      })
      .catch((error) => {
        console.error("Error rejecting order:", error);
        toast.error("An error occurred while rejecting the order.");
      });
  };

  return (
    <>
      <ToastContainer />
      {/* {console.log(orders)} */}
      {/* {console.log(props)} */}

      {mistriLoading ? (
        <>Loading...</>
      ) : orders && orders.length > 0 ? (
        <>
          <div className="w-full min-h-full ">
            <div className="w-full h-full overflow-y-auto noScroll p-2">
              {orders.map((order, index) => (
                <div
                  key={index}
                  className="xl:w-[45%] xl:h-4/5 sm:w-full sm:h-[80%] shrink-0 bg-white overflow-hidden  xl:mr-1 sm:mr-0 sm:mb-2  rounded-xl  ">
                  <div className="w-full h-full ">
                    <div className="w-full xl:h-[55%] sm:h-[45%] overflow-hidden">
                      <img
                        src={mistri.profileImage}
                        className="w-full object-cover "
                      />
                    </div>
                    <div className="flex items-center justify-between ">
                      <span className="px-3 py-1 bg-indexColor text-white rounded-full m-1">₹{order.charges}/</span>
                      <span className="flex flex-col items-start justify-start px-2">
                        <p>Date: {order.orderDate}</p>
                        <p>Time: {order.orderTime}</p>
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center p-1">
                      <div className=" w-[80%] flex items-center justify-center">
                        <p className="overflow-hidden truncate  ">{order.user.address}</p>
                      </div>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center">
                      <div className=" xl:w-[60%] sm:w-[50%] flex items-center justify-center">
                        <h3 className="text-2xl font-bold overflow-hidden truncate ">{order.user.username}</h3>
                      </div>

                      <p>{order.status}</p>
                      <div className="w-full flex">
                        {/* <InputOTP maxLength={6}>
                     <InputOTPGroup>
                       {otp.map((digit, index) => (
                         <InputOTPSlot
                           key={index}
                           id={`otp-input-${index}`}
                           value={otp[index]}
                           onChange={(e) => handleChange(e, index)}
                         />
                       ))}
                     </InputOTPGroup>
                   </InputOTP> */}
                        <div className="flex w-full items-center justify-center">
                          <Button
                            onClick={() => acceptOrder(order._id, order.user._id,mistri._id)}
                            className="bg-black mr-1 ml-2 mt-6  px-2 py-3 w-full text-white flex items-center justify-center">
                            Accept
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Settings"
                              className=""
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24">
                              <path d="M13 10H20L11 23V14H4L13 1V10Z"></path>
                            </svg>
                          </Button>
                          <Button
                            onClick={() => rejectOrder(order._id, order.user._id, mistri._id)}
                            className="bg-indexColor  mr-2  mt-6  px-2 py-3 w-full text-white flex items-center justify-center">
                            Reject
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Settings"
                              className=""
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24">
                              <path d="M13 10H20L11 23V14H4L13 1V10Z"></path>
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full mt-4 flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold">No orders found.</h3>
          </div>
        </>
      )}
    </>
  );
};

export default BookingsComp;
