import React, {useState, createContext} from "react";
export const BookingContext = createContext();

export const BookingNavbarProvider = ({children}) => {
  const [universalOrder, setUniversalOrder] = useState();
  const [activeOrder, setActiveOrder] = useState([]);
  const [order, setOrder] = useState([]);

  return (
    <BookingContext.Provider value={{universalOrder, setUniversalOrder, setActiveOrder, activeOrder, order, setOrder}}>{children}</BookingContext.Provider>
  );
};
