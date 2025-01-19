import React, {useEffect, useState, useContext, useRef} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {userContext} from "../context/Auth.context";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {MapContainer, TileLayer, Marker, Popup, Polyline} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {io} from "socket.io-client";
import {Geolocation} from "@capacitor/geolocation";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io.connect(backendUrl);

const AcceptedOrder = (props) => {
  const {user, setUser, setUserLoading} = useContext(userContext);
  const [userPosition, setUserPosition] = useState([0, 0]);
  const [mistriPosition, setMistriPosition] = useState([0, 0]);
  const [positionLoading, setPositionLoading] = useState(true);
  const [MistriPositionLoading, setMistriPositionLoading] = useState(true);
  const [error, setError] = useState(null);
  const permissionRequested = useRef(false); // Track if permission request has been made
  const errorDisplayed = useRef(false); // Track if error has already been displayed

  const getPermissionAndWatchPositionForMobile = async () => {
    try {
      if (permissionRequested.current) return; // Exit if already requested
      permissionRequested.current = true;

      const hasPermission = await Geolocation.requestPermissions();
      if (hasPermission.location === "granted") {
        const watchId = Geolocation.watchPosition({enableHighAccuracy: true, timeout: 5000, maximumAge: 0}, (position, err) => {
          if (err) {
            if (!errorDisplayed.current) {
              // Show error only once
              setError("Error fetching geolocation");
              toast.error("Error fetching geolocation");
              errorDisplayed.current = true;
            }
            setPositionLoading(false);
            return;
          }
          const {latitude, longitude} = position.coords;
          setUserPosition([latitude, longitude]);
          setPositionLoading(false);
        });

        // Cleanup function to clear watch when component unmounts
        return () => Geolocation.clearWatch({id: watchId});
      } else {
        if (!errorDisplayed.current) {
          // Show error only once
          // setError("Location permission denied.");
          toast.error("Location permission denied.");
          errorDisplayed.current = true;
        }
        setPositionLoading(false);
      }
    } catch (err) {
      // toast.error("Failed to request location permissions.");
      if (!errorDisplayed.current) {
        // Show error only once
        // setError("Failed to request location permissions.");
        errorDisplayed.current = true;
      }
      setPositionLoading(false);
      return;
    }
  };
  const getPermissionAndWatchPositionForWeb = () => {
    if (permissionRequested.current) return; // Exit if permission already requested
    permissionRequested.current = true;

    if (!navigator.geolocation) {
      if (!errorDisplayed.current) {
        toast.error("Geolocation is not supported by your browser.");
        errorDisplayed.current = true;
      }
      setPositionLoading(false);
      return;
    }

    try {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          setUserPosition([latitude, longitude]);
          setPositionLoading(false);
        },
        (err) => {
          if (!errorDisplayed.current) {
            // Show error only once
            toast.error("Error fetching geolocation.");
            errorDisplayed.current = true;
          }
          setPositionLoading(false);
          console.error("Geolocation Error:", err.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 0}
      );

      // Cleanup function to clear the watch
      return () => navigator.geolocation.clearWatch(watchId);
    } catch (err) {
      if (!errorDisplayed.current) {
        // Show error only once
        toast.error("Failed to access geolocation.");
        errorDisplayed.current = true;
      }
      setPositionLoading(false);
      console.error("Geolocation Error:", err.message);
    }
  };
  useEffect(() => {
    getPermissionAndWatchPositionForMobile();
    // getPermissionAndWatchPositionForWeb();
  }, []);

  useEffect(() => {
    if (!error) {
      socket.emit("joinRoom", {room: props.acceptedOrder._id, userId: props.acceptedOrder.user._id});

      socket.on("joinedRoom", () => {
        if (!positionLoading) {
          socket.emit("send-location", {userPosition});
        }
      });

      socket.on("receive-location", (Data) => {
        if (Data.mistriPosition && Data.mistriPosition !== mistriPosition) {
          setMistriPosition(Data.mistriPosition);
          setMistriPositionLoading(false);
        }
      });

      return () => {
        socket.off("joinedRoom");
        socket.off("receive-location");
      };
    }
  }, [userPosition, positionLoading, mistriPosition]);

  const userMarker = new L.Icon({
    iconUrl:
      "https://imgs.search.brave.com/ApJIYKDK7IGJuNPMwxqzH5HiB2K7pM7QJC2EpHmkqoU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/cG5nLmNvbS9pbWct/cG5nL3BuZy1sb2Nh/dGlvbi1maWxlLWxv/Y2F0aW9uLWljb24t/cG5nLTI4Ny5wbmc", // Use your custom marker image here
    iconSize: [25, 40], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowAnchor: [12, 41], // point of the shadow which will correspond to marker's location
  });
  const mistriMarker = new L.Icon({
    iconUrl: "https://pluspng.com/img-png/png-location-location-black-png-image-4231-1200.png", // Use your custom marker image here
    iconSize: [35, 40], // size of the icon
    iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    shadowAnchor: [12, 41], // point of the shadow which will correspond to marker's location
  });
  const polylinePoints = [userPosition, mistriPosition];
  const order = props.acceptedOrder;
  return (
    <>
      <div
        key={order._id}
        className="xl:w-full xl:h-[40%] sm:w-full sm:h-[80%] shrink-0 bg-white   xl:mr-1 sm:mr-0 border-b-2">
        <div className="Map w-full xl:h-[25%] sm:h-[45%]  overflow-hidden shrink-0">
          {/* <Button onClick={(e) => }>Get location</Button> */}
          {positionLoading || !userPosition ? (
            <></>
          ) : (
            <MapContainer
              center={userPosition}
              zoom={30}
              className="w-full h-full "
              style={{height: "40vh", width: "100vw"}} // Ensures the map takes the full available space
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                icon={userMarker}
                position={userPosition}>
                <Popup>Your location</Popup>
              </Marker>
              {!MistriPositionLoading && mistriPosition ? (
                <>
                  <Marker
                    icon={mistriMarker}
                    position={mistriPosition}>
                    <Popup>{order.mistri.mistriname} Location</Popup>
                  </Marker>
                  <Polyline
                    weight={10}
                    positions={polylinePoints}
                    color="black"
                  />
                </>
              ) : (
                <></>
              )}
            </MapContainer>
          )}
        </div>
        <div className="Charges&Date flex items-center justify-between px-2">
          <span className="px-3 py-1 bg-indexColor text-white rounded-full">₹{order.charges}/</span>
          <span className="flex flex-col">
            <span className="flex">
              <p className="mr-1">Date:</p>
              {order.orderDate}
            </span>
            <span className="flex">
              <p className="mr-1">Time:</p>

              {order.orderTime}
            </span>
          </span>
        </div>
        <div className="MistriDets w-full flex items-center justify-center p-4">
          <div className=" w-[80%] flex items-center justify-center">
            <p className="overflow-hidden truncate  ">{order.mistri.address}</p>
          </div>
        </div>
        <div className="MistriDets w-full flex flex-col items-center justify-center p-4">
          <div className=" xl:w-[60%] sm:w-[50%] flex items-center justify-center">
            <h3 className="text-2xl font-bold overflow-hidden truncate ">{order.mistri.mistriname}</h3>
          </div>

          <p>{order.status}</p>
          <div className="w-full flex">
            <div className="OTP w-full flex  items-center justify-center pb-5">
              <span className="mr-1">OTP:</span>
              <Input
                disabled
                className="xl:w-1/2 sm:w-[90%] font-extrabold text-black"
                type="number"
                placeholder="OTP"
                defaultValue={order.otp}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcceptedOrder;
