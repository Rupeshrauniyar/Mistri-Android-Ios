import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SplashScreen } from '@capacitor/splash-screen';

// Hide the splash screen when the app is ready
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await SplashScreen.hide();
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
