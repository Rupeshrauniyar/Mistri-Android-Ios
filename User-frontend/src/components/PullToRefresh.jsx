import React, { useState, useEffect, useRef } from 'react';
import { App } from '@capacitor/app';

const PullToRefresh = ({ onRefresh, children, className = '', pullDistance = 80 }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullY, setPullY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startYRef = useRef(0);
  const isAtTopRef = useRef(false);

  useEffect(() => {
    // Add hardware back button handler for Android
    const backButtonListener = App.addListener('backButton', () => {
      if (isPulling || isRefreshing) {
        // Cancel refresh if back button is pressed during pull
        setIsPulling(false);
        setIsRefreshing(false);
        setPullY(0);
        return;
      }
    });

    return () => {
      // Clean up listener
      backButtonListener.remove();
    };
  }, [isPulling, isRefreshing]);

  const checkIfAtTop = () => {
    if (!containerRef.current) return false;
    return containerRef.current.scrollTop <= 0;
  };

  const handleTouchStart = (e) => {
    isAtTopRef.current = checkIfAtTop();
    if (isAtTopRef.current) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (!isAtTopRef.current || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    
    if (diff > 0) {
      // Prevent default scrolling behavior when pulling down
      e.preventDefault();
      setIsPulling(true);
      // Apply resistance to make pull feel natural
      const resistance = 0.4;
      setPullY(diff * resistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;
    
    if (pullY >= pullDistance) {
      // Trigger refresh
      setIsRefreshing(true);
      setPullY(pullDistance / 2); // Show partial indicator during refresh
      
      try {
        await onRefresh();
      } catch (error) {
      } finally {
        setIsRefreshing(false);
        setIsPulling(false);
        setPullY(0);
      }
    } else {
      // Cancel pull
      setIsPulling(false);
      setPullY(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`pull-to-refresh-container flex flex-col items-center justify-center ${className}`}
      style={{ 
        position: 'relative',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(isPulling || isRefreshing) && (
        <div 
          className="pull-indicator"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${pullY}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f0f0f0',
            transition: isPulling ? 'none' : 'height 0.2s ease-out',
            zIndex: 10,
            overflow: 'hidden'
          }}
        >
          <div className="indicator-content" style={{ opacity: Math.min(pullY / pullDistance, 1) }}>
            {isRefreshing ? (
              <div className="loading-spinner">
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="pull-arrow" style={{ transform: `rotate(${Math.min(180, (pullY / pullDistance) * 180)}deg)` }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7-7 7 7"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div 
        className="pull-content"
        style={{
          transform: isPulling || isRefreshing ? `translateY(${pullY}px)` : 'none',
          transition: isPulling ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh; 