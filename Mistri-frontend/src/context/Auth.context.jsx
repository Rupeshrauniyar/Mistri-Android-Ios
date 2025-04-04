import React, {useState, useEffect, createContext} from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [mistri, setMistri] = useState(localStorage.getItem("mistri")._id ? localStorage.getItem("mistri") : null);
  const [mistriLoading, setMistriLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastOnlineCheck, setLastOnlineCheck] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light");

  // Get data from localStorage
  const getLocalData = () => {
    try {
      const localMistri = JSON.parse(localStorage.getItem("mistri"));
      const token = localStorage.getItem("token");
      return {localMistri, token};
    } catch (error) {
      console.error("Error parsing local mistri data:", error);
      return {localMistri: null, token: null};
    }
  };

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Initialize mistri from localStorage
  useEffect(() => {
    const {localMistri} = getLocalData();
    if (localMistri) {
      setMistri(localMistri);
      setMistriLoading(false);
    }
  }, []);

  // Check mistri authentication status
  const CheckMistri = async () => {
    const {localMistri, token} = getLocalData();

    if (!token) {
      setMistri(null);
      setMistriLoading(false);
      return;
    }

    // If offline, use local data
    if (isOffline) {
      if (localMistri) {
        setMistri(localMistri);
      }
      setMistriLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/mistri/check`, {token});

      if (response.data.status === "OK" && response.data.mistri) {
        // Update local storage with fresh data
        localStorage.setItem("mistri", JSON.stringify(response.data.mistri));
        setMistri(response.data.mistri);
      } else {
        // Clear invalid data
        localStorage.removeItem("mistri");
        localStorage.removeItem("token");
        setMistri(null);
      }
    } catch (error) {
      console.error("Error checking mistri:", error);
      // If server error but we have local data, use it
      if (localMistri && token) {
        setMistri(localMistri);
      } else {
        setMistri(null);
      }
    } finally {
      setMistriLoading(false);
      setLastOnlineCheck(Date.now());
    }
  };

  // Check mistri when online status changes or token changes
  useEffect(() => {
    const {token} = getLocalData();

    // Don't check if we're offline and have recent data
    if (isOffline && lastOnlineCheck && Date.now() - lastOnlineCheck < 300000) {
      return;
    }

    if (token) {
      CheckMistri();
    } else {
      setMistri(null);
      setMistriLoading(false);
    }
  }, [isOffline]);

  // Expose login and logout functions
  const login = async (token, mistriData) => {
    localStorage.setItem("mistri", JSON.stringify(mistriData));
    localStorage.setItem("token", token);
    setMistri(mistriData);
  };

  const logout = () => {
    localStorage.removeItem("mistri");
    localStorage.removeItem("token");
    setMistri(null);
  };

  const fetchUniversalOrders = async () => {
    if (!mistriLoading && mistri?.profession) {
      const Data = [{profession: mistri.profession}, {rejectedOrders: mistri.rejectedOrders}];
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/universal-order`, Data);
        // console.log("Universal Order Response:", response);

        if (response?.data?.status === "OK" && response?.data?.order?.length > 0) {
          setUniversalOrder(response.data.order);
        } else {
          // console.log("No universal orders found");
          setUniversalOrder([]);
        }
      } catch (error) {
        toast.error("Error fetching universal orders:", error);
      }
    } else {
      console.warn("Mistri is loading or profession is undefined.");
    }
  };

  const fetchActiveOrders = async () => {
    if (!mistriLoading && mistri?._id) {
      const Data = {id: mistri._id};
      try {
        const response = await axios.post(`${backendURL}/mistri/fetch/accepted-order`, Data);
        if (response?.data?.status === "OK" && response?.data?.activeOrders) {
          setActiveOrder(response.data.order); // Directly set orders
          setMistri((prev) => ({
            ...prev,
            activeOrders: response.data.activeOrders,
          }));
          setMistri((prev) => ({
            ...prev,
            orders: response.data.order,
          }));
        } else {
          console.log("No active orders found");
        }
      } catch (error) {
        console.error("Error fetching active orders:", error);
      } finally {
        setActiveOrderLoading(false);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        mistri,
        setMistri,
        mistriLoading,
        setMistriLoading,
        isOffline,
        login,
        logout,
        CheckMistri,
        theme,
        setTheme,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
