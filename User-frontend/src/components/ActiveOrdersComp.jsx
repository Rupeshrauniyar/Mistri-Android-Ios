import React, {useState, useContext, useEffect} from "react";
import {userContext} from "../context/Auth.context";
import {ActiveOrdersContext} from "@/context/ActiveOrders.context";
import {ToastContainer, toast} from "react-toastify";
import Orders from "@/components/Orders";
import BookingNavbar from "./BookingNavbar";
import {Link} from "react-router-dom";
import {Button} from "./ui/button";
const ActiveOrdersComp = (props) => {
  const {user, setUser, userLoading} = useContext(userContext);
  const {activeOrders, setActiveOrders} = useContext(ActiveOrdersContext);
  const [ButtonUrl, setButtonUrl] = useState("");
  const setActiveOrdersFnc = (Data) => {
    // console.log(Data._id)
    setActiveOrders(Data);
    setButtonUrl(Data._id);
  };
  return (
    <>
      {/* {console.log(ButtonUrl)} */}
      {/* <ToastContainer /> */}
      <div className="  bg-zinc-100 pb-3 ">
        {userLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="">
            {/* <BookingNavbar /> */}

            {props.orders ? (
              <>
                <div
                  key={props.orders._id}
                  style={{boxSizing: "border-box"}}
                  onClick={() => setActiveOrdersFnc(props.orders)}
                  className={`shrink-0 transition-all cursor-pointer xl:w-[280px] sm:w-full flex xl:flex-col sm:flex-row sm:items-center sm:justify-center xl:h-[380px] sm:h-[160px] bg-white rounded-xl overflow-hidden xl:mr-4 sm:mr-0 ${
                    activeOrders._id === props.orders._id ? "border-black border-4" : "sm:hover:border-4 xl:hover:border-0 sm:hover:border-black"
                  }`}>
                  <div className="Image xl:w-full xl:h-[55%] sm:w-[30%] sm:h-[100%]   overflow-hidden shrink-0 flex items-center justify-center">
                    {props.orders.mistri ? (
                      <img
                        src={props.orders.mistri.profileImage}
                        className="w-full xl:h-full sm:h-full object-cover transition-all sm:object-left  xl:object-center"
                      />
                    ) : (
                      <img
                        src="https://imgs.search.brave.com/oJmhCNRk22fQdZbu84cZUAGtfWey9UBMhi06dAXg6lw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9jcmVhdGUtcGlj/dHVyZS10aGF0LXJl/cHJlc2VudHMtZGl2/ZXJzZS10ZWFtLWNv/bnN0cnVjdGlvbi13/b3JrZXJzLXN1Z2dl/c3RpbmctY29sbGFi/b3JhdGl2ZS1lXzkz/OTAzMy0xMDI1NDYu/anBnP3NpemU9NjI2/JmV4dD1qcGc"
                        className="w-full xl:h-full sm:h-full object-cover transition-all sm:object-left  xl:object-center"
                      />
                    )}
                  </div>
                  <div className="w-full sm:p-2">
                    <div className="Charges flex xl:items-center justify-between ">
                      <span className="px-3  h-[40px] mt-[4px] bg-black text-white rounded-full flex items-center justify-center">
                        ₹{props.orders.charges}/
                      </span>
                      <span className="flex flex-col">
                        <h3>{props.orders.orderDate}</h3>
                        <h3>{props.orders.orderTime}</h3>
                      </span>
                    </div>
                    {props.orders.mistri ? (
                      <>
                        <div className="Address w-full flex xl:items-center xl:justify-center mt-2 ">
                          <div className=" xl:w-[80%] sm:w-[90%] flex xl:items-center xl:justify-center">
                            <p className="overflow-hidden truncate  ">{props.orders.mistri.address}</p>
                          </div>
                        </div>
                        <div className="Name&Profession w-full flex flex-col xl:items-center xl:justify-center ">
                          <p className="text-2xl font-bold">{props.orders.mistri.profession}</p>

                          <div className=" xl:w-[60%] sm:w-[90%]  flex xl:items-center xl:justify-center">
                            <h3 className=" overflow-hidden truncate ">{props.orders.mistri.mistriname}</h3>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-green-500">
                        <div className="Address w-full flex xl:items-center xl:justify-center mt-2 ">
                          <div className=" xl:w-[80%] sm:w-[90%] flex xl:items-center xl:justify-center">
                            <p className="overflow-hidden truncate  ">Pending</p>
                          </div>
                        </div>
                        <div className="Name&Profession w-full flex flex-col xl:items-center xl:justify-center ">
                          <p className="text-2xl font-bold text-black">{props.orders.profession}</p>

                          <div className=" xl:w-[60%] sm:w-[90%]  flex xl:items-center xl:justify-center">
                            <h3 className=" overflow-hidden truncate ">Pending</h3>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="Status w-full flex xl:items-center xl:justify-center">
                      <span className="overflow-hidden  ">
                        Status: <span className="ml-2 font-bold">"{props.orders.status}"</span>
                      </span>
                    </div>
                  </div>
                </div>
                {ButtonUrl ? (
                  <>
                    <div className="w-full overflow-hidden fixed left-0 sm:bottom-[70px] xl:bottom-0 flex items-end justify-end">
                      <div className="xl:w-[80%] sm:w-full ">
                        <Link
                          to={`/bookings/active/${ButtonUrl}`}
                          className=" w-full">
                          <button className="font-bold py-3 px-4 w-full bg-black hover:bg-[#0e0e0e] text-white flex items-center justify-center xl:rounded-xs sm:rounded-lg">
                            Continue
                          </button>
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center mt-8 text-2xl font-bold">No any bookings</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ActiveOrdersComp;
