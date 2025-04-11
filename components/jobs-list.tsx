"use client";

import { useJobs, useJobsByCategory, useJobsByLocation, useFresherJobsByBatch } from "@/lib/hooks/useJobs";
import { JobCard } from "@/components/ui/job-card";
import { useState, useEffect, useMemo } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { Job } from "@/lib/firestore";

interface JobsListProps {
  type?: 'all' | 'category' | 'location' | 'batch';
  category?: string;
  location?: string;
  batchYear?: string;
  initialJobsPerPage?: number;
  searchQuery?: string;
  experienceLevel?: string;
}

export function JobsList({
  type = 'all',
  category,
  location,
  batchYear,
  initialJobsPerPage = 10,
  searchQuery = '',
  experienceLevel = 'all'
}: JobsListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQueryNormalized, setSearchQueryNormalized] = useState('');

  // Normalize search query whenever it changes
  useEffect(() => {
    setSearchQueryNormalized(searchQuery.toLowerCase().trim());
  }, [searchQuery]);

  // Choose the right hook based on the type
  const allJobs = useJobs(initialJobsPerPage);
  const categoryJobs = useJobsByCategory(category || '', initialJobsPerPage);
  const locationJobs = useJobsByLocation(location || '', initialJobsPerPage);
  const batchJobs = useFresherJobsByBatch(batchYear || '', initialJobsPerPage);
  
  // Determine which hook data to use
  const jobsData = type === 'all' 
    ? allJobs 
    : type === 'category' 
      ? categoryJobs 
      : type === 'location' 
        ? locationJobs 
        : batchJobs;
  
  const { jobs: unfilteredJobs, loading, error: hookError, hasMore: hookHasMore, loadMore, refresh } = jobsData;
  
  // Log when search query changes
  useEffect(() => {
    if (searchQuery) {
      console.log(`[JobsList] Searching for: "${searchQuery}"`);
    }
  }, [searchQuery]);

  // Apply client-side filtering for search and experience level with proper search algorithm
  const jobsFiltered = useMemo(() => {
    // If no search filters, return all jobs
    if (!searchQueryNormalized && experienceLevel === 'all') {
      return unfilteredJobs;
    }

    console.log(`[JobsList] Filtering ${unfilteredJobs.length} jobs with search: "${searchQueryNormalized}" and experience: "${experienceLevel}"`);
    
    const filteredResults = unfilteredJobs.filter(job => {
      // Break search into tokens for better matching
      const searchTerms = searchQueryNormalized.split(/\s+/).filter(Boolean);
      
      // Format job data for search
      const title = (job.title || "").toLowerCase();
      const company = (job.company || "").toLowerCase();
      const description = (job.description || "").toLowerCase();
      const jobLocation = (job.location || "").toLowerCase();
      const category = (job.category || "").toLowerCase();
      const jobType = (job.jobType || "").toLowerCase();
      const skills = job.skills && Array.isArray(job.skills) 
        ? job.skills.map(skill => typeof skill === 'string' ? skill.toLowerCase() : '')
        : [];
      
      // If no search terms, only filter by experience level
      if (searchTerms.length === 0) {
        return matchesExperienceLevel(job, experienceLevel);
      }
      
      // Search algorithm - check if ALL terms match in ANY field (better results)
      const matchesSearch = searchTerms.every(term => {
        // Check for matches in different fields
        const termMatches = (
          title.includes(term) ||
          company.includes(term) ||
          description.includes(term) ||
          jobLocation.includes(term) ||
          category.includes(term) ||
          jobType.includes(term) ||
          // For skills, check if ANY skill includes the term
          skills.some(skill => skill.includes(term)) ||
          // Special handling for common search terms
          (
            // Internship searches
            ((term === "intern" || term.includes("intern")) && 
              (category.includes("internship") || 
               jobType.includes("internship") ||
               title.includes("intern") ||
               description.includes("intern"))) ||
            
            // Remote work searches
            ((term === "remote" || term.includes("remot") || term === "wfh" || term === "work from home") && 
              (category.includes("wfh") || 
               title.includes("remote") ||
               description.includes("remote") ||
               description.includes("work from home"))) ||
               
            // Fresher/graduate searches
            ((term === "fresh" || term.includes("fresh") || term === "grad" || term.includes("graduate")) &&
              (category.includes("fresher") ||
               title.includes("fresher") ||
               title.includes("graduate") ||
               description.includes("fresher") ||
               description.includes("graduate")))
          )
        );
        
        // Log the match result for debugging
        if (!termMatches && searchQueryNormalized.length > 2) {
          console.log(`[Search Debug] Term "${term}" did not match job: ${job.title} (${job.company})`);
        }
        
        return termMatches;
      });
      
      const matchesExp = matchesExperienceLevel(job, experienceLevel);
      
      // Return true if both search and experience level conditions are met
      const isMatch = matchesSearch && matchesExp;
      
      // For debugging specific searches
      if (isMatch && searchQueryNormalized.length > 2) {
        console.log(`[Search Hit] "${searchQueryNormalized}" matched job: ${job.title} (${job.company})`);
      }
      
      return isMatch;
    });
    
    console.log(`[JobsList] Filtering complete: found ${filteredResults.length} matching jobs`);
    return filteredResults;
  }, [unfilteredJobs, searchQueryNormalized, experienceLevel]);
  
  // Separate function to check experience level match
  function matchesExperienceLevel(job: Job, expLevel: string): boolean {
    if (expLevel === 'all') return true;
    
    const jobExpLevel = job.experienceLevel?.toLowerCase() || "";
    
    if (expLevel === 'entry') {
      return (
        jobExpLevel.includes('entry') || 
        jobExpLevel.includes('junior') ||
        jobExpLevel.includes('fresher') ||
        jobExpLevel.includes('beginner') ||
        jobExpLevel.includes('trainee') ||
        jobExpLevel.includes('graduate') ||
        jobExpLevel.includes('0-2') || 
        jobExpLevel.includes('0 - 2') ||
        jobExpLevel.includes('1 year') || 
        jobExpLevel.includes('2 year') ||
        /\b[0-1]\b/.test(jobExpLevel) ||
        /\b0[ -]+2\b/.test(jobExpLevel) ||
        /\b1[ -]+2\b/.test(jobExpLevel) ||
        job.category?.toLowerCase() === 'fresher' ||
        job.category?.toLowerCase() === 'internship'
      );
    } 
    else if (expLevel === 'mid') {
      return (
        jobExpLevel.includes('mid') || 
        jobExpLevel.includes('intermediate') ||
        jobExpLevel.includes('2-5') ||
        jobExpLevel.includes('2 - 5') ||
        jobExpLevel.includes('3-5') ||
        jobExpLevel.includes('3 - 5') ||
        jobExpLevel.includes('3 year') ||
        jobExpLevel.includes('4 year') ||
        jobExpLevel.includes('5 year') ||
        /\b[2-5]\b/.test(jobExpLevel) ||
        /\b2[ -]+5\b/.test(jobExpLevel) ||
        /\b3[ -]+5\b/.test(jobExpLevel)
      );
    } 
    else if (expLevel === 'senior') {
      return (
        jobExpLevel.includes('senior') || 
        jobExpLevel.includes('lead') ||
        jobExpLevel.includes('manager') ||
        jobExpLevel.includes('principal') ||
        jobExpLevel.includes('architect') ||
        jobExpLevel.includes('6+') ||
        jobExpLevel.includes('5+') ||
        jobExpLevel.includes('6 year') ||
        jobExpLevel.includes('7 year') ||
        jobExpLevel.includes('8 year') ||
        /\b[6-9]\b/.test(jobExpLevel) ||
        /\b[1-9][0-9]\b/.test(jobExpLevel) ||
        /\b[5-9]\+\b/.test(jobExpLevel)
      );
    }
    
    return true;
  }
  
  // Hide initial loading state if we're switching between hooks
  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  // Log debug information
  useEffect(() => {
    console.log(`[JobsList] Using hook data for: type=${type}, category=${category}, location=${location}`);
    
    if (searchQuery) {
      console.log(`[JobsList] Searching for: "${searchQuery}"`);
    }
    
    if (experienceLevel && experienceLevel !== 'all') {
      console.log(`[JobsList] Filtering by experience level: "${experienceLevel}"`);
    }
    
    // Log filtered results count
    if (unfilteredJobs.length > 0) {
      console.log(`[JobsList] Found ${jobsFiltered.length} matches out of ${unfilteredJobs.length} total jobs`);
    }
  }, [type, category, location, searchQuery, experienceLevel, unfilteredJobs.length, jobsFiltered.length]);
  
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex w-full justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-900 dark:border-white"></div>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-md rounded-lg bg-red-50 p-6 text-center text-red-800 dark:bg-red-900/30 dark:text-red-300">
          <p>{error}</p>
          <button 
            onClick={() => refresh()}
            className="mt-4 rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-800/30 dark:text-red-300 dark:hover:bg-red-700/30"
          >
            Try Again
          </button>
        </div>
      ) : jobsFiltered.length === 0 ? (
        <div className="mx-auto max-w-md rounded-lg bg-neutral-100 p-6 text-center text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          <p>No jobs found matching your search criteria. Please try different filters or check back later.</p>
          {searchQuery && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-300 dark:hover:bg-blue-700/30"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobsFiltered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {hookHasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => loadMore()}
                className="rounded-md bg-neutral-100 px-6 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-neutral-900 dark:border-white"></span>
                    Loading...
                  </span>
                ) : (
                  'Load More Jobs'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 