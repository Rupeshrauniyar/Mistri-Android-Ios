import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollComponent = ({ children }) => {
  const location = useLocation();
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const container = mainContainerRef.current?.querySelector('[data-scroll-container]');
    if (!container) return;

    // Scroll to top on route change, except for specific routes that handle their own scrolling
    const noScrollRoutes = ['/bookings', '/history', '/profile', '/foryou'];
    if (!noScrollRoutes.includes(location.pathname)) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // Save scroll position for current route
    const saveScrollPosition = () => {
      if (!container) return;
      const scrollPosition = container.scrollTop;
      sessionStorage.setItem(`scroll_${location.pathname}`, scrollPosition.toString());
    };

    // Add scroll event listener
    container.addEventListener('scroll', saveScrollPosition, { passive: true });

    // Restore scroll position if it exists
    const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);
    if (savedPosition && noScrollRoutes.includes(location.pathname)) {
      container.scrollTo({
        top: parseInt(savedPosition),
        behavior: 'auto'
      });
    }

    return () => {
      // Clean up
      saveScrollPosition();
      container.removeEventListener('scroll', saveScrollPosition);
    };
  }, [location.pathname]);

  return (
    <div ref={mainContainerRef} className="w-full h-full flex flex-col">
      {children}
    </div>
  );
};

export default ScrollComponent; 