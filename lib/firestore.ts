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
  requirements: string[];
  responsibilities?: string[]; // New field for job responsibilities
  experienceLevel?: string; // Entry Level, Mid Level, Senior Level
  skills?: string[]; // Array of skills required for the job
  postedAt: Date;
  deadline?: Date;
  applicationLink?: string;
  logoUrl?: string;
  status?: "active" | "draft" | "expired"; // Job status
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
    requirements: ["HTML/CSS", "JavaScript", "React", "Responsive Design"],
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
    requirements: ["Node.js", "Express", "MongoDB", "REST API Design"],
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
    requirements: ["Figma", "Adobe XD", "UI/UX Principles", "Prototyping"],
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
    requirements: ["Excel", "SQL", "Python", "Data Visualization"],
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
    requirements: ["JavaScript", "React", "Node.js", "MongoDB"],
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
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD"],
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
  try {
    console.log("Checking Firebase config:", db);
    // Check if db has expected properties that indicate it's properly initialized
    // @ts-ignore - We're intentionally checking if db is properly initialized
    return db && typeof db.doc === 'function';
  } catch (error) {
    console.error("Firebase configuration check failed:", error);
    return false;
  }
};

// Get all jobs with pagination
export async function getJobs(
  lastVisible?: QueryDocumentSnapshot<DocumentData>,
  jobsPerPage: number = 10
) {
  try {
    // If Firebase isn't configured, return mock data
    if (!isFirebaseConfigured()) {
      console.log("Using mock data for jobs");
      return { 
        jobs: MOCK_JOBS.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime()).slice(0, jobsPerPage), 
        lastVisibleDoc: undefined 
      };
    }

    let jobsQuery;
    
    if (lastVisible) {
      jobsQuery = query(
        collection(db as Firestore, "jobs"),
        orderBy("postedAt", "desc"),
        startAfter(lastVisible),
        limit(jobsPerPage)
      );
    } else {
      jobsQuery = query(
        collection(db as Firestore, "jobs"),
        orderBy("postedAt", "desc"),
        limit(jobsPerPage)
      );
    }
    
    const jobsSnapshot = await getDocs(jobsQuery);
    const lastVisibleDoc = jobsSnapshot.docs[jobsSnapshot.docs.length - 1];
    
    const jobs = jobsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore timestamps to Date objects
      return {
        id: doc.id,
        ...data,
        postedAt: data.postedAt?.toDate ? data.postedAt.toDate() : new Date(),
        deadline: data.deadline?.toDate ? data.deadline.toDate() : null
      };
    }) as Job[];
    
    return { jobs, lastVisibleDoc: lastVisibleDoc || undefined };
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
) {
  try {
    // If Firebase isn't configured, return mock data
    if (!isFirebaseConfigured()) {
      console.log(`Using mock data for batch: ${batchYear}`);
      const filteredJobs = MOCK_JOBS
        .filter(job => 
          job.category.toLowerCase() === "fresher" && 
          job.batchYear === batchYear
        )
        .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
        .slice(0, jobsPerPage);
      
      return { jobs: filteredJobs, lastVisibleDoc: undefined };
    }

    console.log(`Fetching fresher jobs for batch: "${batchYear}"`);
    
    // SIMPLIFIED QUERY - first get all fresher jobs, then filter by batch client-side
    const jobsQuery = query(
      collection(db as Firestore, "jobs"),
      where("category", "==", "fresher"),
      limit(100) // Get more jobs since we'll filter them client-side
    );
    
    const jobsSnapshot = await getDocs(jobsQuery);
    console.log(`Query returned ${jobsSnapshot.docs.length} fresher jobs`);
    
    // Process results and filter by batch year
    let jobs = jobsSnapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          postedAt: data.postedAt?.toDate ? data.postedAt.toDate() : new Date(),
          deadline: data.deadline?.toDate ? data.deadline.toDate() : null
        } as Job;
      })
      // Then filter by batchYear
      .filter(job => job.batchYear && job.batchYear === batchYear);
    
    console.log(`After filtering by batch ${batchYear}, found ${jobs.length} jobs`);
    
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
    
    // Create a fake lastVisibleDoc if we need to
    let lastVisibleDoc;
    if (pagedJobs.length > 0) {
      const lastJob = pagedJobs[pagedJobs.length - 1];
      lastVisibleDoc = jobsSnapshot.docs.find(doc => doc.id === lastJob.id);
    }
    
    return { jobs: pagedJobs, lastVisibleDoc: lastVisibleDoc || undefined };
  } catch (error) {
    console.error(`Error fetching fresher jobs by batch ${batchYear}:`, error);
    return { jobs: [], lastVisibleDoc: undefined };
  }
} 