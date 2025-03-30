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
import ScrollComponent from "./components/ScrollComponent.jsx";
import SimplePullToRefresh from "./components/SimplePullToRefresh.jsx";
import { useLocation } from "react-router-dom";

// Component to conditionally render navigation based on path
const AppLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Paths that shouldn't show navbar/topbar
  const noNavPaths = ['/login', '/register', '/logout'];
  const showNav = !noNavPaths.includes(path);

  return (
    <>
      {showNav && <Navbar />}
      
      <div className="flex flex-col w-full h-screen">
        {showNav && <TopNavbar />}
        
        <main className={`flex-1 ${showNav ? 'pb-16 md:pb-0 md:ml-16' : ''}`}>
          <SimplePullToRefresh onRefresh={() => window.location.reload()}>
            <ScrollComponent>
              <Routes>
                <Route element={<IsLoggedin />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/foryou" element={<UniversalOrder />} />
                  <Route path="/bookings" element={<Booking />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/profile" element={<MistriProfile />} />
                  <Route path="/dashboard" element={<MistriProfile />} />
                </Route>

                <Route path="/logout" element={<Logout />} />
                <Route path="/login" element={<MistriLogin />} />
                <Route path="/register" element={<MistriRegister />} />
                <Route path="/settings" element={<Settings />} />
                {/* Not found route */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </ScrollComponent>
          </SimplePullToRefresh>
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <div className="w-full h-screen bg-background dark:bg-background-dark text-foreground dark:text-foreground-dark">
      <AuthProvider>
        <BookingNavbarProvider>
          <Router>
            <AppLayout />
          </Router>
        </BookingNavbarProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
