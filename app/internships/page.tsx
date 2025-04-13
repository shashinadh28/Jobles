"use client";

import { useState } from "react";
import { JobsList } from "@/components/jobs-list";
import { Search } from "lucide-react";

export default function InternshipsPage() {
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
      <h1 className="mb-8 text-center text-4xl font-bold text-neutral-900">
        Internship Opportunities
      </h1>
      
      <p className="mb-12 text-center text-lg text-neutral-600">
        Find the perfect internship to kick-start your career
      </p>
      
      {/* Search and filters */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="w-5 h-5 text-blue-500" />
          </div>
          <input 
            type="text" 
            className="block w-full rounded-full border border-gray-300 bg-white p-4 pl-12 text-base focus:border-blue-500 focus:ring-blue-500" 
            placeholder="Search internships by title, company or skills..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <select
          className="rounded-full border border-gray-300 bg-white p-4 text-base focus:border-blue-500 focus:ring-blue-500"
          value={experienceLevel}
          onChange={(e) => {
            setExperienceLevel(e.target.value);
            setRefreshKey(prevKey => prevKey + 1);
          }}
        >
          <option value="all">All Fields</option>
          <option value="tech">Technology</option>
          <option value="marketing">Marketing</option>
          <option value="finance">Finance</option>
          <option value="hr">Human Resources</option>
        </select>
      </div>
      
      <JobsList 
        key={`internships-${refreshKey}`}
        type="category" 
        category="internship"
        initialJobsPerPage={20}
        searchQuery={searchQuery}
        experienceLevel={experienceLevel === 'all' ? '' : experienceLevel}
      />
    </div>
  );
} 