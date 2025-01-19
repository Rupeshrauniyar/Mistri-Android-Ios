import React, {useContext, createContext, useState} from "react";
export const mistriContext = createContext();
export const MistrisProvider = ({children}) => {
  const [mistris, setMistris] = useState([]);
  return <mistriContext.Provider value={{mistris, setMistris}}>{children}</mistriContext.Provider>;
};
