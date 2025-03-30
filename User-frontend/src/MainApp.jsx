import {useState, useContext, useEffect} from "react";
import {useNavigate, useLocation, BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {App} from "@capacitor/app";
import {userContext} from "./context/Auth.context.jsx";
// import IsLoggedin from "./middleware/IsLoggedin.jsx";
import IsLoggedin from "./middleware/IsLoggedin.jsx";
// Universal pages
import Home from "./pages/Home.jsx";
import Bookings from "./pages/Bookings.jsx";
import Logout from "./pages/Logout.jsx";
import PageNotFound from "./pages/Page-Not-Found.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Favourites from "./pages/Favourites.jsx";
import Search from "./pages/Search.jsx";
import Create from "./pages/Create.jsx";
import Book from "./pages/Book.jsx";
import History from "./pages/History.jsx";
import Profile from "./pages/Profile.jsx";
import GetStarted from "./pages/Getstarted.jsx";
// Components

import Navbar from "./components/Navbar.jsx";
import TopNavbar from "./components/Top-Navbar.jsx";
// import BookingsActive from "./components/BookingsActive.jsx";
import ActiveOrders from "./pages/ActiveOrders.jsx";
import BookingsOther from "./components/BookingsOther.jsx";
import HistoryComponent from "./components/HistoryComponent.jsx";
import ScrollComponent from "./components/ScrollComponent.jsx";
import SimplePullToRefresh from "./components/SimplePullToRefresh.jsx";

function MainApp() {
  const {user, userLoading} = useContext(userContext);
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
  const hideNavbarPaths = ["/getstarted", "/login", "/register"];
  const showNavbars = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      <div className="w-full h-screen flex overflow-hidden dark:bg-black dark:text-white bg-zinc-100 text-black">
        {showNavbars && <Navbar />}

        <div className={`flex flex-col ${showNavbars ? "xl:w-[85%] sm:w-full" : "w-full"} h-screen overflow-hidden`}>
          {showNavbars && <TopNavbar />}

          <div className={`flex-1 ${showNavbars ? "mt-[55px]" : ""} flex flex-col overflow-hidden min-h-screen`}>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <Routes>
                {/* Redirect to getstarted if onboarding not completed */}
                <Route
                  path="/"
                  element={
                    !localStorage.getItem("token") && !localStorage.getItem("user") && !onboardingCompleted && location.pathname !== "/getstarted" ? (
                      <Navigate
                        to="/getstarted"
                        replace
                      />
                    ) : (
                      <Home />
                    )
                  }
                />
                <Route
                  path="/getstarted"
                  element={<GetStarted />}
                />

                {/* done */}
                <Route
                  path="/logout"
                  element={<Logout />}
                />
                {/* done */}
                <Route element={<IsLoggedin />}>
                  <Route
                    path="/bookings"
                    element={<Bookings />}
                  />
                  <Route
                    path="/bookings/other"
                    element={<BookingsOther />}
                  />
                  <Route
                    path="/bookings/active/:orderId"
                    element={<ActiveOrders />}
                  />
                  <Route
                    path="/bookings/history"
                    element={<HistoryComponent showNavbar={true} />}
                  />
                  <Route
                    path="/favourites"
                    element={<Favourites />}
                  />
                  <Route
                    path="/create"
                    element={<Create />}
                  />
                  <Route
                    path="/book/:id"
                    element={<Book />}
                  />
                  <Route
                    path="/history"
                    element={<History />}
                  />
                  <Route
                    path="/profile"
                    element={<Profile />}
                  />
                </Route>

                {/* done */}
                {/* User routes */}
                <Route
                  path="/login"
                  element={<Login />}
                />
                {/* done */}
                <Route
                  path="/register"
                  element={<Register />}
                />
                {/* done */}

                <Route
                  path="/search"
                  element={<Search />}
                />
                {/* done */}

                <Route
                  path="/settings"
                  element={<Settings />}
                />

                {/* Not found route */}
                <Route
                  path="*"
                  element={<PageNotFound />}
                />
                {/* done */}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainApp;
