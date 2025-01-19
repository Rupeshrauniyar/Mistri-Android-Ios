import {useState, useContext} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import IsLoggedin from "./middleware/IsLoggedin.jsx";
// Universal pages
import Home from "./pages/Home.jsx";
import History from "./pages/History.jsx";
import Logout from "./pages/Logout.jsx";
import PageNotFound from "./pages/Page-Not-Found.jsx";
import Settings from "./pages/Settings.jsx";
// Mistri pages
import MistriLogin from "./pages/Mistri.login.jsx";
import MistriRegister from "./pages/Mistri.register.jsx";
import MistriProfile from "./pages/Mistri.profile.jsx";
import Booking from "./pages/Booking.jsx";
// import universalOrder from "./pages/universalOrder.jsx";
import UniversalOrder from "./pages/UniversalOrder.jsx";
// Components
import {AuthProvider} from "./context/Auth.context.jsx";
import {BookingNavbarProvider} from "./context/BookingNavbar.context.jsx";
import Navbar from "./components/Navbar.jsx";
import TopNavbar from "./components/Top-Navbar.jsx";
function App() {
  return (
    <>
      <div className="w-full h-screen dark:bg-black dark:text-white bg-zinc-200 text-black flex overflow-hidden">
        <AuthProvider>
          <BookingNavbarProvider>
            <Router>
              <Navbar />

              <div>
                <TopNavbar />
              </div>

              <div className="xl:w-[80%] mt-[53px] sm:w-full h-screen dark:bg-black dark:text-white bg-zinc-100 text-black flex">
                <Routes>
                  <Route element={<IsLoggedin />}>
                    <Route
                      path="/"
                      element={<Home />}
                    />
                    <Route
                      path="/foryou"
                      element={<UniversalOrder />}
                    />
                    <Route
                      path="/bookings"
                      element={<Booking />}
                    />

                    <Route
                      path="/history"
                      element={<History />}
                    />
                    <Route
                      path="/profile"
                      element={<MistriProfile />}
                    />
                    <Route
                      path="/dashboard"
                      element={<MistriProfile />}
                    />
                  </Route>

                  <Route
                    path="/logout"
                    element={<Logout />}
                  />
                  <Route
                    path="/login"
                    element={<MistriLogin />}
                  />
                  <Route
                    path="/register"
                    element={<MistriRegister />}
                  />
                  <Route
                    path="/settings"
                    element={<Settings />}
                  />
                  {/* Not found route */}
                  <Route
                    path="*"
                    element={<PageNotFound />}
                  />
                </Routes>
              </div>
            </Router>
          </BookingNavbarProvider>
        </AuthProvider>
      </div>
    </>
  );
}

export default App;
