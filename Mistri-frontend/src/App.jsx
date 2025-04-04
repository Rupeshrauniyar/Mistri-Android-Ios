import React, {useEffect} from "react";
import {AuthProvider} from "./context/Auth.context.jsx";
import {BookingNavbarProvider} from "./context/BookingNavbar.context.jsx";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NewApp from "./NewApp.jsx";
const App = () => {
  return (
    <div className="w-full h-full">
      <AuthProvider>
        <BookingNavbarProvider>
          <Router>
            <NewApp />
          </Router>
        </BookingNavbarProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
