import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userContext } from "../context/Auth.context";
import { Loader2 } from "lucide-react";

const IsLoggedin = () => {
  const navigate = useNavigate();
  const { user, userLoading, isOffline } = useContext(userContext);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!userLoading) {
      if (!token || !user) {
        // Use replace to avoid adding to history stack
        navigate("/login", { replace: true });
      }
    }
  }, [user, userLoading, navigate]);

  // Show loading UI while checking authentication
  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If we have a user (either online or offline), show the protected route
  return user ? <Outlet /> : null;
};

export default IsLoggedin;
