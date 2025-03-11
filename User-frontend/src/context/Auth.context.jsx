import React, {useState, useEffect, createContext} from "react";
import axios from "axios";
export const userContext = createContext();
export const AuthProvider = ({children}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [LocalUserLoading, setLocalUserLoading] = useState(true);

  useEffect(() => {
    const LocalUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (token && LocalUser && LocalUser._id) {
      setUser(LocalUser);
      setLocalUserLoading(false);
      // console.log(LocalUser);
    } else {
    }
  }, []);
  useEffect(() => {
    const CheckUser = async () => {
      if (token && LocalUser) {
        await axios.post(`${backendUrl}/user/check`, {token}).then((response) => {
          if (response.data.status === "OK" && response.data.user) {
            setUser(response.data.user);
          } else if (response.data.status === "BAD") {
            setUser(null);
          } else {
            setUser(null);
          }
        });
      } else {
        setUser(null);
      }
      setUserLoading(false);
    };
    CheckUser();
  }, []);

  return <userContext.Provider value={{user, setUser, userLoading, setUserLoading, LocalUserLoading}}> {children} </userContext.Provider>;
};
