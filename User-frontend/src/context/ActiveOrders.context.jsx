import React, {useState, createContext} from "react";
export const ActiveOrdersContext = createContext();
export const ActiveOrdersProvider = ({children}) => {
  const [activeOrders, setActiveOrders] = useState([]);
  return <ActiveOrdersContext.Provider value={{activeOrders, setActiveOrders}}>{children}</ActiveOrdersContext.Provider>;
};
 