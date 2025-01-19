import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import Search from "../components/Search";
import {Link} from "react-router-dom";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginComp from "../components/Login.component";
import MistriSkeletonLoading from "../components/Mistri.skeleton.loading";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {userContext} from "@/context/Auth.context";
const MistriComponent = (props) => {
  const [mistris, setMistris] = useState([]);
  const [mistrisLoadingArray, setMistrisLoadingArray] = useState([{}, {}, {}, {}, {}, {}, {}, {}]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [hidden, sethidden] = useState(true);
  const {user, setUser, userLoading} = useContext(userContext);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [selectedUrl, setSelectedUrl] = useState();
  const [selectedState, setSelectedState] = useState(false);
  const [selectedDiv, setSelectedDiv] = useState({});

  const addToFavorite = (mistriId) => {
    try {
      if (token && user) {
        const data = {
          token,
          mistriId,
        };
        axios.post(`${backendURL}/user/favourite`, data).then(function (response) {
          if (response && response.data.status === "OK" && response.data.type === "add") {
            setUser((prev) => ({...prev, favourites: [...prev.favourites, mistriId]}));
          } else if (response && response.data.status === "OK" && response.data.type === "remove") {
            setUser((prev) => ({...prev, favourites: prev.favourites.filter((favourite) => favourite !== mistriId)}));
          } else {
            toast.error("Something went wrong.");
          }
        });
      } else {
        // toast.dismiss();
        toast.info("Please login to add a favorite.");
        sethidden(false);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const selected = (mistriId) => {
    setSelectedState(true);
    setSelectedUrl(mistriId);
    setSelectedDiv((prev) => ({
      [mistriId]: !prev[mistriId], // Toggle the selected state for the clicked div
    }));
  };
  return (
    <div className="noScroll w-full h-full  flex flex-wrap sm:pb-10">
      {console.log(props)}
      {/* <ToastContainer /> */}
      {props ? (
        props.mistris
          .slice()
          .reverse()
          .map((mistri, index) => (
            <div
              key={index}
              style={{boxSizing: "border-box"}}
              onClick={(e) => selected(mistri._id)}
              className={`${
                selectedDiv[mistri._id] ? "sm:border-4  sm:border-black xl:border-0 " : ""
              } shrink-0 transition-all cursor-pointer xl:w-[280px] sm:w-full flex xl:flex-col sm:flex-row sm:items-center sm:justify-center xl:h-[380px] sm:h-[150px] bg-white rounded-xl overflow-hidden  xl:mr-4 sm:mr-0 mb-3 sm:first-of-type:mt-2 xl:first-of-type:mt-0`}>
              <div className="Image xl:w-full xl:h-[55%] sm:w-[30%] sm:h-[100%]  overflow-hidden flex flex-col items-center justify-center">
                <img
                  src={mistri.profileImage}
                  className="w-full xl:h-full sm:h-full object-cover transition-all  sm:scale-125 xl:scale-100 xl:object-center"
                />
              </div>
              <div className="xl:w-full sm:w-[70%] sm:p-2">
                <div className="Charges flex xl:items-center justify-between ">
                  <span className="px-3 py-1 bg-black text-white rounded-full ">₹{mistri.charges}/</span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="Settings"
                      className=""
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24">
                      <path d="M12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502V15.968ZM12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                    </svg>
                  </span>
                </div>
                <div className="Address w-full flex xl:items-center xl:justify-center mt-2 ">
                  <div className=" xl:w-[80%] sm:w-[90%] flex xl:items-center xl:justify-center">
                    <p className="overflow-hidden truncate  ">{mistri.address}</p>
                  </div>
                </div>
                <div className="Name&Profession w-full flex flex-col xl:items-center xl:justify-center ">
                  <p className="text-2xl font-bold">{mistri.profession}</p>

                  <div className=" xl:w-[60%] sm:w-[90%]  flex xl:items-center xl:justify-center">
                    <h3 className=" overflow-hidden truncate ">{mistri.mistriname}</h3>
                  </div>
                </div>
              </div>
              <div className="sm:hidden xl:block w-full">
                {props.showBookingBtns ? (
                  <div className="w-full flex items-center justify-center ">
                    {/* <Button>Click</Button> */}
                    {user && user !== null && user.orders.length > 0 ? (
                      user.orders.some((order) => order.mistri === mistri?._id || null) ? (
                        <>
                          <Link
                            to={`/bookings`}
                            className=" w-full">
                            <Button className="font-bold py-6 px-4 w-full bg-black text-white flex items-center justify-center ">
                              Check
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-label="Settings"
                                className=""
                                fill="currentColor"
                                height="24"
                                role="img"
                                viewBox="0 0 24 24"
                                width="24">
                                <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                              </svg>
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Link
                          to={`/book/${mistri._id}`}
                          className=" w-full">
                          <Button className="font-bold py-6 px-4 w-full bg-black text-white flex items-center justify-center ">
                            Book
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              aria-label="Settings"
                              className=""
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24">
                              <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                            </svg>
                          </Button>
                        </Link>
                      )
                    ) : (
                      <Link
                        to={`/book/${mistri._id}`}
                        className=" w-full">
                        <Button className="font-bold py-6 px-4 w-full bg-black text-white flex items-center justify-center ">
                          Book
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Settings"
                            className=""
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24">
                            <path d="M4.00436 6.41686L0.761719 3.17422L2.17593 1.76001L5.41857 5.00265H20.6603C21.2126 5.00265 21.6603 5.45037 21.6603 6.00265C21.6603 6.09997 21.6461 6.19678 21.6182 6.29L19.2182 14.29C19.0913 14.713 18.7019 15.0027 18.2603 15.0027H6.00436V17.0027H17.0044V19.0027H5.00436C4.45207 19.0027 4.00436 18.5549 4.00436 18.0027V6.41686ZM6.00436 7.00265V13.0027H17.5163L19.3163 7.00265H6.00436ZM5.50436 23.0027C4.67593 23.0027 4.00436 22.3311 4.00436 21.5027C4.00436 20.6742 4.67593 20.0027 5.50436 20.0027C6.33279 20.0027 7.00436 20.6742 7.00436 21.5027C7.00436 22.3311 6.33279 23.0027 5.50436 23.0027ZM17.5044 23.0027C16.6759 23.0027 16.0044 22.3311 16.0044 21.5027C16.0044 20.6742 16.6759 20.0027 17.5044 20.0027C18.3328 20.0027 19.0044 20.6742 19.0044 21.5027C19.0044 22.3311 18.3328 23.0027 17.5044 23.0027Z"></path>
                          </svg>
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))
      ) : (
        <></>
      )}
      <div className="xl:hidden sm:block fixed bottom-[70px]  left-0 w-full rounded-lg overflow-hidden">
        {props.showBookingBtns ? (
          <div className={`${selectedState ? "opacity-100 flex" : "opacity-0 hidden"} w-full  items-center justify-center transition-all`}>
            <Link
              to={`/book/${selectedUrl}`}
              className=" w-full">
              <Button className=" w-full bg-black py-6">Continue</Button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MistriComponent;
