import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SplashScreen } from '@capacitor/splash-screen';

const Main = () => {
  useEffect(() => {
    // Initialize and hide the splash screen
    const initSplashScreen = async () => {
      try {
        // Hide the splash screen after it has shown for the duration specified in capacitor.config.json
        await SplashScreen.hide();
      } catch (error) {
        console.error('Error initializing splash screen:', error);
      }
    };

    initSplashScreen();
  }, []);

  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
