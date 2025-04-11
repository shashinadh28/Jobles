'use client';

import React, { useState, useEffect } from "react";

export default function ConnectionStatusClient() {
  const [isOnline, setIsOnline] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  
  useEffect(() => {
    // Initial state
    setIsOnline(navigator.onLine);
    
    // Setup event listeners for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => setShowNotification(false), 3000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!showNotification) return null;
  
  return (
    <div className={`fixed bottom-4 right-4 z-50 rounded-md px-4 py-2 shadow-lg transition-all ${
      isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isOnline ? 'Back online - data will sync automatically' : 'You are offline - some features may be limited'}
    </div>
  );
} 
 