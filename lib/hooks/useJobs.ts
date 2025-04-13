import { useState, useEffect } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { 
  getJobs, 
  getJobsByCategory, 
  getJobsByLocation, 
  getFresherJobsByBatch,
  Job 
} from '../firestore';

export function useJobs(
  initialJobsPerPage: number = 10
) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isIndexError, setIsIndexError] = useState(false);

  const loadJobs = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getJobs(reset ? undefined : lastVisible, initialJobsPerPage);
      
      if (result.jobs.length < initialJobsPerPage) {
        setHasMore(false);
      }
      
      setJobs(reset ? result.jobs : [...jobs, ...result.jobs]);
      setLastVisible(result.lastVisibleDoc);
      setIsIndexError(false);
    } catch (err) {
      console.error("Error in useJobs:", err);
      
      const errString = String(err);
      if (errString.includes("index")) {
        setIsIndexError(true);
        setError("Waiting for database index to be created. This may take a few minutes.");
      } else {
        setError('Failed to load jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { jobs, loading, error, hasMore, loadMore: () => loadJobs(), refresh: () => loadJobs(true), isIndexError };
}

export function useJobsByCategory(
  category: string,
  initialJobsPerPage: number = 10
) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isIndexError, setIsIndexError] = useState(false);

  const loadJobs = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useJobsByCategory] Loading ${category} jobs, reset=${reset}`);
      
      const result = await getJobsByCategory(
        category, 
        reset ? undefined : lastVisible, 
        initialJobsPerPage
      );
      
      console.log(`[useJobsByCategory] Loaded ${result.jobs.length} ${category} jobs:`, 
        result.jobs.map(job => ({ id: job.id, title: job.title, date: job.postedAt })));
      
      if (result.jobs.length < initialJobsPerPage) {
        setHasMore(false);
      }
      
      setJobs(reset ? result.jobs : [...jobs, ...result.jobs]);
      setLastVisible(result.lastVisibleDoc);
      setIsIndexError(false);
    } catch (err) {
      console.error(`Error in useJobsByCategory for "${category}":`, err);
      
      const errString = String(err);
      if (errString.includes("index")) {
        setIsIndexError(true);
        setError("Waiting for database index to be created. This may take a few minutes.");
      } else {
        setError(`Failed to load ${category} jobs. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return { jobs, loading, error, hasMore, loadMore: () => loadJobs(), refresh: () => loadJobs(true), isIndexError };
}

export function useJobsByLocation(
  location: string,
  initialJobsPerPage: number = 10
) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isIndexError, setIsIndexError] = useState(false);

  const loadJobs = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getJobsByLocation(
        location, 
        reset ? undefined : lastVisible, 
        initialJobsPerPage
      );
      
      if (result.jobs.length < initialJobsPerPage) {
        setHasMore(false);
      }
      
      setJobs(reset ? result.jobs : [...jobs, ...result.jobs]);
      setLastVisible(result.lastVisibleDoc);
      setIsIndexError(false);
    } catch (err) {
      console.error(`Error in useJobsByLocation for "${location}":`, err);
      
      const errString = String(err);
      if (errString.includes("index")) {
        setIsIndexError(true);
        setError("Waiting for database index to be created. This may take a few minutes.");
      } else {
        setError(`Failed to load jobs in ${location}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return { jobs, loading, error, hasMore, loadMore: () => loadJobs(), refresh: () => loadJobs(true), isIndexError };
}

export function useFresherJobsByBatch(
  batchYear: string,
  initialJobsPerPage: number = 10
) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isIndexError, setIsIndexError] = useState(false);

  const loadJobs = async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`[useFresherJobsByBatch] Loading jobs for batch: ${batchYear}`);
      
      const result = await getFresherJobsByBatch(
        batchYear, 
        reset ? undefined : lastVisible, 
        initialJobsPerPage
      );
      
      if (result.jobs.length < initialJobsPerPage) {
        setHasMore(false);
      }
      
      setJobs(reset ? result.jobs : [...jobs, ...result.jobs]);
      setLastVisible(result.lastVisibleDoc);
      setIsIndexError(false);
    } catch (err) {
      console.error(`Error in useFresherJobsByBatch for "${batchYear}":`, err);
      
      // Check specifically for a Firebase index error
      const errString = String(err);
      if (errString.includes("index")) {
        console.warn("Firebase index error detected in fresh jobs batch query");
        setIsIndexError(true);
        setError("Waiting for database index to be created. This may take a few minutes.");
      } else {
        setError(`Failed to load jobs for batch ${batchYear}. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchYear]);
  
  return { jobs, loading, error, hasMore, loadMore: () => loadJobs(), refresh: () => loadJobs(true), isIndexError };
} 