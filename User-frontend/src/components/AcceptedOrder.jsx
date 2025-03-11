import React, {useEffect, useState, useContext, useRef} from "react";
import axios from "axios";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {userContext} from "../context/Auth.context";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {MapContainer, TileLayer, Marker, Popup, Polyline, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {io} from "socket.io-client";
import {Geolocation} from "@capacitor/geolocation";
import {Loader2, MapPin, Phone, Calendar, Clock, IndianRupee, Navigation, User, CheckCircle, RefreshCcw} from "lucide-react";
import {ActiveOrdersContext} from "@/context/ActiveOrders.context";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io.connect(backendUrl);

// Component to handle map center updates
const MapUpdater = ({center}) => {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
};

const AcceptedOrder = ({acceptedOrder: order}) => {
  const {user} = useContext(userContext);
  const [userPosition, setUserPosition] = useState([0, 0]);
  const [mistriPosition, setMistriPosition] = useState([0, 0]);
  const [positionLoading, setPositionLoading] = useState(true);
  const [mistriPositionLoading, setMistriPositionLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const permissionRequested = useRef(false); // Track if permission request has been made
  const errorDisplayed = useRef(false); // Track if error has already been displayed
  const {activeOrders, seActiveOrdersContext} = useContext(ActiveOrdersContext);

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
  // const getPermissionAndWatchPositionForWeb = () => {
  //   if (permissionRequested.current) return; // Exit if permission already requested
  //   permissionRequested.current = true;

  //   if (!navigator.geolocation) {
  //     if (!errorDisplayed.current) {
  //       toast.error("Geolocation is not supported by your browser.");
  //       errorDisplayed.current = true;
  //     }
  //     setPositionLoading(false);
  //     return;
  //   }

  //   try {
  //     const watchId = navigator.geolocation.watchPosition(
  //       (position) => {
  //         const {latitude, longitude} = position.coords;
  //         setUserPosition([latitude, longitude]);
  //         setPositionLoading(false);
  //       },
  //       (err) => {
  //         if (!errorDisplayed.current) {
  //           // Show error only once
  //           toast.error("Error fetching geolocation.");
  //           errorDisplayed.current = true;
  //         }
  //         setPositionLoading(false);
  //         console.error("Geolocation Error:", err.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
  //     );

  //     // Cleanup function to clear the watch
  //     return () => navigator.geolocation.clearWatch(watchId);
  //   } catch (err) {
  //     if (!errorDisplayed.current) {
  //       // Show error only once
  //       toast.error("Failed to access geolocation.");
  //       errorDisplayed.current = true;
  //     }
  //     setPositionLoading(false);
  //     console.error("Geolocation Error:", err.message);
  //   }
  // };
  useEffect(() => {
    getPermissionAndWatchPositionForMobile();
    // getPermissionAndWatchPositionForWeb();
  }, []);

  useEffect(() => {
    if (!error && userPosition[0] !== 0 && userPosition[1] !== 0) {
      socket.emit("joinRoom", {room: order._id, userId: order.user._id});

      socket.on("joinedRoom", () => {
        socket.emit("send-location", {userPosition});
      });

      socket.on("receive-location", (Data) => {
        if (Data.mistriPosition && (Data.mistriPosition[0] !== mistriPosition[0] || Data.mistriPosition[1] !== mistriPosition[1])) {
          setMistriPosition(Data.mistriPosition);
          setMistriPositionLoading(false);
        }
      });

      return () => {
        socket.off("joinedRoom");
        socket.off("receive-location");
      };
    }
  }, [userPosition, error, order._id, order.user._id]);

  const userMarker = new L.Icon({
    iconUrl:
      "https://imgs.search.brave.com/ApJIYKDK7IGJuNPMwxqzH5HiB2K7pM7QJC2EpHmkqoU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wbHVz/cG5nLmNvbS9pbWct/cG5nL3BuZy1sb2Nh/dGlvbi1maWxlLWxv/Y2F0aW9uLWljb24t/cG5nLTI4Ny5wbmc",
    iconSize: [25, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const mistriMarker = new L.Icon({
    iconUrl: "https://pluspng.com/img-png/png-location-location-black-png-image-4231-1200.png",
    iconSize: [35, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  const polylinePoints = [userPosition, mistriPosition];
  if (positionLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
        <Loader2 className="w-10 h-10 text-black animate-spin" />
        <p className="text-gray-600">Getting your location...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderMap = () => {
    if (!userPosition[0] || !userPosition[1]) {
      return (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Location not available</p>
          </div>
        </div>
      );
    }

    return (
      <MapContainer
        center={userPosition}
        zoom={15}
        className="w-full h-full">
        <MapUpdater center={userPosition} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          icon={userMarker}
          position={userPosition}>
          <Popup>Your location</Popup>
        </Marker>
        {!mistriPositionLoading && mistriPosition[0] && mistriPosition[1] && (
          <>
            <Marker
              icon={mistriMarker}
              position={mistriPosition}>
              <Popup>{order.mistri.mistriname}'s Location</Popup>
            </Marker>
            <Polyline
              weight={4}
              positions={polylinePoints}
              color="black"
              opacity={0.6}
            />
          </>
        )}
      </MapContainer>
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Map Section */}
      <div className="w-full h-[40vh] sm:h-[50vh] relative">{renderMap()}</div>

      {/* Professional Info Card */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{order.mistri.mistriname}</h2>
            <p className="text-gray-600">{order.mistri.profession}</p>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center px-3 py-1 bg-black text-white text-sm">
              <IndianRupee className="w-4 h-4 mr-1" />
              {order.charges}/hr
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Order Status</span>
          <span className={`px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
        </div>

        {/* Time and Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 shrink-0" />
              <span className="text-sm">{order.orderDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 shrink-0" />
              <span className="text-sm">{order.orderTime}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 shrink-0" />
              <span className="text-sm truncate">{order.mistri.address}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-2 shrink-0" />
              <span className="text-sm">{order.mistri.contactNumber}</span>
            </div>
          </div>
        </div>

        {/* OTP Section */}
        <div className="bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Service OTP</label>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <Input
            disabled
            className="text-center font-mono text-2xl tracking-wider bg-white border-0"
            value={order.otp}
          />
          <p className="text-xs text-gray-500 text-center mt-2">Share this OTP with the professional when they arrive</p>
        </div>

        {/* Navigation Button */}
        <Button
          className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2 py-6"
          onClick={() => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${mistriPosition[0]},${mistriPosition[1]}`;
            window.open(url, "_blank");
          }}
          disabled={!mistriPosition[0] || !mistriPosition[1]}>
          <Navigation className="w-5 h-5" />
          <span>Navigate to Professional</span>
        </Button>
      </div>
    </div>
  );
};

export default AcceptedOrder;
