"use client";

import { JobsList } from "@/components/jobs-list";
import { useParams } from "next/navigation";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useState, useEffect } from "react";
import { isOnline } from "@/lib/firebase";

export default function LocationPage() {
  const params = useParams();
  const city = params.city as string;
  const cityName = capitalizeFirstLetter(city);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Check connection status
  useEffect(() => {
    const checkConnection = () => {
      setConnectionError(!isOnline());
    };
    
    checkConnection();
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    // Show content after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
      clearTimeout(timer);
    };
  }, []);

  // When the city parameter changes, refresh the job list
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [city]);

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-center text-4xl font-bold text-neutral-900 dark:text-white">
        Jobs in {cityName}
      </h1>
      
      <p className="mb-12 text-center text-lg text-neutral-600 dark:text-neutral-300">
        Find the best job opportunities in {cityName}
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-neutral-900 dark:border-white"></div>
        </div>
      ) : connectionError ? (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 mb-8 rounded">
          <p className="font-bold">Connectivity Issue</p>
          <p>It seems you're currently offline. Location-based job search works best with an internet connection.</p>
          <p className="mt-2">Jobs that were previously loaded may still be available.</p>
        </div>
      ) : null}
      
      <JobsList 
        key={`location-${city}-${refreshKey}`}
        type="location" 
        location={city} 
        searchQuery={searchQuery}
      />
    </div>
  );
} 