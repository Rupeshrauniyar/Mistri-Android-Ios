import React, {useEffect, useState, useContext, useRef} from "react";
import axios from "axios";
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
  const [permissionStatus, setPermissionStatus] = useState(null);
  const watchIdRef = useRef(null);
  const {activeOrders, seActiveOrdersContext} = useContext(ActiveOrdersContext);

  // Function for mobile devices using Capacitor

  const getMobileLocation = async () => {
    try {
      // Check permissions first
      const permission = await Geolocation.checkPermissions();
      setPermissionStatus(permission.location);

      if (permission.location !== "granted") {
        const requestPermission = await Geolocation.requestPermissions();
        if (requestPermission.location !== "granted") {
          setError("Location permission denied");
          //         setPositionLoading(false);
          return;
        }
      }

      // Start watching position
      const watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
        (position, err) => {
          if (err) {
            setError("Error fetching geolocation");
            //           setPositionLoading(false);
            return;
          }
          const {latitude, longitude} = position.coords;
          setUserPosition([latitude, longitude]);
          setPositionLoading(false);
          setError(null);
        }
      );

      watchIdRef.current = watchId;

      return () => {
        if (watchIdRef.current) {
          Geolocation.clearWatch({id: watchIdRef.current});
        }
      };
    } catch (err) {
      console.error("Error in mobile location:", err);
      setError("Failed to access location services");
      //     setPositionLoading(false);
      alert(err);
    }
  };

  // Function for web browsers using native geolocation
  const getWebLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setPositionLoading(false);
      return;
    }

    try {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          setUserPosition([latitude, longitude]);
          setPositionLoading(false);
          setError(null);
        },
        (err) => {
          // console.error("Geolocation Error:", err);
          let errorMessage = "Error accessing location";

          switch (err.code) {
            case 1:
              errorMessage = "Location access denied. Please enable location services.";
              break;
            case 2:
              errorMessage = "Location unavailable. Please try again.";
              break;
            case 3:
              errorMessage = "Location request timed out. Please try again.";
              break;
          }

          setError(errorMessage);
          setPositionLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      watchIdRef.current = watchId;

      return () => {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
      };
    } catch (err) {
      console.error("Error in web location:", err);
      setError("Failed to access location services");
      setPositionLoading(false);
    }
  };

  // Initialize location tracking
  useEffect(() => {
    getWebLocation();
    // getMobileLocation();
  }, []);

  // Handle retry location access
  const handleRetryLocation = async () => {
    setPositionLoading(true);
    setError(null);
    getWebLocation();
    // getMobileLocation();
  };

  // Socket connection effect
  useEffect(() => {
    if (!error && userPosition[0] !== 0 && userPosition[1] !== 0) {
      socket.emit("joinRoom", {room: order._id, userId: order.user._id});

      socket.on("joinedRoom", () => {
        const Data = {
          userPosition,
          RoomId: order._id,
        };
        socket.emit("send-location", Data);
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
    iconSize: [20, 30],
  });
  const mistriMarker = new L.Icon({
    iconUrl: "https://pluspng.com/img-png/png-location-location-black-png-image-4231-1200.png",
    iconSize: [35, 40],
  });
  const polylinePoints = [userPosition, mistriPosition];

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
    if (positionLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <Loader2 className="w-10 h-10 text-black animate-spin" />
          <p className="text-gray-600 dark:text-white">Getting your location...</p>
        </div>
      );
    }
    if (error || !userPosition) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-zinc-800 dark:text-white space-y-4 rounded-t-2xl">
          <MapPin className="w-12 h-12 text-gray-400" />
          <div className="text-center px-4">
            <p className="text-gray-600 dark:text-white mb-4">
              {error === "Location permission denied" ? "Please enable location access to track the service professional" : "Unable to access your location"}
            </p>
            <Button
              onClick={handleRetryLocation}
              className="bg-black hover:bg-gray-800 text-white flex items-center space-x-2">
              <RefreshCcw className="w-4 h-4" />
              <span>Enable Location Access</span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <MapContainer
        center={userPosition}
        zoom={16}
        className="w-full h-full z-20 rounded-t-2xl">
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
    <div className="w-full mt-4 overflow-hidden px-4 pb-[150px] ">
      <div className="w-full  rounded-2xl overflow-hidden shadow-md dark:bg-zinc-900 bg-white">
        {/* Map Section */}
        <div className="w-full h-[40vh] sm:h-[50vh] relative overflow-hidden">{renderMap()}</div>

        {/* Professional Info Card */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{order.mistri.mistriname}</h2>
              <p className="text-gray-600 dark:text-white">{order.mistri.profession}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-3 py-1 bg-black text-white text-sm rounded-full">
                <IndianRupee className="w-4 h-4 mr-1" />
                {order.charges}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-white">Order Status</span>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
          </div>

          {/* Time and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-zinc-800 dark:text-white p-4 rounded-md">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-white">
                <Calendar className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-sm">{order.orderDate}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-white">
                <Clock className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-sm">{order.orderTime}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-white">
                <MapPin className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-sm truncate">{order.mistri.address}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-white">
                <Phone className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-sm">{order.mistri.contactNumber}</span>
              </div>
            </div>
          </div>

          {/* OTP Section */}
          <div className="bg-gray-50 dark:bg-zinc-800 dark:text-white p-4 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-white">Service OTP</label>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <Input
              disabled
              className="text-center font-mono text-2xl tracking-wider dark:bg-black  border-0 text-green-800"
              value={order.otp}
            />
            <p className="text-xs text-gray-500 text-center mt-2">Share this OTP with the professional when they arrive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptedOrder;
