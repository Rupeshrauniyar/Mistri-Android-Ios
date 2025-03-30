import React, {useState, useEffect, createContext} from "react";
import axios from "axios";
export const mistriContext = createContext();
export const AuthProvider = ({children}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [mistri, setMistri] = useState(null);
  const [mistriLoading, setMistriLoading] = useState(true);
  useEffect(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post(`${backendUrl}/mistri/check`, {token}).then((response) => {
        if (response.data.status === "OK" && response.data.mistri) {
          setMistri(response.data.mistri);
        } else {
          setMistri(null);
        }
      });
    } else {
      setMistri(null);
    }
    setMistriLoading(false);
  }, []);

  return <mistriContext.Provider value={{mistri, setMistri, mistriLoading, setMistriLoading}}> {children} </mistriContext.Provider>;
};

