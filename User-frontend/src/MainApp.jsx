import {useState, useContext, useEffect} from "react";
import {useNavigate, useLocation, BrowserRouter as Router, Routes, Route} from "react-router-dom";
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
// Components

import Navbar from "./components/Navbar.jsx";
import TopNavbar from "./components/Top-Navbar.jsx";
// import BookingsActive from "./components/BookingsActive.jsx";
import ActiveOrders from "./pages/ActiveOrders.jsx";
import BookingsOther from "./components/BookingsOther.jsx";
import HistoryComponent from "./components/HistoryComponent.jsx";
function MainApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const {user, userLoading} = useContext(userContext);
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

  return (
    <>
      <div className="w-full h-screen dark:bg-black dark:text-white bg-zinc-200 text-black flex overflow-hidden">
        <Navbar />

        <div>
          <TopNavbar />
        </div>

        <div className="xl:w-[80%] mt-[53px] sm:w-full h-screen dark:bg-black dark:text-white bg-zinc-100 text-black flex">
          <Routes>
            {/* Universal routes */}
            <Route
              path="/"
              element={<Home />}
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
    </>
  );
}

export default MainApp;
