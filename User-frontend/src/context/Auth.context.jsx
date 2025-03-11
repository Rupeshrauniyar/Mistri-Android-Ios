import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const userContext = createContext();

export const AuthProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastOnlineCheck, setLastOnlineCheck] = useState(null);

  // Get data from localStorage
  const getLocalData = () => {
    try {
      const localUser = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      return { localUser, token };
    } catch (error) {
      console.error("Error parsing local user data:", error);
      return { localUser: null, token: null };
    }
  };

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize user from localStorage
  useEffect(() => {
    const { localUser } = getLocalData();
    if (localUser) {
      setUser(localUser);
      setUserLoading(false);
    }
  }, []);

  // Check user authentication status
  const CheckUser = async () => {
    const { localUser, token } = getLocalData();
    
    if (!token) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    // If offline, use local data
    if (isOffline) {
      if (localUser) {
        setUser(localUser);
      }
      setUserLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/user/check`, { token });
      
      if (response.data.status === "OK" && response.data.user) {
        // Update local storage with fresh data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      } else {
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      // If server error but we have local data, use it
      if (localUser && token) {
        setUser(localUser);
        if (!isOffline) {
          toast.warning("Using offline data. Some features may be limited.");
        }
      } else {
        setUser(null);
      }
    } finally {
      setUserLoading(false);
      setLastOnlineCheck(Date.now());
    }
  };

  // Check user when online status changes or token changes
  useEffect(() => {
    const { token } = getLocalData();
    
    // Don't check if we're offline and have recent data
    if (isOffline && lastOnlineCheck && Date.now() - lastOnlineCheck < 300000) {
      return;
    }

    if (token) {
      CheckUser();
    } else {
      setUser(null);
      setUserLoading(false);
    }
  }, [isOffline]);

  // Expose login and logout functions
  const login = async (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <userContext.Provider 
      value={{
        user,
        setUser,
        userLoading,
        setUserLoading,
        isOffline,
        login,
        logout,
        CheckUser
      }}
    >
      {children}
    </userContext.Provider>
  );
};
