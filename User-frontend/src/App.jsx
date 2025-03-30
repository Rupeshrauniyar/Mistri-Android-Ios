import React, { useEffect } from "react";
import {AuthProvider} from "./context/Auth.context.jsx";
import {MistrisProvider} from "./context/Mistris.context.jsx";
import {ActiveOrdersProvider} from "./context/ActiveOrders.context.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import MainApp from "./MainApp.jsx";


const App = () => {
 

  return (
    <div className="w-full h-full">
      <AuthProvider>
        <MistrisProvider>
          <ActiveOrdersProvider>
            <Router>
              <MainApp />
            </Router>
          </ActiveOrdersProvider>
        </MistrisProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
