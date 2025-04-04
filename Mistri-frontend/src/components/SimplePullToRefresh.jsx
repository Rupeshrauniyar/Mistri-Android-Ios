import React, {useState, useRef, useEffect} from "react";
import {useLocation} from "react-router-dom";

const SimplePullToRefresh = ({onRefresh, children, pullDownThreshold = 100}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const location = useLocation();

  // Handle scroll events to track if we're at the top
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      setIsAtTop(scrollTop <= 1); // Using 1px threshold for better detection
    };

    container.addEventListener("scroll", handleScroll, {passive: true});
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTouchStart = (e) => {
    if (!isAtTop) {
      setIsPulling(false);
      return;
    }

    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setIsPulling(true);
  };

  const handleTouchMove = (e) => {
    if (!isPulling || !isAtTop) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      setPullDistance(Math.min(diff / 2, pullDownThreshold * 1.5)); // Add resistance and max limit
      e.preventDefault();
    } else {
      setPullDistance(0);
      setIsPulling(false);
    }
  };

  const handleTouchEnd = async () => {
    if (!isAtTop) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    if (pullDistance >= pullDownThreshold && !isRefreshing) {
      setIsRefreshing(true);

      try {
        await onRefresh();
      } catch (error) {
        console.error("Refresh failed:", error);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setIsPulling(false);
      }
    } else {
      setPullDistance(0);
      setIsPulling(false);
    }
  };

  // Determine container height based on route
  const getContainerStyle = () => {
    const baseStyle = {
      overflowY: "auto",
      position: "relative",
      zIndex: 1,
      WebkitOverflowScrolling: "touch", // For smooth scrolling on iOS
    };

    // Routes that need full height
    const fullHeightRoutes = ["/bookings", "/history", "/create", "/profile"];
    if (fullHeightRoutes.includes(location.pathname)) {
      return {
        ...baseStyle,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      };
    }

    // Default height for other routes
    return {
      ...baseStyle,
      height: "100vh",
    };
  };

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="min-h-full w-full scroll-smooth"
      style={getContainerStyle()}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      {/* Pull down indicator - only show when at top */}
      {isAtTop && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: `${pullDistance}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
            borderBottom: "1px solid #e0e0e0",
            transition: isPulling ? "none" : "height 0.2s ease-out",
            overflow: "hidden",
            zIndex: 10,
            opacity: pullDistance / pullDownThreshold,
          }}>
          {isRefreshing ? (
            <div className="refreshing">
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="pull-indicator flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: `rotate(${Math.min(180, (pullDistance / pullDownThreshold) * 180)}deg)`,
                  transition: "transform 0.2s ease",
                }}>
                <line
                  x1="12"
                  y1="19"
                  x2="12"
                  y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              <span className="text-sm text-gray-600">{pullDistance >= pullDownThreshold ? "Release to refresh" : "Pull down to refresh"}</span>
            </div>
          )}
        </div>
      )}

      {/* Content with transform - only apply transform when at top */}
      <div
        style={{
          transform: isAtTop ? `translateY(${pullDistance}px)` : "none",
          transition: isPulling ? "none" : "transform 0.2s ease-out",
          minHeight: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}>
        {children}
      </div>
    </div>
  );
};

export default SimplePullToRefresh;
