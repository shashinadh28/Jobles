"use client";

import { useState } from "react";
import { JobsList } from "@/components/jobs-list";
import { Search } from "lucide-react";

export default function FresherJobsPage() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isIndexError, setIsIndexError] = useState(false);

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
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-center text-4xl font-bold text-neutral-900">
        Fresher Job Opportunities
      </h1>
      
      <p className="mb-12 text-center text-lg text-neutral-600">
        Kickstart your career with these entry-level positions
      </p>
      
      {/* Search and batch year filters */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <input 
            type="text" 
            className="block w-full rounded-full border border-gray-300 bg-white p-4 pl-12 text-base focus:border-blue-500 focus:ring-blue-500" 
            placeholder="Search jobs by title, company or skills..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <select
          className="rounded-full border border-gray-300 bg-white p-4 text-base focus:border-blue-500 focus:ring-blue-500"
          value={selectedBatch || ''}
          onChange={(e) => {
            setSelectedBatch(e.target.value || null);
            setIsIndexError(false);
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          <option value="">All Batch Years</option>
          <option value="2023">2023 Batch</option>
          <option value="2024">2024 Batch</option>
          <option value="2025">2025 Batch</option>
          <option value="2026">2026 Batch</option>
          <option value="2027">2027 Batch</option>
        </select>
      </div>
      
      {/* Filter by experience level */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <select
          className="rounded-full border border-gray-300 bg-white p-4 text-base focus:border-blue-500 focus:ring-blue-500"
          value={experienceLevel}
          onChange={(e) => {
            setExperienceLevel(e.target.value);
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          <option value="all">All Experience Levels</option>
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (2-5 years)</option>
          <option value="senior">Senior Level (5+ years)</option>
        </select>
      </div>
      
      {isIndexError && (
        <div className="mt-4 mx-auto max-w-md rounded-lg bg-amber-50 p-3 text-center text-amber-800 border border-amber-200">
          <p>The search index is still being created. This may take a few minutes. Please try again shortly.</p>
        </div>
      )}
      
      {/* Render jobs based on selected batch */}
      <JobsList 
        key={`fresher-${refreshKey}`}
        type="category" 
        category="fresher"
        initialJobsPerPage={20}
        searchQuery={searchQuery}
        batchYear={selectedBatch || ''}
        experienceLevel={experienceLevel}
        onIndexError={setIsIndexError}
      />
    </div>
  );
}

interface BatchButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

function BatchButton({ children, active, onClick }: BatchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active 
          ? "bg-blue-600 text-white shadow-md" 
          : "bg-white text-neutral-600 border border-neutral-200 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
} 