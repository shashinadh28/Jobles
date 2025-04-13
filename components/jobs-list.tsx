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
  onIndexError?: (isError: boolean) => void;
}

export function JobsList({
  type = 'all',
  category,
  location,
  batchYear,
  initialJobsPerPage = 10,
  searchQuery = '',
  experienceLevel = 'all',
  onIndexError
}: JobsListProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisibleDoc, setLastVisibleDoc] = useState<DocumentSnapshot | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQueryNormalized, setSearchQueryNormalized] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [indexErrorDetected, setIndexErrorDetected] = useState(false);
  const [selectedBatchYear, setSelectedBatchYear] = useState(batchYear || '');
  const [currentType, setCurrentType] = useState(type);

  // Set initial batch year from props
  useEffect(() => {
    if (batchYear) {
      setSelectedBatchYear(batchYear);
      setCurrentType('batch');
    }
  }, [batchYear]);

  // Normalize search query whenever it changes
  useEffect(() => {
    setSearchQueryNormalized(searchQuery.toLowerCase().trim());
  }, [searchQuery]);

  // Choose the right hook based on the type
  const allJobs = useJobs(initialJobsPerPage);
  const categoryJobs = useJobsByCategory(category || '', initialJobsPerPage);
  const locationJobs = useJobsByLocation(location || '', initialJobsPerPage);
  const batchJobs = useFresherJobsByBatch(selectedBatchYear, initialJobsPerPage);
  
  // Determine which hook data to use
  const jobsData = currentType === 'all' 
    ? allJobs 
    : currentType === 'category' 
      ? categoryJobs 
      : currentType === 'location' 
        ? locationJobs 
        : batchJobs;
  
  const { jobs: unfilteredJobs, loading, error: hookError, hasMore: hookHasMore, loadMore, refresh, isIndexError } = jobsData;
  
  // Effect to update data when batch year changes
  useEffect(() => {
    if (selectedBatchYear && selectedBatchYear !== '') {
      setCurrentType('batch');
    } else if (currentType === 'batch') {
      // If batch year is cleared, revert to original type
      setCurrentType(type);
    }
  }, [selectedBatchYear, type]);

  // Log when batch year changes
  useEffect(() => {
    if (selectedBatchYear) {
      console.log(`[JobsList] Filtering by batch year: "${selectedBatchYear}"`);
    }
  }, [selectedBatchYear]);

  // Log when search query changes
  useEffect(() => {
    if (searchQuery) {
      console.log(`[JobsList] Searching for: "${searchQuery}"`);
    }
  }, [searchQuery]);

  // Check for index errors
  useEffect(() => {
    if (isIndexError) {
      setIndexErrorDetected(true);
      if (onIndexError) {
        onIndexError(true);
      }
    }
  }, [isIndexError, onIndexError]);

  // Listen for Firebase index errors
  useEffect(() => {
    const handleError = (error: Error) => {
      // Check if the error is a Firebase index error
      if (error && error.message && error.message.includes("The query requires an index")) {
        console.warn("Firebase index error detected:", error.message);
        if (onIndexError) {
          onIndexError(true);
        }
      }
    };

    // If the hook has an error, check for index errors
    if (hookError && typeof hookError === 'string' && hookError.includes("index")) {
      handleError(new Error(hookError));
    }
  }, [hookError, onIndexError]);

  // Reset error handler when filters change
  useEffect(() => {
    if (onIndexError) {
      onIndexError(false);
    }
  }, [type, category, location, batchYear, onIndexError]);

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
    
    // Calculate total pages
    setTotalPages(Math.ceil(filteredResults.length / initialJobsPerPage));
    
    return filteredResults;
  }, [unfilteredJobs, searchQueryNormalized, experienceLevel, initialJobsPerPage]);
  
  // Get paginated jobs based on current page
  const paginatedJobs = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * initialJobsPerPage;
    return jobsFiltered.slice(startIndex, endIndex);
  }, [jobsFiltered, currentPage, initialJobsPerPage]);
  
  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // If we're near the end of our loaded data, fetch more
      if (currentPage + 1 >= totalPages && hookHasMore) {
        loadMore();
      }
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // If we're near the end of our loaded data, fetch more
      if (page >= totalPages && hookHasMore) {
        loadMore();
      }
    }
  };
  
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
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, experienceLevel, type, category, location, batchYear]);
  
  return (
    <div className="w-full">
      {selectedBatchYear && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Showing jobs for {selectedBatchYear} Batch
            <button 
              onClick={() => {
                setSelectedBatchYear('');
                setCurrentType(type);
              }}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex w-full justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-neutral-900 dark:border-white"></div>
        </div>
      ) : indexErrorDetected ? (
        <div className="mx-auto max-w-md rounded-lg bg-yellow-50 p-6 text-center text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
          <p>The database is creating an index for this query. This typically takes a few minutes.</p>
          <button 
            onClick={() => {
              setIndexErrorDetected(false);
              refresh();
            }}
            className="mt-4 rounded-md bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800/30 dark:text-yellow-300 dark:hover:bg-yellow-700/30"
          >
            Try Again
          </button>
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
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          
          {/* Pagination controls - Only show on detail pages with > initialJobsPerPage */}
          {totalPages > 1 && initialJobsPerPage > 8 && (
            <div className="mt-8 flex justify-center items-center space-x-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  currentPage === 1
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  // Calculate page numbers to show, with current page in the middle when possible
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`rounded-md px-3 py-2 text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-blue-600 text-white"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {/* Show ellipsis for many pages */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2 py-2 text-neutral-500">...</span>
                )}
                
                {/* Always show last page if there are many pages */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-200"
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                    : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                }`}
              >
                Next
              </button>
            </div>
          )}
          
          {/* Load More button - Only show on home page with initial 8 jobs */}
          {initialJobsPerPage <= 8 && jobsFiltered.length > initialJobsPerPage && (
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