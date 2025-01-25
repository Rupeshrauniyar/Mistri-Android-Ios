import React, {useContext, useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {userContext} from "../context/Auth.context";
import {Button} from "@/components/ui/button";
const Book = () => {
  const {user, userLoading, setUser} = useContext(userContext);

  const [mistris, setMistris] = useState([]);
  const [charges, setCharges] = useState(null);
  const [time, setTime] = useState();
  const [date, setDate] = useState();

  const mistri = useParams();
  const mistriId = mistri.id;
  const userId = user._id;
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    sendMistriRequest();
  }, []);
  const sendMistriRequest = () => {
    const data = {
      mistriId,
    };
    axios.post(`${backendURL}/user/book/fetch/mistri`, data).then(function (response) {
      if (response && response.data.status === "OK" && response.data.mistri) {
        setMistris([response.data.mistri]);
      } else {
        toast.error("No mistris found.");
        setMistris(null);
      }
    });
  };
  const sendConfirmBookingRequest = (e) => {
    if (!time || !date) {
      return toast.error("All the booking fields are required.");
    }
    if (!charges || charges === null) {
      var BookingData = {
        userId,
        mistriId,
        charges: mistris[0].charges,
        time,
        date,
      };
    } else {
      var BookingData = {
        userId,
        mistriId,
        charges,
        time,
        date,
      };
    }

    // const mistriCharges = mistris[0].charges;

    e.preventDefault();
    axios.post(`${backendURL}/user/booking/confirm`, BookingData).then(function (response) {
      if (response && response.data.status === "OK" && response.data.mistri && response.data.order && response.data.user) {
        setUser((prev) => ({
          ...prev,
          orders: [...prev.orders, response.data.order],
        }));

        toast.success("Booking confirmed successfully.");
      } else if (response && response.data.status === "BAD") {
        toast.error(response.data.message);
      }
    });
  };

  const token = localStorage.getItem("token");
  if (userLoading && !user) {
    return <div>Loading...</div>;
  }

  const userFeilds = [
    {
      name: "email",
      value: user.email,
      disabled: true,
      label: "Email",
      path: (
        <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"></path>
      ),
    },
    {
      name: "contactNumber",
      value: user.contactNumber,
      disabled: true,
      label: "Contact Number",
      path: (
        <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z"></path>
      ),
    },
    {
      name: "address",
      value: user.address,
      disabled: true,
      label: "Address",
      path: (
        <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
      ),
    },
  ];
  return (
    <>
      <ToastContainer />
      {!userLoading ? (
        <>
          <div className="w-full h-full xl:flex xl:flex-row sm:flex-col overflow-y-auto bg-white">
            <div className=" xl:w-full xl:h-[100%] sm:w-full sm:min-h-[140%]  shrink-0 ">
              {mistris ? (
                <>
                  {mistris
                    .slice()
                    .reverse()
                    .map((mistri, index) => (
                      <div
                        key={index}
                        className="w-full  p-2">
                        <div className="flex w-full h-[100px] bg-black text-white p-2 rounded-md">
                          <div className="Image h-full  flex flex-col items-center justify-center">
                            <img
                              className="w-[50px] h-[50px] object-cover overflow-hidden rounded-full"
                              src={mistri.profileImage}
                              alt="mistri"
                            />
                          </div>
                          <div className="h-full flex flex-col justify-center ml-2 whitespace-nowrap overflow-hidden text-ellipsis">
                            <h3 className="text-xl font-bold">{mistri.profession}</h3>
                            <h2 className="whitespace-nowrap overflow-hidden text-ellipsis">{mistri.address}</h2>
                            <h1 className="whitespace-nowrap overflow-hidden text-ellipsis">{mistri.mistriname}</h1>
                          </div>
                        </div>

                        <div className="Inputs-Charges-Date-Time w-full overflow-y-auto noScroll flex flex-col px-2 ">
                          {/* Mistri Charges Input */}
                          <h3 className="mt-2 text-xl">Mistri charges</h3>
                          <label
                            // key={index2}
                            className=" p-2 rounded-md border-[2px] w-full border-[#CACFD6]  outline-none flex items-center">
                            <input
                              name="charges"
                              onChange={(e) => setCharges(e.target.value)}
                              type="number"
                              className="w-full   outline-none"
                              defaultValue={mistri.charges}
                              placeholder="Your price"
                            />
                            ₹
                          </label>

                          {/* Appointment Date Input */}
                          <h3 className="mt-2 text-xl">Select date for appointment</h3>
                          <input
                            name="orderDate"
                            onChange={(e) => setDate(e.target.value)}
                            type="date"
                            className="p-2 rounded-md border-[2px] w-full border-[#CACFD6] hover:border-black outline-none "
                            placeholder="Select date"
                          />

                          {/* Appointment Time Input */}
                          <h3 className="mt-2 text-xl ">Select time for appointment</h3>
                          <input
                            name="orderTime"
                            onChange={(e) => setTime(e.target.value)}
                            type="time"
                            className="p-2 rounded-md border-[2px] w-full border-[#CACFD6] hover:border-black outline-none mb-2 "
                            placeholder="Select time"
                          />

                          {/* <div className=" w-full flex flex-col "> */}
                          {userFeilds.map((userFeild, index2) => (
                            <div
                              key={index2}
                              className="w-full">
                              <h3 className="text-xl mt-2">{userFeild.label}</h3>
                              <label
                                // key={index2}
                                className="p-2 rounded-md border-[2px] w-full border-[#CACFD6]  outline-none flex items-center">
                                <input
                                  type="text"
                                  disabled={userFeild.disabled ? true : false}
                                  className=" w-full h-full bg-none "
                                  value={userFeild.value}
                                  onChange={(e) => handleInputChange(e, index2)} // Add a handler for change
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-label="Settings"
                                  className="p-1 "
                                  fill="currentColor"
                                  height="24"
                                  role="img"
                                  viewBox="0 0 24 24"
                                  width="24">
                                  {userFeild.path}
                                </svg>
                              </label>
                            </div>
                          ))}
                          <div className="w-full flex items-center justify-center">
                            <Button className="bg-gray-300  mt-4 px-2 py-3  xl:w-[90%] rounded-md text-white flex items-center justify-center">
                              Edit profile
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Settings"
                                className="p-1"
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24">
                                <path d="M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z"></path>
                              </svg>
                            </Button>
                          </div>
                          {/* </div> */}
                        </div>

                        <div className="Confirm-Booked-Button w-full flex flex-col items-center justify-center sm:fixed xl:relative sm:bottom-[70px] xl:bottom-0 left-0  mt-2 z-50">
                          {user ? (
                            user.orders.some((order) => order.mistri === mistri._id) ? (
                              <Button className="bg-black sm:mt-0 px-2 py-6 xl:w-[90%] sm:w-full xl:rounded-md text-white flex items-center justify-center">
                                Booked
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
                            ) : (
                              <Button
                                onClick={(e) => sendConfirmBookingRequest(e)}
                                className="bg-black sm:mt-0 px-2 py-6 xl:w-[90%] sm:w-full xl:rounded-md text-white flex items-center justify-center">
                                Confirm booking
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
                            )
                          ) : (
                            <Link
                              to="/login"
                              className="bg-black sm:mt-0 px-2 py-5 xl:w-[90%] sm:w-full xl:rounded-md text-white flex items-center justify-center">
                              Login
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
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <>
                  <div></div>
                </>
              )}
            </div>
          </div>
        </>
      ) : (
        <>Loading</>
      )}
    </>
  );
};

export default Book;
