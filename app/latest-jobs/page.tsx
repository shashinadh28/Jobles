"use client";

import React, { useState } from 'react';
import { JobsList } from "@/components/jobs-list";
import { Search } from "lucide-react";
import EzoicAd from "@/components/ui/EzoicAd";

export default function LatestJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Force a refresh of the JobsList component when search changes
    const timer = setTimeout(() => {
      setRefreshKey(prevKey => prevKey + 1);
    }, 300);
    
    return () => clearTimeout(timer);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Job Listings</h1>

      {/* Search bar */}
      <div className="relative max-w-2xl mx-auto mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search by job title, company, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Ezoic Ad Top of content */}
      <div className="my-8">
        <EzoicAd id={103} className="mx-auto max-w-6xl" />
      </div>
      
      {/* Jobs listing */}
      <JobsList
        type="all"
        initialJobsPerPage={15}
        searchQuery={searchQuery}
      />
      
      {/* Ezoic Ad Bottom of content */}
      <div className="my-8">
        <EzoicAd id={104} className="mx-auto max-w-6xl" />
      </div>
    </div>
  );
} 