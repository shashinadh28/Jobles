import { 
  collection, 
  query, 
  getDocs, 
  getDoc, 
  doc, 
  where, 
  orderBy, 
  limit, 
  DocumentData,
  QueryDocumentSnapshot,
  startAfter,
  Firestore
} from "firebase/firestore";
import { db } from "./firebase";

// Job interface
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string; // full-time, part-time, contract, etc.
  category: string; // fresher, experienced, wfh, internship, etc.
  batchYear?: string; // 2023, 2024, 2025, etc. for fresher jobs
  salary?: string;
  description: string;
  qualifications?: string[]; // Renamed from requirements
  requirements?: string[]; // Keep for backward compatibility
  responsibilities?: string[];
  perks?: string[]; // Added new field
  skills?: string[]; // Array of skills required for the job
  experienceLevel?: string; // Add this field
  postedAt: Date;
  deadline?: Date | null;
  applicationLink?: string;
  logoUrl?: string;
  status?: string;
  batchYears?: string[]; // Support for multiple batch years
}

// Mock data for development when Firebase isn't configured
const MOCK_JOBS: Job[] = [
  {
    id: "job1",
    title: "Frontend Developer",
    company: "TechCorp",
    location: "Noida",
    jobType: "full-time",
    category: "fresher",
    batchYear: "2024",
    salary: "₹5-7 LPA",
    description: "We're looking for a passionate Frontend Developer to join our team.",
    qualifications: ["HTML/CSS", "JavaScript", "React", "Responsive Design"],
    responsibilities: ["Develop web applications using React", "Collaborate with backend developers"],
    experienceLevel: "Entry Level",
    skills: ["React", "JavaScript", "TypeScript", "Tailwind CSS"],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    applicationLink: "https://example.com/apply",
    logoUrl: "/images/company-logos/techcorp.png"
  },
  {
    id: "job2",
    title: "Backend Engineer",
    company: "DataSystems",
    location: "Bengaluru",
    jobType: "full-time",
    category: "fresher",
    batchYear: "2023",
    salary: "₹6-8 LPA",
    description: "Join our backend team to build scalable APIs and services.",
    qualifications: ["Node.js", "Express", "MongoDB", "REST API Design"],
    responsibilities: ["Develop and maintain backend systems", "Integrate APIs with frontend"],
    experienceLevel: "Entry Level",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    applicationLink: "https://example.com/apply",
    logoUrl: "/images/company-logos/datasystems.png"
  },
  {
    id: "job3",
    title: "UI/UX Design Intern",
    company: "CreativeMinds",
    location: "Mumbai",
    jobType: "internship",
    category: "internship",
    salary: "₹15,000/month",
    description: "Learn and grow as a UI/UX designer in our creative team.",
    qualifications: ["Figma", "Adobe XD", "UI/UX Principles", "Prototyping"],
    responsibilities: ["Create wireframes and prototypes", "Conduct user research"],
    experienceLevel: "Entry Level",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    applicationLink: "https://example.com/apply",
    logoUrl: "/images/company-logos/creativeminds.png"
  },
  {
    id: "job4",
    title: "Data Analyst",
    company: "AnalyticsHub",
    location: "Pune",
    jobType: "full-time",
    category: "wfh",
    salary: "₹4.5-6 LPA",
    description: "Work remotely analyzing data and creating insightful reports.",
    qualifications: ["Excel", "SQL", "Python", "Data Visualization"],
    responsibilities: ["Analyze data using SQL and Python", "Create data visualizations"],
    experienceLevel: "Entry Level",
    skills: ["SQL", "Python", "Pandas", "Tableau"],
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    applicationLink: "https://example.com/apply",
    logoUrl: "/images/company-logos/analyticshub.png"
  },
  {
    id: "job5",
    title: "Full Stack Developer",
    company: "WebSolutions",
    location: "Delhi",
    jobType: "full-time",
    category: "fresher",
    batchYear: "2025",
    salary: "₹7-9 LPA",
    description: "Develop end-to-end web applications for our clients.",
    qualifications: ["JavaScript", "React", "Node.js", "MongoDB"],
    responsibilities: ["Develop full stack applications", "Integrate backend and frontend"],
    experienceLevel: "Entry Level",
    skills: ["MERN Stack", "JavaScript", "HTML/CSS", "Git"],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    applicationLink: "https://example.com/apply",
    logoUrl: "/images/company-logos/websolutions.png"
  },
  {
    id: "job6",
    title: "DevOps Engineer",
    company: "CloudTech",
    location: "Hyderabad",
    jobType: "full-time",
    category: "fresher",
    batchYear: "2024",
    salary: "₹8-10 LPA",
    description: "Help us build and maintain our cloud infrastructure.",
    qualifications: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    responsibilities: ["Manage cloud infrastructure", "Implement CI/CD pipelines"],
    experienceLevel: "Entry Level",
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins"],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days from now
    applicationLink: "https://example.com/apply",
    logoUrl: "/images/company-logos/cloudtech.png"
  }
];

// Check if Firebase is properly configured by checking if db is properly initialized
const isFirebaseConfigured = (): boolean => {
  // Always return true to ensure we always use real data from Firebase
  return true;
};

// Cache for frequently accessed data
const jobCache = new Map<string, { data: { jobs: Job[], lastVisibleDoc?: QueryDocumentSnapshot<DocumentData> }, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get all jobs with pagination
export async function getJobs(
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  jobsPerPage: number = 10
): Promise<{ jobs: Job[], lastVisibleDoc?: QueryDocumentSnapshot<DocumentData> }> {
  try {
    const cacheKey = `jobs_${lastVisible?.id || 'initial'}_${jobsPerPage}`;
    const cachedData = jobCache.get(cacheKey);
    
    // Return cached data if it's still valid
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log("Returning cached jobs data");
      return cachedData.data;
    }

    const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' || 
                   process.env.NODE_ENV === 'production';

    // If Firebase isn't configured and we're not in production, return mock data
    if (!isFirebaseConfigured() && !isProd) {
      console.log("Using mock data for jobs (not in production)");
      const result = { 
        jobs: MOCK_JOBS.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime()).slice(0, jobsPerPage), 
        lastVisibleDoc: undefined 
      };
      jobCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }

    // Create optimized query
    const jobsQuery = query(
      collection(db as Firestore, "jobs"),
      orderBy("postedAt", "desc"),
      ...(lastVisible ? [startAfter(lastVisible)] : []),
      limit(jobsPerPage)
    );
    
    const jobsSnapshot = await getDocs(jobsQuery);
    const lastVisibleDoc = jobsSnapshot.docs[jobsSnapshot.docs.length - 1];
    
    const jobs = jobsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      postedAt: doc.data().postedAt?.toDate ? doc.data().postedAt.toDate() : new Date(),
      deadline: doc.data().deadline?.toDate ? doc.data().deadline.toDate() : null
    })) as Job[];
    
    const result = { jobs, lastVisibleDoc: lastVisibleDoc || undefined };
    
    // Cache the result
    jobCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    return result;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], lastVisibleDoc: undefined };
  }
}

// Get job by ID
export async function getJobById(jobId: string) {
  try {
    // If Firebase isn't configured, return mock data
    if (!isFirebaseConfigured()) {
      const job = MOCK_JOBS.find(job => job.id === jobId);
      return job;
    }

    const jobDoc = await getDoc(doc(db as Firestore, "jobs", jobId));
    
    if (jobDoc.exists()) {
      return {
        id: jobDoc.id,
        ...jobDoc.data()
      } as Job;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching job:", error);
    return undefined;
  }
}

// Get jobs by category
export async function getJobsByCategory(
  category: string,
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  jobsPerPage: number = 10
) {
  try {
    // Handle empty category by returning all jobs instead
    if (!category || category.trim() === '') {
      console.log("Empty category provided, falling back to getJobs");
      return getJobs(lastVisible, jobsPerPage);
    }

    // If Firebase isn't configured, return mock data
    if (!isFirebaseConfigured()) {
      const filteredJobs = MOCK_JOBS
        .filter(job => job.category.toLowerCase() === category.toLowerCase())
        .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
        .slice(0, jobsPerPage);
      
      console.log(`Mock getJobsByCategory for "${category}" returning ${filteredJobs.length} jobs`);
      return { jobs: filteredJobs, lastVisibleDoc: undefined };
    }

    console.log(`Fetching jobs by category: "${category}" (lowercase: "${category.toLowerCase()}")`);
    
    // SIMPLIFIED QUERY - fetches all jobs then filters client-side to avoid index requirements
    const jobsQuery = query(
      collection(db as Firestore, "jobs"),
      where("category", "==", category.toLowerCase()),
      limit(50) // Fetch more jobs, we'll sort and limit client-side
    );
    
    const jobsSnapshot = await getDocs(jobsQuery);
    console.log(`Query returned ${jobsSnapshot.docs.length} documents for category "${category.toLowerCase()}"`);
    
    if (jobsSnapshot.docs.length === 0) {
      return { jobs: [], lastVisibleDoc: undefined };
    }
    
    // Process results
    let jobs = jobsSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Processing job document: ${doc.id}, category="${data.category}", title="${data.title}"`);
      
      // Convert Firestore timestamps to Date objects without filtering by date
      return {
        id: doc.id,
        ...data,
        postedAt: data.postedAt?.toDate ? data.postedAt.toDate() : new Date(),
        deadline: data.deadline?.toDate ? data.deadline.toDate() : null
      };
    }) as Job[];
    
    // Sort by date (descending) client-side
    jobs = jobs.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    
    // Apply pagination client-side
    let startIndex = 0;
    if (lastVisible) {
      const lastVisibleId = lastVisible.id;
      const lastVisibleIndex = jobs.findIndex(job => job.id === lastVisibleId);
      if (lastVisibleIndex !== -1) {
        startIndex = lastVisibleIndex + 1;
      }
    }
    
    const pagedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);
    const lastVisibleDoc = jobsSnapshot.docs[startIndex + jobsPerPage - 1] || jobsSnapshot.docs[jobsSnapshot.docs.length - 1];
    
    console.log(`Returning ${pagedJobs.length} jobs for category "${category}"`);
    return { jobs: pagedJobs, lastVisibleDoc: lastVisibleDoc || undefined };
  } catch (error) {
    console.error(`Error fetching jobs by category ${category}:`, error);
    return { jobs: [], lastVisibleDoc: undefined };
  }
}

// Get jobs by location
export async function getJobsByLocation(
  location: string,
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  jobsPerPage: number = 10
) {
  try {
    // If Firebase isn't configured, return mock data
    if (!isFirebaseConfigured()) {
      console.log(`Using mock data for location: ${location}`);
      const filteredJobs = MOCK_JOBS
        .filter(job => job.location.toLowerCase().includes(location.toLowerCase()))
        .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
        .slice(0, jobsPerPage);
      
      return { jobs: filteredJobs, lastVisibleDoc: undefined };
    }

    console.log(`Fetching jobs by location: "${location}"`);
    
    // First try with a simpler query that doesn't require a complex index
    try {
      // Since Firestore doesn't support partial string matches in queries,
      // we'll get jobs and filter them client-side for the location
      let jobsQuery;
      
      if (lastVisible) {
        jobsQuery = query(
          collection(db as Firestore, "jobs"),
          orderBy("postedAt", "desc"),
          startAfter(lastVisible),
          limit(jobsPerPage * 3) // Get more than needed to allow for filtering
        );
      } else {
        jobsQuery = query(
          collection(db as Firestore, "jobs"),
          orderBy("postedAt", "desc"),
          limit(jobsPerPage * 3) // Get more than needed to allow for filtering
        );
      }
      
      const jobsSnapshot = await getDocs(jobsQuery);
      
      // Filter jobs that match the location (case-insensitive partial match)
      const locationLower = location.toLowerCase();
      const filteredJobs = [];
      
      for (const doc of jobsSnapshot.docs) {
        const data = doc.data();
        const jobLocation = data.location ? data.location.toLowerCase() : "";
        
        // Check if job location contains the search location
        if (jobLocation.includes(locationLower)) {
          filteredJobs.push({
            id: doc.id,
            ...data,
            // Convert Firestore timestamps to Date objects
            postedAt: data.postedAt?.toDate() || new Date(),
            deadline: data.deadline?.toDate() || null
          } as Job);
          
          // Stop when we reach the requested number of jobs
          if (filteredJobs.length >= jobsPerPage) {
            break;
          }
        }
      }
      
      // Use the last doc from the original query for pagination
      const lastVisibleDoc = jobsSnapshot.docs[jobsSnapshot.docs.length - 1] || undefined;
      
      return { 
        jobs: filteredJobs,
        lastVisibleDoc: lastVisibleDoc
      };
      
    } catch (indexError) {
      // If we hit an index error, use a fallback approach
      console.warn("Error with indexed query, falling back to simplified query:", indexError);
      
      // Get all jobs (limited number) without complex query
      const simpleQuery = query(
        collection(db as Firestore, "jobs"),
        limit(100) // Get a batch of jobs to filter client-side
      );
      
      const jobsSnapshot = await getDocs(simpleQuery);
      console.log(`Fallback query returned ${jobsSnapshot.docs.length} jobs to filter`);
      
      // Process results and filter by location
      const locationLower = location.toLowerCase();
      const jobs = jobsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            postedAt: data.postedAt?.toDate ? data.postedAt.toDate() : new Date(),
            deadline: data.deadline?.toDate ? data.deadline.toDate() : null
          } as Job;
        })
        .filter(job => {
          const jobLocation = (job.location || "").toLowerCase();
          return jobLocation.includes(locationLower);
        })
        .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
        .slice(0, jobsPerPage);
      
      console.log(`After filtering, found ${jobs.length} jobs in location "${location}"`);
      
      return { 
        jobs, 
        lastVisibleDoc: undefined // No pagination for fallback method
      };
    }
    
  } catch (error) {
    console.error("Error getting jobs by location:", error);
    return { jobs: [], lastVisibleDoc: undefined };
  }
}

// Get fresher jobs by batch
export async function getFresherJobsByBatch(
  batchYear: string,
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  jobsPerPage: number = 10
): Promise<{ jobs: Job[], lastVisibleDoc?: QueryDocumentSnapshot<DocumentData> }> {
  try {
    if (!isFirebaseConfigured()) {
      const mockJobs = MOCK_JOBS.filter(job => {
        // Check if this job matches the requested batch year
        if (!job.category || job.category.toLowerCase() !== "fresher") return false;
        
        // Check for batch year match
        if (job.batchYear === batchYear) return true;
        
        // Also check batchYears array if available
        if (job.batchYears && Array.isArray(job.batchYears)) {
          return job.batchYears.includes(batchYear);
        }
        
        return false;
      });
      
      // Sort and limit mock data
      const result = { 
        jobs: mockJobs
          .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
          .slice(0, jobsPerPage), 
        lastVisibleDoc: undefined 
      };
      
      return result;
    }

    try {
      // Try the complex query first (requires composite index)
      const fresherJobsQuery = query(
        collection(db as Firestore, "jobs"),
        where("category", "==", "fresher"),
        where("status", "==", "active"),
        // We need to use OR query logic here, but Firestore doesn't directly support OR
        // So we'll use one condition and filter the results client-side
        where("batchYears", "array-contains", batchYear),
        ...(lastVisible ? [startAfter(lastVisible)] : []),
        orderBy("postedAt", "desc"),
        limit(jobsPerPage * 2) // Get extra to allow for filtering
      );

      const querySnapshot = await getDocs(fresherJobsQuery);
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedAt: doc.data().postedAt.toDate(),
        deadline: doc.data().deadline?.toDate() || null
      })) as Job[];
      
      return {
        jobs: jobs.slice(0, jobsPerPage),
        lastVisibleDoc: lastVisibleDoc || undefined
      };
    } catch (indexError) {
      console.warn("Index not yet available, falling back to simpler query:", indexError);
      
      // Fallback: Get all fresher jobs and filter client-side
      const simpleQuery = query(
        collection(db as Firestore, "jobs"),
        where("category", "==", "fresher"),
        where("status", "==", "active"),
        orderBy("postedAt", "desc"),
        limit(100) // Get more to filter client-side
      );
      
      const querySnapshot = await getDocs(simpleQuery);
      
      // Filter by batch year client-side
      const filteredJobs = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            postedAt: data.postedAt?.toDate ? data.postedAt.toDate() : new Date(),
            deadline: data.deadline?.toDate ? data.deadline.toDate() : null
          } as Job;
        })
        .filter(job => {
          // Check for batchYear exact match
          if (job.batchYear === batchYear) return true;
          
          // Check batchYears array if available
          if (job.batchYears && Array.isArray(job.batchYears)) {
            return job.batchYears.includes(batchYear);
          }
          
          return false;
        });
      
      // Apply pagination
      const paginatedJobs = filteredJobs.slice(0, jobsPerPage);
      
      return {
        jobs: paginatedJobs,
        lastVisibleDoc: undefined // No cursor-based pagination for fallback method
      };
    }
  } catch (error) {
    console.error("Error fetching fresher jobs by batch:", error);
    return { jobs: [], lastVisibleDoc: undefined };
  }
} 