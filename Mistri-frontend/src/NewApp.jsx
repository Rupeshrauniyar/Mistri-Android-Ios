import {useState, useEffect, useContext} from "react";
import {App} from "@capacitor/app";
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
import {AuthContext} from "./context/Auth.context.jsx";
import {BookingNavbarProvider} from "./context/BookingNavbar.context.jsx";
import Navbar from "./components/Navbar.jsx";
import TopNavbar from "./components/Top-Navbar.jsx";
import ScrollComponent from "./components/ScrollComponent.jsx";
import SimplePullToRefresh from "./components/SimplePullToRefresh.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import AcceptedOrderComp from "./components/AcceptedOrdersComp.jsx";
import AcceptedOrder from "./pages/AcceptedOrder.jsx";
import {Package} from "lucide-react";

function NewApp() {
  const {mistri, mistriLoading, theme, setTheme} = useContext(AuthContext);
  const [onboardingCompleted, setOnboardingCompleted] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if onboarding is completed
    const completed = localStorage.getItem("onboardingCompleted") === "true";
    setOnboardingCompleted(completed);
  }, []);

  useEffect(() => {
    const handleBackButton = () => {
      if (location.pathname === "/") {
        // If on home page, close the app
        App.exitApp();
      } else {
        // Navigate back to the previous page
        navigate(-1);
      }
    };

    const backButtonListener = App.addListener("backButton", handleBackButton);

    // Clean up listener when component unmounts
    return () => {
      backButtonListener.remove();
    };
  }, [navigate, location]);

  // Don't render anything until we know if onboarding is completed
  if (onboardingCompleted === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  // Hide navbars on getstarted, login, and register pages
  const showNavbars = mistri?._id;

  return (
    <>
      <div className={`w-full h-screen  flex overflow-hidden ${theme === "dark" ? "dark bg-black text-zinc-100" : " light bg-zinc-100 text-black"}`}>
        {showNavbars && <Navbar />}
        {showNavbars && <TopNavbar />}

        <div className={`flex  flex-col ${showNavbars ? "xl:w-[85%] xl:ml-[17%] sm:w-full" : "w-full"} h-screen overflow-hidden`}>
          <div className={`   flex-1 ${showNavbars ? "mt-[65px]   " : ""} flex flex-col  min-h-screen`}>
            <div className="flex-1 flex flex-col overflow-y-auto ">
              <Routes>
                <Route element={<IsLoggedin />}>
                  <Route
                    path="/"
                    element={<Home />}
                  />

                  <Route
                    path="/bookings"
                    element={<Booking />}
                  />
                  <Route
                    path="/bookings/foryou"
                    element={<UniversalOrder />}
                  />
                  <Route
                    path="/active/:id"
                    element={<AcceptedOrder />}
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
          </div>
        </div>
      </div>
    </>
  );
}

export default NewApp;
