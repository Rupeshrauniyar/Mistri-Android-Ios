import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Search from "./Search";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MistriSkeletonLoading from "./Mistri.skeleton.loading";
import {mistriContext} from "../context/Auth.context";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {MapContainer, TileLayer, Marker, Popup, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {io} from "socket.io-client";
import {Geolocation} from "@capacitor/geolocation";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io.connect(backendUrl);

const AcceptedOrderComp = (props) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const {mistri, setMistri, mistriLoading} = useContext(mistriContext);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState();
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoaading] = useState(true);
  const order = props.order;
  const [userPosition, setuserPosition] = useState([0, 0]);
  const [mistriPosition, setMistriPosition] = useState([0, 0]);
  const [positionLoading, setPositionLoading] = useState(true);
  const [UserPositionLoading, setUserPositionLoading] = useState(true);
  const [error, setError] = useState(false);
  // const fetchOrders = () => {
  //   setLoaading(true);
  //   axios
  //     .get(`${backendURL}/mistri/orders`, {
  //       headers: {
  //         authorization: `${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //       if (response.data.status === "BAD" && response.datainStatus === false) {
  //         navigate("/login");
  //       } else if (response.data.status === "BAD" && response.data.isVerified === false) {
  //         toast.error("Your account is not verified yet");
  //         setIsVerified(false);
  //       } else if (response.data.status === "OK" && response.data.isVerified === true) {
  //         setIsVerified(true);
  //         if (response.data.order.length > 0) {
  //           if (response.data.type === "my-order") {
  //             setOrderType("my-order");
  //           } else if (response.data.type === "universal-order") {
  //             setOrderType("universal-order");
  //           }
  //           setOrders(response.data.order);
  //         } else {
  //           // toast.info("No orders found");
  //           setOrders([]);
  //         }
  //       }
  //       setLoaading(false);
  //     });
  // };
  // useEffect(() => {
  //   fetchOrders();
  // }, []);

  const startOrder = (orderId, userId, mistriId) => {
    const Data = {
      userId,
      mistriId,
      orderId,
    };
    axios
      .post(`${backendURL}/mistri/orders/start`, Data, {
        headers: {
          authorization: `${token}`,
        },
      })
      .then((response) => {
        if (response.data.status === "BAD" && response.datainStatus === false) {
          navigate("/login");
        } else if (response.data.status === "OK") {
          toast.success("Order accepted successfully");
          setMistri((prev) => ({
            ...prev,
            acceptedOrder: [...prev.acceptedOrder, response.data.order._id],
          }));

          fetchOrders();
        } else {
          toast.error("Failed to accept order");
        }
      });
  };
  const mistriMarker = new L.Icon({
    iconUrl:
      "https://imgs.search.brave.com/ApJIYKDK7IGJuNPMwxqzH5HiB2K7pM7QJC2EpHmkqoU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/cG5nLmNvbS9pbWct/cG5nL3BuZy1sb2Nh/dGlvbi1maWxlLWxv/Y2F0aW9uLWljb24t/cG5nLTI4Ny5wbmc", // Use your custom marker image here
    iconSize: [25, 40], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowAnchor: [12, 41], // point of the shadow which will correspond to marker's location
  });
  const userMarker = new L.Icon({
    iconUrl: "https://pluspng.com/img-png/png-location-location-black-png-image-4231-1200.png", // Use your custom marker image here
    iconSize: [35, 40], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowAnchor: [12, 41], // point of the shadow which will correspond to marker's location
  });
  const polylinePoints = [userPosition, mistriPosition];

  useEffect(() => {
    if (mistri.acceptedOrder.length > 0) {
      const getPermissionAndWatchPositionForMobile = async () => {
        try {
          const hasPermission = await Geolocation.requestPermissions();
          if (hasPermission.location === "granted") {
            const watchId = Geolocation.watchPosition({enableHighAccuracy: true, timeout: 5000, maximumAge: 0}, (position, err) => {
              if (err) {
                setError("Error fetching geolocation");
                toast.error("Error fetching geolocation");
                setPositionLoading(false);
                return;
              }
              const {latitude, longitude} = position.coords;
              setMistriPosition([latitude, longitude]);
              setPositionLoading(false);
            });
            return () => Geolocation.clearWatch({id: watchId});
          } else {
            setError("Location permission denied.");
            setPositionLoading(false);
          }
        } catch (err) {
          setError("Failed to request location permissions.");
          toast.error("Failed to request location permissions.");
          setPositionLoading(false);
          console.log(err);
        }
      };
      const getPermissionAndWatchPositionForWeb = () => {
        if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser.");
          toast.error("Geolocation is not supported by your browser.");
          setPositionLoading(false);
          return;
        }

        try {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const {latitude, longitude} = position.coords;
              setMistriPosition([latitude, longitude]);
              setPositionLoading(false);
            },
            (err) => {
              setError("Error fetching geolocation.");
              toast.error("Error fetching geolocation.");
              setPositionLoading(false);
              console.error("Geolocation Error:", err.message);
            },
            {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}
          );

          // Return a function to clear the watch when the component unmounts
          return () => navigator.geolocation.clearWatch(watchId);
        } catch (err) {
          setError("Failed to access geolocation.");
          toast.error("Failed to access geolocation.");
          setPositionLoading(false);
          console.error("Geolocation Error:", err.message);
        }
      };

      // getPermissionAndWatchPositionForMobile();

      getPermissionAndWatchPositionForWeb()
    }
  }, []);
  useEffect(() => {
    if (mistri.acceptedOrder.length > 0) {
      if (!error) {
        socket.emit("joinRoom", {room: mistri.acceptedOrder[0]._id, userId: mistri.acceptedOrder[0].user._id});
        // socket.emit("send-location", {userPosition});
        socket.on("joinedRoom", (userId) => {
          // ("User Joined", userId);

          !positionLoading ? socket.emit("send-location", {mistriPosition}) : <></>;
          socket.on("receive-location", (Data) => {
            // (Data)
            if (Data.userPosition && Data.userPosition !== userPosition) {
              setuserPosition(Data.userPosition);
              setUserPositionLoading(false);
            }
          });
        });
        return () => {
          socket.off("joinedRoom");
          socket.off("receive-location");
        };
      }
    }
  }, [userPosition, mistriPosition, positionLoading]);

  return (
    <>
      {mistri.acceptedOrder && mistri.acceptedOrder.length > 0 ? (
        <div className="w-full min-h-[100vh] flex flex-col items-center ">
          {mistri.acceptedOrder.map((order, index) => (
            <div
              key={index}
              className="w-full h-full bg-white overflow-hidden">
              <div className="Map w-full xl:h-[45%] sm:h-[45%]  overflow-hidden bg-gray-200">
                {!positionLoading && mistriPosition ? (
                  <MapContainer
                    center={mistriPosition}
                    zoom={30}
                    className="w-full h-full "
                    style={{height: "40vh", width: "100vw"}} // Ensures the map takes the full available space
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {!UserPositionLoading ? (
                      <>
                        <Marker
                          icon={userMarker}
                          position={userPosition}>
                          <Popup>{order.user.username} Location</Popup>
                        </Marker>
                        <Polyline
                          weight={8}
                          positions={polylinePoints}
                          color="black"
                        />
                      </>
                    ) : (
                      <></>
                    )}

                    <Marker
                      icon={mistriMarker}
                      position={mistriPosition}>
                      <Popup>Your location</Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <></>
                )}
              </div>
              <div className="OrderDets flex items-center justify-between ">
                <span className="px-3 py-1 bg-indexColor text-white rounded-full m-1">₹{order.charges}/</span>
                <span className="flex flex-col items-start justify-start">
                  <span className="flex">
                    <p className="mr-1">Date:</p>
                    {order.orderDate}
                  </span>
                  <span className="flex">
                    <p className="mr-1">Time:</p>

                    {order.orderTime}
                  </span>
                  {/* Time: */}
                </span>
              </div>
              <div className="UserDets w-full flex items-center justify-center p-1">
                <div className=" w-[80%] flex items-center justify-center">
                  <p className="overflow-hidden truncate  ">{order.user.address}</p>
                </div>
              </div>
              <div className="UserDets w-full flex flex-col items-center justify-center mb-4">
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
                  <div className="OTP w-full flex flex-col items-center justify-center">
                    <Input
                      className="xl:w-1/2 sm:w-[90%]"
                      type="number"
                      placeholder="OTP"
                    />

                    <Button
                      onClick={() => startOrder(order._id, order.user._id, order.mistri)}
                      className="bg-indexColor  mt-6  px-2 py-3  text-white flex items-center justify-center">
                      Verify
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
          ))}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AcceptedOrderComp;
