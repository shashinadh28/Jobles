"use client";

import { useState } from "react";
import { JobsList } from "@/components/jobs-list";
import { Search } from "lucide-react";

export default function FresherJobsPage() {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
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
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-8 text-center text-4xl font-bold text-neutral-900 dark:text-white">
        Fresher Jobs
      </h1>
      
      <p className="mb-8 text-center text-lg text-neutral-600 dark:text-neutral-300">
        Find your first job opportunity after graduation
      </p>
      
      {/* Search and filters */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <input 
            type="text" 
            className="block w-full rounded-full border border-gray-300 bg-white p-4 pl-12 text-base focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" 
            placeholder="Search jobs by title, company or skills..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <select
          className="rounded-full border border-gray-300 bg-white p-4 text-base focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-neutral-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
      
      {/* Batch filters */}
      <div className="mb-12 flex flex-wrap justify-center gap-2">
        <BatchButton 
          active={selectedBatch === null} 
          onClick={() => {
            setSelectedBatch(null);
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          All Batches
        </BatchButton>
        
        <BatchButton 
          active={selectedBatch === "2023"} 
          onClick={() => {
            setSelectedBatch("2023");
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          2023 Batch
        </BatchButton>
        
        <BatchButton 
          active={selectedBatch === "2024"} 
          onClick={() => {
            setSelectedBatch("2024");
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          2024 Batch
        </BatchButton>
        
        <BatchButton 
          active={selectedBatch === "2025"} 
          onClick={() => {
            setSelectedBatch("2025");
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          2025 Batch
        </BatchButton>
        
        <BatchButton 
          active={selectedBatch === "2026"} 
          onClick={() => {
            setSelectedBatch("2026");
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          2026 Batch
        </BatchButton>
        
        <BatchButton 
          active={selectedBatch === "2027"} 
          onClick={() => {
            setSelectedBatch("2027");
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          2027 Batch
        </BatchButton>
      </div>
      
      {/* Render jobs based on selected batch */}
      {selectedBatch ? (
        <JobsList 
          key={`batch-${selectedBatch}-${refreshKey}`}
          type="batch" 
          batchYear={selectedBatch}
          initialJobsPerPage={10}
          searchQuery={searchQuery}
          experienceLevel={experienceLevel}
        />
      ) : (
        <JobsList 
          key={`fresher-${refreshKey}`}
          type="category" 
          category="fresher"
          initialJobsPerPage={10}
          searchQuery={searchQuery}
          experienceLevel={experienceLevel}
        />
      )}
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
          : "bg-white text-neutral-600 border border-neutral-200 hover:border-blue-300 hover:text-blue-600 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 dark:hover:border-blue-700"
      }`}
    >
      {children}
    </button>
  );
} 