import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context/Auth.context';
import { Loader2 } from 'lucide-react';

const Logout = () => {
  const { logout } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay to show the loading indicator
    const timer = setTimeout(() => {
      // Call the logout function from context
      logout();
      
      // Redirect to home page
      navigate('/', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [logout, navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-black" />
        <h1 className="text-2xl font-bold mb-2">Logging Out</h1>
        <p className="text-gray-600">Please wait while we log you out...</p>
      </div>
    </div>
  );
};

export default Logout;
